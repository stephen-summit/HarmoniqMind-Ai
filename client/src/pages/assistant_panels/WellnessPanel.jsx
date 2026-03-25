import { useState } from "react";
import { postChat } from "../../api";
import ResponseText from "../../components/ResponseText";

export default function WellnessPanel({ assistantType = "wellness" }) {
  const [sleep, setSleep] = useState("");
  const [diet, setDiet] = useState("");
  const [stress, setStress] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuidance = async () => {
    setLoading(true);
    try {
      const input = `Sleep hours: ${sleep || "N/A"}\nDiet: ${diet || "N/A"}\nStress level (1-10): ${stress || "N/A"}`;
      const res = await postChat(assistantType, input);
      setResponse(res.assistantText || res.message || res.error || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Error contacting server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-2xl border border-cyan-100 shadow-lg shadow-cyan-100/50">
      <h2 className="text-2xl font-bold mb-4 text-cyan-900">Wellness Guidance</h2>
      <p className="text-sm text-slate-600 mb-5">Share your routine and get a practical wellness plan you can follow this week.</p>

      <div className="my-2">
        <label className="block font-semibold text-slate-700">How many hours do you sleep?</label>
        <input
          type="text"
          className="border border-slate-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-300"
          value={sleep}
          onChange={(e) => setSleep(e.target.value)}
        />
      </div>

      <div className="my-2">
        <label className="block font-semibold text-slate-700">Describe your diet:</label>
        <input
          type="text"
          className="border border-slate-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-300"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        />
      </div>

      <div className="my-2">
        <label className="block font-semibold text-slate-700">Stress level (1–10):</label>
        <input
          type="number"
          min="1"
          max="10"
          className="border border-slate-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-cyan-300"
          value={stress}
          onChange={(e) => setStress(e.target.value)}
        />
      </div>

      <button
        onClick={handleGuidance}
        disabled={loading}
        className="mt-3 bg-cyan-600 text-white px-4 py-3 rounded-xl w-full font-semibold hover:bg-cyan-700 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Get Wellness Guidance"}
      </button>

      {response && (
        <div className="mt-5 p-4 md:p-5 border border-cyan-100 rounded-xl bg-white">
          <h3 className="font-semibold text-slate-800 mb-2">Your wellness summary</h3>
          <ResponseText text={response} className="text-slate-700" />
        </div>
      )}
    </div>
  );
}