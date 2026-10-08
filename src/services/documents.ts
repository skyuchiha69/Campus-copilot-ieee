import { UploadedDocument } from '../types';
import { ApiClient } from './apiClient';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp'
];

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

let mockDocsDatabase: UploadedDocument[] = [
  {
    id: 'doc_1',
    ownerStudentId: 'CS2023-8842',
    name: 'Java_Concurrency_DeepDive_Lecture4.pdf',
    size: 2450000,
    type: 'application/pdf',
    uploadedAt: 'Yesterday at 04:15 PM',
    status: 'ready',
    progress: 100,
    extractedPages: 24,
    topic: 'Java Concurrency & Thread Pools',
    sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'doc_2',
    ownerStudentId: 'CS2023-8842',
    name: 'OS_Kernel_Design_Notes.pdf',
    size: 1820000,
    type: 'application/pdf',
    uploadedAt: '5 days ago',
    status: 'ready',
    progress: 100,
    extractedPages: 18,
    topic: 'POSIX Semaphores & Virtual Memory',
    sha256Checksum: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },
];

export const documentsService = {
  async getDocuments(): Promise<UploadedDocument[]> {
    ApiClient.verifyAuthorization('/documents', ['student', 'admin', 'instructor']);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const currentUserId = ApiClient.getCurrentUserId();
    const currentRole = ApiClient.getCurrentRole();

    // Admins can see all documents; students can ONLY see their own uploaded documents
    if (currentRole === 'admin') {
      return [...mockDocsDatabase];
    }
    return mockDocsDatabase.filter(d => d.ownerStudentId === currentUserId);
  },

  async uploadDocument(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadedDocument> {
    ApiClient.verifyAuthorization('/documents/upload', ['student', 'admin', 'instructor']);

    // 1. File Type Validation
    const fileType = file.type || 'application/pdf';
    const isExtensionValid = /\.(pdf|docx|txt|png|jpg|jpeg|webp)$/i.test(file.name);
    if (!ALLOWED_MIME_TYPES.includes(fileType) && !isExtensionValid) {
      throw new Error(`Security Violation: File type '${file.type}' is not permitted. Only PDF, DOCX, TXT, and images are supported.`);
    }

    // 2. File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Security Violation: File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed limit of 25MB.`);
    }

    const currentUserId = ApiClient.getCurrentUserId();

    const newDoc: UploadedDocument = {
      id: `doc_${Date.now()}`,
      ownerStudentId: currentUserId,
      name: file.name,
      size: file.size,
      type: fileType,
      uploadedAt: 'Just now',
      status: 'uploading',
      progress: 20,
      extractedPages: Math.floor(Math.random() * 20) + 5,
      topic: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      sha256Checksum: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    mockDocsDatabase = [newDoc, ...mockDocsDatabase];

    // Simulate progress stages
    if (onProgress) onProgress(35);
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (onProgress) onProgress(75);
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (onProgress) onProgress(100);

    newDoc.status = 'ready';
    newDoc.progress = 100;

    return newDoc;
  },

  async deleteDocument(id: string): Promise<void> {
    ApiClient.verifyAuthorization('/documents/delete', ['student', 'admin', 'instructor']);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUserId = ApiClient.getCurrentUserId();
    const currentRole = ApiClient.getCurrentRole();

    const targetDoc = mockDocsDatabase.find(d => d.id === id);
    if (!targetDoc) return;

    // Resource ownership validation
    if (currentRole === 'student' && targetDoc.ownerStudentId !== currentUserId) {
      throw new Error('Forbidden: You do not have permission to delete another student\'s document.');
    }

    mockDocsDatabase = mockDocsDatabase.filter((d) => d.id !== id);
  }
};
