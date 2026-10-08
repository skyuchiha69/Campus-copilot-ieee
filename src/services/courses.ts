import { Course } from '../types';
import { MOCK_COURSES } from './mockData';

export const coursesService = {
  async getCourses(): Promise<Course[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...MOCK_COURSES];
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_COURSES.find((c) => c.id === id);
  }
};
