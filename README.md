# Campus Copilot — Architecture & Integration Documentation

> **"Your University. One Intelligent Assistant."**  
> An AI-powered university assistant combining official university information, authenticated student data, RAG vector retrieval, and automated academic support.

---

## 🏗️ 1. System Architecture

```
                                    ┌────────────────────────┐
                                    │    React Frontend      │
                                    │  (Vite + TailwindCSS)  │
                                    └───────────┬────────────┘
                                                │
                                       HTTPS / JSON Requests
                                                │
                                    ┌───────────▼────────────┐
                                    │   Express.js Backend   │
                                    │    (Port 5000 /api/v1) │
                                    └───────────┬────────────┘
                                                │
                        ┌───────────────────────┼───────────────────────┐
                        │                       │                       │
               ┌────────▼────────┐    ┌─────────▼─────────┐    ┌────────▼────────┐
               │ Authentication  │    │  Role-Based RBAC  │    │ Multi-Tenant    │
               │ & JWT Context   │    │ (student/admin/…) │    │ Private Data    │
               └────────┬────────┘    └─────────┬─────────┘    │ Isolation       │
                        │                       │              └────────┬────────┘
                        └───────────────────────┼───────────────────────┘
                                                │
                                    ┌───────────▼────────────┐
                                    │     Service Layer      │
                                    │ ┌────────────────────┐ │
                                    │ │ AI Orchestrator    │ │
                                    │ │ VectorStore (RAG)  │ │
                                    │ │ Portal Adapter     │ │
                                    │ └────────────────────┘ │
                                    └───────────┬────────────┘
                                                │
                ┌───────────────────────────────┼───────────────────────────────┐
                │                               │                               │
    ┌───────────▼───────────┐       ┌───────────▼───────────┐       ┌───────────▼───────────┐
    │     MongoDB Atlas     │       │    Vector Search      │       │   University Portal   │
    │ (Student Data, Users, │       │  (Document Chunks,    │       │        Adapter        │
    │  Notices, Policies)   │       │   Anti-Injection)     │       │  (Live ERP / Scraping)│
    └───────────────────────┘       └───────────────────────┘       └───────────────────────┘
```

---

## 🔒 2. Security & Role-Based Access Control (RBAC)

### Supported Roles
1. **`student`**: Can access strictly their own private profile, timetable, attendance records, exam schedules, homework assignments, and personal uploaded documents.
2. **`instructor`**: Can view student rosters, advisory profiles, and upload approved course materials.
3. **`staff`**: Can manage departmental notices, event listings, and facility locations.
4. **`admin`**: Full administrative privileges, analytics, knowledge gap resolution, and ERP sync triggers.

### Backend-Enforced Isolation
All student queries use `req.user.id` extracted directly from the verified cryptographic JWT token. Requests cannot bypass isolation by supplying arbitrary `userId` query parameters or body payloads.

```typescript
// Enforced Query Isolation Example
const attendance = await StudentAttendance.find({ user_id: req.user.id });
const timetable  = await StudentTimetable.find({ user_id: req.user.id });
```

---

## 📡 3. Standardized API Endpoints (`/api/v1`)

All API responses follow the canonical envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "requestId": "req_1728384920_abc123"
}
```

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new student, faculty, or administrator with bcrypt password hashing.
- `POST /api/v1/auth/login` — Authenticate with email/student ID and receive a signed JWT token.
- `POST /api/v1/auth/logout` — Invalidate session.
- `GET  /api/v1/auth/me` — Retrieve verified user profile and role context.

### Student Private Records (`/api/v1/student`)
- `GET /api/v1/student/profile` — Authenticated student's degree program, semester, CGPA, and advisor.
- `GET /api/v1/student/timetable` — Personalized weekly schedule with room numbers and faculty.
- `GET /api/v1/student/attendance` — Real-time attendance stats, dynamic class calculations (classes that can be missed or needed to reach target), and policy alerts.
- `GET /api/v1/student/results` — Semester-wise GPA, CGPA, and course grade breakdown.
- `GET /api/v1/student/examinations` — Mid-term and end-term seat numbers, timings, and venues.
- `GET /api/v1/student/assignments` — Pending assignments, submission deadlines, and feedback.

### Multi-Step RAG Chat & History (`/api/v1/chat`)
- `POST /api/v1/chat` / `POST /api/v1/chat/completions` — Grounded academic assistant with 3-tier Grounding Status (`strongly_grounded`, `partially_grounded`, `not_verified`), source citations, and Prompt Injection Defense.
- `GET  /api/v1/chat/conversations` — List user's conversation history.
- `GET  /api/v1/chat/conversations/:id` — Retrieve messages for a conversation.
- `DELETE /api/v1/chat/conversations/:id` — Delete a conversation and its messages.

### Document Upload & Ingestion (`/api/v1/documents`)
- `POST   /api/v1/documents` — Multipart file upload (PDF/TXT/DOCX), automatic text extraction, chunking, and isolated vector storage.
- `GET    /api/v1/documents` — List user's private documents and public university handbooks.
- `DELETE /api/v1/documents/:id` — Remove document and all indexed vector chunks.

### Public Campus Data
- `GET /api/v1/notices` — Official circulars and examination bulletins.
- `GET /api/v1/events` — Campus hackathons, seminars, and workshops.
- `GET /api/v1/campus` — Building locator, labs, library hours, and facilities.
- `GET /api/v1/courses` — Public syllabus catalog and prerequisites.

### Admin APIs (`/api/v1/admin`) — *Protected by requireRole('admin')*
- `GET  /api/v1/admin/analytics` — System queries, grounding accuracy rate, user counts.
- `GET  /api/v1/admin/knowledge-gaps` — Unanswered or unverified student questions.
- `POST /api/v1/admin/knowledge-gaps/:id/resolve` — Mark knowledge gap resolved with official source link.
- `GET  /api/v1/admin/audit-logs` — Security and administrative audit trail.

### Sync & Health
- `GET  /api/v1/sync/status` — Reports live ERP sync status or honest `"unconfigured"` message.
- `POST /api/v1/sync/trigger` — Trigger synchronization.
- `GET  /api/v1/health` — Liveness check (`api: healthy`, `database: connected`, `rag: available`).

---

## ⚙️ 4. Local Setup & Execution

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017` or MongoDB Atlas URI.

### 1. Backend Setup
```bash
cd "Campus Copilot/campus-copilot-backend"
npm install
npm run build
npm run seed              # Populates test users, attendance, timetable, policies, and notices
npm run start             # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd "../.."                 # Root project folder
npm install
npm run dev               # Starts Vite dev server on http://localhost:3000
```

---

## 📊 5. Feature Status Matrix

| Component | Status | Description |
| :--- | :---: | :--- |
| **Authentication (JWT + Bcrypt)** | **IMPLEMENTED** | Password hashing, token validation, expiration, `/auth/me`, logout |
| **Role-Based Access Control (RBAC)** | **IMPLEMENTED** | `student`, `instructor`, `staff`, `admin` route guards and 403 barriers |
| **Student Private Isolation** | **IMPLEMENTED** | Attendance, timetable, results, and documents isolated by `req.user.id` |
| **Attendance Calculator** | **IMPLEMENTED** | Server-side attendance math (can-miss vs needed-to-target calculations) |
| **RAG Multi-Tenant Vector Search** | **IMPLEMENTED** | MongoDB Atlas vector integration with local hybrid fallback & injection defense |
| **Grounding Verification & Citations** | **IMPLEMENTED** | 3-tier grounding status (`strongly_grounded`, `partially_grounded`, `not_verified`) |
| **Knowledge Gap Tracking** | **IMPLEMENTED** | Automatic recording of unverified student queries with Admin resolution workflow |
| **Document Processing & Chunks** | **IMPLEMENTED** | Multipart file upload, text extraction, chunking, and ownership metadata |
| **Truthful ERP Portal Reporting** | **IMPLEMENTED** | `UniversityPortalAdapter` reports honest `"unconfigured"` state until live ERP credentials are provided |
| **Real University Portal Scraper** | **REQUIRES ERP CREDENTIALS** | Headless Puppeteer / DCS login requires live campus server credentials |
| **Atlas Vector Search Index** | **REQUIRES ATLAS INDEX** | Creates dynamic vector search over `DocumentChunk.embedding` |
| **Live AI LLM Synthesis** | **REQUIRES AI API KEY** | Supported via `AI_API_KEY` (OpenAI / Gemini); falls back to grounded synthesizer |
