import React, { useEffect, useState } from 'react';
import { Clock, MapPin, User, Calendar, Navigation, CheckCircle2 } from 'lucide-react';
import { TimetableSlot } from '../../types';
import { studentService } from '../../services/student';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface MyTimetableProps {
  onLocateRoom?: (room: string) => void;
}

export const MyTimetable: React.FC<MyTimetableProps> = ({ onLocateRoom }) => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Thursday');

  useEffect(() => {
    studentService.getTimetable().then(setSlots);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
  const filteredSlots = slots.filter((s) => s.day === selectedDay);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Weekly Timetable</h2>
            <PrivacyBadge label="Official Class Schedule" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Synchronized with University Central Timetable Engine
          </p>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {day}
              {day === 'Thursday' && ' (Today)'}
            </button>
          );
        })}
      </div>

      {/* Timetable Slot List */}
      <div className="space-y-3">
        {filteredSlots.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel bg-slate-900/60 border border-slate-800 text-slate-400">
            No scheduled lectures on {selectedDay}. Enjoy your study block!
          </div>
        ) : (
          filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                slot.isCurrent
                  ? 'glass-panel bg-indigo-950/40 border-indigo-500/50 shadow-xl relative overflow-hidden'
                  : 'glass-panel bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {slot.isCurrent && (
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-cyan-400" />
              )}

              <div className="flex items-start md:items-center gap-4">
                <div
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[90px] ${
                    slot.isCurrent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 border border-slate-800 text-slate-300'
                  }`}
                >
                  <Clock className="w-4 h-4 mb-1 text-cyan-300" />
                  <span className="text-xs font-bold">{slot.startTime}</span>
                  <span className="text-[10px] opacity-70">{slot.endTime}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {slot.courseCode}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {slot.type}
                    </span>
                    {slot.isCurrent && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{slot.courseName}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {slot.instructor}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <strong>{slot.room}</strong> — {slot.building}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => onLocateRoom && onLocateRoom(slot.room)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
