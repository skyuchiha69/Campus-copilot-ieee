import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Calendar,
  Sparkles,
  Menu,
  X,
  Clock,
  CheckCircle,
  FileCheck2,
  FolderOpen,
  Bell,
  Compass,
  Upload,
  LifeBuoy,
  ShieldAlert,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const bottomItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'chat', label: 'Copilot', icon: MessageSquare, highlight: true },
    { id: 'timetable', label: 'Schedule', icon: Clock },
    { id: 'study_studio', label: 'Study', icon: Sparkles },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom Sticky Tab Bar for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-2 flex items-center justify-around">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? item.highlight
                    ? 'text-cyan-400 font-bold scale-105'
                    : 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  item.highlight
                    ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        {/* Menu Drawer Toggle */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl ${
            drawerOpen ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <div className="p-1">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* Slide-over Sheet for full navigation on mobile */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-slate-900 border-l border-slate-800 p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
                    CC
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Campus Copilot</h4>
                    <p className="text-[11px] text-slate-400">All Modules</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation categories */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    <span>Student Portal</span>
                    <PrivacyBadge label="Private" size="sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelect('profile')}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs font-medium text-slate-200"
                    >
                      <User className="w-4 h-4 text-purple-400 mb-1" />
                      My Profile
                    </button>
                    <button
                      onClick={() => handleSelect('courses')}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs font-medium text-slate-200"
                    >
                      <BookOpen className="w-4 h-4 text-purple-400 mb-1" />
                      My Courses
                    </button>
                    <button
                      onClick={() => handleSelect('attendance')}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs font-medium text-slate-200"
                    >
                      <CheckCircle className="w-4 h-4 text-purple-400 mb-1" />
                      Attendance
                    </button>
                    <button
                      onClick={() => handleSelect('examinations')}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs font-medium text-slate-200"
                    >
                      <FileCheck2 className="w-4 h-4 text-purple-400 mb-1" />
                      Examinations
                    </button>
                    <button
                      onClick={() => handleSelect('assignments')}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs font-medium text-slate-200"
                    >
                      <FolderOpen className="w-4 h-4 text-purple-400 mb-1" />
                      Assignments
                    </button>
                    <button
                      onClick={() => handleSelect('results')}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs font-medium text-slate-200"
                    >
                      <FileCheck2 className="w-4 h-4 text-purple-400 mb-1" />
                      Grades & CGPA
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Campus Services
                  </div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleSelect('notices')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 text-xs font-medium text-slate-200"
                    >
                      <Bell className="w-4 h-4 text-amber-400" />
                      Official Notices
                    </button>
                    <button
                      onClick={() => handleSelect('events')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 text-xs font-medium text-slate-200"
                    >
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      Events & Hackathons
                    </button>
                    <button
                      onClick={() => handleSelect('campus')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 text-xs font-medium text-slate-200"
                    >
                      <Compass className="w-4 h-4 text-emerald-400" />
                      Campus Directory
                    </button>
                    <button
                      onClick={() => handleSelect('documents')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 text-xs font-medium text-slate-200"
                    >
                      <Upload className="w-4 h-4 text-indigo-400" />
                      Document Upload
                    </button>
                    <button
                      onClick={() => handleSelect('support')}
                      className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 text-xs font-medium text-slate-200"
                    >
                      <LifeBuoy className="w-4 h-4 text-rose-400" />
                      Support & Helpdesk
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => handleSelect('admin')}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-500/30 text-xs font-semibold"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Sync Console</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
