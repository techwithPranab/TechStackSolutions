import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { authMiddleware } from '@/middleware/auth';

export async function PATCH(
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

    const { status } = await req.json();
    const { id } = await params;
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json({
        success: false,
        message: 'Contact not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating contact status'
    }, { status: 500 });
  }
}
