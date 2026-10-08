import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Lock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatAction } from '../../types';
import { PrivacyBadge } from '../ui/PrivacyBadge';
import { SourceCard } from '../ui/SourceCard';
import { ConfidenceIndicator } from '../ui/ConfidenceIndicator';

interface ChatMessageProps {
  message: ChatMessageType;
  onActionClick?: (action: ChatAction) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick }) => {
  const isAssistant = message.sender === 'assistant';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const cleanText = message.content.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Basic markdown parser for bold, headers, code, and bullet lists
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-indigo-300 mt-3 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline" />
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-white mt-4 mb-2 border-b border-white/10 pb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }

      // Code blocks (simple representation)
      if (line.startsWith('```')) {
        return (
          <div key={idx} className="text-[10px] font-mono uppercase text-slate-500 my-1">
            {line.replace('```', '') || 'code'}
          </div>
        );
      }

      // Bullet points
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-xs sm:text-sm my-0.5 leading-relaxed">
            {parseInlineMarkdown(cleanBullet)}
          </li>
        );
      }

      // Numbered items
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="ml-2 text-slate-200 text-xs sm:text-sm my-1 font-medium leading-relaxed">
            {parseInlineMarkdown(line)}
          </div>
        );
      }

      // Normal paragraph
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-200 my-1 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Regex for bold **text** and `code`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-indigo-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 my-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Avatar (for assistant) */}
      {isAssistant && (
        <div className="relative shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
            <Sparkles className="h-4 w-4 text-cyan-300" />
          </div>
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`flex flex-col max-w-[90%] sm:max-w-[80%] md:max-w-[75%] ${
          isAssistant ? 'items-start' : 'items-end'
        }`}
      >
        {/* Header Badges */}
        {isAssistant && (
          <div className="flex flex-wrap items-center gap-2 mb-1.5 px-1">
            <span className="text-xs font-bold text-slate-200">Campus Copilot</span>

            {/* Privacy Badge if response contains student-specific data */}
            {message.isPrivate && <PrivacyBadge label="Private to you" size="sm" />}

            {/* Grounding Status Indicator */}
            <ConfidenceIndicator status={message.groundingStatus || 'strongly_grounded'} />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl p-4 sm:p-5 text-sm transition-all shadow-md ${
            isAssistant
              ? 'glass-panel bg-slate-900/90 border-slate-800 text-slate-100 rounded-tl-sm'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-indigo-600/20'
          }`}
        >
          {/* Main content body */}
          <div className="space-y-1">{renderFormattedContent(message.content)}</div>

          {/* Sources Section */}
          {isAssistant && message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Sources & Data Origins</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.sources.map((src, idx) => (
                  <SourceCard key={idx} source={src} />
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Action Buttons */}
          {isAssistant && message.actions && message.actions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
              {message.actions.map((act) => (
                <button
                  key={act.id}
                  onClick={() => onActionClick && onActionClick(act)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
                >
                  <span>{act.label}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer timestamp & action pills */}
        <div className="flex items-center gap-3 mt-1.5 px-2 text-[11px] text-slate-500">
          <span>{message.timestamp}</span>

          {isAssistant && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="hover:text-slate-300 transition-colors flex items-center gap-1"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSpeak}
                className={`hover:text-slate-300 transition-colors flex items-center gap-1 ${
                  speaking ? 'text-indigo-400 font-semibold' : ''
                }`}
                title={speaking ? 'Stop speaking' : 'Read aloud with AI voice'}
              >
                {speaking ? <VolumeX className="w-3 h-3 text-indigo-400" /> : <Volume2 className="w-3 h-3" />}
                <span>{speaking ? 'Stop' : 'Listen'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar (for user) */}
      {!isAssistant && (
        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 font-bold text-xs">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
