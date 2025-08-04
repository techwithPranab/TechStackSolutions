const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalProjects: { type: Number, default: 0 },
  totalYears: { type: Number, default: 8 },
  totalMobileApps: { type: Number, default: 0 },
  totalWebApps: { type: Number, default: 0 },
  email: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Stats', statsSchema);
