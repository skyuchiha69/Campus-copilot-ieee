import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeGap extends Document {
  question: string;
  category: string;
  retrieved_sources: string[];
  failure_reason: string;
  occurrence_count: number;
  resolved: boolean;
  resolved_by?: string;
  resolution_notes?: string;
  timestamp: Date;
}

const KnowledgeGapSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    category: { type: String, default: 'General' },
    retrieved_sources: [{ type: String }],
    failure_reason: { type: String, default: 'No authoritative document matched query' },
    occurrence_count: { type: Number, default: 1 },
    resolved: { type: Boolean, default: false },
    resolved_by: { type: String },
    resolution_notes: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

KnowledgeGapSchema.index({ resolved: 1, occurrence_count: -1 });

export default mongoose.model<IKnowledgeGap>('KnowledgeGap', KnowledgeGapSchema);
