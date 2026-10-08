import mongoose, { Schema, Document as MongooseDoc } from 'mongoose';

export interface IDocumentRecord extends MongooseDoc {
  document_id: string;
  title: string;
  file_name: string;
  file_type: string;
  file_size: number;
  owner_user_id: string;
  visibility: 'public' | 'private';
  source_type: 'student_document' | 'official_university' | 'syllabus' | 'policy';
  chunks_count: number;
  status: 'processing' | 'indexed' | 'failed';
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}

const DocumentRecordSchema: Schema = new Schema(
  {
    document_id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    file_name: { type: String, required: true },
    file_type: { type: String, required: true },
    file_size: { type: Number, required: true },
    owner_user_id: { type: String, required: true, index: true },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    source_type: {
      type: String,
      enum: ['student_document', 'official_university', 'syllabus', 'policy'],
      default: 'student_document'
    },
    chunks_count: { type: Number, default: 0 },
    status: { type: String, enum: ['processing', 'indexed', 'failed'], default: 'indexed' },
    error_message: { type: String }
  },
  { timestamps: true }
);

DocumentRecordSchema.index({ owner_user_id: 1, visibility: 1 });

export default mongoose.model<IDocumentRecord>('DocumentRecord', DocumentRecordSchema);
