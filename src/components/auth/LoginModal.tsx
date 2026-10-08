import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, loginSSO } = useAuth();
  const [identifier, setIdentifier] = useState('dharm.sharma@campus.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(identifier, password, role);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async (provider: 'google' | 'university_sso') => {
    setIsLoading(true);
    try {
      await loginSSO(provider);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand / Header */}
        <div className="text-center mb-6">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-600/30 mb-3">
            <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-cyan-300" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-white">Campus Copilot Secure Access</h3>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with your university credentials or Single Sign-On
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex rounded-xl bg-slate-950 p-1 mb-5 border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'admin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Administrator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Email or Student ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="dharm.sharma@campus.edu or CS2023-8842"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Campus Copilot'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SSO Options */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => handleSSO('university_sso')}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>Continue with University Portal SSO</span>
          </button>

          <button
            onClick={() => handleSSO('google')}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue with Google Workspace</span>
          </button>
        </div>

        {/* Security Rule Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Protected by Campus Copilot API Tokenization</span>
          </p>
        </div>
      </div>
    </div>
  );
};
