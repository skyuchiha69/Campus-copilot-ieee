import mongoose, { Schema, Document } from 'mongoose';

export interface ISourceAttribution {
  title: string;
  origin: 'official_university' | 'authenticated_student_portal' | 'student_document' | 'general_knowledge';
  verified: boolean;
  updatedAt?: string;
  documentId?: string;
  url?: string;
  snippet?: string;
  authorityScore?: number;
}

export interface IMessage extends Document {
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  grounding_status?: 'strongly_grounded' | 'partially_grounded' | 'not_verified';
  sources?: ISourceAttribution[];
  category?: string;
  confidence?: number;
  study_mode?: string;
  created_at: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversation_id: { type: String, required: true, index: true },
    user_id: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    grounding_status: {
      type: String,
      enum: ['strongly_grounded', 'partially_grounded', 'not_verified'],
      default: 'not_verified'
    },
    sources: [
      {
        title: { type: String, required: true },
        origin: { type: String, required: true },
        verified: { type: Boolean, default: false },
        updatedAt: { type: String },
        documentId: { type: String },
        url: { type: String },
        snippet: { type: String },
        authorityScore: { type: Number }
      }
    ],
    category: { type: String },
    confidence: { type: Number },
    study_mode: { type: String }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

MessageSchema.index({ conversation_id: 1, created_at: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
