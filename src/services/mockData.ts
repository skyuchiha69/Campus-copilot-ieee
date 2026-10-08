import {
  StudentProfile,
  Course,
  TimetableSlot,
  AttendanceRecord,
  ResultRecord,
  Examination,
  Assignment,
  Notice,
  UniversityEvent,
  CampusLocation,
  SyncState,
  AdminAnalytics,
  SupportTicket,
  ChatMessage,
  AuditLogEntry,
  KnowledgeGap
} from '../types';

export const MOCK_STUDENT: StudentProfile = {
  id: 'usr_dharm_2026',
  studentId: 'CS2023-8842',
  name: 'Dharm',
  email: 'dharm.sharma@campus.edu',
  department: 'Computer Science & Engineering',
  program: 'B.Tech Computer Science',
  semester: 5,
  division: 'A',
  batch: '2023-2027',
  advisor: 'Dr. Evelyn Reed (HOD CSE)',
  cgpa: 8.84,
  creditsEarned: 84,
  totalCredits: 160,
  lastPortalSync: 'Today, 10:32 AM',
};

export const MOCK_SYNC_STATE: SyncState = {
  status: 'connected',
  lastSynced: 'Today, 10:32 AM',
  nextSync: 'Today, 11:02 AM',
  portalConnected: true,
  totalDocuments: 124,
  totalNotices: 43,
  totalCourses: 78,
  recordsSynced: 245,
  failedRecords: 0,
  studentDataSynced: true,
  activeFailures: 0,
  isStale: false,
  syncMessage: 'Official university portal webhook & student portal sync active',
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_java',
    code: 'CS301',
    title: 'Advanced Java & Enterprise Architecture',
    credits: 4,
    instructor: 'Prof. Ramesh Kulkarni',
    instructorEmail: 'r.kulkarni@campus.edu',
    department: 'Computer Science',
    semester: 5,
    attendancePercentage: 88,
    grade: 'A',
    description: 'Deep dive into Java concurrency, JVM bytecode, Spring Boot microservices, ORM Hibernate, and Design Patterns.',
    syllabus: [
      { unit: 1, title: 'OOP Principles & JVM Internals', topics: ['Polymorphism', 'Inheritance & Abstract Classes', 'Memory Model & Garbage Collection'] },
      { unit: 2, title: 'Multithreading & Concurrency', topics: ['ExecutorService', 'Locks & Synchronization', 'CompletableFuture'] },
      { unit: 3, title: 'Collections & Generics', topics: ['Custom HashMaps', 'Streams API', 'Lambdas'] },
      { unit: 4, title: 'Enterprise Frameworks', topics: ['Spring Boot REST APIs', 'JPA/Hibernate', 'Security Filters'] },
    ],
    resources: [
      { id: 'res_1', title: 'Java_Concurrency_DeepDive_Lecture4.pdf', type: 'pdf', url: '#', uploadedAt: 'Yesterday' },
      { id: 'res_2', title: 'Unit_2_Practice_Questions.pdf', type: 'notes', url: '#', uploadedAt: '3 days ago' },
    ]
  },
  {
    id: 'crs_co',
    code: 'CS302',
    title: 'Computer Organization & Architecture',
    credits: 4,
    instructor: 'Dr. Sarah Vance',
    instructorEmail: 's.vance@campus.edu',
    department: 'Computer Science',
    semester: 5,
    attendancePercentage: 92,
    grade: 'A+',
    description: 'Microarchitecture, RISC-V pipelining, hazards, memory hierarchy, cache coherence, and parallel processing.',
    syllabus: [
      { unit: 1, title: 'Instruction Set Architecture', topics: ['MIPS/RISC-V assembly', 'Addressing modes', 'Instruction decoding'] },
      { unit: 2, title: 'Processor Datapath & Pipelining', topics: ['Five-stage pipeline', 'Data hazards & forwarding', 'Branch prediction'] },
      { unit: 3, title: 'Memory Hierarchy', topics: ['Cache mapping techniques', 'Virtual memory', 'TLB translation'] },
    ],
    resources: [
      { id: 'res_3', title: 'RISC-V_Pipelining_Handout.pdf', type: 'slides', url: '#', uploadedAt: '1 week ago' },
    ]
  },
  {
    id: 'crs_os',
    code: 'CS303',
    title: 'Operating Systems & Kernel Design',
    credits: 4,
    instructor: 'Prof. Ananya Sen',
    instructorEmail: 'a.sen@campus.edu',
    department: 'Computer Science',
    semester: 5,
    attendancePercentage: 84,
    grade: 'A',
    description: 'Processes, CPU scheduling algorithms, synchronization semaphores/mutexes, deadlock detection, and virtual memory paging.',
    syllabus: [
      { unit: 1, title: 'Process Management', topics: ['Process Lifecycle', 'Fork/Exec system calls', 'Context Switching'] },
      { unit: 2, title: 'Synchronization & Deadlocks', topics: ['Peterson algorithm', 'Semaphores & Mutexes', 'Banker\'s Algorithm'] },
      { unit: 3, title: 'Memory & File Systems', topics: ['Demand Paging', 'Page replacement algorithms (LRU, FIFO)', 'Inodes & Ext4'] },
    ],
    resources: [
      { id: 'res_4', title: 'OS_Kernel_Design_Notes.pdf', type: 'pdf', url: '#', uploadedAt: '5 days ago' },
    ]
  },
  {
    id: 'crs_math',
    code: 'MA301',
    title: 'Discrete Mathematics & Graph Theory',
    credits: 3,
    instructor: 'Dr. Marcus Vance',
    instructorEmail: 'm.vance@campus.edu',
    department: 'Mathematics',
    semester: 5,
    attendancePercentage: 85,
    grade: 'B+',
    description: 'Combinatorics, propositional logic, recurrence relations, graph theory, trees, and algebraic structures.',
    syllabus: [
      { unit: 1, title: 'Combinatorics & Recurrence', topics: ['Generating functions', 'Inclusion-Exclusion', 'Pigeonhole principle'] },
      { unit: 2, title: 'Graph Theory & Networks', topics: ['Eulerian & Hamiltonian graphs', 'Dijkstra & Kruskal', 'Planar graphs & Colorings'] },
    ],
    resources: [
      { id: 'res_5', title: 'Graph_Algorithms_Cheatsheet.pdf', type: 'pdf', url: '#', uploadedAt: '2 weeks ago' },
    ]
  }
];

export const MOCK_TIMETABLE: TimetableSlot[] = [
  {
    id: 'tt_1',
    ownerStudentId: 'CS2023-8842',
    day: 'Thursday',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    courseCode: 'CS301',
    courseName: 'Java Enterprise Lab',
    instructor: 'Prof. Ramesh Kulkarni',
    room: 'Lab 3',
    building: 'Turing Computer Complex',
    type: 'Lab',
    isCurrent: true,
  },
  {
    id: 'tt_2',
    ownerStudentId: 'CS2023-8842',
    day: 'Thursday',
    startTime: '12:00 PM',
    endTime: '01:00 PM',
    courseCode: 'CS302',
    courseName: 'Computer Organization',
    instructor: 'Dr. Sarah Vance',
    room: 'Room 204',
    building: 'Main Academic Block',
    type: 'Lecture',
  },
  {
    id: 'tt_3',
    ownerStudentId: 'CS2023-8842',
    day: 'Thursday',
    startTime: '02:30 PM',
    endTime: '03:30 PM',
    courseCode: 'CS303',
    courseName: 'Operating Systems',
    instructor: 'Prof. Ananya Sen',
    room: 'Room 301',
    building: 'Main Academic Block',
    type: 'Lecture',
  },
  {
    id: 'tt_4',
    ownerStudentId: 'CS2023-8842',
    day: 'Thursday',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    courseCode: 'MA301',
    courseName: 'Discrete Mathematics',
    instructor: 'Dr. Marcus Vance',
    room: 'Auditorium B',
    building: 'Ramanujan Science Hall',
    type: 'Lecture',
  },
  {
    id: 'tt_5',
    ownerStudentId: 'CS2023-8842',
    day: 'Friday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    courseCode: 'CS303',
    courseName: 'Operating Systems Lab',
    instructor: 'Prof. Ananya Sen',
    room: 'OS Linux Lab 2',
    building: 'Turing Computer Complex',
    type: 'Lab',
  },
  {
    id: 'tt_6',
    ownerStudentId: 'CS2023-8842',
    day: 'Friday',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    courseCode: 'CS301',
    courseName: 'Advanced Java',
    instructor: 'Prof. Ramesh Kulkarni',
    room: 'Room 201',
    building: 'Main Academic Block',
    type: 'Lecture',
  },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS301',
    courseTitle: 'Advanced Java & Enterprise Architecture',
    totalClasses: 32,
    attendedClasses: 28,
    percentage: 87.5,
    minimumRequired: 75,
    status: 'safe',
    lastUpdated: '07 Oct 2026',
    records: [
      { date: '06 Oct 2026', status: 'Present', topic: 'Spring Data JPA & Transaction Management' },
      { date: '04 Oct 2026', status: 'Present', topic: 'Custom ThreadPoolExecutors' },
      { date: '01 Oct 2026', status: 'Absent', topic: 'ConcurrentHashMap Internals' },
      { date: '29 Sep 2026', status: 'Present', topic: 'Java Generics & Type Erasure' },
    ]
  },
  {
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS302',
    courseTitle: 'Computer Organization & Architecture',
    totalClasses: 28,
    attendedClasses: 26,
    percentage: 92.8,
    minimumRequired: 75,
    status: 'safe',
    lastUpdated: '06 Oct 2026',
    records: [
      { date: '05 Oct 2026', status: 'Present', topic: 'Branch Target Buffer & 2-bit Predictors' },
      { date: '03 Oct 2026', status: 'Present', topic: 'Pipelining Hazards Mitigation' },
    ]
  },
  {
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS303',
    courseTitle: 'Operating Systems & Kernel Design',
    totalClasses: 30,
    attendedClasses: 25,
    percentage: 83.3,
    minimumRequired: 75,
    status: 'safe',
    lastUpdated: '07 Oct 2026',
    records: [
      { date: '07 Oct 2026', status: 'Present', topic: 'Dining Philosophers with Mutex' },
      { date: '02 Oct 2026', status: 'Absent', topic: 'Bankers Algorithm Implementation' },
    ]
  },
  {
    ownerStudentId: 'CS2023-8842',
    courseCode: 'MA301',
    courseTitle: 'Discrete Mathematics & Graph Theory',
    totalClasses: 25,
    attendedClasses: 21,
    percentage: 84.0,
    minimumRequired: 75,
    status: 'safe',
    lastUpdated: '05 Oct 2026',
    records: [
      { date: '05 Oct 2026', status: 'Present', topic: 'Kruskal Algorithm & Disjoint Sets' },
    ]
  }
];

export const MOCK_EXAMINATIONS: Examination[] = [
  {
    id: 'ex_1',
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS301',
    courseName: 'Advanced Java Mid-Term',
    examType: 'Mid-Term',
    date: '14 Oct 2026',
    time: '10:00 AM - 12:00 PM',
    duration: '2 Hours',
    venue: 'Exam Hall A-102',
    seatNumber: 'DESK-42',
    admitCardReady: true,
    syllabusCovered: 'Units 1, 2, and 3 (Multithreading & Spring Boot)',
  },
  {
    id: 'ex_2',
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS302',
    courseName: 'Computer Organization Mid-Term',
    examType: 'Mid-Term',
    date: '16 Oct 2026',
    time: '10:00 AM - 12:00 PM',
    duration: '2 Hours',
    venue: 'Exam Hall B-204',
    seatNumber: 'DESK-42',
    admitCardReady: true,
    syllabusCovered: 'Units 1 and 2 (ISA & Pipelining Datapath)',
  },
  {
    id: 'ex_3',
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS303',
    courseName: 'Operating Systems Practical Viva',
    examType: 'Practical',
    date: '20 Oct 2026',
    time: '02:00 PM - 05:00 PM',
    duration: '3 Hours',
    venue: 'Linux Kernel Lab 3',
    seatNumber: 'TERMINAL-14',
    admitCardReady: true,
    syllabusCovered: 'POSIX threads, semaphore implementation, xv6 kernel modifications',
  }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS301',
    courseName: 'Advanced Java',
    title: 'Spring Boot Microservice with JWT & Rate Limiter',
    description: 'Implement a distributed rate limiter in Java using Redis token bucket algorithm with Spring Security JWT auth filters.',
    dueDate: '12 Oct 2026, 11:59 PM',
    maxScore: 100,
    status: 'Pending',
  },
  {
    id: 'asg_2',
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS303',
    courseName: 'Operating Systems',
    title: 'Custom Memory Allocator (malloc/free simulation)',
    description: 'Build a thread-safe slab memory allocator in C/C++ handling fragmentation and coalescing.',
    dueDate: '15 Oct 2026, 05:00 PM',
    maxScore: 50,
    status: 'Pending',
  },
  {
    id: 'asg_3',
    ownerStudentId: 'CS2023-8842',
    courseCode: 'CS302',
    courseName: 'Computer Organization',
    title: 'RISC-V 5-Stage Pipeline Hazard Simulator',
    description: 'Simulate RAW data hazard detection with forwarding paths in Python or C++.',
    dueDate: '02 Oct 2026',
    maxScore: 50,
    status: 'Graded',
    submittedDate: '01 Oct 2026',
    score: 48,
    feedback: 'Excellent forwarding path edge-case handling. Clean modular architecture.',
    aiEvaluation: {
      conceptUnderstanding: 'Strong mastery of RAW hazards and forwarding multiplexer routing.',
      structure: 'Modular C++ implementation with decoupled pipeline register stages.',
      completeness: '100% of test hazard vectors validated successfully.',
      possibleIssues: [
        'Memory load-use stall requires 1 bubble before forwarding (correctly handled).'
      ],
      suggestions: [
        'Consider adding branch prediction 2-bit saturating counter simulation for extra credit.'
      ],
      preliminaryScore: 48,
      disclaimer: 'AI-generated feedback. Not an official university grade.',
      instructorReviewStatus: 'Approved'
    }
  }
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: 'not_1',
    title: 'Schedule for Mid-Term Examination Autumn 2026 (Official Bulletin)',
    category: 'examination',
    publishDate: '06 Oct 2026',
    issuer: 'Office of Controller of Examinations',
    department: 'University Academic Council',
    isPriority: true,
    verifiedOfficial: true,
    content: 'The Mid-Term theory and practical examinations for B.Tech Semester 3, 5, and 7 will commence on 14th October 2026. Hall tickets/admit cards can now be verified on the portal. Late exam registration closes on 10th October 2026 at 5:00 PM.',
    officialDocUrl: 'https://univ.edu/notices/exam_autumn_2026.pdf',
    tags: ['Exams', 'Mid-Term', 'Admit Card', 'Timetable']
  },
  {
    id: 'not_2',
    title: 'Application Window for University NOC (No Objection Certificate) & Internships',
    category: 'administrative',
    publishDate: '05 Oct 2026',
    issuer: 'Dean of Student Affairs & Training Placement Cell',
    isPriority: false,
    verifiedOfficial: true,
    content: 'Students seeking NOC for 6-month winter industrial training or external internships must submit Form-B through Campus Copilot or the Training & Placement portal by 25th October 2026. HOD approval required.',
    officialDocUrl: 'https://univ.edu/training/noc_guidelines_2026.pdf',
    tags: ['NOC', 'Internship', 'Placement', 'Administration']
  },
  {
    id: 'not_3',
    title: 'Annual Campus Hackathon "HackCopilot 2026" Registrations Open',
    category: 'official',
    publishDate: '04 Oct 2026',
    issuer: 'Department of Computer Science & ACM Student Chapter',
    department: 'CSE',
    isPriority: true,
    verifiedOfficial: true,
    content: 'Registration for HackCopilot 2026 is officially open! 36-hour hackathon with cash prizes worth $15,000 across AI/ML, Decentralized Systems, and Smart Campus solutions. Team size: 2-4 students.',
    officialDocUrl: 'https://univ.edu/events/hackcopilot2026',
    tags: ['Hackathon', 'ACM', 'Prizes', 'Events']
  },
  {
    id: 'not_4',
    title: 'Central Library Extended Night Hours & Quiet Study Rooms',
    category: 'departmental',
    publishDate: '03 Oct 2026',
    issuer: 'Chief Librarian',
    isPriority: false,
    verifiedOfficial: true,
    content: 'In view of forthcoming mid-term exams, Central Library Level 2 & 3 will remain open 24/7 with high-speed WiFi and coffee stations starting 08 October 2026.',
    tags: ['Library', 'Study', 'Facilities']
  }
];

export const MOCK_EVENTS: UniversityEvent[] = [
  {
    id: 'ev_1',
    title: 'HackCopilot 2026 — 36hr National AI Hackathon',
    category: 'Hackathon',
    date: '24-26 Oct 2026',
    time: '09:00 AM onwards',
    location: 'Innovation & Incubation Hub, 3rd Floor',
    organizer: 'CSE Dept & Google Student Club',
    description: 'Build next-gen intelligent agentic software with mentors from top tech firms. Food, swag, and hardware kits provided.',
    registered: true,
    seatsLeft: 18,
    registrationDeadline: '20 Oct 2026',
    bannerGradient: 'from-indigo-600 to-cyan-600'
  },
  {
    id: 'ev_2',
    title: 'Hands-on Workshop: Building Agentic Workflows with LangGraph',
    category: 'Workshop',
    date: '18 Oct 2026',
    time: '02:00 PM - 05:30 PM',
    location: 'Turing Complex, Lab 4',
    organizer: 'AI Research Society',
    description: 'Learn multi-agent collaboration, memory retrieval, tool-calling pipelines, and autonomous evaluation.',
    registered: false,
    seatsLeft: 24,
    registrationDeadline: '16 Oct 2026',
    bannerGradient: 'from-violet-600 to-fuchsia-600'
  },
  {
    id: 'ev_3',
    title: 'Distinguished Speaker: Future of High-Performance Operating Systems',
    category: 'Seminar',
    date: '22 Oct 2026',
    time: '04:00 PM - 06:00 PM',
    location: 'Main Auditorium',
    organizer: 'IEEE Student Branch',
    description: 'Keynote by Dr. Aris Thorne on Microkernels, eBPF telemetry, and memory safety in systems programming.',
    registered: false,
    seatsLeft: 85,
    registrationDeadline: '21 Oct 2026',
    bannerGradient: 'from-emerald-600 to-teal-600'
  }
];

export const MOCK_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc_lab3',
    name: 'Java & Enterprise Systems Lab (Lab 3)',
    code: 'TCC-L3',
    category: 'Lab',
    building: 'Turing Computer Complex',
    floor: '2nd Floor',
    roomNumber: 'Room 204-B',
    department: 'Computer Science',
    incharge: 'Prof. Ramesh Kulkarni (Lab Head)',
    directions: 'Enter Turing Complex main lobby, take elevator to 2nd Floor, turn right past AI Research Hub. Lab 3 is on the left.',
    openHours: '08:30 AM - 07:00 PM',
  },
  {
    id: 'loc_lab4',
    name: 'Advanced Networking & AI Systems (Lab 4)',
    code: 'TCC-L4',
    category: 'Lab',
    building: 'Turing Computer Complex',
    floor: '2nd Floor',
    roomNumber: 'Room 208',
    department: 'Computer Science',
    incharge: 'Dr. Evelyn Reed',
    directions: 'Enter Turing Complex, 2nd floor, straight down the east wing corridor next to server room.',
    openHours: '08:30 AM - 08:00 PM',
  },
  {
    id: 'loc_lib',
    name: 'Central University Library & Research Commons',
    code: 'CUL-01',
    category: 'Library',
    building: 'Rabindranath Tagore Learning Center',
    floor: 'Ground, 1st, 2nd, 3rd Floors',
    roomNumber: 'Main Building',
    directions: 'Located at the center of campus green lawn, opposite Senate House.',
    openHours: '24 Hours (during Exam Season)',
  },
  {
    id: 'loc_exam_hall',
    name: 'Main Examination Hall A-102',
    code: 'EXAM-A102',
    category: 'Classroom',
    building: 'Academic Block A',
    floor: '1st Floor',
    roomNumber: 'A-102',
    directions: 'Academic Block A, stairwell east, directly in front of the main foyer.',
    openHours: 'Exam times only (08:30 AM - 06:00 PM)',
  },
  {
    id: 'loc_dean_office',
    name: 'Office of Dean of Student Affairs',
    code: 'ADMIN-DSA',
    category: 'Admin Office',
    building: 'Administrative Central Tower',
    floor: 'Ground Floor',
    roomNumber: 'G-12',
    incharge: 'Dean R. K. Singhania',
    directions: 'Directly inside main Administrative Tower gate on the right.',
    openHours: '09:30 AM - 05:00 PM (Mon-Fri)',
  }
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_1',
    timestamp: 'Today, 10:32 AM',
    actorId: 'system_sync_daemon',
    actorRole: 'admin',
    action: 'sync_trigger',
    details: 'Automated 30-min university portal webhook sync. 245 records refreshed across courses, notices, and timetable.',
    status: 'SUCCESS'
  },
  {
    id: 'aud_2',
    timestamp: 'Today, 09:15 AM',
    actorId: 'admin_dean_office',
    actorRole: 'admin',
    action: 'notice_update',
    details: 'Published Autumn 2026 Mid-Term Examination Schedule notice (Doc ID: not_1).',
    status: 'SUCCESS'
  },
  {
    id: 'aud_3',
    timestamp: 'Yesterday, 04:45 PM',
    actorId: 'admin_registrar',
    actorRole: 'admin',
    action: 'knowledge_gap_resolve',
    details: 'Ingested Transport Department PDF memo resolving query: Bus route schedule for South Campus route 12.',
    status: 'SUCCESS'
  }
];

export const MOCK_KNOWLEDGE_GAPS: KnowledgeGap[] = [
  {
    id: 'gap_1',
    query: 'Bus route schedule for South Campus route 12 on Saturdays',
    timestamp: '07 Oct 2026',
    category: 'Transportation',
    retrievedSources: [],
    failureReason: 'No official transport circular indexed for weekend schedules.',
    count: 28,
    status: 'open',
    suggestedSource: 'Transport Department PDF notice',
  },
  {
    id: 'gap_2',
    query: 'Criteria for semester exchange scholarship to Munich Tech',
    timestamp: '06 Oct 2026',
    category: 'International Relations',
    retrievedSources: ['Exchange_Guidelines_2025.pdf'],
    failureReason: 'Outdated 2025 document retrieved; 2026 criteria missing from knowledge base.',
    count: 19,
    status: 'under_review',
    suggestedSource: 'International Relations Office memo',
  },
  {
    id: 'gap_3',
    query: 'Hostel mess refund policy for Diwali vacation',
    timestamp: '05 Oct 2026',
    category: 'Hostel Affairs',
    retrievedSources: [],
    failureReason: 'No active circular found in Chief Warden database.',
    count: 14,
    status: 'open',
    suggestedSource: 'Chief Warden circular',
  },
  {
    id: 'gap_4',
    query: 'Gymnasium membership renewal procedure for postgraduates',
    timestamp: '04 Oct 2026',
    category: 'Sports Facilities',
    retrievedSources: ['Sports_Complex_2024.pdf'],
    failureReason: 'PG renewal fee table missing from vectorized index.',
    count: 9,
    status: 'open',
    suggestedSource: 'Sports Complex guidelines',
  }
];

export const MOCK_ADMIN_ANALYTICS: AdminAnalytics = {
  activeStudentsToday: 1842,
  totalQueriesToday: 9410,
  ragAccuracyScore: 98.4,
  avgResponseTimeMs: 380,
  unansweredGapsCount: 4,
  recentKnowledgeGaps: MOCK_KNOWLEDGE_GAPS,
  auditLogs: MOCK_AUDIT_LOGS,
  popularTopics: [
    { topic: 'Mid-Term Exam Dates & Admit Cards', queryCount: 3210 },
    { topic: 'Timetable & Room Relocation', queryCount: 2140 },
    { topic: 'Attendance Shortage Rules & Medical Leaves', queryCount: 1420 },
    { topic: 'Java & OS Syllabus Explanations', queryCount: 1190 },
    { topic: 'NOC & Internship Application Steps', queryCount: 890 },
  ],
  categoryBreakdown: [
    { category: 'Student-Specific Portal Data', percentage: 42 },
    { category: 'General University Information', percentage: 31 },
    { category: 'Academic & Study Assistance', percentage: 17 },
    { category: 'Campus Directory & Navigation', percentage: 7 },
    { category: 'Administrative & NOC Requests', percentage: 3 },
  ]
};

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_101',
    ticketNumber: 'TKT-2026-8891',
    studentId: 'CS2023-8842',
    studentName: 'Dharm',
    subject: 'Attendance correction for CS301 (Java Enterprise) dated 01 Oct',
    category: 'Academic',
    priority: 'Medium',
    status: 'In-Progress',
    createdAt: '02 Oct 2026',
    updatedAt: '03 Oct 2026',
    description: 'I was present during the lab session on 01 Oct 2026 and submitted my git commit on time, but portal marks Absent. Attached lab log.',
    aiTriageSummary: 'Valid discrepancy ticket: Automated lab git check verifies commit timestamp matching scheduled class hours. Routed to Prof. Ramesh Kulkarni.',
    responses: [
      {
        sender: 'Campus AI Assistant',
        role: 'AI Triage',
        message: 'Your ticket has been logged and correlated with Git repository logs. The course instructor has been notified for manual verification.',
        timestamp: '02 Oct 2026, 11:45 AM'
      },
      {
        sender: 'Prof. Ramesh Kulkarni',
        role: 'Faculty',
        message: 'Verified log file. Updating attendance register on portal during next sync batch.',
        timestamp: '03 Oct 2026, 04:10 PM'
      }
    ]
  },
  {
    id: 'tkt_102',
    ticketNumber: 'TKT-2026-8740',
    studentId: 'CS2023-8842',
    studentName: 'Dharm',
    subject: 'Request for Official NOC for Google Summer Training',
    category: 'Administration',
    priority: 'High',
    status: 'Open',
    createdAt: '06 Oct 2026',
    updatedAt: '06 Oct 2026',
    description: 'I have received an offer letter for the upcoming winter sprint. Requesting endorsement on Form-B.',
    aiTriageSummary: 'NOC Request: Student meets required minimum CGPA (8.84 > 7.50 requirement) and has zero backlogs. Eligible for accelerated clearance.',
    responses: [
      {
        sender: 'Campus AI Assistant',
        role: 'AI Triage',
        message: 'Eligibility criteria verified (CGPA: 8.84, Attendance: 87.5%). Form-B auto-filled and queued for HOD digital signature.',
        timestamp: '06 Oct 2026, 02:20 PM'
      }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'assistant',
    content: `Hello Dharm 👋 Welcome to **Campus Copilot**!

I have synchronized your official student records and university notices. You can ask me anything about your academic schedule, exam timetables, campus buildings, study topics, or administrative procedures.`,
    timestamp: '10:32 AM',
    category: 'general_university',
    responseType: 'answer',
    groundingStatus: 'strongly_grounded',
    sources: [
      {
        title: 'Campus Copilot Synchronization Gateway',
        origin: 'student_portal',
        updatedDate: 'Today, 10:32 AM',
        verified: true,
      }
    ],
    actions: [
      { id: 'act_1', label: '📅 What is my next class?', type: 'navigate' },
      { id: 'act_2', label: '📊 Check my attendance safe margin', type: 'navigate' },
      { id: 'act_3', label: '📝 When is the exam registration deadline?', type: 'navigate' },
      { id: 'act_4', label: '💡 Study Mode: Explain Java Inheritance', type: 'study_mode' },
    ]
  }
];
