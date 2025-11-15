import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { authMiddleware } from '@/middleware/auth';

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching testimonials'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        message: authResult.message
      }, { status: authResult.status });
    }

    const testimonialData = await req.json();
    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    }, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creating testimonial'
    }, { status: 500 });
  }
}
