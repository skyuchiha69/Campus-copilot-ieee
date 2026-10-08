import { UniversityEvent } from '../types';
import { MOCK_EVENTS } from './mockData';

let eventsDatabase = [...MOCK_EVENTS];

export const eventsService = {
  async getEvents(): Promise<UniversityEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...eventsDatabase];
  },

  async toggleRegistration(eventId: string): Promise<UniversityEvent> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    eventsDatabase = eventsDatabase.map((ev) => {
      if (ev.id === eventId) {
        const nextState = !ev.registered;
        return {
          ...ev,
          registered: nextState,
          seatsLeft: ev.seatsLeft !== undefined ? (nextState ? ev.seatsLeft - 1 : ev.seatsLeft + 1) : undefined,
        };
      }
      return ev;
    });

    const updated = eventsDatabase.find((e) => e.id === eventId)!;
    return updated;
  }
};
