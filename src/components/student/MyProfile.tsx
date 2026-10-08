import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Layers,
  Hash,
  Award,
  Calendar,
  ShieldCheck,
  BookCheck,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { studentService } from '../../services/student';
import { PrivacyBadge } from '../ui/PrivacyBadge';

export const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    studentService.getProfile().then(setProfile);
  }, []);

  if (!profile) return <div className="p-8 text-center text-slate-400">Loading student profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 shadow-xl">
            <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center text-3xl font-extrabold text-white">
              {profile.name.charAt(0)}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <h2 className="text-2xl font-extrabold text-white">{profile.name}</h2>
              <PrivacyBadge label="Authenticated Portal Record" size="sm" />
            </div>

            <p className="text-sm text-indigo-300 font-medium">{profile.program}</p>
            <p className="text-xs text-slate-400 mt-1">{profile.department}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs text-slate-300">
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 font-mono">
                ID: {profile.studentId}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
                Semester {profile.semester} • Div {profile.division}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
                Batch: {profile.batch}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Advisor & Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Academic Standing</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Cumulative GPA (CGPA)</span>
              <span className="text-base font-extrabold text-amber-400">{profile.cgpa} / 10.0</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Earned Degree Credits</span>
              <span className="text-sm font-bold text-slate-100">
                {profile.creditsEarned} / {profile.totalCredits} Credits
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Academic Standing</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Good Standing (Zero Backlogs)
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Contact & Official Mentorship</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">University Email</span>
              <span className="text-sm font-mono text-slate-200">{profile.email}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              <span className="text-xs text-slate-400 block mb-1">Faculty Academic Advisor</span>
              <span className="text-sm font-semibold text-slate-200">{profile.advisor}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
              <span>Portal Synchronization Status:</span>
              <span className="font-bold flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
