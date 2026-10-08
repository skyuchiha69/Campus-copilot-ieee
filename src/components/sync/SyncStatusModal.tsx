import React from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  FileText,
  Bell,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useSync } from '../../context/SyncContext';

export const SyncStatusModal: React.FC = () => {
  const {
    isSyncModalOpen,
    closeSyncModal,
    status,
    lastSynced,
    nextSync,
    totalDocuments,
    totalNotices,
    totalCourses,
    recordsSynced,
    failedRecords,
    isStale,
    staleReason,
    studentDataSynced,
    syncMessage,
    triggerSync,
    simulateFailure,
    simulateReconnect
  } = useSync();

  if (!isSyncModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-slate-900/95 border border-slate-700/80 shadow-2xl p-6 text-slate-100">
        {/* Close button */}
        <button
          onClick={closeSyncModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">University Data Synchronization</h3>
            <p className="text-xs text-slate-400">Official Portal Webhook & Authenticated RAG Pipeline</p>
          </div>
        </div>

        {/* Stale data warning alert if active */}
        {isStale && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 mb-4 flex items-center gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold">Stale Data Warning</div>
              <span>{staleReason || 'Displaying cached university portal snapshot. Real-time updates pending reconnect.'}</span>
            </div>
          </div>
        )}

        {/* Health status banner */}
        <div
          className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 ${
            status === 'connected'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : status === 'syncing'
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}
        >
          {status === 'connected' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {status === 'syncing' && <RefreshCw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin" />}
          {status === 'failed' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}

          <div className="text-xs">
            <div className="font-semibold text-sm mb-0.5">
              {status === 'connected' && '🟢 Portal Bridge Connected'}
              {status === 'syncing' && '🟡 Ingesting Latest Updates...'}
              {status === 'failed' && '🔴 Sync Interrupted (Automated Retry)'}
            </div>
            <p className="text-slate-300">{syncMessage || 'All data streams healthy.'}</p>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Synchronized Data Categories
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-300">Documents</span>
              </div>
              <span className="text-sm font-bold text-slate-100">{totalDocuments}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300">Official Notices</span>
              </div>
              <span className="text-sm font-bold text-slate-100">{totalNotices}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300">Courses & Syllabus</span>
              </div>
              <span className="text-sm font-bold text-slate-100">{totalCourses}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300">Records Refreshed</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {recordsSynced} ({failedRecords} fail)
              </span>
            </div>
          </div>
        </div>

        {/* Security & Freshness Footer */}
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-3">
            <span>Last synced: <strong className="text-slate-200">{lastSynced}</strong></span>
            <span>•</span>
            <span>Next sync: <strong className="text-slate-200">{nextSync}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Credential Leakage</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {status === 'failed' ? (
              <button
                onClick={simulateReconnect}
                type="button"
                className="px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 rounded-lg border border-indigo-500/30"
              >
                Simulate Reconnect
              </button>
            ) : (
              <button
                onClick={simulateFailure}
                type="button"
                className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                title="Test how the UI handles sync errors and stale data alerts"
              >
                Simulate Network Error
              </button>
            )}
          </div>

          <button
            onClick={() => triggerSync()}
            disabled={status === 'syncing'}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${status === 'syncing' ? 'animate-spin' : ''}`} />
            <span>{status === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
