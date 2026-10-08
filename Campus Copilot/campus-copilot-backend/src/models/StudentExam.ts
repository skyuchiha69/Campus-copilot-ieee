import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentExam extends Document {
  user_id: string;
  course_code: string;
  course_name: string;
  exam_type: 'Mid-Semester' | 'End-Semester' | 'Practical' | 'Viva';
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM - 01:00 PM"
  room: string;
  seat_number?: string;
  instructions?: string;
}

const StudentExamSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, index: true },
    course_code: { type: String, required: true },
    course_name: { type: String, required: true },
    exam_type: { type: String, enum: ['Mid-Semester', 'End-Semester', 'Practical', 'Viva'], default: 'End-Semester' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    room: { type: String, required: true },
    seat_number: { type: String },
    instructions: { type: String }
  },
  { timestamps: true }
);

StudentExamSchema.index({ user_id: 1, date: 1 });

export default mongoose.model<IStudentExam>('StudentExam', StudentExamSchema);
