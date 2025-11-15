import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { testEmail } = await req.json();
    
    if (!testEmail) {
      return NextResponse.json({
        success: false,
        message: 'Test email address is required'
      }, { status: 400 });
    }

    // Test email connection
    const connectionTest = await emailService.verifyConnection();
    
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        message: 'Email server connection failed. Please check your SMTP configuration.'
      }, { status: 500 });
    }

    // Send test email
    const testEmailSent = await emailService.sendEmail({
      to: testEmail,
      subject: 'TechStack Solutions - Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea;">Email Configuration Test Successful! 🎉</h2>
          <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Date: ${new Date().toLocaleString()}</li>
              <li>Recipient: ${testEmail}</li>
              <li>Service: TechStack Solutions Email System</li>
            </ul>
          </div>
          <p>If you received this email, your email configuration is working properly!</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px;">
            This is an automated test email from TechStack Solutions.<br>
            Please do not reply to this email.
          </p>
        </div>
      `
    });

    if (testEmailSent) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error testing email configuration',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const connectionTest = await emailService.verifyConnection();
    
    return NextResponse.json({
      success: connectionTest,
      message: connectionTest 
        ? 'Email server connection successful' 
        : 'Email server connection failed',
      config: {
        host: process.env.SMTP_HOST || 'Not configured',
        port: process.env.SMTP_PORT || 'Not configured',
        user: process.env.SMTP_USER || 'Not configured',
        secure: process.env.SMTP_SECURE || 'Not configured'
      }
    });
    
  } catch (error) {
    console.error('Email connection test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error testing email connection',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
