import React from 'react';
import { Award, CheckCircle, BookOpen, Calendar, ArrowUpRight } from 'lucide-react';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface QuickStatsProps {
  cgpa: number;
  attendanceAvg: number;
  coursesCount: number;
  nextExamDate: string;
  onNavigateTab: (tab: string) => void;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  cgpa,
  attendanceAvg,
  coursesCount,
  nextExamDate,
  onNavigateTab,
}) => {
  const stats = [
    {
      label: 'Cumulative CGPA',
      value: cgpa.toFixed(2),
      subtext: 'Top 5% in CSE Department',
      icon: Award,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      tab: 'results',
      isPrivate: true,
    },
    {
      label: 'Aggregate Attendance',
      value: `${attendanceAvg}%`,
      subtext: 'Safe (>75% mandatory)',
      icon: CheckCircle,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      tab: 'attendance',
      isPrivate: true,
    },
    {
      label: 'Enrolled Courses',
      value: coursesCount.toString(),
      subtext: '19 Credits Registered',
      icon: BookOpen,
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      tab: 'courses',
      isPrivate: true,
    },
    {
      label: 'Next Mid-Term Exam',
      value: nextExamDate,
      subtext: 'Java Mid-Term (Hall A-102)',
      icon: Calendar,
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      tab: 'examinations',
      isPrivate: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((st, idx) => {
        const Icon = st.icon;
        return (
          <div
            key={idx}
            onClick={() => onNavigateTab(st.tab)}
            className="group cursor-pointer rounded-2xl p-5 glass-panel bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl border ${st.badgeColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                {st.isPrivate && <PrivacyBadge label="Private" size="sm" />}
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {st.value}
            </div>

            <div className="text-xs font-semibold text-slate-300 mt-1">
              {st.label}
            </div>

            <div className="text-[11px] text-slate-400 mt-1">
              {st.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
