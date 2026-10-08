import React, { useState } from 'react';
import { Search, MapPin, Building, Clock, User, Compass, Navigation, ArrowRight } from 'lucide-react';
import { CampusLocation } from '../../types';
import { MOCK_CAMPUS_LOCATIONS } from '../../services/mockData';

interface CampusDirectoryProps {
  initialSearch?: string;
  onAskCopilot?: (locName: string) => void;
}

export const CampusDirectory: React.FC<CampusDirectoryProps> = ({
  initialSearch = '',
  onAskCopilot,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Lab', 'Library', 'Classroom', 'Admin Office'];

  const filteredLocations = MOCK_CAMPUS_LOCATIONS.filter((loc) => {
    const matchesCat = selectedCategory === 'all' || loc.category === selectedCategory;
    const matchesQuery =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Campus Digital GeoDirectory</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
            Indoor Navigator
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Instant step-by-step directions to classrooms, computing labs, auditoriums, and administrative offices
        </p>
      </div>

      {/* Search Input and Categories */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campus (e.g. 'Lab 4', 'Library', 'Examination Hall', 'Dean')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-6 shadow-xl space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{loc.code}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                  {loc.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{loc.name}</h3>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{loc.building} • <strong>{loc.floor}</strong> ({loc.roomNumber})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Hours: {loc.openHours}</span>
                </div>
                {loc.incharge && (
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Incharge: {loc.incharge}</span>
                  </div>
                )}
              </div>

              {/* Step-by-step Directions Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Walking Directions:</span>
                </div>
                <p className="leading-relaxed">{loc.directions}</p>
              </div>
            </div>

            <button
              onClick={() => onAskCopilot && onAskCopilot(loc.name)}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-700/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Ask Copilot for Live Navigation Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
