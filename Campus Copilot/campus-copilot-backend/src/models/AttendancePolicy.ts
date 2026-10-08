import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendancePolicy extends Document {
  university_name: string;
  minimum_required_percentage: number; // e.g. 75
  condonation_limit_percentage: number; // e.g. 65
  medical_exception_allowed: boolean;
  policy_document_id?: string;
  description: string;
  updated_at: Date;
}

const AttendancePolicySchema: Schema = new Schema(
  {
    university_name: { type: String, required: true, default: 'GSFC University' },
    minimum_required_percentage: { type: Number, required: true, default: 75 },
    condonation_limit_percentage: { type: Number, required: true, default: 65 },
    medical_exception_allowed: { type: Boolean, default: true },
    policy_document_id: { type: String, default: 'POL-2025-ATT-01' },
    description: {
      type: String,
      default: 'University regulations require a minimum aggregate attendance of 75% in each registered course to be eligible to appear in the end-semester examinations.'
    }
  },
  { timestamps: { createdAt: false, updatedAt: 'updated_at' } }
);

export default mongoose.model<IAttendancePolicy>('AttendancePolicy', AttendancePolicySchema);
