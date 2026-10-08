import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentChunk extends Document {
  document_id: string;
  source_url?: string;
  source_type: string; // 'official_university' | 'student_document' | 'syllabus' | 'policy'
  document_type: string; // 'notice', 'syllabus', 'policy', 'assignment', 'notes'
  department?: string;
  course?: string;
  semester?: string;
  publication_date?: Date;
  effective_date?: Date;
  page_number?: number;
  chunk_index?: number;
  authority: number; // 5 = Official, 4 = Dept, 1 = Student
  content: string; // The actual text chunk
  embedding?: number[]; // Vector embedding
  last_synced: Date;
  owner_user_id?: string; // If private document
  visibility: 'public' | 'private';
}

const DocumentChunkSchema: Schema = new Schema(
  {
    document_id: { type: String, required: true, index: true },
    source_url: { type: String },
    source_type: { type: String, required: true, index: true },
    document_type: { type: String, required: true },
    department: { type: String },
    course: { type: String },
    semester: { type: String },
    publication_date: { type: Date },
    effective_date: { type: Date },
    page_number: { type: Number },
    chunk_index: { type: Number, default: 0 },
    authority: { type: Number, required: true, default: 1 },
    content: { type: String, required: true },
    embedding: { type: [Number] },
    last_synced: { type: Date, default: Date.now },
    owner_user_id: { type: String, index: true },
    visibility: { type: String, enum: ['public', 'private'], default: 'public', index: true },
  },
  { timestamps: true }
);

DocumentChunkSchema.index({ owner_user_id: 1, visibility: 1 });
DocumentChunkSchema.index({ document_id: 1, chunk_index: 1 });

export default mongoose.model<IDocumentChunk>('DocumentChunk', DocumentChunkSchema);
