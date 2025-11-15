import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { authMiddleware } from '@/middleware/auth';
import { CloudinaryService } from '@/lib/cloudinary';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, { status: 404 });
    }

    // Check if blog is active for public access
    if (!blog.isActive) {
      const authResult = await authMiddleware(req);
      if (!authResult.success) {
        return NextResponse.json({
          success: false,
          message: 'Blog not found'
        }, { status: 404 });
      }
    }

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching blog'
    }, { status: 500 });
  }
}

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

    const blogData = await req.json();
    const { id } = await params;
    
    // Ensure isActive is boolean
    if (typeof blogData.isActive !== 'undefined') {
      blogData.isActive = blogData.isActive === true || blogData.isActive === 'true';
    }
    
    const blog = await Blog.findByIdAndUpdate(
      id, 
      blogData, 
      { new: true, runValidators: true }
    );    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating blog'
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
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'Blog not found'
      }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (blog.imagePublicId) {
      try {
        await CloudinaryService.deleteImage(blog.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with blog deletion even if Cloudinary deletion fails
      }
    }

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error deleting blog'
    }, { status: 500 });
  }
}
