import React from 'react';
import { User, Shield, Sparkles, Building, Layers, Hash } from 'lucide-react';
import { StudentProfile } from '../../types';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface GreetingHeaderProps {
  student: StudentProfile;
  onOpenChatWithPrompt?: (prompt: string) => void;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  student,
  onOpenChatWithPrompt,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative rounded-3xl overflow-hidden glass-panel bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
      {/* Background glow circle */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div>
          {/* Privacy badge and sync timestamp */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <PrivacyBadge label="Private Student Records" size="sm" />
            <span className="text-[11px] text-slate-400">
              Synced: <strong className="text-slate-300">{student.lastPortalSync || 'Today'}</strong>
            </span>
          </div>

          {/* Personalized Greeting */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {student.name}</span>
            <span className="animate-bounce">👋</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            You have <strong className="text-cyan-300">4 active lectures today</strong> and your next class begins at <strong className="text-indigo-300">10:00 AM (Java Lab 3)</strong>.
          </p>

          {/* Academic meta chips */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>{student.department}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Semester {student.semester} • Div {student.division}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px]">
              <Hash className="w-3.5 h-3.5 text-purple-400" />
              <span>{student.studentId}</span>
            </div>
          </div>
        </div>

        {/* Quick Copilot AI Interaction Card */}
        <div className="shrink-0 w-full lg:w-80 p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-xl shadow-indigo-950/50">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Campus Copilot Instant AI</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Ask any question about your portal records or campus rules.
          </p>
          <div className="space-y-1.5">
            <button
              onClick={() => onOpenChatWithPrompt && onOpenChatWithPrompt('What is my next class?')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700/60 text-xs text-slate-200 hover:text-indigo-200 transition-all flex items-center justify-between"
            >
              <span>📅 What is my next class?</span>
              <span className="text-[10px] text-indigo-400">Ask →</span>
            </button>
            <button
              onClick={() => onOpenChatWithPrompt && onOpenChatWithPrompt('What is the exam registration deadline?')}
              className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700/60 text-xs text-slate-200 hover:text-indigo-200 transition-all flex items-center justify-between"
            >
              <span>📝 Mid-term exam schedule</span>
              <span className="text-[10px] text-indigo-400">Ask →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
