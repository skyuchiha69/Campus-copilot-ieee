import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  Sparkles,
  AlertCircle,
  File,
  Eye,
  MessageSquare
} from 'lucide-react';
import { UploadedDocument } from '../../types';
import { documentsService } from '../../services/documents';

interface DocumentUploadDropzoneProps {
  onAskDocInChat?: (doc: UploadedDocument) => void;
}

export const DocumentUploadDropzone: React.FC<DocumentUploadDropzoneProps> = ({
  onAskDocInChat,
}) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    documentsService.getDocuments().then(setDocuments);
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const newDoc = await documentsService.uploadDocument(file, (prog) => {
        setUploadProgress(prog);
      });
      setDocuments((prev) => [newDoc, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    await documentsService.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Document Intelligence Hub</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
            OCR & RAG Pipeline
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload syllabi, lecture slides, research papers, or notes to ask instant questions.
        </p>
      </div>

      {/* Dropzone Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`rounded-3xl p-8 sm:p-10 border-2 border-dashed text-center transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-950/30 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Drag & Drop your study documents here
            </h3>
            <p className="text-xs text-slate-400">
              Supports PDF, DOCX, TXT, and scanned document images up to 25MB
            </p>
          </div>

          {/* Upload progress state */}
          {isUploading && (
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="flex items-center justify-between text-xs text-indigo-300">
                <span>Ingesting into Vector Database...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30">
              <span>Browse Local Files</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">
          Your Ingested Documents ({documents.length})
        </h3>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100">{doc.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Vectorized
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>{(doc.size / (1024 * 1024)).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{doc.extractedPages} Pages Parsed</span>
                    <span>•</span>
                    <span>Uploaded: {doc.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onAskDocInChat && onAskDocInChat(doc)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Copilot</span>
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
