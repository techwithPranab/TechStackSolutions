import mongoose from 'mongoose';

export interface IStats extends mongoose.Document {
  totalProjects: number;
  totalYears: number;
  totalMobileApps: number;
  totalWebApps: number;
  email: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const statsSchema = new mongoose.Schema({
  totalProjects: { type: Number, default: 0 },
  totalYears: { type: Number, default: 8 },
  totalMobileApps: { type: Number, default: 0 },
  totalWebApps: { type: Number, default: 0 },
  email: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  // Add more fields as needed
}, { timestamps: true });

export default mongoose.models.Stats || mongoose.model<IStats>('Stats', statsSchema);
