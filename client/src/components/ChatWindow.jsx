import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../firebase';
import { postChat } from '../api';
import ResponseText from './ResponseText';

const assistantProfiles = {
  anxiety: {
    name: 'Dr. Sarah',
    subtitle: 'CBT-based support for anxious thoughts and calming routines.',
    emoji: '🧘'
  },
  emotional: {
    name: 'Emotional Guide',
    subtitle: 'Understand your emotions and build healthier coping patterns.',
    emoji: '💙'
  },
  relationship: {
    name: 'Alex',
    subtitle: 'Practical communication and relationship guidance.',
    emoji: '🤝'
  },
  productivity: {
    name: 'Maya',
    subtitle: 'Personalized systems to focus and finish what matters.',
    emoji: '📈'
  },
  wellness: {
    name: 'Dr. Kim',
    subtitle: 'Balanced routines for sleep, stress, and wellbeing.',
    emoji: '🌿'
  },
  crisis: {
    name: 'Safety Support',
    subtitle: 'Immediate grounding and safety-first guidance.',
    emoji: '🛟'
  }
};

export default function ChatWindow({ apiBase, assistantType }) {
  const [messages, setMessages] = useState([]); // {role, text}
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const boxRef = useRef();
  const profile = assistantProfiles[assistantType] || assistantProfiles.anxiety;

  useEffect(() => {
    // optionally fetch existing history from server when component loads
    async function loadHistory(){
      if (!auth.currentUser) return;
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${apiBase}/api/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const conversation = data.history?.find(h => h.assistantType === assistantType);
      if (conversation) {
        // fetch conversation details
        const convRes = await fetch(`${apiBase}/api/chat/${conversation.id}`, { headers: { Authorization: `Bearer ${token}` } });
        const convData = await convRes.json();
        if (convData.chat) {
          setConversationId(convData.chat._id);
          setMessages(convData.chat.messages.map(m => ({role: m.role, text: m.text})));
        }
      }
    }
    loadHistory();
  }, [apiBase, assistantType]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(prev => [...prev, { role:'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const resp = await postChat(assistantType, text, conversationId);
      if (resp.assistantText) {
        setConversationId(resp.conversationId || conversationId);
        setMessages(prev => [...prev, { role:'assistant', text: resp.assistantText }]);
      } else if (resp.chat && resp.chat.messages) {
        setMessages(resp.chat.messages.map(m => ({role: m.role, text: m.text})));
      } else if (resp.error) {
        setMessages(prev => [...prev, { role:'assistant', text: `Server error: ${resp.error}` }]);
      } else {
        setMessages(prev => [...prev, { role:'assistant', text: 'Sorry — no response.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role:'assistant', text: 'Error communicating with server.' }]);
    } finally {
      setLoading(false);
    }
  }

  const quicks = [
    "I'm feeling anxious about...",
    "I keep having worrying thoughts",
    "Help me with breathing exercises",
    "I'm stressed about work/school"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card border border-cyan-100 shadow-lg shadow-cyan-100/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-xl">{profile.emoji}</div>
          <div>
            <div className="font-semibold text-slate-800">Hello! I'm {profile.name}</div>
            <div className="text-sm text-slate-600">{profile.subtitle}</div>
          </div>
        </div>

        <div ref={boxRef} className="h-80 overflow-auto p-4 bg-gradient-to-b from-cyan-50/70 to-white rounded-xl mb-4 border border-cyan-100/70">
          {messages.length === 0 && <div className="text-sm text-slate-500">No messages yet — start the conversation.</div>}
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role==='user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-[90%] px-4 py-3 rounded-2xl text-sm ${m.role==='user' ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200/60 rounded-br-sm' : 'bg-white border border-slate-200 shadow-sm rounded-bl-sm text-slate-700'}`}>
                {m.role === 'assistant' ? <ResponseText text={m.text} /> : <div>{m.text}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1 border border-slate-300 bg-white rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-300" placeholder="Share what's on your mind... How are you feeling today?" />
          <button onClick={handleSend} disabled={loading} className="px-4 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-60">
            {loading ? '...' : 'Send'}
          </button>
        </div>

        <div className="mt-3 text-sm text-slate-500">Quick starters:</div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {quicks.map((q,i)=> (
            <button key={i} className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full hover:border-cyan-300 hover:text-cyan-700" onClick={()=> setInput(q)}>{q}</button>
          ))}
        </div>
      </div>

      <div className="card border border-slate-200 shadow-lg shadow-slate-100/70">
        <h3 className="font-semibold mb-2">Resources & Tips</h3>
        <p className="text-sm text-slate-600">Try breathing exercises, grounding techniques, or ask Dr. Sarah for CBT framing of your thoughts.</p>

        <div className="mt-6">
          <h4 className="font-semibold">Suggested exercises</h4>
          <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
            <li>Box Breathing: 4 in, 4 hold, 4 out, 4 hold (repeat)</li>
            <li>5-4-3-2-1 grounding exercise</li>
            <li>Identify automatic thoughts & reframe them</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
