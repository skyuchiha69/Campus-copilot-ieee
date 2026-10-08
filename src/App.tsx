import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SyncProvider } from './context/SyncContext';

import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';

import { DashboardHome } from './components/dashboard/DashboardHome';
import { ChatInterface } from './components/chat/ChatInterface';
import { StudyModeStudio } from './components/ai/StudyModeStudio';
import { MyProfile } from './components/student/MyProfile';
import { MyCourses } from './components/student/MyCourses';
import { MyTimetable } from './components/student/MyTimetable';
import { MyAttendance } from './components/student/MyAttendance';
import { MyExaminations } from './components/student/MyExaminations';
import { MyAssignments } from './components/student/MyAssignments';
import { MyResults } from './components/student/MyResults';

import { NoticesHub } from './components/notices/NoticesHub';
import { EventsHub } from './components/events/EventsHub';
import { CampusDirectory } from './components/campus/CampusDirectory';
import { DocumentUploadDropzone } from './components/documents/DocumentUploadDropzone';
import { SupportDesk } from './components/support/SupportDesk';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { SyncStatusModal } from './components/sync/SyncStatusModal';
import { LoginModal } from './components/auth/LoginModal';
import { LandingPage } from './components/landing/LandingPage';
import { UploadedDocument } from './types';

function MainApp() {
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLandingView, setIsLandingView] = useState(false);
  const [prefilledChatPrompt, setPrefilledChatPrompt] = useState<string>('');
  const [searchTargetRoom, setSearchTargetRoom] = useState<string>('');

  const handleOpenChatWithPrompt = (prompt: string) => {
    setPrefilledChatPrompt(prompt);
    setActiveTab('chat');
  };

  const handleLocateRoom = (room: string) => {
    setSearchTargetRoom(room);
    setActiveTab('campus');
  };

  const handleAskDocInChat = (doc: UploadedDocument) => {
    setPrefilledChatPrompt(`Summarize key exam takeaways from ${doc.name}`);
    setActiveTab('chat');
  };

  if (isLandingView) {
    return (
      <LandingPage
        onStartChat={() => {
          setIsLandingView(false);
          setActiveTab('chat');
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic View Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950/40 p-2 sm:p-4 md:p-6 pb-24 lg:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardHome
              onNavigateTab={setActiveTab}
              onOpenChatWithPrompt={handleOpenChatWithPrompt}
              onLocateRoom={handleLocateRoom}
            />
          )}

          {activeTab === 'chat' && (
            <ChatInterface
              onNavigateTab={setActiveTab}
              initialPrompt={prefilledChatPrompt}
            />
          )}

          {activeTab === 'study_studio' && (
            <StudyModeStudio
              onOpenChatWithPrompt={handleOpenChatWithPrompt}
            />
          )}

          {activeTab === 'profile' && <MyProfile />}
          {activeTab === 'courses' && (
            <MyCourses
              onLaunchStudyMode={(code, topic) => {
                setActiveTab('study_studio');
              }}
            />
          )}
          {activeTab === 'timetable' && <MyTimetable onLocateRoom={handleLocateRoom} />}
          {activeTab === 'attendance' && <MyAttendance />}
          {activeTab === 'examinations' && (
            <MyExaminations
              onPrepareWithAI={(course, syllabus) => {
                handleOpenChatWithPrompt(`Prepare mid-term study guide for ${course} covering: ${syllabus}`);
              }}
            />
          )}
          {activeTab === 'assignments' && <MyAssignments />}
          {activeTab === 'results' && <MyResults />}

          {activeTab === 'notices' && <NoticesHub />}
          {activeTab === 'events' && <EventsHub />}
          {activeTab === 'campus' && (
            <CampusDirectory
              initialSearch={searchTargetRoom}
              onAskCopilot={(loc) => handleOpenChatWithPrompt(`Where is ${loc}?`)}
            />
          )}
          {activeTab === 'documents' && (
            <DocumentUploadDropzone onAskDocInChat={handleAskDocInChat} />
          )}
          {activeTab === 'support' && <SupportDesk />}
          {activeTab === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Mobile Sticky Navigation & Menu Drawer */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Sync Status Modal */}
      <SyncStatusModal />

      {/* Authentication Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLandingView(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SyncProvider>
          <MainApp />
        </SyncProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
