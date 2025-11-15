import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { authMiddleware } from '@/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        message: 'Service not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching service'
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

    const serviceData = await req.json();
    const { id } = await params;
    const service = await Service.findByIdAndUpdate(
      id,
      serviceData,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return NextResponse.json({
        success: false,
        message: 'Service not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating service'
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
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return NextResponse.json({
        success: false,
        message: 'Service not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error deleting service'
    }, { status: 500 });
  }
}
