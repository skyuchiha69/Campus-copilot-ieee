import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  Trash2,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileText,
  X
} from 'lucide-react';
import { ChatMessage as ChatMessageType, ChatAction, UploadedDocument } from '../../types';
import { INITIAL_CHAT_MESSAGES } from '../../services/mockData';
import { chatService } from '../../services/chat';
import { ChatMessage } from './ChatMessage';
import { QuickPromptChips } from './QuickPromptChips';
import { documentsService } from '../../services/documents';

interface ChatInterfaceProps {
  onNavigateTab?: (tab: string) => void;
  initialPrompt?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onNavigateTab,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_CHAT_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudyMode, setSelectedStudyMode] = useState<
    'explain' | 'simplify' | 'examples' | 'quiz' | 'viva' | 'practice' | 'summary' | null
  >(null);
  const [attachedDoc, setAttachedDoc] = useState<UploadedDocument | null>(null);
  const [availableDocs, setAvailableDocs] = useState<UploadedDocument[]>([]);
  const [showDocPicker, setShowDocPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    documentsService.getDocuments().then(setAvailableDocs);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string, forceStudyMode?: any) => {
    const text = (customPrompt || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessageType = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        prompt: text,
        studyMode: forceStudyMode || selectedStudyMode || undefined,
        attachedDocId: attachedDoc ? attachedDoc.id : undefined,
      });

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      const errorMsg: ChatMessageType = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        content: 'I encountered an error retrieving data from the university knowledge bridge. Please retry shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general_university',
        responseType: 'warning',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.type === 'navigate') {
      if (action.label.includes('Timetable') || action.label.includes('next class')) {
        onNavigateTab && onNavigateTab('timetable');
      } else if (action.label.includes('Attendance') || action.label.includes('attendance')) {
        onNavigateTab && onNavigateTab('attendance');
      } else if (action.label.includes('Exam') || action.label.includes('Mid-Term')) {
        onNavigateTab && onNavigateTab('examinations');
      } else if (action.label.includes('Syllabus') || action.label.includes('Courses')) {
        onNavigateTab && onNavigateTab('courses');
      } else if (action.label.includes('Directions') || action.label.includes('Campus Map') || action.label.includes('Lab')) {
        onNavigateTab && onNavigateTab('campus');
      } else {
        onNavigateTab && onNavigateTab('dashboard');
      }
    } else if (action.type === 'study_mode' || action.type === 'quiz') {
      if (action.payload?.mode) {
        setSelectedStudyMode(action.payload.mode);
        handleSend(`Please provide ${action.payload.mode} for this topic`, action.payload.mode);
      } else if (action.type === 'quiz') {
        onNavigateTab && onNavigateTab('study_studio');
      } else {
        onNavigateTab && onNavigateTab('study_studio');
      }
    } else if (action.type === 'ticket') {
      onNavigateTab && onNavigateTab('support');
    } else if (action.type === 'report_error') {
      chatService.reportQueryToKnowledgeGap(
        action.payload?.query || 'Flagged answer',
        action.payload?.category || 'User Reported Discrepancy',
        'Reported by student: Answer flagged as inaccurate or unverified.'
      );
      const confirmationMsg: ChatMessageType = {
        id: `conf_${Date.now()}`,
        sender: 'assistant',
        category: 'general_university',
        responseType: 'answer',
        groundingStatus: 'strongly_grounded',
        content: `✓ **Report Logged:** Thank you for flagging this query. It has been routed to the **University Administrator Knowledge Gap Desk** for official verification and re-indexing.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, confirmationMsg]);
    }
  };

  const studyModes = [
    { id: 'explain', label: 'Explain Concept' },
    { id: 'simplify', label: 'Simplify (ELI5)' },
    { id: 'examples', label: 'Code Examples' },
    { id: 'quiz', label: 'Take Quiz' },
    { id: 'viva', label: 'Viva Voice' },
    { id: 'summary', label: 'Summarize' },
  ] as const;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto w-full glass-panel bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Chat Top Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-4 w-4 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100">Campus Copilot Assistant</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                RAG Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Official University Knowledge & Authenticated Student Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([INITIAL_CHAT_MESSAGES[0]])}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-800/80 transition-colors"
            title="Reset Chat Session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Study Mode Selector Bar */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-1 flex items-center gap-1">
          <Sliders className="w-3 h-3 text-cyan-400" />
          <span>Study Mode:</span>
        </span>
        {studyModes.map((mode) => {
          const isSelected = selectedStudyMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setSelectedStudyMode(isSelected ? null : mode.id)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              {mode.label}
              {isSelected && ' ✓'}
            </button>
          );
        })}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onActionClick={handleActionClick} />
        ))}

        {/* AI Typing Loading State */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 my-4 animate-in fade-in">
            <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-4 w-4 text-cyan-300 animate-spin" />
              </div>
            </div>
            <div className="rounded-2xl p-4 glass-panel bg-slate-900/90 border border-slate-800 rounded-tl-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">Grounding knowledge with university portal...</span>
                <span className="flex space-x-1">
                  <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                </span>
              </div>
              <div className="h-2 w-48 bg-slate-800 rounded animate-pulse"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-1.5 border-t border-slate-800/80 bg-slate-950/40">
        <QuickPromptChips onSelectPrompt={(p) => handleSend(p)} />
      </div>

      {/* Attached Document Pill (if any) */}
      {attachedDoc && (
        <div className="mx-4 mb-2 p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Analyzing: <strong>{attachedDoc.name}</strong></span>
          </div>
          <button
            onClick={() => setAttachedDoc(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Chat Input Field */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 relative">
        {/* Document Picker Drawer (if open) */}
        {showDocPicker && (
          <div className="absolute bottom-full left-4 right-4 mb-2 p-3 rounded-2xl glass-panel bg-slate-900/95 border border-slate-700 shadow-2xl z-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Select Document to Ground Query</span>
              <button onClick={() => setShowDocPicker(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {availableDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setAttachedDoc(doc);
                    setShowDocPicker(false);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-indigo-950/50 border border-slate-700/60 flex items-center justify-between text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">Ready</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Attach Document Trigger */}
          <button
            type="button"
            onClick={() => setShowDocPicker(!showDocPicker)}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-indigo-300 hover:border-indigo-500/40 transition-colors"
            title="Attach Document for RAG query"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                selectedStudyMode
                  ? `Study Mode [${selectedStudyMode}]: Ask a topic or syllabus concept...`
                  : 'Ask Campus Copilot (e.g. "What is my next class?", "Where is Lab 4?", "Midterm dates")...'
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
