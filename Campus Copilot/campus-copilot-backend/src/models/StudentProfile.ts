import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  user_id: string; // The authenticated user's ID
  student_id: string; // University student ID (e.g. CS2023-8842)
  name: string;
  department_id: string;
  department_name: string;
  semester: string;
  division: string;
  program: string;
  cgpa?: number;
  credits_completed?: number;
  credits_total?: number;
  advisor_name?: string;
  advisor_email?: string;
  status: string;
  last_synced: Date;
}

const StudentProfileSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    department_id: { type: String, required: true },
    department_name: { type: String, default: 'Computer Science & Engineering' },
    semester: { type: String, required: true },
    division: { type: String, required: true },
    program: { type: String, required: true },
    cgpa: { type: Number, default: 8.84 },
    credits_completed: { type: Number, default: 92 },
    credits_total: { type: Number, default: 160 },
    advisor_name: { type: String, default: 'Dr. Ramesh Kulkarni' },
    advisor_email: { type: String, default: 'r.kulkarni@gsfc.ac.in' },
    status: { type: String, default: 'active' },
    last_synced: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
