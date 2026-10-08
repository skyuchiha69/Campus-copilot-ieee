import React, { useEffect, useState } from 'react';
import { FileCheck2, Calendar, Clock, MapPin, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { Examination } from '../../types';
import { studentService } from '../../services/student';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface MyExaminationsProps {
  onPrepareWithAI?: (courseName: string, syllabus: string) => void;
}

export const MyExaminations: React.FC<MyExaminationsProps> = ({ onPrepareWithAI }) => {
  const [exams, setExams] = useState<Examination[]>([]);

  useEffect(() => {
    studentService.getExaminations().then(setExams);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Examinations & Hall Tickets
            </h2>
            <PrivacyBadge label="Official Seating" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Autumn 2026 Mid-Term & Practical Examination Schedules
          </p>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">{exam.courseCode}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                      {exam.examType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{exam.courseName}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <strong>{exam.date}</strong> ({exam.time})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Venue: <strong>{exam.venue}</strong>
                    </span>
                    {exam.seatNumber && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 font-mono text-[11px] border border-purple-500/30">
                        Seat: {exam.seatNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  onClick={() => onPrepareWithAI && onPrepareWithAI(exam.courseName, exam.syllabusCovered)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prepare with AI</span>
                </button>
              </div>
            </div>

            {/* Syllabus Coverage Footer */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mr-2">
                  Syllabus Covered:
                </span>
                <span className="text-slate-200">{exam.syllabusCovered}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Admit Card Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
