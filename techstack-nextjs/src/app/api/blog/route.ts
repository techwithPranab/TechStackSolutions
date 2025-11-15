import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { authMiddleware } from '@/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all');
    const isActiveParam = searchParams.get('isActive');

    let filter: any = {};
    
    if (showAll === 'true') {
      // Admin request - check authentication
      const authResult = await authMiddleware(req);
      if (!authResult.success) {
        return NextResponse.json({
          success: false,
          message: authResult.message
        }, { status: authResult.status });
      }
      
      if (typeof isActiveParam !== 'undefined' && isActiveParam !== null) {
        filter.isActive = isActiveParam === 'true';
      }
    } else {
      // Public request - only active blogs
      filter.isActive = true;
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching blogs'
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

    const blogData = await req.json();
    
    // Ensure isActive is boolean
    if (typeof blogData.isActive !== 'undefined') {
      blogData.isActive = blogData.isActive === true || blogData.isActive === 'true';
    }
    
    const blog = new Blog(blogData);
    await blog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    }, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creating blog'
    }, { status: 500 });
  }
}
