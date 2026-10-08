import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAssignment extends Document {
  user_id: string;
  course_code: string;
  course_name: string;
  title: string;
  description?: string;
  due_date: string; // ISO date
  total_points: number;
  submitted: boolean;
  submission_date?: Date;
  grade?: number;
  feedback?: string;
}

const StudentAssignmentSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, index: true },
    course_code: { type: String, required: true },
    course_name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    due_date: { type: String, required: true },
    total_points: { type: Number, default: 100 },
    submitted: { type: Boolean, default: false },
    submission_date: { type: Date },
    grade: { type: Number },
    feedback: { type: String }
  },
  { timestamps: true }
);

StudentAssignmentSchema.index({ user_id: 1, due_date: 1 });

export default mongoose.model<IStudentAssignment>('StudentAssignment', StudentAssignmentSchema);
