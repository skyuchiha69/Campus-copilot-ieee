// Comprehensive Type Definitions for Campus Copilot

export type UserRole = 'student' | 'staff' | 'instructor' | 'admin';

export type GroundingStatus = 'strongly_grounded' | 'partially_grounded' | 'not_verified';

export interface StudentProfile {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  program: string;
  semester: number | string;
  division: string;
  batch: string;
  avatarUrl?: string;
  advisor: string;
  cgpa?: number;
  creditsEarned?: number;
  totalCredits?: number;
  lastPortalSync?: string;
  status?: string;
}

export type SyncStatusType = 'connected' | 'syncing' | 'failed' | 'idle' | 'unconfigured';

export interface SyncState {
  status: SyncStatusType;
  lastSynced: string;
  nextSync: string;
  portalConnected: boolean;
  totalDocuments: number;
  totalNotices: number;
  totalCourses: number;
  recordsSynced: number;
  failedRecords: number;
  studentDataSynced: boolean;
  activeFailures: number;
  isStale: boolean;
  staleReason?: string;
  syncMessage?: string;
}

export interface TimetableSlot {
  id: string;
  ownerStudentId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  room: string;
  building: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';
  isCurrent?: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  instructor: string;
  instructorEmail: string;
  department: string;
  semester: number;
  attendancePercentage?: number;
  grade?: string;
  description: string;
  syllabus: {
    unit: number;
    title: string;
    topics: string[];
  }[];
  resources: {
    id: string;
    title: string;
    type: 'pdf' | 'slides' | 'notes' | 'video';
    url: string;
    uploadedAt: string;
  }[];
}

export interface AttendanceRecord {
  ownerStudentId: string;
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  minimumRequired: number;
  classesCanMiss?: number;
  classesNeededToTarget?: number;
  status: 'safe' | 'warning' | 'critical';
  lastUpdated: string;
  records?: {
    date: string;
    status: 'Present' | 'Absent' | 'Excused';
    topic?: string;
  }[];
}

export interface ResultRecord {
  ownerStudentId: string;
  semester: number;
  academicYear: string;
  sgpa: number;
  credits: number;
  status: 'Passed' | 'Result Awaited';
  courses: {
    code: string;
    name: string;
    credits: number;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
    points: number;
  }[];
}

export interface Examination {
  id: string;
  ownerStudentId: string;
  courseCode: string;
  courseName: string;
  examType: 'Mid-Term' | 'End-Term' | 'Practical' | 'Viva' | 'Mid-Semester' | 'End-Semester';
  date: string;
  time: string;
  duration: string;
  venue: string;
  seatNumber?: string;
  admitCardReady: boolean;
  syllabusCovered: string;
}

export interface AssignmentAiEvaluation {
  conceptUnderstanding: string;
  structure: string;
  completeness: string;
  possibleIssues: string[];
  suggestions: string[];
  preliminaryScore: number;
  disclaimer: string;
  instructorReviewStatus: 'Pending Review' | 'Approved' | 'Overridden';
}

export interface Assignment {
  id: string;
  ownerStudentId: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Overdue';
  submittedDate?: string;
  score?: number;
  grade?: number;
  feedback?: string;
  aiEvaluation?: AssignmentAiEvaluation;
}

export type NoticeCategory = 'official' | 'examination' | 'departmental' | 'administrative' | 'student';

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  publishDate: string;
  issuer: string;
  department?: string;
  isPriority: boolean;
  content: string;
  officialDocUrl?: string;
  verifiedOfficial: boolean;
  tags: string[];
}

export interface UniversityEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Workshop' | 'Seminar' | 'Cultural' | 'Sports' | 'Career';
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  registered: boolean;
  seatsLeft?: number;
  registrationDeadline: string;
  bannerGradient: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: 'Lab' | 'Classroom' | 'Auditorium' | 'Library' | 'Admin Office' | 'Cafeteria' | 'Facility';
  building: string;
  floor: string;
  roomNumber: string;
  department?: string;
  incharge?: string;
  directions: string;
  coordinates?: { x: number; y: number };
  openHours: string;
}

export type ChatSourceOrigin = 'official_university' | 'student_portal' | 'uploaded_doc' | 'student_document' | 'ai_academic' | 'authenticated_student_portal' | 'general_knowledge';

export interface ChatSource {
  title: string;
  origin: ChatSourceOrigin;
  documentName?: string;
  pageNumber?: number | string;
  updatedDate?: string;
  url?: string;
  verified: boolean;
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'navigate' | 'download' | 'quiz' | 'study_mode' | 'view_source' | 'ticket' | 'report_error';
  payload?: any;
}

export type ChatResponseType = 'answer' | 'source' | 'student_data' | 'action' | 'warning' | 'escalation' | 'attendance_calc' | 'grounded_rag';

export type ChatCategory = 'general_university' | 'student_specific' | 'academic' | 'campus' | 'administrative' | 'ATTENDANCE' | 'TIMETABLE' | 'EXAMINATIONS' | 'ASSIGNMENTS' | 'POLICY';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  category?: ChatCategory;
  isPrivate?: boolean;
  groundingStatus?: GroundingStatus;
  sources?: ChatSource[];
  actions?: ChatAction[];
  studentData?: Record<string, any>;
  warning?: string;
  responseType?: ChatResponseType;
  studyModeContext?: 'explain' | 'simplify' | 'examples' | 'quiz' | 'viva' | 'practice' | 'summary';
  ragQueryId?: string;
}

export interface UploadedDocument {
  id: string;
  ownerStudentId: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  extractedPages?: number;
  topic?: string;
  sha256Checksum?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  subject: string;
  category: 'Academic' | 'Examination' | 'Administration' | 'Technical' | 'Hostel' | 'Scholarship' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In-Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  description: string;
  aiTriageSummary?: string;
  responses: {
    sender: string;
    role: string;
    message: string;
    timestamp: string;
  }[];
}

export interface KnowledgeGap {
  id: string;
  query: string;
  timestamp: string;
  category: string;
  retrievedSources: string[];
  failureReason: string;
  count: number;
  status: 'open' | 'under_review' | 'resolved';
  suggestedSource?: string;
  resolutionNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: UserRole;
  action: 'sync_trigger' | 'document_modify' | 'knowledge_source_update' | 'permission_change' | 'notice_update' | 'knowledge_gap_resolve';
  details: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
}

export interface AdminAnalytics {
  activeStudentsToday: number;
  totalQueriesToday: number;
  ragAccuracyScore: number;
  avgResponseTimeMs: number;
  unansweredGapsCount: number;
  recentKnowledgeGaps: KnowledgeGap[];
  auditLogs: AuditLogEntry[];
  popularTopics: { topic: string; queryCount: number }[];
  categoryBreakdown: { category: string; percentage: number }[];
}

// Standardized API Envelope Interfaces
export interface ApiError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'OWNERSHIP_VIOLATION' | 'NETWORK_ERROR' | 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'INVALID_TOKEN' | 'VALIDATION_ERROR' | 'USER_EXISTS' | 'FILE_MISSING' | 'API_ERROR' | 'INTERNAL_ERROR' | 'INTERNAL_SERVER_ERROR';
  message: string;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  requestId: string;
  timestamp: string;
  latencyMs?: number;
}
