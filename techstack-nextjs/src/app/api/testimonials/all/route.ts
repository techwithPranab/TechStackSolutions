import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
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

    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching testimonials'
    }, { status: 500 });
  }
}
