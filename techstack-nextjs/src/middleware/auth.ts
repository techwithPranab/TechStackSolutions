import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import Admin from '../models/Admin';
import dbConnect from '../lib/mongodb';

export interface AuthenticatedRequest extends NextRequest {
  admin?: any;
}

export const authMiddleware = async (req: NextRequest) => {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return {
        success: false,
        message: 'Access denied. No token provided.',
        status: 401
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    await dbConnect();
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      return {
        success: false,
        message: 'Invalid token or admin account deactivated.',
        status: 401
      };
    }

    return {
      success: true,
      admin
    };
  } catch (error) {
    return {
      success: false,
      message: 'Invalid token.',
      status: 401
    };
  }
};

export const superAdminOnly = (admin: any) => {
  if (admin.role !== 'super-admin') {
    return {
      success: false,
      message: 'Access denied. Super admin privileges required.',
      status: 403
    };
  }
  return { success: true };
};
