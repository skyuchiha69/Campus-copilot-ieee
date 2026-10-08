import mongoose from 'mongoose';
import app from '../server';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import StudentAttendance from '../models/StudentAttendance';
import StudentTimetable from '../models/StudentTimetable';
import AttendancePolicy from '../models/AttendancePolicy';
import bcrypt from 'bcryptjs';
import http from 'http';

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING FULL CAMPUS COPILOT BACKEND INTEGRATION TEST');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // Connect to DB or in-memory
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-copilot';
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
  } catch (err: any) {
    console.warn('MongoDB connection note (tests will proceed with app handler):', err.message);
  }

  const PORT = 5555;
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  const BASE_URL = `http://localhost:${PORT}/api/v1`;

  try {
    // 1. Health Endpoint Check
    console.log('\n--- 1. Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
    assert(healthData.success === true, 'Health returns success: true');
    assert(healthData.data.api === 'healthy', 'API status is healthy');

    // 2. Authentication: Register
    console.log('\n--- 2. Authentication: Register ---');
    const testEmail = `test_student_${Date.now()}@gsfc.ac.in`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@123',
        name: 'Test Student',
        role: 'student',
        student_id: `CS2026-${Math.floor(1000 + Math.random() * 9000)}`
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'Student registration returns 201 Created');
    assert(regData.success === true && Boolean(regData.data.token), 'Registration returns JWT token');
    const studentToken = regData.data?.token;

    // 3. Authentication: Login with correct password
    console.log('\n--- 3. Authentication: Login ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@123'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Login returns 200 OK with valid credentials');
    assert(loginData.data.user.email === testEmail, 'Login returns correct authenticated user email');

    // 4. Authentication: Login with incorrect password
    const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword'
      })
    });
    const invalidLoginData = await invalidLoginRes.json();
    assert(invalidLoginRes.status === 401, 'Login fails with 401 Unauthorized for incorrect password');
    assert(invalidLoginData.error?.code === 'INVALID_CREDENTIALS', 'Error code is INVALID_CREDENTIALS');

    // 5. Protected Endpoint: GET /auth/me
    console.log('\n--- 4. Protected Session: GET /auth/me ---');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'GET /auth/me responds with 200 OK');
    assert(meData.data.user.role === 'student', 'Authenticated user role is student');

    // 6. Student Attendance & Calculations
    console.log('\n--- 5. Student APIs & Calculations ---');
    const attRes = await fetch(`${BASE_URL}/student/attendance`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const attData = await attRes.json();
    assert(attRes.status === 200, 'GET /student/attendance responds with 200 OK');
    assert(attData.success === true, 'Attendance response is wrapped in standard envelope');
    assert(attData.data.summary.minimumRequired === 75, 'Attendance policy reflects university minimum required (75%)');

    // 7. Student Timetable
    const ttRes = await fetch(`${BASE_URL}/student/timetable`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const ttData = await ttRes.json();
    assert(ttRes.status === 200, 'GET /student/timetable responds with 200 OK');

    // 8. Public Information APIs
    console.log('\n--- 6. Public University APIs ---');
    const noticesRes = await fetch(`${BASE_URL}/notices`);
    const noticesData = await noticesRes.json();
    assert(noticesRes.status === 200, 'GET /notices responds with 200 OK');
    assert(Array.isArray(noticesData.data), 'Notices returns an array of public announcements');

    const eventsRes = await fetch(`${BASE_URL}/events`);
    assert(eventsRes.status === 200, 'GET /events responds with 200 OK');

    const campusRes = await fetch(`${BASE_URL}/campus`);
    assert(campusRes.status === 200, 'GET /campus responds with 200 OK');

    // 9. Multi-Step Grounded RAG Chat
    console.log('\n--- 7. Grounded Chat & RAG Engine ---');
    const chatRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        prompt: 'What is the university minimum attendance requirement?'
      })
    });
    const chatData = await chatRes.json();
    assert(chatRes.status === 200, 'POST /chat responds with 200 OK');
    assert(Boolean(chatData.data.groundingStatus), 'Response includes verified groundingStatus');
    assert(Array.isArray(chatData.data.sources), 'Response includes sources attribution array');
    assert(Boolean(chatData.data.conversationId), 'Response returns MongoDB-persisted conversationId');

    // 10. Role-Based Access Control (RBAC): Student attempting Admin endpoint
    console.log('\n--- 8. Role-Based Access Control (RBAC) ---');
    const forbiddenRes = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const forbiddenData = await forbiddenRes.json();
    assert(forbiddenRes.status === 403, 'Student attempting /admin/analytics is blocked with 403 Forbidden');
    assert(forbiddenData.error?.code === 'FORBIDDEN', 'Error code is FORBIDDEN');

    // 11. Admin User Registration & Analytics Access
    const adminEmail = `test_admin_${Date.now()}@gsfc.ac.in`;
    const adminRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: 'AdminPassword@123',
        name: 'Dean Administration',
        role: 'admin'
      })
    });
    const adminRegData = await adminRegRes.json();
    const adminToken = adminRegData.data?.token;

    const adminAnalyticsRes = await fetch(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminAnalyticsData = await adminAnalyticsRes.json();
    assert(adminAnalyticsRes.status === 200, 'Admin successfully accesses /admin/analytics with 200 OK');
    assert(adminAnalyticsData.data.systemStatus.ragEngine === 'active', 'RAG engine reports active');

    // 12. University Portal Honest Sync Status
    console.log('\n--- 9. University Portal Honest Sync Reporting ---');
    const syncRes = await fetch(`${BASE_URL}/sync/status`);
    const syncData = await syncRes.json();
    assert(syncRes.status === 200, 'GET /sync/status responds with 200 OK');
    assert(syncData.data.status === 'unconfigured' || syncData.data.status === 'connected', 'Sync status is truthfully reported as unconfigured or connected');

  } catch (err: any) {
    console.error('Test execution exception:', err);
    failed++;
  } finally {
    server.close();
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }

  console.log('\n======================================================');
  console.log(`🏁 INTEGRATION TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');
}

if (require.main === module) {
  runTests();
}
