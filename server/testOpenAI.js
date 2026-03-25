require('dotenv').config();
const fetch = require('node-fetch');

async function testOpenAI() {
  const key = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'nvidia/nemotron-3-super-120b-a12b';

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Say hello in one short sentence.' }],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 16384,
      stream: false,
      extra_body: {
        chat_template_kwargs: { enable_thinking: true },
        reasoning_budget: 16384
      }
    })
  });

  if (!res.ok) {
    console.error('API error:', await res.text());
    return;
  }

  const data = await res.json();
  console.log('Response:', data.choices?.[0]?.message || data);
}

testOpenAI();
