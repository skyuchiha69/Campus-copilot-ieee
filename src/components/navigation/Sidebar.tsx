import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Calendar,
  Clock,
  Award,
  FileCheck2,
  Bell,
  Sparkles,
  Upload,
  Compass,
  LifeBuoy,
  ShieldAlert,
  User,
  CheckCircle,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();

  const coreNav = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard, badge: 'Home' },
    { id: 'chat', label: 'Campus Copilot AI', icon: MessageSquare, highlight: true },
    { id: 'study_studio', label: 'Study Mode Studio', icon: Sparkles, badge: 'AI Tools' },
  ];

  const studentPortalNav = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'timetable', label: 'My Timetable', icon: Clock },
    { id: 'attendance', label: 'My Attendance', icon: CheckCircle },
    { id: 'examinations', label: 'My Examinations', icon: FileCheck2 },
    { id: 'assignments', label: 'My Assignments', icon: FolderOpen },
    { id: 'results', label: 'My Results', icon: Award },
  ];

  const universityNav = [
    { id: 'notices', label: 'Official Notices', icon: Bell, badge: 'Live' },
    { id: 'events', label: 'Events & Hackathons', icon: Calendar },
    { id: 'campus', label: 'Campus Directory', icon: Compass },
    { id: 'documents', label: 'Document Upload', icon: Upload },
    { id: 'support', label: 'Support & NOC', icon: LifeBuoy },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 p-4 min-h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Primary Copilot Launch Section */}
      <div className="space-y-1 mb-6">
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Core Assistant
        </div>
        {coreNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Student-Specific Portal Section */}
      <div className="space-y-1 mb-6">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Student Portal
          </span>
          <PrivacyBadge label="Private" size="sm" />
        </div>
        {studentPortalNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-900/30 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-300' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* University Knowledge & Resources Section */}
      <div className="space-y-1 mb-6">
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Campus Knowledge
        </div>
        {universityNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin / Synchronizer Controls */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <button
          onClick={() => setActiveTab('admin')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'admin'
              ? 'bg-amber-950/40 text-amber-200 border border-amber-500/40'
              : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Admin Sync Console</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
            Sync View
          </span>
        </button>
      </div>
    </aside>
  );
};
