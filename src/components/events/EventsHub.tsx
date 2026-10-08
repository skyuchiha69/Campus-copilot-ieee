import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { UniversityEvent } from '../../types';
import { eventsService } from '../../services/events';

export const EventsHub: React.FC = () => {
  const [events, setEvents] = useState<UniversityEvent[]>([]);

  useEffect(() => {
    eventsService.getEvents().then(setEvents);
  }, []);

  const handleToggle = async (id: string) => {
    const updated = await eventsService.toggleRegistration(id);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Campus Events & Hackathons</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
            Live Calendar
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Discover student workshops, coding hackathons, guest lectures, and cultural symposiums
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between transition-all hover:border-indigo-500/40"
          >
            {/* Gradient Top Banner */}
            <div className={`h-28 bg-gradient-to-r ${ev.bannerGradient} p-5 flex flex-col justify-between relative`}>
              <span className="self-start text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20">
                {ev.category}
              </span>
              <div className="text-white text-xs font-semibold drop-shadow">
                Organized by {ev.organizer}
              </div>
            </div>

            {/* Body content */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-2">{ev.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{ev.description}</p>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{ev.date} ({ev.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-slate-200">{ev.location}</span>
                  </div>
                  {ev.seatsLeft !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ev.seatsLeft} seats remaining</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Action */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Deadline: {ev.registrationDeadline}
                </span>

                <button
                  onClick={() => handleToggle(ev.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    ev.registered
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  }`}
                >
                  {ev.registered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <span>Register Now</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
