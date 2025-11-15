import nodemailer from 'nodemailer';
import { ContactForm } from '@/types';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendContactConfirmation(contactData: ContactForm): Promise<boolean> {
    const confirmationHtml = this.generateConfirmationTemplate(contactData);
    
    return await this.sendEmail({
      to: contactData.email,
      subject: 'Thank you for contacting TechStack Solutions - Consultation Request Received',
      html: confirmationHtml,
    });
  }

  async sendAdminNotification(contactData: ContactForm): Promise<boolean> {
    const adminHtml = this.generateAdminNotificationTemplate(contactData);
    
    return await this.sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER || '',
      subject: `New Contact Form Submission - ${contactData.name}`,
      html: adminHtml,
    });
  }

  private generateConfirmationTemplate(data: ContactForm): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - TechStack Solutions</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #667eea;
            margin-top: 0;
            font-size: 24px;
          }
          .info-box {
            background: #f8fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          .info-row {
            margin: 10px 0;
          }
          .label {
            font-weight: bold;
            color: #374151;
            display: inline-block;
            min-width: 120px;
          }
          .value {
            color: #64748b;
          }
          .cta {
            text-align: center;
            margin: 30px 0;
          }
          .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: transform 0.3s ease;
          }
          .footer {
            background: #1a202c;
            color: white;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
          }
          .social-links {
            margin: 15px 0;
          }
          .social-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TechStack Solutions</h1>
            <p>Your Partner in Digital Transformation</p>
          </div>
          
          <div class="content">
            <h2>Thank You, ${data.name}!</h2>
            <p>We've received your consultation request and are excited to help you bring your project to life. Our team will review your requirements and get back to you within 24 hours.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #667eea;">Your Submission Details:</h3>
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${data.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${data.email}</span>
              </div>
              ${data.phone ? `
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">${data.phone}</span>
              </div>
              ` : ''}
              ${data.company ? `
              <div class="info-row">
                <span class="label">Company:</span>
                <span class="value">${data.company}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Project Type:</span>
                <span class="value">${this.getProjectTypeLabel(data.projectType)}</span>
              </div>
              ${data.budget ? `
              <div class="info-row">
                <span class="label">Budget Range:</span>
                <span class="value">${data.budget}</span>
              </div>
              ` : ''}
              ${data.timeline ? `
              <div class="info-row">
                <span class="label">Timeline:</span>
                <span class="value">${data.timeline}</span>
              </div>
              ` : ''}
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul style="color: #64748b; padding-left: 20px;">
              <li>Our team will review your project requirements</li>
              <li>We'll prepare a customized proposal for your needs</li>
              <li>Schedule a free consultation call within 24 hours</li>
              <li>Discuss your project timeline and next steps</li>
            </ul>
            
            <div class="cta">
              <p>In the meantime, feel free to explore our services:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://techstacksolutions.com'}" class="cta-button">Visit Our Website</a>
            </div>
            
            <p>If you have any immediate questions, don't hesitate to reach out to us at <a href="mailto:${process.env.ADMIN_EMAIL || 'contact@techstacksolutions.com'}" style="color: #667eea;">${process.env.ADMIN_EMAIL || 'contact@techstacksolutions.com'}</a> or call us at <a href="tel:+15551234567" style="color: #667eea;">+1 (555) 123-4567</a>.</p>
          </div>
          
          <div class="footer">
            <p><strong>TechStack Solutions</strong></p>
            <p>Specializing in React Native, React.js, Node.js, and Cloud Technologies</p>
            <div class="social-links">
              <a href="#">LinkedIn</a> | 
              <a href="#">Twitter</a> | 
              <a href="#">GitHub</a>
            </div>
            <p>&copy; ${new Date().getFullYear()} TechStack Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminNotificationTemplate(data: ContactForm): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 30px;
          }
          .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          .info-row {
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: bold;
            color: #374151;
            display: inline-block;
            min-width: 120px;
          }
          .value {
            color: #1f2937;
          }
          .message-box {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
          }
          .priority {
            color: #dc2626;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Contact Form Submission</h1>
            <p>TechStack Solutions Admin Panel</p>
          </div>
          
          <div class="content">
            <h2>Contact Details</h2>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${data.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
              </div>
              ${data.phone ? `
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:${data.phone}">${data.phone}</a></span>
              </div>
              ` : ''}
              ${data.company ? `
              <div class="info-row">
                <span class="label">Company:</span>
                <span class="value">${data.company}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Project Type:</span>
                <span class="value">${this.getProjectTypeLabel(data.projectType)}</span>
              </div>
              ${data.budget ? `
              <div class="info-row">
                <span class="label">Budget Range:</span>
                <span class="value">${data.budget}</span>
              </div>
              ` : ''}
              ${data.timeline ? `
              <div class="info-row">
                <span class="label">Timeline:</span>
                <span class="value">${data.timeline}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Submitted:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            ${data.message ? `
            <div class="message-box">
              <h3 style="margin-top: 0; color: #92400e;">Project Description:</h3>
              <p style="margin-bottom: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
            ` : ''}
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #dc2626;">Action Required:</h3>
              <ul style="margin-bottom: 0;">
                <li>Review the project requirements</li>
                <li>Prepare a customized proposal</li>
                <li class="priority">Contact within 24 hours</li>
                <li>Schedule consultation call</li>
              </ul>
            </div>
            
            <p><strong>Quick Actions:</strong></p>
            <p>
              📧 <a href="mailto:${data.email}?subject=Re: Your consultation request - TechStack Solutions">Reply to ${data.name}</a><br>
              📞 ${data.phone ? `<a href="tel:${data.phone}">Call ${data.phone}</a><br>` : ''}
              🔗 <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/admin">Admin Dashboard</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getProjectTypeLabel(projectType: string): string {
    const labels: { [key: string]: string } = {
      'mobile-app': 'Mobile App Development',
      'web-app': 'Web Application',
      'full-stack': 'Full-Stack Solution',
      'consulting': 'Technical Consulting',
      'other': 'Other'
    };
    return labels[projectType] || projectType;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
