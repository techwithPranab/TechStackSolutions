const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/consultancy-website')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Enable services API route
app.use('/api/services', require('./routes/services'));
// Enable contact API route
app.use('/api/contact', require('./routes/contact'));
// Enable testimonials API route
app.use('/api/testimonials', require('./routes/testimonials'));
// Enable admin API route
app.use('/api/admin', require('./routes/admin'));
// Enable blog/case studies API route
app.use('/api/blog', require('./routes/blog'));
// Enable stats API route for hero section
app.use('/api/stats', require('./routes/stats'));

// Basic routes for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
