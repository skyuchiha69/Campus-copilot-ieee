import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, FileText, ExternalLink, Filter, AlertCircle, ShieldCheck } from 'lucide-react';
import { Notice, NoticeCategory } from '../../types';
import { noticesService } from '../../services/notices';

export const NoticesHub: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    noticesService.getNotices().then(setNotices);
  }, []);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'examination', label: 'Examinations' },
    { id: 'administrative', label: 'Administrative' },
    { id: 'departmental', label: 'Departmental' },
    { id: 'official', label: 'Official General' },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesQuery =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">University Official Notices</h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time administrative notices ingested from official university portals
          </p>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter notices..."
          className="w-full sm:w-56 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Notices Cards List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-3xl glass-panel p-6 shadow-xl space-y-3 transition-all ${
              notice.isPriority
                ? 'bg-slate-900/95 border-amber-500/40 relative overflow-hidden'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            {notice.isPriority && (
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-400" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {notice.isPriority && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    PRIORITY BULLETIN
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {notice.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{notice.publishDate}</span>
              </div>

              <span className="text-xs text-slate-400 font-medium">Issuer: {notice.issuer}</span>
            </div>

            <h3 className="text-base font-bold text-slate-100">{notice.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{notice.content}</p>

            {/* Source card and tags footer */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {notice.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {notice.officialDocUrl && (
                <a
                  href={notice.officialDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Verify Official PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
