import React, { useState } from "react";
import { postChat } from "../../api";
import { AlertTriangle, ExternalLink, Heart, PhoneCall, ShieldAlert } from "lucide-react";
import ResponseText from "../../components/ResponseText";

const indiaContacts = [
  {
    name: "National Emergency Response",
    desc: "Police, fire, and emergency response",
    actionLabel: "Call",
    actionValue: "112",
    href: "tel:112",
  },
  {
    name: "Tele-MANAS (24x7 Mental Health)",
    desc: "Government mental health and counseling support",
    actionLabel: "Call",
    actionValue: "14416 / 1-800-891-4416",
    href: "tel:14416",
  },
  {
    name: "AASRA Helpline",
    desc: "Emotional support and suicide prevention",
    actionLabel: "Call",
    actionValue: "+91-22-27546669",
    href: "tel:+912227546669",
  },
  {
    name: "iCALL Psychosocial Helpline",
    desc: "Mental health support from trained professionals",
    actionLabel: "Call",
    actionValue: "+91-9152987821",
    href: "tel:+919152987821",
  },
];

const indiaResources = [
  { label: "Tele-MANAS", href: "https://telemanas.mohfw.gov.in/" },
  { label: "iCALL", href: "https://icallhelpline.org/" },
  { label: "AASRA", href: "http://www.aasra.info/" },
];

export default function CrisisPanel({ assistantType = "crisis" }) {
  const [issue, setIssue] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!issue.trim()) return;
    setLoading(true);
    try {
      const res = await postChat(assistantType, issue.trim());
      setResponse(res.assistantText || res.reply || res.message || "No support received.");
    } catch (err) {
      console.error(err);
      setResponse("Error contacting server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Crisis Support
          </h2>
          <p className="text-slate-500 mt-1">Immediate support and professional resources (India)</p>
        </div>

        <div className="px-6 py-4 border-b border-red-100 bg-red-50/70 text-red-800 text-sm font-medium">
          If this is a life-threatening emergency, call 112 immediately.
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <PhoneCall className="w-5 h-5 text-red-500" />
            Emergency & Crisis Contacts
          </h3>

          <div className="space-y-3">
            {indiaContacts.map((contact) => (
              <a
                key={contact.name}
                href={contact.href}
                className="block rounded-xl border border-red-200 p-4 hover:bg-red-50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-800">{contact.name}</div>
                    <div className="text-sm text-slate-500 mt-1">{contact.desc}</div>
                    <div className="text-sm mt-2">
                      <span className="text-red-600 font-medium">{contact.actionLabel}</span>
                      <span className="text-red-700 font-bold ml-2">{contact.actionValue}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-red-400 mt-1" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="text-blue-700 font-semibold mb-2">Online Resources</div>
            <ul className="space-y-1 text-sm text-blue-800">
              {indiaResources.map((resource) => (
                <li key={resource.label}>
                  <a href={resource.href} target="_blank" rel="noreferrer" className="hover:underline">
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Tell Me What's Happening
        </h3>

        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm flex gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">Important:</span> I can provide emotional support, grounding steps, and a short safety plan,
            but I cannot replace professional emergency care. If you are in immediate danger, call 112 now.
          </p>
        </div>

        <textarea
          className="w-full mt-4 border border-slate-300 rounded-xl p-4 min-h-36 focus:outline-none focus:ring-2 focus:ring-red-300"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Share what you're going through right now. I'm here to support you and suggest immediate next steps."
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? "Requesting Support..." : "Get Immediate Support"}
        </button>

        {response && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <ResponseText text={response} />
          </div>
        )}
      </section>
    </div>
  );
}
