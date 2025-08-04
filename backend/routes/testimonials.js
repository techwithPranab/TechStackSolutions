const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { authMiddleware } = require('../middleware/auth');

// Get all active testimonials (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// Get all testimonials including inactive (Admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// Create new testimonial (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Creating testimonial with data:', req.body);
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    
    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial'
    });
  }
});

// Update testimonial (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Updating testimonial with ID:', req.params.id, 'and data:', req.body);
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial'
    });
  }
});

// Delete testimonial (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial'
    });
  }
});

// Seed initial testimonials (run once)
router.post('/seed', async (req, res) => {
  try {
    const existingTestimonials = await Testimonial.find();
    if (existingTestimonials.length > 0) {
      return res.json({
        success: true,
        message: 'Testimonials already exist'
      });
    }

    const testimonials = [
      {
        name: 'Sarah Johnson',
        company: 'TechStart Inc',
        position: 'CTO',
        content: 'Exceptional mobile app development! They delivered our React Native app on time and exceeded our expectations. The team was professional and responsive throughout the project.',
        rating: 5,
        image: '/api/placeholder/testimonial1'
      },
      {
        name: 'Michael Chen',
        company: 'GrowthCorp',
        position: 'Product Manager',
        content: 'Outstanding web development services. Our React.js dashboard is now faster and more user-friendly than ever. Great technical expertise and project management.',
        rating: 5,
        image: '/api/placeholder/testimonial2'
      },
      {
        name: 'Emily Rodriguez',
        company: 'InnovateLab',
        position: 'Founder',
        content: 'Full-stack development at its finest. From initial consultation to final deployment, they handled everything professionally. Highly recommend for any React/Node.js projects.',
        rating: 5,
        image: '/api/placeholder/testimonial3'
      }
    ];

    await Testimonial.insertMany(testimonials);

    res.status(201).json({
      success: true,
      message: 'Testimonials seeded successfully',
      data: testimonials
    });
  } catch (error) {
    console.error('Seed testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding testimonials'
    });
  }
});

module.exports = router;
