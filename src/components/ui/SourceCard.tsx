import React from 'react';
import { CheckCircle2, Lock, Sparkles, FileText, ExternalLink, Bot } from 'lucide-react';
import { ChatSource } from '../../types';

interface SourceCardProps {
  source: ChatSource;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const getOriginConfig = () => {
    switch (source.origin) {
      case 'official_university':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: '✓ Official University Source',
          bg: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200',
          badgeText: source.verified ? 'Verified Document' : 'Official Notice',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'student_portal':
        return {
          icon: <Lock className="w-3.5 h-3.5 text-purple-400" />,
          label: '🔒 Your Student Portal',
          bg: 'bg-purple-950/30 border-purple-500/30 text-purple-200',
          badgeText: 'Private & Authenticated',
          badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'uploaded_doc':
        return {
          icon: <FileText className="w-3.5 h-3.5 text-amber-400" />,
          label: '📄 Your Document',
          bg: 'bg-amber-950/30 border-amber-500/30 text-amber-200',
          badgeText: 'Student Upload',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'ai_academic':
      default:
        return {
          icon: <Bot className="w-3.5 h-3.5 text-cyan-400" />,
          label: '🤖 AI Reasoning',
          bg: 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200',
          badgeText: 'Curriculum Model',
          badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
    }
  };

  const config = getOriginConfig();

  return (
    <div className={`rounded-xl p-3 border text-xs transition-all ${config.bg}`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-100">
          {config.icon}
          <span>{config.label}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${config.badgeClass}`}>
          {config.badgeText}
        </span>
      </div>

      <div className="text-slate-200 font-medium line-clamp-1 mb-1">
        {source.title}
      </div>

      {source.documentName && (
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <FileText className="w-3 h-3 text-slate-500" />
          <span>{source.documentName}</span>
          {source.pageNumber && <span className="text-cyan-400">(Page {source.pageNumber})</span>}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/5">
        <span>{source.updatedDate ? `Updated: ${source.updatedDate}` : 'Synchronized Record'}</span>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
