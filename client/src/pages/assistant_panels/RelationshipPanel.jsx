import React, { useState } from "react";
import { postChat } from "../../api";
import ResponseText from "../../components/ResponseText";

export default function RelationshipPanel({ assistantType = "relationship" }) {
  const [context, setContext] = useState("");
  const [details, setDetails] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!context) return;
    setLoading(true);
    try {
      const input = `Context: ${context}\nDetails: ${details || "N/A"}`;
      const res = await postChat(assistantType, input);
      setResponse(res.assistantText || res.reply || res.message || "No advice received.");
    } catch (err) {
      console.error(err);
      setResponse("Error contacting server.");
    } finally {
      setLoading(false);
    }
  }

  const options = ["Family", "Friends", "Romantic", "Work"];

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl border border-rose-100 shadow-lg shadow-rose-100/40">
      <h2 className="text-2xl font-bold mb-2 text-rose-800">Relationship Guidance</h2>
      <p className="text-sm text-slate-600 mb-4">Pick a relationship context and get scripts you can actually use in real conversations.</p>

      <div className="mb-4 flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setContext(o)}
            className={`px-4 py-2 rounded-lg border ${
              context === o ? "bg-rose-600 text-white border-rose-600" : "bg-white text-gray-700 border-slate-300"
            }`}
          >
            {o}
          </button>
        ))}
      </div>

      <textarea
        className="w-full border border-slate-300 p-3 rounded-xl mb-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-rose-300"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Describe the situation..."
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 disabled:opacity-60"
      >
        {loading ? "Fetching Advice..." : "Get Advice"}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-white rounded-xl border border-rose-100">
          <h3 className="font-semibold mb-2 text-slate-800">Advice</h3>
          <ResponseText text={response} className="text-slate-700" />
        </div>
      )}
    </div>
  );
}
