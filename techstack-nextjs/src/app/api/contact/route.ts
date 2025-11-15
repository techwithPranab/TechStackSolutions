import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { authMiddleware } from '@/middleware/auth';
import { emailService } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message
    } = await req.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and message are required'
      }, { status: 400 });
    }

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message
    });

    await contact.save();

    // Prepare contact data for email service
    const contactData = {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message
    };

    // Send confirmation email to user and notification to admin
    try {
      const emailPromises = [];
      
      // Send confirmation email to user
      emailPromises.push(emailService.sendContactConfirmation(contactData));
      
      // Send notification email to admin
      emailPromises.push(emailService.sendAdminNotification(contactData));
      
      const emailResults = await Promise.allSettled(emailPromises);
      
      // Log email results but don't fail the API if emails fail
      emailResults.forEach((result, index) => {
        const emailType = index === 0 ? 'confirmation' : 'admin notification';
        if (result.status === 'rejected') {
          console.error(`Failed to send ${emailType} email:`, result.reason);
        } else {
          console.log(`${emailType} email sent successfully:`, result.value);
        }
      });
      
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Continue with success response even if emails fail
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully. You will receive a confirmation email shortly.',
      data: contact
    }, { status: 201 });

  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error submitting contact form'
    }, { status: 500 });
  }
}

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

    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching contacts'
    }, { status: 500 });
  }
}
