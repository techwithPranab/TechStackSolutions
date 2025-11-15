import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { authMiddleware } from '@/middleware/auth';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({ isActive: true });
    return NextResponse.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching services'
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

    const serviceData = await req.json();
    const service = new Service(serviceData);
    await service.save();
    
    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: service
    }, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creating service'
    }, { status: 500 });
  }
}
