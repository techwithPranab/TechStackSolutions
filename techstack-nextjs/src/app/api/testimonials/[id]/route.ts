import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { authMiddleware } from '@/middleware/auth';
import { CloudinaryService } from '@/lib/cloudinary';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      testimonialData,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return NextResponse.json({
        success: false,
        message: 'Testimonial not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating testimonial'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        message: authResult.message
      }, { status: authResult.status });
    }

    const { id } = await params;
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return NextResponse.json({
        success: false,
        message: 'Testimonial not found'
      }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (testimonial.imagePublicId) {
      try {
        await CloudinaryService.deleteImage(testimonial.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with testimonial deletion even if Cloudinary deletion fails
      }
    }

    // Delete the testimonial
    await Testimonial.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error deleting testimonial'
    }, { status: 500 });
  }
}
