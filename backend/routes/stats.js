const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Stats = require('../models/Stats');
const { authMiddleware } = require('../middleware/auth');
// Admin: Update stats (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    let statsDoc = await Stats.findOne();
    if (!statsDoc) {
      statsDoc = new Stats();
    }
    const { totalProjects, totalYears, totalMobileApps, totalWebApps, email, contactNumber } = req.body;
    if (typeof totalProjects === 'number') statsDoc.totalProjects = totalProjects;
    if (typeof totalYears === 'number') statsDoc.totalYears = totalYears;
    if (typeof totalMobileApps === 'number') statsDoc.totalMobileApps = totalMobileApps;
    if (typeof totalWebApps === 'number') statsDoc.totalWebApps = totalWebApps;
    if (typeof email === 'string') statsDoc.email = email;
    if (typeof contactNumber === 'string') statsDoc.contactNumber = contactNumber;
    await statsDoc.save();
    res.json({ success: true, message: 'Stats updated', data: statsDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating stats' });
  }
});

// Public stats endpoint for hero section
router.get('/', async (req, res) => {
  try {
    // Try to get stats from DB
    let statsDoc = await Stats.findOne();
    if (statsDoc) {
      res.json({
        success: true,
        data: {
          totalProjects: statsDoc.totalProjects,
          totalYears: statsDoc.totalYears,
          totalMobileApps: statsDoc.totalMobileApps,
          totalWebApps: statsDoc.totalWebApps,
          email: statsDoc.email,
          contactNumber: statsDoc.contactNumber
        }
      });
    } else {
      // Fallback to calculated values
      const [totalProjects, totalYears, totalMobileApps, totalWebApps] = await Promise.all([
        Blog.countDocuments({ isActive: true }),
        Promise.resolve(8),
        Service.countDocuments({ icon: 'mobile' }),
        Service.countDocuments({ icon: 'web' })
      ]);
      res.json({
        success: true,
        data: {
          totalProjects,
          totalYears,
          totalMobileApps,
          totalWebApps
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

module.exports = router;
