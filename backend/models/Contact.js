const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    enum: ['mobile-app', 'web-app', 'full-stack', 'consulting', 'other'],
    default: 'other'
  },
  budget: {
    type: String,
    enum: ['5k-10k', '10k-25k', '25k-50k', '50k-100k', '100k+'],
  },
  timeline: {
    type: String,
    enum: ['1-3 months', '3-6 months', '6-12 months', '12+ months'],
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'completed'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
