import mongoose, { Schema, Document } from 'mongoose';

export interface IPublicCourse extends Document {
  course_code: string;
  course_name: string;
  department: string;
  credits: number;
  description: string;
  semester: string;
  syllabus_document_id?: string;
  prerequisites?: string[];
  faculty_in_charge?: string;
}

const PublicCourseSchema: Schema = new Schema(
  {
    course_code: { type: String, required: true, unique: true, index: true },
    course_name: { type: String, required: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true },
    description: { type: String, required: true },
    semester: { type: String, required: true },
    syllabus_document_id: { type: String },
    prerequisites: [{ type: String }],
    faculty_in_charge: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IPublicCourse>('PublicCourse', PublicCourseSchema);
