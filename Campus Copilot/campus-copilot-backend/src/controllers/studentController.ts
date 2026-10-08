import { Response, NextFunction } from 'express';
import { RequestWithId } from '../middleware/requestId';
import StudentProfile from '../models/StudentProfile';
import StudentAttendance from '../models/StudentAttendance';
import StudentTimetable from '../models/StudentTimetable';
import StudentResult from '../models/StudentResult';
import StudentExam from '../models/StudentExam';
import StudentAssignment from '../models/StudentAssignment';
import AttendancePolicy from '../models/AttendancePolicy';
import { AppError } from '../middleware/errorHandler';

export const getProfile = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const profile = await StudentProfile.findOne({ user_id: userId });

    if (!profile) {
      return res.json({
        success: true,
        data: null,
        error: null,
        requestId: req.id
      });
    }

    return res.json({
      success: true,
      data: profile,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const records = await StudentAttendance.find({ user_id: userId }).sort({ course_code: 1 });

    // Fetch university attendance policy or fallback to standard policy
    const policy = await AttendancePolicy.findOne();
    const minRequired = policy?.minimum_required_percentage || 75;

    // Server-side calculation of attendance health and missable classes
    const enrichedRecords = records.map(record => {
      const { classes_attended, classes_total, attendance_percentage } = record;
      
      // Calculate how many future classes can be missed while staying >= minRequired
      // Formula: floor((classes_attended / (minRequired / 100)) - classes_total)
      const canMiss = Math.max(0, Math.floor((classes_attended / (minRequired / 100)) - classes_total));

      // Calculate how many consecutive classes must be attended to reach minRequired
      // Formula: ceil((minRequired * classes_total - 100 * classes_attended) / (100 - minRequired))
      let neededToReach = 0;
      if (attendance_percentage < minRequired) {
        neededToReach = Math.max(0, Math.ceil((minRequired * classes_total - 100 * classes_attended) / (100 - minRequired)));
      }

      return {
        id: record._id,
        courseId: record.course_id,
        courseCode: record.course_code,
        courseName: record.course_name,
        percentage: attendance_percentage,
        attended: classes_attended,
        total: classes_total,
        minimumRequired: minRequired,
        classesCanMiss: canMiss,
        classesNeededToTarget: neededToReach,
        status: attendance_percentage >= minRequired ? 'safe' : attendance_percentage >= (policy?.condonation_limit_percentage || 65) ? 'warning' : 'critical',
        lastUpdated: record.last_updated,
        lastSynced: record.last_synced
      };
    });

    const totalAttended = records.reduce((acc, r) => acc + r.classes_attended, 0);
    const totalClasses = records.reduce((acc, r) => acc + r.classes_total, 0);
    const aggregatePercentage = totalClasses > 0 ? Number(((totalAttended / totalClasses) * 100).toFixed(1)) : 0;

    return res.json({
      success: true,
      data: {
        records: enrichedRecords,
        summary: {
          aggregatePercentage,
          totalAttended,
          totalClasses,
          minimumRequired: minRequired,
          policyName: policy?.university_name || 'GSFC University',
          policyDescription: policy?.description
        }
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getTimetable = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const timetable = await StudentTimetable.find({ user_id: userId }).sort({ day: 1, start_time: 1 });

    return res.json({
      success: true,
      data: timetable,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const attendanceRecords = await StudentAttendance.find({ user_id: userId });

    const courses = attendanceRecords.map(a => ({
      courseId: a.course_id,
      courseCode: a.course_code,
      courseName: a.course_name,
      attendance: a.attendance_percentage
    }));

    return res.json({
      success: true,
      data: courses,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getResults = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const results = await StudentResult.find({ user_id: userId }).sort({ semester: -1 });

    return res.json({
      success: true,
      data: results,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getExaminations = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const exams = await StudentExam.find({ user_id: userId }).sort({ date: 1 });

    return res.json({
      success: true,
      data: exams,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignments = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const assignments = await StudentAssignment.find({ user_id: userId }).sort({ due_date: 1 });

    return res.json({
      success: true,
      data: assignments,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};
