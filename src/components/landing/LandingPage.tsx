import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calendar,
  Lock,
  CheckCircle2,
  Compass,
  FileText,
  Zap,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onStartChat: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat, onOpenLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navbar for Landing */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 glass-panel bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <GraduationCap className="h-5 w-5 text-cyan-300" />
              </div>
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">Campus Copilot</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onStartChat}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Launch Copilot
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-8">
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel bg-slate-900/90 border border-indigo-500/30 text-xs font-medium text-indigo-300 shadow-xl shadow-indigo-950/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation University Intelligence Platform</span>
        </div>

        {/* Hero Tagline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
          Your University.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-300">
            One Intelligent Assistant.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Get instant answers from official university information, understand your academic life,
          discover campus resources, and get personalized assistance from one AI-powered assistant.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartChat}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Ask Campus Copilot</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-panel bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>See How It Works</span>
          </button>
        </div>

        {/* Interactive Live Preview Mock */}
        <div className="pt-10 max-w-4xl mx-auto text-left">
          <div className="rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-slate-500 ml-2">campus-copilot-engine</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified University RAG
              </span>
            </div>

            {/* Prompt & Answer demo */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 text-indigo-200 font-medium">
                Student: <strong>"What is my next class and what is the exam registration deadline?"</strong>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Campus Copilot:</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-200 border border-purple-500/30">
                    🔒 Private to you
                  </span>
                </div>
                <p>
                  1. Your next class is <strong>Java Enterprise Lab (CS301)</strong> at <strong>10:00 AM</strong> in <strong>Lab 3</strong> (Turing Complex).
                </p>
                <p>
                  2. According to the <strong>Official University Examination Notice (06 Oct 2026)</strong>, late mid-term exam registration closes on <strong>10th October at 5:00 PM</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-panel bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">University Knowledge Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official circulars, syllabi, holiday calendars, examination venues, and departmental guidelines.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Private Student Portal Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Securely query personal timetables, attendance thresholds, internal grades, and LMS assignments with zero credential leakage.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">AI Study Studio & Viva</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive quiz generation, verbal viva voice simulators, code architecture diagrams, and plain-english concept simplifiers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
