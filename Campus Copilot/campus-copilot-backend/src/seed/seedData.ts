import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import StudentAttendance from '../models/StudentAttendance';
import StudentTimetable from '../models/StudentTimetable';
import StudentResult from '../models/StudentResult';
import StudentExam from '../models/StudentExam';
import StudentAssignment from '../models/StudentAssignment';
import AttendancePolicy from '../models/AttendancePolicy';
import Notice from '../models/Notice';
import UniversityEvent from '../models/UniversityEvent';
import CampusLocation from '../models/CampusLocation';
import PublicCourse from '../models/PublicCourse';
import DocumentChunk from '../models/DocumentChunk';
import DocumentRecord from '../models/Document';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-copilot';

export async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to database:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB.');

    // 1. Seed Users
    const salt = await bcrypt.genSalt(10);
    const studentPasswordHash = await bcrypt.hash('Student@123', salt);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const facultyPasswordHash = await bcrypt.hash('Faculty@123', salt);

    let studentUser = await User.findOne({ email: 'student@gsfc.ac.in' });
    if (!studentUser) {
      studentUser = await User.create({
        email: 'student@gsfc.ac.in',
        passwordHash: studentPasswordHash,
        role: 'student',
        name: 'Dharm Vaghela',
        student_id: 'CS2023-8842',
        department: 'Computer Science & Engineering',
        program: 'B.Tech Computer Science & Engineering'
      });
      console.log('[Seed] Created default student user (student@gsfc.ac.in / Student@123)');
    }

    let adminUser = await User.findOne({ email: 'admin@gsfc.ac.in' });
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@gsfc.ac.in',
        passwordHash: adminPasswordHash,
        role: 'admin',
        name: 'Administrator (Dean Office)',
        student_id: 'ADMIN-9901',
        department: 'Academic Administration',
        program: 'Dean Office'
      });
      console.log('[Seed] Created default admin user (admin@gsfc.ac.in / Admin@123)');
    }

    let facultyUser = await User.findOne({ email: 'faculty@gsfc.ac.in' });
    if (!facultyUser) {
      facultyUser = await User.create({
        email: 'faculty@gsfc.ac.in',
        passwordHash: facultyPasswordHash,
        role: 'instructor',
        name: 'Prof. Ramesh Kulkarni',
        student_id: 'FAC-301',
        department: 'Computer Science & Engineering',
        program: 'Faculty'
      });
      console.log('[Seed] Created default faculty user (faculty@gsfc.ac.in / Faculty@123)');
    }

    const studentIdStr = studentUser._id.toString();

    // 2. Seed Student Profile
    await StudentProfile.findOneAndUpdate(
      { user_id: studentIdStr },
      {
        user_id: studentIdStr,
        student_id: 'CS2023-8842',
        name: 'Dharm Vaghela',
        department_id: 'DEPT_CSE',
        department_name: 'Computer Science & Engineering',
        semester: 'Semester 6',
        division: 'A',
        program: 'B.Tech Computer Science & Engineering',
        cgpa: 8.84,
        credits_completed: 92,
        credits_total: 160,
        advisor_name: 'Dr. Ramesh Kulkarni',
        advisor_email: 'r.kulkarni@gsfc.ac.in',
        status: 'active',
        last_synced: new Date()
      },
      { upsert: true, new: true }
    );

    // 3. Seed Attendance Records for Dharm
    const attendanceData = [
      { course_id: 'CS302', course_code: 'CS302', course_name: 'Data Structures & Algorithms', attendance_percentage: 88, classes_attended: 22, classes_total: 25 },
      { course_id: 'CS305', course_code: 'CS305', course_name: 'Database Management Systems', attendance_percentage: 79, classes_attended: 19, classes_total: 24 },
      { course_id: 'CS301', course_code: 'CS301', course_name: 'Operating Systems', attendance_percentage: 85, classes_attended: 23, classes_total: 27 },
      { course_id: 'CS308', course_code: 'CS308', course_name: 'Computer Networks', attendance_percentage: 72, classes_attended: 18, classes_total: 25 },
      { course_id: 'CS310', course_code: 'CS310', course_name: 'Artificial Intelligence & RAG', attendance_percentage: 95, classes_attended: 19, classes_total: 20 },
      { course_id: 'CS312', course_code: 'CS312', course_name: 'Software Engineering & Agile', attendance_percentage: 80, classes_attended: 16, classes_total: 20 }
    ];

    for (const att of attendanceData) {
      await StudentAttendance.findOneAndUpdate(
        { user_id: studentIdStr, course_id: att.course_id },
        { ...att, user_id: studentIdStr, last_synced: new Date(), last_updated: new Date() },
        { upsert: true }
      );
    }

    // 4. Seed Timetable for Dharm
    await StudentTimetable.deleteMany({ user_id: studentIdStr });
    const timetableSlots = [
      { user_id: studentIdStr, course_id: 'CS305', course_code: 'CS305', course_name: 'Database Management Systems', day: 'Monday', start_time: '09:30', end_time: '10:30', room: 'Lab 301', faculty: 'Dr. Sharma', type: 'lecture' },
      { user_id: studentIdStr, course_id: 'CS302', course_code: 'CS302', course_name: 'Data Structures & Algorithms', day: 'Monday', start_time: '10:45', end_time: '11:45', room: 'LH-2', faculty: 'Prof. Patel', type: 'lecture' },
      { user_id: studentIdStr, course_id: 'CS301', course_code: 'CS301', course_name: 'Operating Systems', day: 'Tuesday', start_time: '09:30', end_time: '10:30', room: 'LH-1', faculty: 'Dr. Ramesh Kulkarni', type: 'lecture' },
      { user_id: studentIdStr, course_id: 'CS310', course_code: 'CS310', course_name: 'Artificial Intelligence & RAG', day: 'Tuesday', start_time: '14:00', end_time: '16:00', room: 'AI Innovation Hub (Bldg B)', faculty: 'Dr. Arvind Joshi', type: 'lab' },
      { user_id: studentIdStr, course_id: 'CS308', course_code: 'CS308', course_name: 'Computer Networks', day: 'Wednesday', start_time: '11:00', end_time: '12:00', room: 'LH-3', faculty: 'Prof. Sneha Shah', type: 'lecture' },
      { user_id: studentIdStr, course_id: 'CS305', course_code: 'CS305', course_name: 'Database Management Systems', day: 'Thursday', start_time: '10:30', end_time: '11:30', room: 'Lab 301', faculty: 'Dr. Sharma', type: 'lecture' },
      { user_id: studentIdStr, course_id: 'CS302', course_code: 'CS302', course_name: 'Data Structures & Algorithms', day: 'Thursday', start_time: '14:00', end_time: '15:00', room: 'LH-2', faculty: 'Prof. Patel', type: 'lecture' },
      { user_id: studentIdStr, course_id: 'CS312', course_code: 'CS312', course_name: 'Software Engineering & Agile', day: 'Friday', start_time: '09:30', end_time: '10:30', room: 'LH-2', faculty: 'Prof. Mehta', type: 'lecture' }
    ];
    await StudentTimetable.insertMany(timetableSlots);

    // 5. Seed Results
    await StudentResult.deleteMany({ user_id: studentIdStr });
    await StudentResult.create({
      user_id: studentIdStr,
      student_id: 'CS2023-8842',
      semester: 'Semester 5',
      gpa: 8.92,
      cgpa: 8.84,
      courses: [
        { course_code: 'CS301', course_name: 'Operating Systems', credits: 4, grade: 'AA', points: 10 },
        { course_code: 'CS302', course_name: 'Data Structures & Algorithms', credits: 4, grade: 'AB', points: 9 },
        { course_code: 'CS305', course_code_name: 'Database Systems', course_name: 'Database Systems', credits: 4, grade: 'BB', points: 8 },
        { course_code: 'MA201', course_name: 'Discrete Mathematics', credits: 3, grade: 'AA', points: 10 }
      ],
      status: 'passed'
    });

    // 6. Seed Examinations
    await StudentExam.deleteMany({ user_id: studentIdStr });
    await StudentExam.insertMany([
      { user_id: studentIdStr, course_code: 'CS305', course_name: 'Database Management Systems', exam_type: 'Mid-Semester', date: '2026-10-15', time: '10:00 AM - 12:00 PM', room: 'Hall A-102', seat_number: 'DESK-42' },
      { user_id: studentIdStr, course_code: 'CS302', course_name: 'Data Structures & Algorithms', exam_type: 'Mid-Semester', date: '2026-10-18', time: '02:00 PM - 04:00 PM', room: 'Hall B-201', seat_number: 'DESK-18' },
      { user_id: studentIdStr, course_code: 'CS301', course_name: 'Operating Systems', exam_type: 'Mid-Semester', date: '2026-10-22', time: '10:00 AM - 12:00 PM', room: 'Hall A-105', seat_number: 'DESK-09' }
    ]);

    // 7. Seed Assignments
    await StudentAssignment.deleteMany({ user_id: studentIdStr });
    await StudentAssignment.insertMany([
      { user_id: studentIdStr, course_code: 'CS305', course_name: 'Database Systems', title: 'Assignment 3: B-Tree Indexing & Normalization', due_date: '2026-10-12', total_points: 100, submitted: false },
      { user_id: studentIdStr, course_code: 'CS301', course_name: 'Operating Systems', title: 'Lab Assignment 2: Thread Synchronization in C++', due_date: '2026-10-14', total_points: 50, submitted: true, grade: 48, feedback: 'Excellent concurrency handling and zero race conditions.' },
      { user_id: studentIdStr, course_code: 'CS310', course_name: 'Artificial Intelligence', title: 'Project Milestone 1: RAG Pipeline with Atlas Vector Search', due_date: '2026-10-20', total_points: 100, submitted: false }
    ]);

    // 8. Seed Attendance Policy
    await AttendancePolicy.deleteMany({});
    await AttendancePolicy.create({
      university_name: 'GSFC University',
      minimum_required_percentage: 75,
      condonation_limit_percentage: 65,
      medical_exception_allowed: true,
      policy_document_id: 'POL-2025-ATT-01',
      description: 'GSFC University academic regulations require a minimum aggregate attendance of 75% in each registered course to be eligible to appear in the end-semester examinations. Students with attendance between 65% and 74.9% may apply for Dean condonation upon submitting verified medical certificates.'
    });

    // 9. Seed Public Notices
    await Notice.deleteMany({});
    await Notice.insertMany([
      {
        title: 'Mid-Semester Examination Schedule for Autumn 2026',
        content: 'The Office of the Controller of Examinations announces that Mid-Semester Examinations will commence from October 15, 2026. Students are required to carry their physical ID card and verify their assigned seating desk.',
        category: 'exam',
        department: 'Controller of Examinations',
        author: 'Dr. S. K. Roy (Controller of Examinations)',
        priority: 'urgent',
        published_at: new Date()
      },
      {
        title: 'GSFC University National AI & Robotics Hackathon 2026 Registration Open',
        content: 'Registrations are now open for HackGSFC 2026. Teams of up to 4 students can register for tracks including Generative AI, Campus Automation, and Green Energy Tech. Cash prizes worth ₹3,50,000.',
        category: 'academic',
        department: 'School of Technology',
        author: 'Dean of Student Affairs',
        priority: 'high',
        published_at: new Date(Date.now() - 86400000)
      },
      {
        title: 'University Central Library Extended Hours during Exam Weeks',
        content: 'The Central Library (Building C) will remain open 24/7 starting from October 10th to facilitate student preparation for mid-semester assessments.',
        category: 'general',
        department: 'Central Library',
        author: 'Chief Librarian',
        priority: 'normal',
        published_at: new Date(Date.now() - 172800000)
      }
    ]);

    // 10. Seed Events
    await UniversityEvent.deleteMany({});
    await UniversityEvent.insertMany([
      {
        title: 'HackGSFC 2026: 36-Hour National Innovation Hackathon',
        description: 'Compete with 100+ university teams to build production-grade AI solutions, robotics prototypes, and campus apps.',
        category: 'hackathon',
        date: '2026-10-25',
        time: '09:00 AM - Oct 26 09:00 PM',
        location: 'GSFC University Innovation Complex, Auditorium B',
        organizer: 'CSE Department & IEEE Student Branch',
        featured: true
      },
      {
        title: 'Guest Lecture: Enterprise RAG Architecture & Vector Search',
        description: 'Industry keynote on deploying production LangChain & MongoDB vector search architectures for enterprise systems.',
        category: 'seminar',
        date: '2026-10-18',
        time: '03:00 PM - 05:00 PM',
        location: 'Seminar Hall 301, Building A',
        organizer: 'School of Technology',
        featured: false
      }
    ]);

    // 11. Seed Campus Locations
    await CampusLocation.deleteMany({});
    await CampusLocation.insertMany([
      { name: 'Central Library & Digital Study Hub', code: 'LIB-C', category: 'library', building: 'Building C', floor: '1st & 2nd Floor', hours: '08:00 AM - 11:00 PM (24/7 during exams)', description: 'Quiet study pods, high-speed WiFi, research journals, and digital workstations.' },
      { name: 'Computer Science Lab 301 (Database & OS Lab)', code: 'LAB-301', category: 'lab', building: 'Building A (Technology Block)', floor: '3rd Floor', room_number: 'A-301', hours: '09:00 AM - 06:00 PM', description: 'Dual-monitor Linux/Windows development workstations.' },
      { name: 'AI Innovation Hub & Robotics Arena', code: 'AI-HUB', category: 'academic', building: 'Building B', floor: 'Ground Floor', room_number: 'B-01', hours: '09:00 AM - 08:00 PM', description: 'GPU compute clusters, testing benches, and hackathon workspace.' },
      { name: 'Student Cafeteria & Garden Lounge', code: 'CAFE-01', category: 'canteen', building: 'Student Center', floor: 'Ground Floor', hours: '08:00 AM - 09:00 PM', description: 'Fresh meals, espresso bar, and outdoor discussion benches.' },
      { name: 'Dean Office & Academic Administration', code: 'ADMIN-01', category: 'admin', building: 'Administrative Complex', floor: '2nd Floor', room_number: 'ADM-204', hours: '09:30 AM - 05:30 PM', description: 'Enrollment verification, hall tickets, fee inquiries, and official transcripts.' }
    ]);

    // 12. Seed Public Courses
    await PublicCourse.deleteMany({});
    await PublicCourse.insertMany([
      { course_code: 'CS302', course_name: 'Data Structures & Algorithms', department: 'Computer Science & Engineering', credits: 4, semester: 'Semester 6', description: 'Advanced graph algorithms, dynamic programming, balanced trees, and amortized complexity.' },
      { course_code: 'CS305', course_name: 'Database Management Systems', department: 'Computer Science & Engineering', credits: 4, semester: 'Semester 6', description: 'Relational algebra, SQL, query optimization, ACID transactions, and NoSQL architecture.' },
      { course_code: 'CS310', course_name: 'Artificial Intelligence & RAG', department: 'Computer Science & Engineering', credits: 4, semester: 'Semester 6', description: 'Neural networks, vector search embeddings, LangChain RAG pipelines, and grounded LLM synthesis.' }
    ]);

    // 13. Seed Document Chunks for RAG
    await DocumentChunk.deleteMany({ source_type: 'official_university' });
    await DocumentRecord.deleteMany({ source_type: 'official_university' });

    const docId = 'DOC_REG_2025_01';
    await DocumentRecord.create({
      document_id: docId,
      title: 'GSFC University Academic Regulations & Student Handbook 2025-2026',
      file_name: 'academic_regulations_2025_2026.pdf',
      file_type: 'application/pdf',
      file_size: 2450000,
      owner_user_id: adminUser._id.toString(),
      visibility: 'public',
      source_type: 'official_university',
      chunks_count: 3,
      status: 'indexed'
    });

    await DocumentChunk.insertMany([
      {
        document_id: docId,
        source_type: 'official_university',
        document_type: 'policy',
        authority: 5,
        visibility: 'public',
        content: 'GSFC University Attendance Policy: Every student is required to maintain a minimum aggregate attendance of 75% in each registered theory and laboratory course. Students falling between 65% and 74.9% may apply for condonation with authorized medical certification. Students below 65% are debarred from end-semester examinations.',
        chunk_index: 0,
        last_synced: new Date()
      },
      {
        document_id: docId,
        source_type: 'official_university',
        document_type: 'policy',
        authority: 5,
        visibility: 'public',
        content: 'Grading and Evaluation System: The university follows a 10-point Letter Grading scale: AA (10 points, Outstanding), AB (9 points, Excellent), BB (8 points, Very Good), BC (7 points, Good), CC (6 points, Fair), CD (5 points, Average), DD (4 points, Pass), and FF (0 points, Fail). Minimum CGPA required for award of degree is 5.0.',
        chunk_index: 1,
        last_synced: new Date()
      },
      {
        document_id: docId,
        source_type: 'official_university',
        document_type: 'policy',
        authority: 5,
        visibility: 'public',
        content: 'Examination Rules: Students must report to the examination hall at least 15 minutes before scheduled start time. Electronic smartwatches, smartphones, and programmable calculators are strictly prohibited inside the hall.',
        chunk_index: 2,
        last_synced: new Date()
      }
    ]);

    console.log('[Seed] Database successfully seeded with official university records!');
  } catch (error) {
    console.error('[Seed] Database seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] MongoDB disconnected.');
  }
}

if (require.main === module) {
  seedDatabase();
}
