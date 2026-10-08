import mongoose, { Schema, Document } from 'mongoose';

export interface ICampusLocation extends Document {
  name: string;
  code: string;
  category: 'academic' | 'lab' | 'library' | 'sports' | 'canteen' | 'admin' | 'hostel';
  building: string;
  floor?: string;
  room_number?: string;
  coordinates?: { lat: number; lng: number };
  hours?: string;
  description?: string;
}

const CampusLocationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['academic', 'lab', 'library', 'sports', 'canteen', 'admin', 'hostel'],
      default: 'academic'
    },
    building: { type: String, required: true },
    floor: { type: String },
    room_number: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    hours: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

CampusLocationSchema.index({ building: 1, category: 1 });

export default mongoose.model<ICampusLocation>('CampusLocation', CampusLocationSchema);
