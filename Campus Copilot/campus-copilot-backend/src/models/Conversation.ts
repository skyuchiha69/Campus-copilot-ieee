import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  user_id: string;
  title: string;
  mode: 'explain' | 'quiz' | 'viva' | 'summarize' | 'general';
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'New Conversation' },
    mode: {
      type: String,
      enum: ['explain', 'quiz', 'viva', 'summarize', 'general'],
      default: 'general'
    },
    pinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ConversationSchema.index({ user_id: 1, updatedAt: -1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
