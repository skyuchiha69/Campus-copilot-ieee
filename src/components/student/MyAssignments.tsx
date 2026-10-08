import React, { useEffect, useState } from 'react';
import { FolderOpen, Clock, CheckCircle2, Upload, Sparkles, AlertCircle, ShieldAlert, Check } from 'lucide-react';
import { Assignment } from '../../types';
import { studentService } from '../../services/student';
import { PrivacyBadge } from '../ui/PrivacyBadge';

export const MyAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    studentService.getAssignments().then(setAssignments);
  }, []);

  const handleSimulateSubmit = (id: string) => {
    setSubmittingId(id);
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'Submitted',
                submittedDate: 'Just now',
                aiEvaluation: {
                  conceptUnderstanding: 'Good understanding of core principles with clear modular separation.',
                  structure: 'Clean layout following standard repository conventions.',
                  completeness: 'Meets 4 of 5 core criteria.',
                  possibleIssues: ['Edge case handling for concurrency timeouts could be improved.'],
                  suggestions: ['Review Unit 2 handout for lock timeout strategies.'],
                  preliminaryScore: 45,
                  disclaimer: 'AI-generated feedback. Not an official university grade.',
                  instructorReviewStatus: 'Pending Review',
                },
              }
            : a
        )
      );
      setSubmittingId(null);
    }, 700);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Course Assignments</h2>
            <PrivacyBadge label="LMS Portal Sync" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit coursework and review AI-generated preliminary evaluations and instructor reviews
          </p>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-5">
        {assignments.map((asg) => {
          const isPending = asg.status === 'Pending';
          const hasAiEval = asg.aiEvaluation !== undefined;

          return (
            <div
              key={asg.id}
              className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3.5 rounded-2xl shrink-0 ${
                      asg.status === 'Graded'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {asg.courseCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{asg.courseName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          asg.status === 'Graded'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : asg.status === 'Submitted'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{asg.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {asg.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        Due: {asg.dueDate}
                      </span>
                      <span>Max Score: {asg.maxScore} pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  {isPending ? (
                    <button
                      onClick={() => handleSimulateSubmit(asg.id)}
                      disabled={submittingId === asg.id}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{submittingId === asg.id ? 'Submitting...' : 'Upload & Submit'}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submitted ({asg.submittedDate})</span>
                    </span>
                  )}
                </div>
              </div>

              {/* AI-Generated Preliminary Evaluation Card */}
              {hasAiEval && asg.aiEvaluation && (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-xs font-bold text-white">
                        AI Preliminary Evaluation & Diagnostic Feedback
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                        asg.aiEvaluation.instructorReviewStatus === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      Instructor Status: {asg.aiEvaluation.instructorReviewStatus}
                    </span>
                  </div>

                  {/* Mandatory Academic Disclaimer */}
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-2 text-[11px] text-amber-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      <strong>Notice:</strong> {asg.aiEvaluation.disclaimer} Official grades are certified exclusively by the course instructor.
                    </span>
                  </div>

                  {/* Criteria breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-300 block">Concept Understanding</span>
                      <p className="text-slate-300">{asg.aiEvaluation.conceptUnderstanding}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-cyan-300 block">Structure & Architecture</span>
                      <p className="text-slate-300">{asg.aiEvaluation.structure}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-300 block">Completeness</span>
                      <p className="text-slate-300">{asg.aiEvaluation.completeness}</p>
                    </div>
                  </div>

                  {/* Possible issues & Suggestions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    {asg.aiEvaluation.possibleIssues.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-rose-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                          <span>Identified Edge Cases / Issues</span>
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {asg.aiEvaluation.possibleIssues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {asg.aiEvaluation.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-indigo-300 flex items-center gap-1">
                          <Check className="w-3 h-3 text-indigo-400" />
                          <span>Actionable Suggestions</span>
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {asg.aiEvaluation.suggestions.map((sug, idx) => (
                            <li key={idx}>{sug}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
