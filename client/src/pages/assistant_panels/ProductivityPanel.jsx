import { useState } from "react";
import { postChat } from "../../api";
import ResponseText from "../../components/ResponseText";

const profiles = [
  { key: "Student", title: "Student", desc: "High school or college student", icon: "🎓" },
  { key: "Professional", title: "Professional", desc: "Working professional", icon: "💼" },
  { key: "Freelancer", title: "Freelancer", desc: "Independent contractor", icon: "🚀" },
  { key: "Entrepreneur", title: "Entrepreneur", desc: "Business owner or startup founder", icon: "💡" }
];

export default function ProductivityPanel({ assistantType = "productivity" }) {
  const [profile, setProfile] = useState("Student");
  const [challenges, setChallenges] = useState("");
  const [goals, setGoals] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    setResponse("");
    setLoading(true);
    try {
      const input = `Profile: ${profile}\nChallenges: ${challenges || "N/A"}\nGoals: ${goals || "N/A"}`;
      const res = await postChat(assistantType, input);
      const assistantText =
        res.assistantText || res.reply || res.message || res.text || res.answer || JSON.stringify(res);
      setResponse(assistantText);
    } catch (err) {
      console.error(err);
      setResponse("There was an error contacting the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card border border-emerald-100 shadow-lg shadow-emerald-100/40">
        <h2 className="text-lg font-semibold mb-4">Let's Optimize Your Productivity</h2>

        <label className="block text-sm font-medium mb-2">What best describes you?</label>
        <div className="space-y-3">
          {profiles.map((p) => {
            const selected = profile === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setProfile(p.key)}
                className={`w-full text-left border rounded-lg p-4 flex items-start gap-4 transition 
                  ${selected ? "bg-amber-50 border-amber-200 shadow-sm" : "bg-white border-slate-200"}
                `}
              >
                <div className="text-2xl">{p.icon}</div>
                <div>
                  <div className={`font-medium ${selected ? "text-amber-800" : ""}`}>{p.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <label className="block text-sm font-medium mt-6 mb-2">What productivity challenges are you facing?</label>
        <textarea
          className="w-full border rounded p-3 text-sm"
          placeholder="Describe your struggles (time management, distractions, motivation issues...)"
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          rows={4}
        />

        <label className="block text-sm font-medium mt-4 mb-2">What are your productivity goals? (Optional)</label>
        <textarea
          className="w-full border rounded p-3 text-sm"
          placeholder="e.g., improve focus, better work-life balance..."
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          rows={3}
        />

        <button
          onClick={handlePlan}
          disabled={loading}
          className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating plan..." : "Get My Productivity Plan"}
        </button>

        <div className="mt-4 text-sm text-slate-500">
          <strong>Focus areas:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>Time management</li>
            <li>Habit formation</li>
            <li>Goal setting</li>
            <li>Energy optimization</li>
            <li>Stress management</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card border border-emerald-100/70">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">📈</div>
            <div>
              <div className="font-semibold">Ready to Boost Your Productivity!</div>
              <div className="text-sm text-slate-500">
                Tell me about your current challenges and goals, and I'll create a personalized productivity system.
              </div>
            </div>
          </div>
        </div>

        <div className="card border border-slate-200">
          <h3 className="font-semibold mb-3">Popular Productivity Techniques</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="p-3 rounded bg-slate-50 border">Pomodoro Technique — 25-minute focused sessions with 5-minute breaks</li>
            <li className="p-3 rounded bg-slate-50 border">Deep Work — Extended periods of distraction-free focused work</li>
            <li className="p-3 rounded bg-slate-50 border">Time Blocking — Schedule specific time slots for different work types</li>
          </ul>
        </div>

        <div className="card border border-emerald-100/80">
          <h4 className="font-semibold mb-2">Plan</h4>
          {response ? (
            <ResponseText text={response} className="text-sm text-slate-700" />
          ) : (
            <div className="text-sm text-slate-500">
              Your personalized plan will appear here after you click "Get My Productivity Plan".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
