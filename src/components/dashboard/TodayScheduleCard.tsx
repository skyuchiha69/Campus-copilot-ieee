import React from 'react';
import { Clock, MapPin, User, ChevronRight, Sparkles, Navigation } from 'lucide-react';
import { TimetableSlot } from '../../types';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface TodayScheduleCardProps {
  slots: TimetableSlot[];
  onNavigateTab: (tab: string) => void;
  onLocateRoom?: (room: string) => void;
}

export const TodayScheduleCard: React.FC<TodayScheduleCardProps> = ({
  slots,
  onNavigateTab,
  onLocateRoom,
}) => {
  return (
    <div className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Today's Schedule</h3>
            <PrivacyBadge label="Official Timetable" size="sm" />
          </div>
          <p className="text-xs text-slate-400">Live schedule synchronized from university timetable engine</p>
        </div>
        <button
          onClick={() => onNavigateTab('timetable')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>Full Week</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {slots.map((slot, idx) => (
          <div
            key={slot.id || idx}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              slot.isCurrent
                ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/40 relative overflow-hidden'
                : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
            }`}
          >
            {slot.isCurrent && (
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-cyan-400" />
            )}

            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`p-3 rounded-xl flex flex-col items-center justify-center shrink-0 min-w-[70px] ${
                  slot.isCurrent
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-700 text-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5 mb-1 text-cyan-300" />
                <span className="text-xs font-bold leading-tight">{slot.startTime}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{slot.courseCode}</span>
                  <h4 className="text-sm font-bold text-slate-100">{slot.courseName}</h4>
                  {slot.isCurrent && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                      NOW
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    {slot.instructor}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <strong>{slot.room}</strong> ({slot.building})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => onLocateRoom ? onLocateRoom(slot.room) : onNavigateTab('campus')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title={`Find directions to ${slot.room}`}
              >
                <Navigation className="w-3 h-3 text-indigo-400" />
                <span>Locate Room</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
