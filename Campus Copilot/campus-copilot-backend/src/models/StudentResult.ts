import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseGrade {
  course_code: string;
  course_name: string;
  credits: number;
  grade: string;
  points: number;
}

export interface IStudentResult extends Document {
  user_id: string;
  student_id: string;
  semester: string;
  gpa: number;
  cgpa: number;
  courses: ICourseGrade[];
  status: 'passed' | 'pending' | 're-exam';
  published_at: Date;
}

const StudentResultSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, index: true },
    student_id: { type: String, required: true, index: true },
    semester: { type: String, required: true },
    gpa: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    courses: [
      {
        course_code: { type: String, required: true },
        course_name: { type: String, required: true },
        credits: { type: Number, required: true },
        grade: { type: String, required: true },
        points: { type: Number, required: true }
      }
    ],
    status: { type: String, enum: ['passed', 'pending', 're-exam'], default: 'passed' },
    published_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

StudentResultSchema.index({ user_id: 1, semester: 1 }, { unique: true });

export default mongoose.model<IStudentResult>('StudentResult', StudentResultSchema);
