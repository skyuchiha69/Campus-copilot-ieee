import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Zap,
  Layers,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  FileCheck2
} from 'lucide-react';
import { MOCK_COURSES } from '../../services/mockData';

interface StudyModeStudioProps {
  initialCourseCode?: string;
  initialTopic?: string;
  onOpenChatWithPrompt?: (prompt: string) => void;
}

export const StudyModeStudio: React.FC<StudyModeStudioProps> = ({
  initialCourseCode = 'CS301',
  initialTopic = 'Java Concurrency & Thread Synchronization',
  onOpenChatWithPrompt,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(initialCourseCode);
  const [activeMode, setActiveMode] = useState<
    'explain' | 'simplify' | 'examples' | 'quiz' | 'viva' | 'practice' | 'summary'
  >('quiz');
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [vivaResponse, setVivaResponse] = useState('');
  const [vivaEvaluated, setVivaEvaluated] = useState(false);

  const courseObj = MOCK_COURSES.find((c) => c.code === selectedCourse) || MOCK_COURSES[0];

  const modes = [
    { id: 'quiz', label: 'Interactive Quiz', icon: Zap, desc: 'Self-assessment with instant feedback' },
    { id: 'viva', label: 'AI Viva Simulator', icon: Volume2, desc: 'Oral exam practice & voice assessment' },
    { id: 'explain', label: 'Deep Explanation', icon: BookOpen, desc: 'Comprehensive technical breakdown' },
    { id: 'simplify', label: 'Simplify (ELI5)', icon: Sparkles, desc: 'Plain english analogies' },
    { id: 'examples', label: 'Code Architectures', icon: BrainCircuit, desc: 'Production code patterns' },
    { id: 'summary', label: '1-Page Cheat Sheet', icon: FileCheck2, desc: 'High-yield exam recap' },
  ] as const;

  const quizQuestions = [
    {
      q: 'Which locking construct in Java provides starvation-free acquisition via strict FIFO ordering?',
      options: [
        'synchronized (this) {}',
        'ReentrantLock(true) [Fair Lock]',
        'volatile keyword',
        'AtomicBoolean'
      ],
      correct: 1,
      explanation: 'Passing true to the ReentrantLock constructor initializes a FairSync which grants locks in arrival order, preventing thread starvation.'
    },
    {
      q: 'In the 5-stage RISC-V pipeline, what is the purpose of Data Forwarding (Bypassing)?',
      options: [
        'To flush instructions upon branch misprediction',
        'To feed computed results directly from EX/MEM stages to ALU inputs before write-back',
        'To speed up instruction fetching from L1 cache',
        'To eliminate control hazards'
      ],
      correct: 1,
      explanation: 'Data forwarding eliminates Read-After-Write (RAW) pipeline stalls by forwarding outputs from EX/MEM or MEM/WB registers directly to ALU operand muxes.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl glass-panel bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>AI Study Studio</span>
              </span>
              <span className="text-xs text-slate-400">Grounded with Official Syllabus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Master Your Curriculum with AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Select any enrolled course and test your knowledge through interactive viva simulations, quick quizzes, or simplified breakdowns.
            </p>
          </div>

          {/* Course Selector Dropdown */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Select Enrolled Course:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MOCK_COURSES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setSelectedCourse(c.code);
                    setQuizAnswered(null);
                    setVivaEvaluated(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCourse === c.code
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-lg shadow-cyan-950/30'
                  : 'glass-panel bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-bold text-slate-100">{m.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{m.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode Workspace Display */}
      <div className="rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Active Subject Context Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-xs font-bold text-indigo-300 font-mono">{courseObj.code}: </span>
              <span className="text-sm font-bold text-white">{courseObj.title}</span>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Instructor: {courseObj.instructor}
          </span>
        </div>

        {/* 1. QUIZ MODE */}
        {activeMode === 'quiz' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question 1 of 2
              </span>
              <span className="text-xs text-amber-400 font-semibold">High-Yield Mid-Term Exam Topic</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {quizQuestions[0].q}
            </h3>

            <div className="space-y-3">
              {quizQuestions[0].options.map((opt, idx) => {
                const isSelected = quizAnswered === idx;
                const isCorrect = idx === quizQuestions[0].correct;

                let btnStyles = 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800';
                if (quizAnswered !== null) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-rose-950/50 border-rose-500/50 text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizAnswered !== null}
                    onClick={() => setQuizAnswered(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${btnStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-xs border border-slate-700 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {quizAnswered !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {quizAnswered !== null && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs sm:text-sm text-slate-200 space-y-2 animate-in fade-in">
                <div className="font-bold text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Curriculum Insight:</span>
                </div>
                <p className="leading-relaxed">{quizQuestions[0].explanation}</p>
                <button
                  onClick={() => setQuizAnswered(null)}
                  className="mt-2 text-xs font-semibold text-cyan-300 hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Next Question</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. VIVA MODE */}
        {activeMode === 'viva' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/30 flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-violet-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-violet-200">AI External Viva Examiner</h4>
                <p className="text-xs text-slate-400">
                  Simulates realistic technical defense sessions based on your course's practical syllabus.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Examiner Prompt:
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-100 italic">
                "Candidate Dharm, explain how Java's \`CompletableFuture\` handles non-blocking asynchronous pipeline chaining compared to legacy \`Future.get()\` thread blocking."
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">
                Your Technical Response (Voice / Text):
              </label>
              <textarea
                rows={4}
                value={vivaResponse}
                onChange={(e) => setVivaResponse(e.target.value)}
                placeholder="Type your technical answer here, citing thread pool execution, thenApply, thenCompose, and exception handling..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setVivaEvaluated(true)}
                disabled={!vivaResponse.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Evaluate My Defense</span>
              </button>
            </div>

            {vivaEvaluated && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-emerald-300">
                  <span>AI Rubric Score: 9.5 / 10.0</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Distinction Grade
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Excellent answer! You correctly emphasized callback chaining with <code className="text-cyan-300 font-mono">thenApplyAsync()</code> and avoidance of worker thread starvation in ForkJoinPool.commonPool().
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. EXPLAIN / SIMPLIFY / EXAMPLES / SUMMARY */}
        {activeMode !== 'quiz' && activeMode !== 'viva' && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base sm:text-lg font-bold text-white capitalize">
              {activeMode} Mode: {courseObj.title}
            </h3>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
              <p>
                In <strong>{courseObj.title}</strong>, core mastery centers on decomposing monolithic software patterns into high-throughput asynchronous abstractions.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-xs">
                {`ExecutorService executor = Executors.newFixedThreadPool(8);\nCompletableFuture.supplyAsync(() -> fetchUserData(), executor)\n  .thenApply(this::transformData)\n  .thenAccept(this::persistRecord);`}
              </div>
              <p>
                This architecture guarantees that request handling threads remain unblocked during database round-trips.
              </p>
            </div>

            <button
              onClick={() => onOpenChatWithPrompt && onOpenChatWithPrompt(`Deep dive into ${activeMode} for ${courseObj.title}`)}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask Copilot to Elaborate in Chat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
