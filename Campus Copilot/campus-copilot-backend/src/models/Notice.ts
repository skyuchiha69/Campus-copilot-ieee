import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  category: 'academic' | 'administrative' | 'exam' | 'placement' | 'general';
  department?: string;
  author: string;
  published_at: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: { title: string; url: string; file_size?: string }[];
}

const NoticeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'administrative', 'exam', 'placement', 'general'],
      default: 'general'
    },
    department: { type: String, default: 'University Wide' },
    author: { type: String, required: true },
    published_at: { type: Date, default: Date.now },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    attachments: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        file_size: { type: String }
      }
    ]
  },
  { timestamps: true }
);

NoticeSchema.index({ published_at: -1, priority: 1 });

export default mongoose.model<INotice>('Notice', NoticeSchema);
