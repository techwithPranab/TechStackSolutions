import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { authMiddleware } from '@/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        message: authResult.message
      }, { status: authResult.status });
    }

    return NextResponse.json({
      success: true,
      data: authResult.admin
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        message: authResult.message
      }, { status: authResult.status });
    }

    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({
        success: false,
        message: 'Name and email are required'
      }, { status: 400 });
    }

    const Admin = (await import('@/models/Admin')).default;
    const admin = await Admin.findById(authResult.admin._id);
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Admin not found'
      }, { status: 404 });
    }

    admin.name = name;
    admin.email = email;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: admin.toJSON()
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
