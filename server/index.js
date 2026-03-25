// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { isValidObjectId } = require('mongoose');

const initFirebaseAdmin = require('./config/firebaseAdmin');
const Chat = require('./models/Chat');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;
const AI_API_URL = process.env.AI_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
const AI_MODEL = process.env.AI_MODEL || 'nvidia/nemotron-3-super-120b-a12b';

function resolveModelForProvider(model, apiUrl) {
  if (!model) return model;
  const isNvidia = typeof apiUrl === 'string' && apiUrl.includes('integrate.api.nvidia.com');
  if (!isNvidia) return model;

  // NVIDIA often expects fully-qualified IDs like moonshotai/kimi-k2.5.
  if (!model.includes('/') && /^kimi/i.test(model)) {
    return `moonshotai/${model}`;
  }

  return model;
}

if (!MONGO_URI) throw new Error("MONGO_URI is required in env");
if (!AI_API_KEY) throw new Error("AI_API_KEY (or OPENROUTER_API_KEY) is required in env");

initFirebaseAdmin();

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error(err); process.exit(1); });

const admin = require('firebase-admin');
const app = express();
app.use(cors());
app.use(express.json({limit: '1mb'}));

// middleware to verify Firebase ID token
async function authenticate(req, res, next){
  try{
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
    if(!token) return res.status(401).json({error:'No token provided'});
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    // ensure user record exists locally
    await User.updateOne({uid: decoded.uid}, {
      $set: {
        email: decoded.email || null,
        displayName: decoded.name || null,
        photoURL: decoded.picture || null
      }
    }, {upsert:true});
    next();
  }catch(err){
    console.error('auth error', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// system prompts
function getSystemPromptForAssistant(type){
  const styleGuide = 'Response style: Use plain, friendly text with short headings and bullet points. Avoid markdown tables, avoid pipe characters (|), and avoid decorative separators.';
  const map = {
    anxiety: `You are "Dr. Sarah", an empathetic AI anxiety-relief counselor. Use CBT techniques, grounding, breathing exercises, safe comforting language. Always include a brief action step the user can try. ${styleGuide}`,
    emotional: `You are an emotional analysis assistant. Help the user identify emotions, triggers, patterns and suggest reflective questions and coping strategies. Be concise and non-judgmental. ${styleGuide}`,
    relationship: `You are Alex, a relationship advisor. Help with communication, boundaries, and conflict resolution. Provide practical scripts / phrases to use when talking to others. ${styleGuide}`,
    productivity: `You are Maya, a productivity coach. Offer routines, Pomodoro, time-blocking, and habit building tailored to the user's context. ${styleGuide}`,
    wellness: `You are Dr. Kim, wellness advisor. Offer general nutrition, sleep and exercise guidance. Not a medical diagnosis. Advise to consult professionals for medical conditions. ${styleGuide}`,
    crisis: `You are a crisis-support assistant: provide immediate coping techniques, encourage contacting emergency services and list hotlines. Always give safety-first instructions and encourage contacting emergency services if in danger. ${styleGuide}`
  };
  return map[type] || `You are a helpful mental wellbeing assistant. ${styleGuide}`;
}

// chat route
app.post('/api/chat', authenticate, async (req, res) => {
  try {
    const { assistantType, input, conversationId } = req.body;
    if (!assistantType || !input) {
      return res.status(400).json({error:'assistantType & input required'});
    }

    // find chat safely
    let chat;
    if (conversationId && isValidObjectId(conversationId)) {
      chat = await Chat.findById(conversationId);
    }
    if (!chat) {
      chat = new Chat({
        userUid: req.user.uid,
        assistantType,
        messages: []
      });
    }

    // push user message
    chat.messages.push({ role: 'user', text: input });
    chat.updatedAt = new Date();

    // build messages for AI
    const systemPrompt = getSystemPromptForAssistant(assistantType);
    const messagesForAI = [
      { role: 'system', content: systemPrompt },
      ...chat.messages.map(m => ({ role: m.role, content: m.text }))
    ];
    const resolvedModel = resolveModelForProvider(AI_MODEL, AI_API_URL);

    // call configured AI API
    const requestHeaders = {
      'Authorization': `Bearer ${AI_API_KEY}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // OpenRouter-specific headers remain optional and only apply to that endpoint.
    if (AI_API_URL.includes('openrouter.ai')) {
      requestHeaders['HTTP-Referer'] = process.env.AI_HTTP_REFERER || 'http://localhost:5000';
      requestHeaders['X-Title'] = process.env.AI_APP_TITLE || 'HarmoniqMind';
    }

    const requestBody = {
      model: resolvedModel,
      messages: messagesForAI,
      stream: false,
      max_tokens: 16384,
      temperature: 1,
      top_p: 0.95
    };

    if (AI_API_URL.includes('integrate.api.nvidia.com')) {
      requestBody.extra_body = {
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 16384
      };
    }

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    });

    if(!response.ok){
      const errText = await response.text();
      console.error('AI API error', errText);
      return res.status(500).json({error:'AI API error', detail: errText});
    }

    const aiData = await response.json();
    const aiMessage = aiData.choices?.[0]?.message || {};
    const contentText = typeof aiMessage.content === 'string' ? aiMessage.content.trim() : '';
    const reasoningText = typeof aiMessage.reasoning_content === 'string'
      ? aiMessage.reasoning_content.trim()
      : (typeof aiMessage.reasoning === 'string' ? aiMessage.reasoning.trim() : '');
    const assistantText = contentText || reasoningText || "Sorry, I'm having trouble right now.";

    chat.messages.push({ role: 'assistant', text: assistantText });
    await chat.save();

    res.json({ conversationId: chat._id, assistantText, messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// history route
app.get('/api/history', authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ userUid: req.user.uid }).sort({ updatedAt: -1 }).limit(50);
    const summary = chats.map(c => ({
      id: c._id,
      assistantType: c.assistantType,
      title: c.title || '',
      lastMessage: c.messages.length ? c.messages[c.messages.length-1].text.slice(0,200) : '',
      updatedAt: c.updatedAt
    }));
    res.json({ history: summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// get conversation
app.get('/api/chat/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid conversation id' });
    }
    const chat = await Chat.findById(id);
    if (!chat || chat.userUid !== req.user.uid) return res.status(404).json({error:'Not found'});
    res.json({ chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
