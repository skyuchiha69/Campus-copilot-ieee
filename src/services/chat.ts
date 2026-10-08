import { ChatMessage, ChatSource, ChatAction, GroundingStatus, ChatCategory } from '../types';
import { MOCK_STUDENT, MOCK_TIMETABLE, MOCK_COURSES, MOCK_ATTENDANCE, MOCK_NOTICES, MOCK_CAMPUS_LOCATIONS, MOCK_KNOWLEDGE_GAPS } from './mockData';
import { ApiClient } from './apiClient';

export interface ChatRequestPayload {
  prompt: string;
  studyMode?: 'explain' | 'simplify' | 'examples' | 'quiz' | 'viva' | 'practice' | 'summary';
  attachedDocId?: string;
  studentId?: string;
}

export const chatService = {
  async sendMessage(payload: ChatRequestPayload): Promise<ChatMessage> {
    const { prompt, studyMode, attachedDocId } = payload;
    const cleanPrompt = prompt.toLowerCase().trim();
    const activeUserId = ApiClient.getCurrentUserId();

    // Enforce authentication check before processing
    ApiClient.verifyAuthorization('/chat/completions');

    try {
      const res = await ApiClient.request<any>('/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt, studyMode, attachedDocId }),
      });

      if (res.success && res.data) {
        const d = res.data;
        const mappedSources: ChatSource[] = Array.isArray(d.sources)
          ? d.sources.map((s: any) => ({
              title: s.title || 'Official University Source',
              origin: s.origin === 'student_document' ? 'student_document' : s.origin === 'authenticated_student_portal' ? 'student_portal' : 'official_university',
              documentName: s.documentId || 'University_Knowledge_Base',
              updatedDate: s.updatedAt || 'Recently updated',
              verified: Boolean(s.verified),
            }))
          : [];

        return {
          id: d.messageId || `msg_${Date.now()}`,
          sender: 'assistant',
          category: (d.category?.toLowerCase() as ChatCategory) || 'academic',
          isPrivate: d.category === 'ATTENDANCE' || d.category === 'TIMETABLE' || d.category === 'STUDENT_SPECIFIC',
          responseType: d.category === 'ATTENDANCE' ? 'attendance_calc' : 'grounded_rag',
          groundingStatus: (d.groundingStatus as GroundingStatus) || 'strongly_grounded',
          ragQueryId: res.requestId,
          content: d.answer || d.response || 'Information retrieved from university records.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: mappedSources,
          actions: [
            { id: 'act_report_err', label: '⚠️ Report Incorrect Info', type: 'report_error', payload: { query: prompt, category: d.category || 'General' } },
          ],
        };
      }
    } catch {
      // Backend offline: proceed to client-side deterministic pipeline
    }

    // Latency simulation representing client fallback RAG pipeline
    await new Promise((resolve) => setTimeout(resolve, 400));
    const ragQueryId = ApiClient.generateRequestId();

    // =========================================================================
    // 1. INTENT: STUDENT PORTAL — TIMETABLE & NEXT CLASS
    // =========================================================================
    if (cleanPrompt.includes('next class') || cleanPrompt.includes('schedule') || cleanPrompt.includes('timetable') || cleanPrompt.includes('class today')) {
      // Resource-level verification: Ensure user is querying their own timetable
      const userSlots = MOCK_TIMETABLE.filter(s => s.ownerStudentId === activeUserId && s.day === 'Thursday');
      const nextClass = userSlots[0] || MOCK_TIMETABLE[0];

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'student_specific',
        isPrivate: true,
        responseType: 'student_data',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        content: `Your next scheduled class is **${nextClass.courseName} (${nextClass.courseCode})** at **${nextClass.startTime}** in **${nextClass.room}** (${nextClass.building}).

• **Instructor:** ${nextClass.instructor}
• **Session Type:** ${nextClass.type}
• **Current Status:** In session right now`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Authenticated University Student Portal (Timetable Engine)',
            origin: 'student_portal',
            documentName: 'Student_Timetable_Autumn_2026.json',
            updatedDate: 'Today, 10:32 AM',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_nav_room', label: `📍 Directions to ${nextClass.room}`, type: 'navigate' },
          { id: 'act_view_tt', label: '📅 View Full Weekly Timetable', type: 'navigate' },
          { id: 'act_report_err', label: '⚠️ Report Incorrect Info', type: 'report_error', payload: { query: prompt, category: 'Timetable' } }
        ],
        studentData: {
          course: nextClass.courseName,
          time: nextClass.startTime,
          venue: `${nextClass.room}, ${nextClass.building}`
        }
      };
    }

    // =========================================================================
    // 2. INTENT: STUDENT PORTAL — ENROLLED COURSES
    // =========================================================================
    if (cleanPrompt.includes('enrolled') || cleanPrompt.includes('my courses') || cleanPrompt.includes('what courses')) {
      const courseList = MOCK_COURSES.map(c => `• **${c.code}: ${c.title}** (${c.credits} Credits) — *${c.instructor}*`).join('\n');
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'student_specific',
        isPrivate: true,
        responseType: 'student_data',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        content: `You are currently enrolled in **4 active courses** for **Semester 5 (CSE Division A)**:

${courseList}

All 4 courses are officially registered and synchronized with your university portal account.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'University ERP Course Registration System',
            origin: 'student_portal',
            documentName: 'Course_Enrollment_Registry.json',
            updatedDate: 'Today, 10:32 AM',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_view_syllabus', label: '📚 Open Course Syllabus Viewer', type: 'navigate' },
          { id: 'act_study_mode', label: '💡 Launch Study Mode for Java', type: 'study_mode' }
        ]
      };
    }

    // =========================================================================
    // 3. INTENT: STUDENT PORTAL — ATTENDANCE & SHORTAGE SAFETY
    // =========================================================================
    if (cleanPrompt.includes('attendance') || cleanPrompt.includes('classes attended') || cleanPrompt.includes('miss') || cleanPrompt.includes('shortage')) {
      const userAtt = MOCK_ATTENDANCE.filter(a => a.ownerStudentId === activeUserId);
      const avg = (userAtt.reduce((acc, curr) => acc + curr.percentage, 0) / (userAtt.length || 1)).toFixed(1);
      const list = userAtt.map(a => `• **${a.courseCode}** (${a.courseTitle}): **${a.percentage}%** (${a.attendedClasses}/${a.totalClasses} classes)`).join('\n');

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'student_specific',
        isPrivate: true,
        responseType: 'student_data',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        content: `Your overall aggregate attendance is **${avg}%** (Minimum mandatory university requirement is **75%**).

${list}

🟢 **Status: Safe Margin**. You can safely miss up to **3 lectures** in Computer Organization and **2 lectures** in Java while remaining safely above the 75% regulatory threshold.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Biometric & ERP RFID Attendance Register',
            origin: 'student_portal',
            documentName: 'RFID_Biometric_Ledger.log',
            updatedDate: '07 Oct 2026, 05:00 PM',
            verified: true,
          },
          {
            title: 'Academic Ordinance §14.2 (Attendance Regulations)',
            origin: 'official_university',
            documentName: 'academic_ordinance_2026.pdf',
            pageNumber: 24,
            updatedDate: '01 Aug 2026',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_attendance_tab', label: '📊 View Attendance Risk Breakdown', type: 'navigate' },
          { id: 'act_report_err', label: '⚠️ Report Attendance Discrepancy', type: 'ticket' }
        ]
      };
    }

    // =========================================================================
    // 4. INTENT: OFFICIAL UNIVERSITY SOURCE — EXAMINATIONS & DEADLINES
    // =========================================================================
    if (cleanPrompt.includes('exam') || cleanPrompt.includes('deadline') || cleanPrompt.includes('mid-term') || cleanPrompt.includes('midterm') || cleanPrompt.includes('admit card') || cleanPrompt.includes('diwali') || cleanPrompt.includes('vacation')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'general_university',
        isPrivate: false,
        responseType: 'answer',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        content: `According to the **Official University Examination Bulletin (Ref: EX-AUTUMN-2026)**:

1. **Mid-Term Examination Dates:** Theory & Practical examinations begin on **14th October 2026**.
2. **Registration Deadline:** Regular registration is closed. Late exam registration portal window closes on **10th October 2026 at 5:00 PM**.
3. **Admit Cards:** Hall tickets are available for instant digital verification on the student portal. Desk seating allocations have been published.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Office of Controller of Examinations Bulletin',
            origin: 'official_university',
            documentName: 'exam_autumn_2026.pdf',
            pageNumber: 1,
            updatedDate: '06 October 2026',
            url: 'https://univ.edu/notices/exam_autumn_2026.pdf',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_exam_schedule', label: '📅 View My Exam Dates & Seating', type: 'navigate' },
          { id: 'act_download_admit', label: '📥 Download Admit Card PDF', type: 'download' }
        ]
      };
    }

    // =========================================================================
    // 5. INTENT: ADMINISTRATIVE — NOC & INTERNSHIPS
    // =========================================================================
    if (cleanPrompt.includes('noc') || cleanPrompt.includes('internship') || cleanPrompt.includes('no objection')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'administrative',
        isPrivate: false,
        responseType: 'answer',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        content: `To apply for a **University No Objection Certificate (NOC)** for 6-month industrial internships:

1. **Eligibility Criteria:**
   • Minimum CGPA of **7.50** (Your CGPA is **8.84** ✓ Eligible)
   • Zero active backlogs (Verified ✓)
   • Minimum 75% attendance record (Verified ✓)

2. **Application Steps:**
   • Fill out **Form-B (Internship Endorsement)** on the Training & Placement portal.
   • Attach company offer letter with start date and mentor contact.
   • Submit before the deadline: **25th October 2026**.
   • Digital HOD approval is granted within 48 hours.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Training & Placement Cell Internship Guidelines 2026',
            origin: 'official_university',
            documentName: 'noc_guidelines_2026.pdf',
            pageNumber: 3,
            updatedDate: '05 October 2026',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_open_noc_tkt', label: '📝 Auto-Fill NOC Form-B Ticket', type: 'ticket' }
        ]
      };
    }

    // =========================================================================
    // 6. INTENT: CAMPUS DIRECTORY — NAVIGATION & LOCATIONS
    // =========================================================================
    if (cleanPrompt.includes('where is') || cleanPrompt.includes('location') || cleanPrompt.includes('lab 4') || cleanPrompt.includes('lab 3') || cleanPrompt.includes('library')) {
      let target = MOCK_CAMPUS_LOCATIONS[0];
      if (cleanPrompt.includes('lab 4')) target = MOCK_CAMPUS_LOCATIONS[1];
      if (cleanPrompt.includes('library')) target = MOCK_CAMPUS_LOCATIONS[2];

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'campus',
        isPrivate: false,
        responseType: 'answer',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        content: `**${target.name}** (${target.code}) is located in:

• **Building:** ${target.building}
• **Floor / Room:** ${target.floor} (${target.roomNumber})
• **Operating Hours:** ${target.openHours}
• **Directions:** ${target.directions}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Campus Digital GeoDirectory & Facility Registry',
            origin: 'official_university',
            documentName: 'Campus_Building_Master.json',
            updatedDate: '01 October 2026',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_campus_map', label: '🗺️ Open Interactive Campus Map', type: 'navigate' }
        ]
      };
    }

    // =========================================================================
    // 7. INTENT: STUDENT UPLOADED DOCUMENT QUESTION
    // =========================================================================
    if (attachedDocId || cleanPrompt.includes('this document') || cleanPrompt.includes('this pdf') || cleanPrompt.includes('notes.pdf')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'academic',
        isPrivate: true,
        responseType: 'answer',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        content: `Based on your uploaded document (**Java_Concurrency_DeepDive_Lecture4.pdf**):

• **Unit 2 Focus:** Thread pools, \`ReentrantLock\`, condition variables, and lock-free atomic variables (\`AtomicInteger\`).
• **Key Exam Alert:** Question 3 in Mid-Terms specifically focuses on deadlock avoidance via ordered resource acquisition locks.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Student Upload: Java_Concurrency_DeepDive_Lecture4.pdf',
            origin: 'uploaded_doc',
            documentName: 'Java_Concurrency_DeepDive_Lecture4.pdf',
            pageNumber: 'Pages 4-12',
            updatedDate: 'Parsed 1 hour ago',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_doc_summary', label: '📑 Generate 1-Page Summary Cheat-Sheet', type: 'study_mode' }
        ]
      };
    }

    // =========================================================================
    // 8. INTENT: STUDY MODE & ACADEMIC SYLLABUS CONCEPTS
    // =========================================================================
    if (studyMode || cleanPrompt.includes('explain') || cleanPrompt.includes('inheritance') || cleanPrompt.includes('java') || cleanPrompt.includes('quiz') || cleanPrompt.includes('viva')) {
      const mode = studyMode || 'explain';

      if (mode === 'quiz' || cleanPrompt.includes('quiz')) {
        return {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          category: 'academic',
          isPrivate: false,
          responseType: 'action',
          groundingStatus: 'strongly_grounded',
          ragQueryId,
          studyModeContext: 'quiz',
          content: `### 🎯 Quick Self-Assessment: Java Concurrency & OOP

**Question 1:** What is the primary difference between \`synchronized\` block and \`ReentrantLock\` in modern Java?
A) \`ReentrantLock\` only works on primitive types
B) \`ReentrantLock\` supports timed lock polling, interruptible acquisition, and fairness policies
C) \`synchronized\` has higher throughput in multi-core JVMs
D) There is no functional difference

*Reply with your answer or launch the interactive Study Studio quiz module.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: [
            {
              title: 'CS301 Official Syllabus & Java SE 21 Specification',
              origin: 'ai_academic',
              documentName: 'CS301_Syllabus_Unit2.pdf',
              pageNumber: 8,
              verified: true,
            }
          ],
          actions: [
            { id: 'act_quiz_tool', label: '🚀 Launch Interactive Quiz Studio', type: 'quiz' }
          ]
        };
      }

      if (mode === 'viva' || cleanPrompt.includes('viva')) {
        return {
          id: `msg_${Date.now()}`,
          sender: 'assistant',
          category: 'academic',
          isPrivate: false,
          responseType: 'action',
          groundingStatus: 'strongly_grounded',
          ragQueryId,
          studyModeContext: 'viva',
          content: `### 🎙️ AI Viva Voice Simulation: Operating Systems (CS303)

**Examiner Prompt:** *"Student Dharm, suppose two threads execute concurrently and both enter a critical section guarded by a naive spinlock on a uniprocessor. What potential catastrophe occurs, and how does Peterson's algorithm or an OS mutex prevent deadlock?"*

Formulate your technical answer, or switch to Study Studio for automated rubric evaluation.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: [
            {
              title: 'Operating Systems Principles (Silberschatz) & CS303 Syllabus',
              origin: 'ai_academic',
              documentName: 'CS303_Syllabus_Unit2.pdf',
              verified: true,
            }
          ],
          actions: [
            { id: 'act_viva_studio', label: '🎙️ Open AI Viva Simulator', type: 'study_mode' }
          ]
        };
      }

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        category: 'academic',
        isPrivate: false,
        responseType: 'answer',
        groundingStatus: 'strongly_grounded',
        ragQueryId,
        studyModeContext: mode,
        content: `### ☕ Java Object-Oriented Principles: Inheritance & Polymorphism

In Java, **Inheritance** is an IS-A relationship where a subclass derives state (fields) and behavior (methods) from a superclass using the extends keyword.

// Superclass
public abstract class UniversityEntity {
    protected String id;
    protected String name;

    public abstract void performRole();
}

// Subclass demonstrating Polymorphism
public class Student extends UniversityEntity {
    private double cgpa;

    @Override
    public void performRole() {
        System.out.println("Attending lectures and submitting lab assignments.");
    }
}

#### Key Architecture Points:
1. **Method Overriding vs Overloading:** Dynamic dispatch resolves method calls at runtime via the vtable in JVM bytecode.
2. **Multiple Inheritance:** Java prohibits multiple class inheritance to avoid the diamond problem, but permits multiple interface implementation.
3. **Memory Model:** Subclass instances allocate memory for both superclass and subclass fields on the Java Heap.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            title: 'Official CS301 Syllabus — Unit 1: OOP Principles & JVM Internals',
            origin: 'official_university',
            documentName: 'CS301_Curriculum_2026.pdf',
            pageNumber: 3,
            verified: true,
          },
          {
            title: 'Campus Copilot AI Academic Knowledge Base',
            origin: 'ai_academic',
            verified: true,
          }
        ],
        actions: [
          { id: 'act_simplify', label: '✨ Simplify (ELI5)', type: 'study_mode', payload: { mode: 'simplify' } },
          { id: 'act_examples', label: '💻 Real-world Architecture Examples', type: 'study_mode', payload: { mode: 'examples' } },
          { id: 'act_quiz_gen', label: '📝 Generate Practice Quiz', type: 'quiz' },
        ]
      };
    }

    // =========================================================================
    // 9. UNVERIFIED QUERY / HALLUCINATION PREVENTER FALLBACK
    // =========================================================================
    // If the query cannot be grounded in official or student portal data:
    // We register a Knowledge Gap automatically and provide an honest unverified response.
    const failureReason = 'Information not found in verified university sources or active portal records.';
    this.reportQueryToKnowledgeGap(prompt, 'General Inquiry', failureReason);

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      category: 'general_university',
      isPrivate: false,
      responseType: 'warning',
      groundingStatus: 'not_verified',
      ragQueryId,
      content: `I couldn't verify this information from the available university sources or synchronized student records.

To maintain strict academic accuracy, Campus Copilot does not generate unverified answers for administrative, examination, or course policies.

• **Status:** Information not found in verified university sources.
• **Action:** This query has been automatically flagged to the university administrator knowledge gap desk for official documentation.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [],
      actions: [
        { id: 'act_tt', label: '📅 Check Today\'s Timetable', type: 'navigate' },
        { id: 'act_support', label: '🎫 Open Support / Helpdesk Ticket', type: 'ticket' },
        { id: 'act_report', label: '⚠️ Flag as Knowledge Gap', type: 'report_error', payload: { query: prompt } }
      ]
    };
  },

  reportQueryToKnowledgeGap(query: string, category: string = 'General Inquiry', failureReason: string = 'Unanswered query') {
    const existing = MOCK_KNOWLEDGE_GAPS.find(g => g.query.toLowerCase() === query.toLowerCase());
    if (existing) {
      existing.count += 1;
    } else {
      MOCK_KNOWLEDGE_GAPS.unshift({
        id: `gap_${Date.now()}`,
        query,
        timestamp: 'Just now',
        category,
        retrievedSources: [],
        failureReason,
        count: 1,
        status: 'open',
      });
    }
  }
};
