import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stats from '@/models/Stats';
import Service from '@/models/Service';
import Blog from '@/models/Blog';
import { authMiddleware } from '@/middleware/auth';

export async function GET() {
  try {
    await dbConnect();
    
    // Try to get stats from DB
    let statsDoc = await Stats.findOne();
    
    if (statsDoc) {
      return NextResponse.json({
        success: true,
        data: {
          totalProjects: statsDoc.totalProjects,
          totalYears: statsDoc.totalYears,
          totalMobileApps: statsDoc.totalMobileApps,
          totalWebApps: statsDoc.totalWebApps,
          email: statsDoc.email,
          contactNumber: statsDoc.contactNumber
        }
      });
    } else {
      // Fallback to calculated values
      const [totalProjects, totalMobileApps, totalWebApps] = await Promise.all([
        Blog.countDocuments({ isActive: true }),
        Service.countDocuments({ icon: 'mobile' }),
        Service.countDocuments({ icon: 'web' })
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          totalProjects,
          totalYears: 8,
          totalMobileApps,
          totalWebApps,
          email: '',
          contactNumber: ''
        }
      });
    }
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching stats'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return NextResponse.json({
        success: false,
        message: authResult.message
      }, { status: authResult.status });
    }

    let statsDoc = await Stats.findOne();
    if (!statsDoc) {
      statsDoc = new Stats();
    }

    const { totalProjects, totalYears, totalMobileApps, totalWebApps, email, contactNumber } = await req.json();
    
    if (typeof totalProjects === 'number') statsDoc.totalProjects = totalProjects;
    if (typeof totalYears === 'number') statsDoc.totalYears = totalYears;
    if (typeof totalMobileApps === 'number') statsDoc.totalMobileApps = totalMobileApps;
    if (typeof totalWebApps === 'number') statsDoc.totalWebApps = totalWebApps;
    if (typeof email === 'string') statsDoc.email = email;
    if (typeof contactNumber === 'string') statsDoc.contactNumber = contactNumber;

    await statsDoc.save();

    return NextResponse.json({
      success: true,
      message: 'Stats updated successfully',
      data: statsDoc
    });
  } catch (error) {
    console.error('Update stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating stats'
    }, { status: 500 });
  }
}
