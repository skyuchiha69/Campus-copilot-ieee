import React, { useEffect, useState } from 'react';
import {
  StudentProfile,
  TimetableSlot,
  Course,
  Examination,
  Assignment,
  Notice,
  AttendanceRecord
} from '../../types';
import { studentService } from '../../services/student';
import { coursesService } from '../../services/courses';
import { noticesService } from '../../services/notices';
import { GreetingHeader } from './GreetingHeader';
import { QuickStats } from './QuickStats';
import { TodayScheduleCard } from './TodayScheduleCard';
import { UpcomingDeadlines } from './UpcomingDeadlines';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface DashboardHomeProps {
  onNavigateTab: (tab: string) => void;
  onOpenChatWithPrompt?: (prompt: string) => void;
  onLocateRoom?: (room: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigateTab,
  onOpenChatWithPrompt,
  onLocateRoom,
}) => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Examination[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [stu, tt, crs, ex, asg, not, att] = await Promise.all([
        studentService.getProfile(),
        studentService.getTimetable(),
        coursesService.getCourses(),
        studentService.getExaminations(),
        studentService.getAssignments(),
        noticesService.getNotices(),
        studentService.getAttendance(),
      ]);

      setStudent(stu);
      setTimetable(tt.filter((t) => t.day === 'Thursday')); // Today's Thursday slots
      setCourses(crs);
      setExams(ex);
      setAssignments(asg);
      setNotices(not);
      setAttendance(att);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading || !student) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto p-4">
        <div className="h-48 rounded-3xl bg-slate-900"></div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="h-28 rounded-2xl bg-slate-900"></div>
          <div className="h-28 rounded-2xl bg-slate-900"></div>
          <div className="h-28 rounded-2xl bg-slate-900"></div>
          <div className="h-28 rounded-2xl bg-slate-900"></div>
        </div>
        <div className="h-64 rounded-3xl bg-slate-900"></div>
      </div>
    );
  }

  const attendanceAvg = Math.round(
    attendance.reduce((acc, curr) => acc + curr.percentage, 0) / (attendance.length || 1)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* 1. Personalized Greeting Header with Metadata */}
      <GreetingHeader
        student={student}
        onOpenChatWithPrompt={onOpenChatWithPrompt}
      />

      {/* 2. Key Metrics & Quick Stats */}
      <QuickStats
        cgpa={student.cgpa || 8.84}
        attendanceAvg={attendanceAvg}
        coursesCount={courses.length}
        nextExamDate={exams[0]?.date || '14 Oct'}
        onNavigateTab={onNavigateTab}
      />

      {/* 3. Main Dashboard Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Timetable & My Courses Quick Grid */}
        <div className="lg:col-span-7 space-y-6">
          <TodayScheduleCard
            slots={timetable}
            onNavigateTab={onNavigateTab}
            onLocateRoom={onLocateRoom}
          />

          {/* Enrolled Courses Summary Grid */}
          <div className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">My Active Courses</h3>
                  <PrivacyBadge label="Enrolled" size="sm" />
                </div>
                <p className="text-xs text-slate-400">Autumn Semester 2026 Curriculum</p>
              </div>
              <button
                onClick={() => onNavigateTab('courses')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View Syllabus</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => onNavigateTab('courses')}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      {course.code}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {course.instructor}
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Attendance:</span>
                    <span className="font-bold text-emerald-400">{course.attendancePercentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming Deadlines & Priority Bulletins */}
        <div className="lg:col-span-5 space-y-6">
          <UpcomingDeadlines
            assignments={assignments}
            exams={exams}
            notices={notices}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>
    </div>
  );
};
