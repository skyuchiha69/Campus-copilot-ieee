import React from 'react';
import { Award, TrendingUp, CheckCircle2, FileText, Download } from 'lucide-react';
import { PrivacyBadge } from '../ui/PrivacyBadge';

export const MyResults: React.FC = () => {
  const semesters = [
    {
      sem: 4,
      academicYear: 'Spring 2026',
      sgpa: 9.12,
      credits: 22,
      courses: [
        { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4, grade: 'A+', points: 10 },
        { code: 'CS202', name: 'Database Management Systems', credits: 4, grade: 'A', points: 9 },
        { code: 'CS203', name: 'Design & Analysis of Algorithms', credits: 4, grade: 'A+', points: 10 },
        { code: 'MA202', name: 'Probability & Statistics', credits: 4, grade: 'A', points: 9 },
        { code: 'EC201', name: 'Digital Logic Design', credits: 3, grade: 'B+', points: 8 },
      ],
    },
    {
      sem: 3,
      academicYear: 'Autumn 2025',
      sgpa: 8.76,
      credits: 21,
      courses: [
        { code: 'CS101', name: 'Object-Oriented Programming (C++)', credits: 4, grade: 'A', points: 9 },
        { code: 'CS102', name: 'Discrete Computational Structures', credits: 4, grade: 'A', points: 9 },
        { code: 'EE101', name: 'Basic Electrical Engineering', credits: 3, grade: 'B+', points: 8 },
        { code: 'MA102', name: 'Linear Algebra & Calculus', credits: 4, grade: 'A', points: 9 },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Academic Transcripts & Grades</h2>
            <PrivacyBadge label="Official Controller Record" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Grades and SGPA transcript records certified by the Office of the Controller of Examinations.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400">Cumulative CGPA</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">8.84</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Semesters History */}
      <div className="space-y-6">
        {semesters.map((s) => (
          <div
            key={s.sem}
            className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  Semester {s.sem} ({s.academicYear})
                </h3>
                <span className="text-xs text-slate-400">{s.credits} Total Credits Earned</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold text-xs">
                  SGPA: {s.sgpa}
                </span>
              </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Course Name</th>
                    <th className="py-2.5 px-3">Credits</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {s.courses.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{c.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-100">{c.name}</td>
                      <td className="py-2.5 px-3">{c.credits}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-extrabold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                          {c.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">{c.points}.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
