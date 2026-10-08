import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversityEvent extends Document {
  title: string;
  description: string;
  category: 'hackathon' | 'seminar' | 'workshop' | 'cultural' | 'sports' | 'placement';
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  organizer: string;
  registration_url?: string;
  featured: boolean;
}

const UniversityEventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['hackathon', 'seminar', 'workshop', 'cultural', 'sports', 'placement'],
      default: 'seminar'
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    registration_url: { type: String },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

UniversityEventSchema.index({ date: 1 });

export default mongoose.model<IUniversityEvent>('UniversityEvent', UniversityEventSchema);
