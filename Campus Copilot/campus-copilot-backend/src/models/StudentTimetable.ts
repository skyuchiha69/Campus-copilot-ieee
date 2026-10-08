import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentTimetable extends Document {
  user_id: string;
  course_id: string;
  course_code: string;
  course_name: string;
  day: string; // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  room: string;
  faculty: string;
  type: 'lecture' | 'lab' | 'tutorial';
  last_synced: Date;
}

const StudentTimetableSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, index: true },
    course_id: { type: String, required: true },
    course_code: { type: String, required: true },
    course_name: { type: String, required: true },
    day: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    room: { type: String, required: true },
    faculty: { type: String, required: true },
    type: { type: String, enum: ['lecture', 'lab', 'tutorial'], default: 'lecture' },
    last_synced: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

StudentTimetableSchema.index({ user_id: 1, day: 1 });

export default mongoose.model<IStudentTimetable>('StudentTimetable', StudentTimetableSchema);
