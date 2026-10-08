import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user_id: string;
  user_email: string;
  user_role: string;
  action: string;
  resource: string;
  details?: any;
  ip_address?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, index: true },
    user_email: { type: String, required: true },
    user_role: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ip_address: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: { createdAt: 'timestamp', updatedAt: false } }
);

AuditLogSchema.index({ timestamp: -1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
