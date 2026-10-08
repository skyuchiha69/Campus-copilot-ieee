import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Database,
  Users,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  FileText,
  Bell,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Activity,
  Lock,
  ShieldAlert,
  Search,
  Check,
  Plus
} from 'lucide-react';
import { AdminAnalytics, KnowledgeGap, AuditLogEntry } from '../../types';
import { adminService } from '../../services/admin';
import { useSync } from '../../context/SyncContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { role, switchRole } = useAuth();
  const sync = useSync();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [selectedGap, setSelectedGap] = useState<KnowledgeGap | null>(null);
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [auditTab, setAuditTab] = useState<'gaps' | 'audit'>('gaps');

  useEffect(() => {
    if (role === 'admin') {
      adminService.getAnalytics().then(setAnalytics).catch(console.error);
    }
  }, [role]);

  // 403 Forbidden UI Guard if a non-admin role attempts to view this panel
  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-12 text-center space-y-6">
        <div className="h-20 w-20 mx-auto rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40">
            HTTP 403 — Forbidden
          </span>
          <h2 className="text-2xl font-extrabold text-white">Administrator Access Required</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Your authenticated session role is <strong className="text-indigo-300 capitalize">[{role}]</strong>.
            University telemetry, audit logs, and knowledge gap indexing are restricted to authorized campus administrators.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => switchRole('admin')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all"
          >
            Authenticate as University Administrator
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return <div className="p-8 text-center text-slate-400">Loading admin operations console...</div>;

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGap || !sourceTitle) return;
    setIsResolving(true);
    try {
      await adminService.resolveKnowledgeGap(selectedGap.id, sourceTitle, sourceUrl, resolutionNotes);
      const updated = await adminService.getAnalytics();
      setAnalytics(updated);
      setSelectedGap(null);
      setSourceTitle('');
      setSourceUrl('');
      setResolutionNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              University AI Operations & Sync Console
            </h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              Administrator Guard Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time telemetry, RAG grounding precision, student query traffic, and university portal sync
          </p>
        </div>

        <button
          onClick={() => sync.triggerSync()}
          disabled={sync.status === 'syncing'}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${sync.status === 'syncing' ? 'animate-spin' : ''}`} />
          <span>{sync.status === 'syncing' ? 'Syncing...' : 'Trigger University Sync'}</span>
        </button>
      </div>

      {/* 1. UNIVERSITY DATA SYNCHRONIZATION DASHBOARD CARD */}
      <div className="rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">University Portal Data Synchronization</h3>
              <p className="text-xs text-slate-400">
                Official Webhook & Scraper Bridge (Automated Sync every 30 mins)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                sync.status === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${sync.status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              {sync.status === 'connected' ? 'Portal Bridge: Connected' : 'Syncing...'}
            </span>
          </div>
        </div>

        {/* Stale data warning banner if active */}
        {sync.isStale && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold">Stale Data Notice</div>
              <span>{sync.staleReason || 'Portal connection delayed. Displaying verified cached records.'}</span>
            </div>
          </div>
        )}

        {/* Sync Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold text-emerald-400">✓ Ingested</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{sync.totalDocuments}</div>
            <div className="text-xs text-slate-400">Documents Ingested</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-bold text-emerald-400">✓ Verified</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{sync.totalNotices}</div>
            <div className="text-xs text-slate-400">Official Notices</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold text-emerald-400">✓ Active</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{sync.totalCourses}</div>
            <div className="text-xs text-slate-400">Courses & Syllabus</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-bold text-emerald-400">Records</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{sync.recordsSynced}</div>
            <div className="text-xs text-slate-400">Records Refreshed ({sync.failedRecords} failed)</div>
          </div>
        </div>

        {/* Security Isolation & Next Sync Footer */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Last synced: <strong className="text-slate-200">{sync.lastSynced}</strong></span>
            <span>•</span>
            <span>Next scheduled: <strong className="text-slate-200">{sync.nextSync}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Credential Exposure (Protected API Gateway)</span>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME AI TELEMETRY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold text-emerald-400">+12% vs last week</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics.activeStudentsToday}</div>
          <div className="text-xs font-semibold text-slate-300">Active Students Today</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400">Peak at 10 AM</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics.totalQueriesToday}</div>
          <div className="text-xs font-semibold text-slate-300">AI Queries Answered</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">Grounding High</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{analytics.ragAccuracyScore}%</div>
          <div className="text-xs font-semibold text-slate-300">RAG Precision Score</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <Activity className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">Fast Stream</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics.avgResponseTimeMs} ms</div>
          <div className="text-xs font-semibold text-slate-300">Avg RAG Latency</div>
        </div>
      </div>

      {/* 3. KNOWLEDGE GAPS & AUDIT LOG TABS */}
      <div className="rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuditTab('gaps')}
              className={`text-sm font-bold pb-1 transition-all ${
                auditTab === 'gaps'
                  ? 'text-indigo-300 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Knowledge Gaps ({analytics.unansweredGapsCount} Open)
            </button>
            <button
              onClick={() => setAuditTab('audit')}
              className={`text-sm font-bold pb-1 transition-all ${
                auditTab === 'audit'
                  ? 'text-indigo-300 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Administrative Audit Logs ({analytics.auditLogs.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Knowledge Gaps */}
        {auditTab === 'gaps' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Review unanswered student queries, attach verified circulars/memos, and re-index the RAG pipeline.
            </p>

            <div className="space-y-3">
              {analytics.recentKnowledgeGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">"{gap.query}"</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                          gap.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {gap.status.toUpperCase()} ({gap.count}x)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Category: <strong>{gap.category}</strong> • Reason: {gap.failureReason}
                      {gap.suggestedSource && <span className="text-cyan-400"> • Source: {gap.suggestedSource}</span>}
                    </div>
                  </div>

                  {gap.status !== 'resolved' ? (
                    <button
                      onClick={() => setSelectedGap(gap)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold self-end sm:self-auto shrink-0 transition-colors"
                    >
                      Attach Verified Source & Resolve
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>Vectorized</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Audit Logs */}
        {auditTab === 'audit' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Immutable ledger of administrative operations, source ingestion, notice changes, and webhook sync events.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Actor Role</th>
                    <th className="py-2.5 px-3">Action Type</th>
                    <th className="py-2.5 px-3">Operation Details</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {analytics.auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{log.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold text-indigo-300">{log.actorRole}</td>
                      <td className="py-2.5 px-3 font-mono text-cyan-400">{log.action}</td>
                      <td className="py-2.5 px-3 text-slate-200">{log.details}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-emerald-400">{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {selectedGap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-2">Resolve Knowledge Gap</h3>
            <p className="text-xs text-slate-400 mb-4">
              Query: <strong className="text-indigo-300">"{selectedGap.query}"</strong>
            </p>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Verified Source Title / Circular Name
                </label>
                <input
                  type="text"
                  required
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="e.g. Official South Campus Weekend Bus Schedule 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Official Document URL or File Reference
                </label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://univ.edu/transport/bus_schedule_2026.pdf"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Resolution / Ingestion Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Summarize key facts extracted for the RAG vector index..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGap(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResolving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {isResolving ? 'Indexing...' : 'Vectorize & Resolve Gap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
