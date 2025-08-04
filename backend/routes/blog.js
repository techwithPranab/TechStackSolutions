const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { authMiddleware } = require('../middleware/auth');

// Get all active blogs (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching blogs' });
  }
});

// Get all blogs (admin, with optional isActive filter)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const { isActive } = req.query;
    let filter = {};
    if (typeof isActive !== 'undefined') {
      filter.isActive = isActive === 'true';
    }
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching blogs' });
  }
});

// Get single blog/case study by id (public)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || (!blog.isActive && !req.admin)) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching blog' });
  }
});

// Create blog/case study (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Ensure isActive is boolean
    if (typeof req.body.isActive !== 'undefined') {
      req.body.isActive = req.body.isActive === true || req.body.isActive === 'true';
    }
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({ success: true, message: 'Blog created', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating blog' });
  }
});

// Update blog/case study (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Ensure isActive is boolean
    if (typeof req.body.isActive !== 'undefined') {
      req.body.isActive = req.body.isActive === true || req.body.isActive === 'true';
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Blog updated', data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating blog' });
  }
});

// Delete blog/case study (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting blog' });
  }
});

module.exports = router;
