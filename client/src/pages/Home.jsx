import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithGoogle,
  signInWithFacebook,
  auth,
  logout,
} from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";

// Import icons from lucide-react
import {
  Brain,
  Heart,
  Users,
  Target,
  Activity,
  PhoneCall,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

const assistants = [
  {
    key: "anxiety",
    title: "Anxiety Relief",
    iconColor: "text-sky-700",
    iconBg: "bg-sky-100",
    borderGlow: "hover:border-sky-300",
    subtitle: "AI-powered CBT support",
    icon: Brain,
  },
  {
    key: "emotional",
    title: "Emotional Analysis",
    iconColor: "text-rose-700",
    iconBg: "bg-rose-100",
    borderGlow: "hover:border-rose-300",
    subtitle: "Understand your emotional patterns",
    icon: Heart,
  },
  {
    key: "relationship",
    title: "Relationship Advisor",
    iconColor: "text-violet-700",
    iconBg: "bg-violet-100",
    borderGlow: "hover:border-violet-300",
    subtitle: "Navigate relationships",
    icon: Users,
  },
  {
    key: "productivity",
    title: "Productivity Coach",
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-100",
    borderGlow: "hover:border-emerald-300",
    subtitle: "Optimize your routines",
    icon: Target,
  },
  {
    key: "wellness",
    title: "Wellness Guide",
    iconColor: "text-cyan-700",
    iconBg: "bg-cyan-100",
    borderGlow: "hover:border-cyan-300",
    subtitle: "Personalized health advice",
    icon: Activity,
  },
  {
    key: "crisis",
    title: "Crisis Support",
    iconColor: "text-red-700",
    iconBg: "bg-red-100",
    borderGlow: "hover:border-red-300",
    subtitle: "Immediate support & resources",
    icon: PhoneCall,
  },
];

export default function Home({ apiBase }) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-rose-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <header className="bg-white/90 backdrop-blur rounded-2xl border border-white shadow-md px-4 sm:px-6 py-4 mb-8">
          <div className="flex items-center justify-between gap-3">
            <h1
              className="text-3xl font-extrabold tracking-tight cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-sky-600">Harmoniq</span>
              <span className="text-indigo-900">Mind</span>
            </h1>

            <button
              className="md:hidden p-2 rounded-lg border border-slate-200 bg-slate-50"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <nav className="hidden md:flex gap-2 text-slate-700 font-semibold">
              <button onClick={() => navigate("/")} className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-700 transition">Home</button>
              <button onClick={() => navigate("/")} className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-700 transition">History</button>
              <button onClick={() => navigate("/about")} className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-700 transition">About</button>
            </nav>

            <div className="hidden md:flex items-center gap-3 min-w-0">
              {!user ? (
                <>
                  <button
                    onClick={() => signInWithGoogle()}
                    className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg border hover:bg-slate-200 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.2c-6.4 34.7-25.6 64.1-54.6 83.8v69.6h88.5c51.6-47.5 80.4-117.5 80.4-198.3z"/>
                      <path fill="#34A853" d="M272 544.3c73.6 0 135.3-24.5 180.4-66.7l-88.5-69.6c-24.6 16.5-56.1 26.2-91.9 26.2-70.7 0-130.6-47.7-152-111.5H29v70.2c45.2 89.1 138 151.4 243 151.4z"/>
                      <path fill="#FBBC05" d="M120 322.7c-10.8-32-10.8-66.3 0-98.3V154.2H29c-38.8 76.6-38.8 168.3 0 244.9l91-76.4z"/>
                      <path fill="#EA4335" d="M272 107.7c39.9 0 75.8 13.8 104.1 40.8l78.1-78.1C407.2 24.5 345.6 0 272 0 167 0 74.2 62.3 29 151.4l91 70.2c21.4-63.8 81.3-111.5 152-111.5z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    onClick={() => signInWithFacebook()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 320 512" fill="currentColor">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S293.3 0 268.08 0c-73.52 0-121.44 44.38-121.44 124.72v70.62H86.4V288h60.24v224h92.66V288z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </>
              ) : (
                <>
                  <img src={user.photoURL} alt="me" className="w-9 h-9 rounded-full border border-sky-200" />
                  <span className="font-semibold text-slate-800 truncate max-w-72">{user.displayName || user.email}</span>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 rounded-lg border bg-slate-100 hover:bg-slate-200 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden mt-4 border-t pt-3 space-y-2">
              <button onClick={() => { navigate("/"); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50">Home</button>
              <button onClick={() => { navigate("/"); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50">History</button>
              <button onClick={() => { navigate("/about"); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-sky-50">About</button>
              {user && (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg bg-slate-100 mt-2">
                  Logout
                </button>
              )}
            </div>
          )}
        </header>

        <section className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-full mb-3">
            <Sparkles size={16} /> AI Mental Wellness Hub
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900">How can we support you today?</h2>
          <p className="text-lg text-slate-600 mt-3">Choose one of our specialized AI assistants tailored for your daily well-being.</p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistants.map((a) => {
            const Icon = a.icon;
            return (
              <motion.button
                key={a.key}
                onClick={() => navigate(`/assistant/${a.key}`)}
                className={`bg-white/90 text-left p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition ${a.borderGlow}`}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-14 h-14 rounded-2xl ${a.iconBg} ${a.iconColor} mb-5 flex items-center justify-center`}>
                  <Icon size={30} strokeWidth={2.2} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{a.title}</h3>
                <p className="text-base text-slate-600 mt-3">{a.subtitle}</p>
              </motion.button>
            );
          })}
        </div>

        <footer className="mt-10 bg-white/90 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 text-center shadow-sm">
          <strong>Important Notice:</strong> HarmoniqMind provides supportive AI-driven guidance and is not a replacement for professional mental health care.
        </footer>
      </div>
    </div>
  );
}