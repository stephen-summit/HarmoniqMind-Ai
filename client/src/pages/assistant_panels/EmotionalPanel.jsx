import React, { useState } from "react";
import { postChat } from "../../api";
import ResponseText from "../../components/ResponseText";

export default function EmotionalPanel({ assistantType = "emotional" }) {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await postChat(assistantType, text.trim());
      setResponse(res.assistantText || res.reply || res.message || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Error contacting server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-sky-50 via-cyan-50 to-white rounded-2xl border border-sky-100 shadow-lg shadow-sky-100/50">
      <h2 className="text-2xl font-bold mb-2 text-sky-800">Emotional Support</h2>
      <p className="text-sm text-slate-600 mb-4">Tell me what you are feeling and get gentle, practical reflection prompts.</p>
      <textarea
        className="w-full border border-slate-300 p-3 rounded-xl mb-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-sky-300"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share what’s on your mind..."
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "Analyze My Feelings"}
      </button>
      {response && (
        <div className="mt-6 p-4 bg-white rounded-xl border border-sky-100">
          <h3 className="font-semibold mb-2 text-slate-800">Assistant Response</h3>
          <ResponseText text={response} className="text-slate-700" />
        </div>
      )}
    </div>
  );
}
