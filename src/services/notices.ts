import { Notice, NoticeCategory } from '../types';
import { MOCK_NOTICES } from './mockData';

export const noticesService = {
  async getNotices(category?: NoticeCategory): Promise<Notice[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (category) {
      return MOCK_NOTICES.filter((n) => n.category === category);
    }
    return [...MOCK_NOTICES];
  },

  async getPriorityNotices(): Promise<Notice[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_NOTICES.filter((n) => n.isPriority);
  }
};
