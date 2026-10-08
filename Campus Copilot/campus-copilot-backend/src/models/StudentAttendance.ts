import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAttendance extends Document {
  user_id: string;
  course_id: string;
  course_name: string;
  course_code: string;
  attendance_percentage: number;
  classes_attended: number;
  classes_total: number;
  last_updated: Date;
  last_synced: Date;
}

const StudentAttendanceSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, index: true },
    course_id: { type: String, required: true },
    course_name: { type: String, required: true },
    course_code: { type: String, required: true },
    attendance_percentage: { type: Number, required: true },
    classes_attended: { type: Number, required: true },
    classes_total: { type: Number, required: true },
    last_updated: { type: Date, default: Date.now },
    last_synced: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

StudentAttendanceSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

export default mongoose.model<IStudentAttendance>('StudentAttendance', StudentAttendanceSchema);
