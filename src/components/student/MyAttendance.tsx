import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { AttendanceRecord } from '../../types';
import { studentService } from '../../services/student';
import { PrivacyBadge } from '../ui/PrivacyBadge';

export const MyAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>('CS301');

  useEffect(() => {
    studentService.getAttendance().then(setAttendance);
  }, []);

  const overallAvg = attendance.length
    ? (attendance.reduce((a, b) => a + b.percentage, 0) / attendance.length).toFixed(1)
    : '0';

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner with Safety Metric */}
      <div className="rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Attendance Register</h2>
            <PrivacyBadge label="Private Record" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Biometric and ERP RFID attendance logs synchronized from the university student portal.
            Minimum university requirement: <strong className="text-amber-300">75%</strong>.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400">Aggregate Average</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{overallAvg}%</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Course-by-Course Attendance Cards */}
      <div className="space-y-4">
        {attendance.map((rec) => {
          const isExpanded = expandedCourse === rec.courseCode;
          const isSafe = rec.percentage >= rec.minimumRequired;

          return (
            <div
              key={rec.courseCode}
              className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedCourse(isExpanded ? null : rec.courseCode)}
                className="p-5 sm:p-6 cursor-pointer hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl shrink-0 ${
                      isSafe
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {rec.courseCode}
                      </span>
                      <span className="text-xs font-bold text-slate-100">{rec.courseTitle}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Attended <strong className="text-slate-200">{rec.attendedClasses}</strong> of{' '}
                      <strong className="text-slate-200">{rec.totalClasses}</strong> lectures • Last Updated: {rec.lastUpdated}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  {/* Progress Ring / Percentage */}
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-slate-100">{rec.percentage}%</div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isSafe
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {isSafe ? 'Safe Margin' : 'Critical Shortage'}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    isSafe ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, rec.percentage)}%` }}
                />
              </div>

              {/* Daily Log History */}
              {isExpanded && rec.records && (
                <div className="p-5 sm:p-6 border-t border-slate-800/80 bg-slate-950/40 space-y-3 animate-in fade-in">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Recent Session Ledger
                  </h4>
                  <div className="space-y-2">
                    {rec.records.map((r, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-mono">{r.date}</span>
                          <span className="text-slate-200 font-medium">{r.topic || 'Class Session'}</span>
                        </div>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-[10px] border ${
                            r.status === 'Present'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    ))}
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
