import { SupportTicket } from '../types';
import { MOCK_SUPPORT_TICKETS } from './mockData';

let ticketsDatabase = [...MOCK_SUPPORT_TICKETS];

export const supportService = {
  async getTickets(): Promise<SupportTicket[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...ticketsDatabase];
  },

  async createTicket(ticketData: {
    subject: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
    description: string;
    studentName: string;
    studentId: string;
  }): Promise<SupportTicket> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Automated AI Triage synthesis
    const aiTriageSummary = `AI Triage: Automated categorization as [${ticketData.category}]. High urgency scan passed. Dispatched to department supervisor.`;

    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: ticketData.studentId,
      studentName: ticketData.studentName,
      subject: ticketData.subject,
      category: ticketData.category,
      priority: ticketData.priority,
      status: 'Open',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      description: ticketData.description,
      aiTriageSummary,
      responses: [
        {
          sender: 'Campus AI Assistant',
          role: 'AI Triage',
          message: `Your ticket has been received and verified. Preliminary assessment: ${aiTriageSummary}`,
          timestamp: 'Just now',
        },
      ],
    };

    ticketsDatabase = [newTicket, ...ticketsDatabase];
    return newTicket;
  },

  async addReply(ticketId: string, message: string): Promise<SupportTicket> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    ticketsDatabase = ticketsDatabase.map((tkt) => {
      if (tkt.id === ticketId) {
        return {
          ...tkt,
          updatedAt: 'Just now',
          responses: [
            ...tkt.responses,
            {
              sender: 'Dharm',
              role: 'Student',
              message,
              timestamp: 'Just now',
            },
          ],
        };
      }
      return tkt;
    });
    return ticketsDatabase.find((t) => t.id === ticketId)!;
  },
};
