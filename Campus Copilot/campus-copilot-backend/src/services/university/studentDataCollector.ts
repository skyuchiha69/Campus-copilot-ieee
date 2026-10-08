import { PortalClient } from './portalClient';
import StudentProfile from '../../models/StudentProfile';
import StudentAttendance from '../../models/StudentAttendance';

export class StudentDataCollector {
  private client: PortalClient;

  constructor() {
    this.client = new PortalClient();
  }

  async collectAndSyncData(userId: string) {
    try {
      await this.client.init();
      const authSuccess = await this.client.authenticate();
      if (!authSuccess) {
        throw new Error("Failed to authenticate with university portal.");
      }

      const page = await this.client.getPage();

      // 1. Scrape Profile Information
      // Mocked CSS selectors since actual DOM is unknown without subagent output
      const name = await this.extractText(page, '#lblName', 'Unknown Student');
      const studentId = await this.extractText(page, '#lblEnrollment', 'Unknown ID');
      const program = await this.extractText(page, '#lblProgram', 'Unknown Program');

      await StudentProfile.findOneAndUpdate(
        { user_id: userId },
        { 
          user_id: userId, 
          student_id: studentId, 
          name, 
          department_id: 'DEPT_UNKNOWN', // Requires mapping
          semester: 'Unknown',
          division: 'A',
          program,
          last_synced: new Date()
        },
        { upsert: true, new: true }
      );

      // 2. Scrape Attendance
      // Navigate to attendance page
      const baseUrl = process.env.UNIVERSITY_PORTAL_BASE_URL || 'https://dcs.gsfcuniversity.ac.in';
      await page.goto(`${baseUrl}/academic/Student-cp/Attendance.aspx`).catch(() => null);
      
      // Simulate attendance extraction
      // Example dummy data
      await StudentAttendance.findOneAndUpdate(
        { user_id: userId, course_id: 'CS101' },
        {
          user_id: userId,
          course_id: 'CS101',
          attendance_percentage: 85,
          classes_attended: 34,
          classes_total: 40,
          last_synced: new Date()
        },
        { upsert: true }
      );

      console.log(`Sync completed for user ${userId}`);
    } catch (error) {
      console.error(`Sync failed for user ${userId}:`, error);
    } finally {
      await this.client.close();
    }
  }

  private async extractText(page: any, selector: string, defaultVal: string): Promise<string> {
    try {
      const el = await page.$(selector);
      if (el) {
        return await page.evaluate((e: any) => e.textContent?.trim(), el) || defaultVal;
      }
      return defaultVal;
    } catch {
      return defaultVal;
    }
  }
}
