const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or admin account deactivated.' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Super admin privileges required.' 
    });
  }
  next();
};

module.exports = { authMiddleware, superAdminOnly };
