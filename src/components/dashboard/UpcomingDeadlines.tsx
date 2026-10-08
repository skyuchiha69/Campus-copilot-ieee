import React from 'react';
import { AlertCircle, Clock, Calendar, ChevronRight, FileCheck, Award, ExternalLink } from 'lucide-react';
import { Assignment, Examination, Notice } from '../../types';

interface UpcomingDeadlinesProps {
  assignments: Assignment[];
  exams: Examination[];
  notices: Notice[];
  onNavigateTab: (tab: string) => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  assignments,
  exams,
  notices,
  onNavigateTab,
}) => {
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');
  const priorityNotice = notices.find((n) => n.isPriority);

  return (
    <div className="space-y-6">
      {/* Priority Bulletin Alert if active */}
      {priorityNotice && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Priority University Bulletin
                </span>
                <span className="text-[11px] text-slate-400">{priorityNotice.publishDate}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                {priorityNotice.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                {priorityNotice.content}
              </p>
              <button
                onClick={() => onNavigateTab('notices')}
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1"
              >
                <span>Read Official Notice Document</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Assignments & Deliverables */}
      <div className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Upcoming Assignments</h3>
            <p className="text-xs text-slate-400">Deadlines from university LMS synchronization</p>
          </div>
          <button
            onClick={() => onNavigateTab('assignments')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>All Assignments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {pendingAssignments.map((asg) => (
            <div
              key={asg.id}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-300">{asg.courseCode}</span>
                    <h5 className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1">
                      {asg.title}
                    </h5>
                  </div>
                  <div className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>Due: {asg.dueDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('assignments')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium shrink-0 transition-colors"
              >
                Submit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
