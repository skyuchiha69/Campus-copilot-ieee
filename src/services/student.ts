import { StudentProfile, TimetableSlot, AttendanceRecord, Examination, Assignment } from '../types';
import { MOCK_STUDENT, MOCK_TIMETABLE, MOCK_ATTENDANCE, MOCK_EXAMINATIONS, MOCK_ASSIGNMENTS } from './mockData';
import { ApiClient } from './apiClient';

export const studentService = {
  async getProfile(targetStudentId: string = 'CS2023-8842'): Promise<StudentProfile> {
    ApiClient.verifyAuthorization('/student/profile', ['student', 'staff', 'instructor', 'admin'], targetStudentId);

    try {
      const res = await ApiClient.request<any>('/student/profile');
      if (res.success && res.data) {
        return {
          id: res.data._id || 'std_1',
          studentId: res.data.student_id || targetStudentId,
          name: res.data.name || MOCK_STUDENT.name,
          email: 'dharm.v@gsfc.ac.in',
          department: res.data.department_name || MOCK_STUDENT.department,
          program: res.data.program || MOCK_STUDENT.program,
          semester: res.data.semester || MOCK_STUDENT.semester,
          division: res.data.division || MOCK_STUDENT.division,
          batch: MOCK_STUDENT.batch,
          advisor: res.data.advisor_name || MOCK_STUDENT.advisor,
          cgpa: res.data.cgpa || MOCK_STUDENT.cgpa,
          creditsEarned: res.data.credits_completed || MOCK_STUDENT.creditsEarned,
          totalCredits: res.data.credits_total || MOCK_STUDENT.totalCredits,
          lastPortalSync: res.data.last_synced ? new Date(res.data.last_synced).toLocaleString() : 'Just now',
          status: 'active',
        };
      }
    } catch {
      // Graceful fallback
    }

    return { ...MOCK_STUDENT };
  },

  async getTimetable(targetStudentId: string = 'CS2023-8842'): Promise<TimetableSlot[]> {
    ApiClient.verifyAuthorization('/student/timetable', ['student', 'staff', 'instructor', 'admin'], targetStudentId);

    try {
      const res = await ApiClient.request<any[]>('/student/timetable');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((item: any) => ({
          id: item._id,
          courseCode: item.course_code,
          courseName: item.course_name,
          day: item.day,
          startTime: item.start_time,
          endTime: item.end_time,
          room: item.room,
          building: item.room?.includes('Lab') ? 'Building A (Technology Block)' : 'Building B',
          instructor: item.faculty,
          type: item.type === 'lab' ? 'Lab' : 'Lecture',
          ownerStudentId: targetStudentId,
        }));
      }
    } catch {
      // Fallback
    }

    return MOCK_TIMETABLE.filter((t) => t.ownerStudentId === targetStudentId);
  },

  async getAttendance(targetStudentId: string = 'CS2023-8842'): Promise<AttendanceRecord[]> {
    ApiClient.verifyAuthorization('/student/attendance', ['student', 'staff', 'instructor', 'admin'], targetStudentId);

    try {
      const res = await ApiClient.request<any>('/student/attendance');
      if (res.success && res.data && Array.isArray(res.data.records) && res.data.records.length > 0) {
        return res.data.records.map((r: any) => ({
          ownerStudentId: targetStudentId,
          courseCode: r.courseCode,
          courseTitle: r.courseName,
          percentage: r.percentage,
          attendedClasses: r.attended,
          totalClasses: r.total,
          minimumRequired: r.minimumRequired || 75,
          classesCanMiss: r.classesCanMiss,
          classesNeededToTarget: r.classesNeededToTarget,
          status: r.status,
          lastUpdated: r.lastUpdated ? new Date(r.lastUpdated).toLocaleDateString() : 'Today',
        }));
      }
    } catch {
      // Fallback
    }

    return MOCK_ATTENDANCE.filter((a) => a.ownerStudentId === targetStudentId);
  },

  async getExaminations(targetStudentId: string = 'CS2023-8842'): Promise<Examination[]> {
    ApiClient.verifyAuthorization('/student/examinations', ['student', 'staff', 'instructor', 'admin'], targetStudentId);

    try {
      const res = await ApiClient.request<any[]>('/student/examinations');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((e: any) => ({
          id: e._id,
          courseCode: e.course_code,
          courseName: e.course_name,
          examType: e.exam_type || 'End-Term',
          date: e.date,
          time: e.time,
          duration: '3 Hours',
          venue: e.room,
          seatNumber: e.seat_number || 'TBA',
          admitCardReady: true,
          syllabusCovered: 'All Units (1 to 5)',
          ownerStudentId: targetStudentId,
        }));
      }
    } catch {
      // Fallback
    }

    return MOCK_EXAMINATIONS.filter((e) => e.ownerStudentId === targetStudentId);
  },

  async getAssignments(targetStudentId: string = 'CS2023-8842'): Promise<Assignment[]> {
    ApiClient.verifyAuthorization('/student/assignments', ['student', 'staff', 'instructor', 'admin'], targetStudentId);

    try {
      const res = await ApiClient.request<any[]>('/student/assignments');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((a: any) => ({
          id: a._id,
          courseCode: a.course_code,
          courseName: a.course_name,
          title: a.title,
          description: a.description || 'Complete the assignment questions and submit before deadline.',
          dueDate: a.due_date,
          maxScore: a.total_points || 100,
          status: a.submitted ? (a.grade ? 'Graded' : 'Submitted') : 'Pending',
          submittedDate: a.submission_date,
          score: a.grade,
          feedback: a.feedback,
          ownerStudentId: targetStudentId,
        }));
      }
    } catch {
      // Fallback
    }

    return MOCK_ASSIGNMENTS.filter((a) => a.ownerStudentId === targetStudentId);
  }
};
