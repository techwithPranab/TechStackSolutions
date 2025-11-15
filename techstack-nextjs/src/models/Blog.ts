import mongoose from 'mongoose';

export interface IBlog extends mongoose.Document {
  title: string;
  summary: string;
  content: string;
  image?: string;
  client?: string;
  technologies: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  image: { type: String },
  client: { type: String },
  technologies: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);
