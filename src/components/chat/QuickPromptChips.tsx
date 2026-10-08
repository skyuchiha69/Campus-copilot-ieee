import React from 'react';
import { Sparkles, Calendar, BookOpen, Clock, FileCheck2, HelpCircle, MapPin } from 'lucide-react';

interface QuickPromptChipsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const QuickPromptChips: React.FC<QuickPromptChipsProps> = ({ onSelectPrompt }) => {
  const prompts = [
    { label: 'What is my next class?', icon: Clock, category: 'Personal' },
    { label: 'What is the exam registration deadline?', icon: Calendar, category: 'Exam' },
    { label: 'What courses am I enrolled in?', icon: BookOpen, category: 'Courses' },
    { label: 'Explain inheritance in Java with code', icon: Sparkles, category: 'Study' },
    { label: 'Where is Lab 4 located?', icon: MapPin, category: 'Campus' },
    { label: 'How do I apply for an NOC for internships?', icon: FileCheck2, category: 'Admin' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-indigo-400" />
        <span>Suggestions:</span>
      </span>
      {prompts.map((p, idx) => {
        const Icon = p.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p.label)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 transition-all active:scale-95 shadow-sm"
          >
            <Icon className="w-3 h-3 text-indigo-400" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
