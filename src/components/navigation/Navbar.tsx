import React from 'react';
import {
  Sparkles,
  Search,
  Sun,
  Moon,
  Shield,
  GraduationCap,
  Bell,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SyncStatus } from '../ui/SyncStatus';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenLoginModal?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenLoginModal,
  activeTab,
  setActiveTab,
}) => {
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 glass-panel bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/90">
                <GraduationCap className="h-5 w-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                  Campus Copilot
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Your University. One Intelligent Assistant.
              </p>
            </div>
          </button>
        </div>

        {/* Middle: Search bar trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={() => setActiveTab('chat')}
            type="button"
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-indigo-500/40 hover:bg-slate-900 transition-all shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="truncate">Ask anything (exams, next class, Java, notices)...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400 rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sync Status Badge */}
          <SyncStatus />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
            >
              <Shield className={`w-3.5 h-3.5 ${role === 'admin' ? 'text-amber-400' : 'text-indigo-400'}`} />
              <span className="capitalize">{role}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl glass-panel bg-slate-900/95 border border-slate-700/80 shadow-2xl py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Select RBAC Role
                </div>
                <button
                  onClick={() => {
                    switchRole('student');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    role === 'student' ? 'text-indigo-400 bg-indigo-950/40 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>Student (Dharm)</span>
                  {role === 'student' && <span className="text-[10px]">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchRole('instructor');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    role === 'instructor' ? 'text-cyan-400 bg-cyan-950/40 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>Instructor (Faculty)</span>
                  {role === 'instructor' && <span className="text-[10px]">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchRole('staff');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    role === 'staff' ? 'text-purple-400 bg-purple-950/40 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>University Staff</span>
                  {role === 'staff' && <span className="text-[10px]">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setActiveTab('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    role === 'admin' ? 'text-amber-400 bg-amber-950/40 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>Administrator</span>
                  {role === 'admin' && <span className="text-[10px]">Active</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Account / Profile */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setActiveTab('profile')}
              type="button"
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all text-left"
            >
              <div className="hidden lg:block text-right">
                <div className="text-xs font-semibold text-slate-200 line-clamp-1">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{user.studentId}</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs">
                {user.name.charAt(0)}
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
