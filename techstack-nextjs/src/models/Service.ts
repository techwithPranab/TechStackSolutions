import mongoose from 'mongoose';

export interface IService extends mongoose.Document {
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  icon?: string;
  price?: {
    startingPrice?: number;
    currency: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    trim: true
  },
  price: {
    startingPrice: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
