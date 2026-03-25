import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Rocket, ShieldAlert, Target, Github, Linkedin, Globe } from "lucide-react";
import dev1Image from "./Dev1.jpeg";
import dev2Image from "./Dev2.jpeg";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-rose-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <button
          onClick={() => navigate("/")}
          className="text-sky-700 hover:text-sky-900 font-semibold mb-4"
        >
          &larr; Back to Home
        </button>

        <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
            <Rocket className="text-sky-600" />
            About HarmoniqMind
          </h1>

          {/* Description */}
          <p className="mt-4 text-slate-700 leading-7">
            HarmoniqMind is an AI-powered mental wellness platform designed to support individuals in managing stress,
            anxiety, emotional challenges, and decision-making in daily life.
          </p>

          {/* Features */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Brain className="text-indigo-600" />
              What Makes HarmoniqMind Unique
            </h2>
            <ul className="mt-4 space-y-2 text-slate-700 list-disc pl-5">
              <li>AI-Driven emotional support</li>
              <li>Wellness & productivity guidance</li>
              <li>Relationship advisory system</li>
              <li>Crisis support with helplines</li>
              <li>Smart decision-making assistance</li>
            </ul>
          </section>

          {/* Mission */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="text-emerald-600" />
              Our Mission
            </h2>
            <p className="mt-3 text-slate-700">
              To help individuals think clearly, manage emotions, and make better decisions.
            </p>
          </section>

          {/* Developer */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900">👨‍💻 Developer</h2>
            <div className="mt-3 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg">Sumit Kumar Ram</p>
                <p>Final Year CSE | Vel Tech University</p>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    href="https://www.linkedin.com/in/sumit-kumar-440a032a1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Linkedin size={18} /> LinkedIn
                  </a>

                  <a
                    href="https://github.com/stephen-summit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                  >
                    <Github size={18} /> GitHub
                  </a>

                  <a
                    href="https://stephen-summit.github.io/My_Portfolio/Main2.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Globe size={18} /> Portfolio
                  </a>
                </div>

                <p className="mt-4 text-sm text-slate-600">
                  Passionate about AI, mental health tech, and building impactful real-world solutions.
                </p>
              </div>

              <div className="md:shrink-0 md:pl-4">
                <img
                  src={dev1Image}
                  alt="Sumit Kumar Ram"
                  className="w-full md:w-40 h-40 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* Contributor */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900">🤝 Contributor</h2>
            <div className="mt-3 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="font-semibold text-lg">Sushant Karn</p>
                <p>Final Year CSE | Vel Tech University</p>
                <p>Project Contributor</p>
              </div>

              <div className="md:shrink-0 md:pl-4">
                <img
                  src={dev2Image}
                  alt="Sushant Karn"
                  className="w-full md:w-40 h-40 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </section>

          {/* Vision */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900">🔮 Vision</h2>
            <p className="mt-3 text-slate-700">
              To build a scalable AI-driven mental wellness platform impacting millions globally.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
              <ShieldAlert className="text-amber-700" />
              Disclaimer
            </h2>
            <p className="mt-2 text-amber-900">
              This platform provides guidance but does not replace professional medical help.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}