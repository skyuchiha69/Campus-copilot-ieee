import React, { useEffect, useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SupportTicket } from '../../types';
import { supportService } from '../../services/support';
import { useAuth } from '../../context/AuthContext';

export const SupportDesk: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>('tkt_101');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // New ticket form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Academic');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [description, setDescription] = useState('');

  useEffect(() => {
    supportService.getTickets().then(setTickets);
  }, []);

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    const newTicket = await supportService.createTicket({
      subject,
      category,
      priority,
      description,
      studentName: user?.name || 'Dharm',
      studentId: user?.studentId || 'CS2023-8842',
    });

    setTickets([newTicket, ...tickets]);
    setActiveTicketId(newTicket.id);
    setShowCreateModal(false);
    setSubject('');
    setDescription('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    const updated = await supportService.addReply(activeTicket.id, replyText);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText('');
  };

  const categories: SupportTicket['category'][] = [
    'Academic',
    'Examination',
    'Administration',
    'Technical',
    'Hostel',
    'Scholarship',
    'Other',
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Student Helpdesk & NOC Desk
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              AI Automated Triage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Submit administrative grievances, NOC applications, and attendance discrepancy requests
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Main Grid: Ticket List & Detail Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-3">
          {tickets.map((tkt) => {
            const isSelected = activeTicket?.id === tkt.id;
            return (
              <div
                key={tkt.id}
                onClick={() => setActiveTicketId(tkt.id)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'glass-panel bg-indigo-950/40 border-indigo-500/50 shadow-xl'
                    : 'glass-panel bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-300">
                    {tkt.ticketNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      tkt.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : tkt.status === 'In-Progress'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-1 mb-1">
                  {tkt.subject}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/5">
                  <span className="font-semibold text-slate-300">{tkt.category}</span>
                  <span>{tkt.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Ticket Detail Conversation Thread */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="rounded-3xl glass-panel bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-5">
              {/* Ticket Detail Header */}
              <div className="pb-4 border-b border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-300">
                    {activeTicket.ticketNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Priority: <strong className="text-amber-400">{activeTicket.priority}</strong>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activeTicket.subject}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeTicket.description}
                </p>
              </div>

              {/* AI Triage Synthesis Box */}
              {activeTicket.aiTriageSummary && (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Dispatch & Verification Ledger:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {activeTicket.aiTriageSummary}
                  </p>
                </div>
              )}

              {/* Responses Thread */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {activeTicket.responses.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300">
                        {res.sender} ({res.role})
                      </span>
                      <span className="text-[10px] text-slate-500">{res.timestamp}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{res.message}</p>
                  </div>
                ))}
              </div>

              {/* Add Reply Box */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an additional response or note..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shrink-0 shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl glass-panel bg-slate-900/60 border border-slate-800 text-slate-400">
              Select a support ticket to view correspondence.
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4">Create New Helpdesk Ticket</h3>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. NOC Application for Winter Internship"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide complete details. The AI triage engine will auto-verify your student records."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
