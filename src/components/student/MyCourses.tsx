import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  User,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  GraduationCap
} from 'lucide-react';
import { Course } from '../../types';
import { coursesService } from '../../services/courses';
import { PrivacyBadge } from '../ui/PrivacyBadge';

interface MyCoursesProps {
  onLaunchStudyMode?: (courseCode: string, topic: string) => void;
}

export const MyCourses: React.FC<MyCoursesProps> = ({ onLaunchStudyMode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>('crs_java');

  useEffect(() => {
    coursesService.getCourses().then(setCourses);
  }, []);

  const toggleCourse = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">My Enrolled Courses</h2>
            <PrivacyBadge label="Registered" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Official Course Curriculum & Syllabus Units (Semester 5)
          </p>
        </div>
      </div>

      {/* Courses Accordion List */}
      <div className="space-y-4">
        {courses.map((course) => {
          const isExpanded = expandedCourseId === course.id;

          return (
            <div
              key={course.id}
              className="rounded-3xl glass-panel bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl transition-all"
            >
              {/* Course Card Header */}
              <div
                onClick={() => toggleCourse(course.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {course.code}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {course.credits} Credits
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{course.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Instructor: <strong className="text-slate-200">{course.instructor}</strong></span>
                      <span>•</span>
                      <span>Attendance: <strong className="text-emerald-400">{course.attendancePercentage}%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLaunchStudyMode && onLaunchStudyMode(course.code, course.title);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Study Mode</span>
                  </button>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Syllabus & Resources */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-800/80 bg-slate-950/40 space-y-6 animate-in fade-in">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Units & Topics */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Official Syllabus Units</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.syllabus.map((unit) => (
                        <div
                          key={unit.unit}
                          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-300">
                              Unit {unit.unit}: {unit.title}
                            </span>
                            <button
                              onClick={() => onLaunchStudyMode && onLaunchStudyMode(course.code, unit.title)}
                              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              Explain Unit
                            </button>
                          </div>
                          <ul className="space-y-1">
                            {unit.topics.map((t, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-slate-500"></span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Handouts */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Course Handouts & Synchronized Documents</span>
                    </h4>

                    <div className="space-y-2">
                      {course.resources.map((res) => (
                        <div
                          key={res.id}
                          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            <span className="font-medium text-slate-200">{res.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">Uploaded {res.uploadedAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
