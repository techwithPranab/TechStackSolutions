const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { authMiddleware } = require('../middleware/auth');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service'
    });
  }
});

// Create initial services (run once to populate database)
router.post('/seed', async (req, res) => {
  try {
    // Check if services already exist
    const existingServices = await Service.find();
    if (existingServices.length > 0) {
      return res.json({
        success: true,
        message: 'Services already exist'
      });
    }

    const services = [
      {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications built with React Native and cutting-edge technologies for iOS and Android.',
        features: [
          'Cross-platform development with React Native',
          'Native iOS and Android apps',
          'Real-time features and push notifications',
          'Backend API integration',
          'App store deployment support'
        ],
        technologies: ['React Native', 'Expo', 'Firebase', 'Redux', 'TypeScript'],
        icon: 'mobile',
        price: {
          startingPrice: 15000,
          currency: 'USD'
        }
      },
      {
        title: 'Web Application Development',
        description: 'Modern, responsive web applications using React.js, Node.js, and modern web technologies with scalable architecture.',
        features: [
          'Responsive React.js applications',
          'RESTful API development with Node.js',
          'Database design and optimization',
          'Real-time features with WebSockets',
          'Cloud deployment and scaling'
        ],
        technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'AWS'],
        icon: 'web',
        price: {
          startingPrice: 10000,
          currency: 'USD'
        }
      },
      {
        title: 'Full-Stack Solutions',
        description: 'Complete end-to-end development services from concept to deployment with ongoing support and maintenance.',
        features: [
          'Complete project planning and architecture',
          'Frontend and backend development',
          'Database design and implementation',
          'DevOps and deployment automation',
          'Ongoing maintenance and support'
        ],
        technologies: ['MERN Stack', 'TypeScript', 'Docker', 'AWS', 'MongoDB'],
        icon: 'fullstack',
        price: {
          startingPrice: 25000,
          currency: 'USD'
        }
      },
      {
        title: 'Technical Consulting',
        description: 'Expert technical guidance, code reviews, architecture planning, and technology stack recommendations.',
        features: [
          'Technical architecture consulting',
          'Code review and optimization',
          'Technology stack recommendations',
          'Performance optimization',
          'Best practices implementation'
        ],
        technologies: ['Various', 'Architecture', 'Performance', 'Security', 'Scalability'],
        icon: 'consulting',
        price: {
          startingPrice: 150,
          currency: 'USD'
        }
      }
    ];

    await Service.insertMany(services);

    res.status(201).json({
      success: true,
      message: 'Services seeded successfully',
      data: services
    });

  } catch (error) {
    console.error('Seed services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding services'
    });
  }
});

// Admin protected routes below
// Create new service (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service'
    });
  }
});

// Update service (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service'
    });
  }
});

// Delete service (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service'
    });
  }
});

module.exports = router;
