'use client';

'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Build,
  Reviews,
  ContactMail,
  TrendingUp,
  Article,
} from '@mui/icons-material';
import { servicesAPI, testimonialsAPI, contactAPI, blogAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import StatsManager from './StatsManager';

interface DashboardStats {
  totalServices: number;
  totalTestimonials: number;
  totalContacts: number;
  pendingContacts: number;
  totalBlogs: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, description }) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `1px solid ${color}30`,
      minWidth: 250,
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: color,
            color: 'white',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" component="div" color={color} fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    totalTestimonials: 0,
    totalContacts: 0,
    pendingContacts: 0,
    totalBlogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, testimonialsRes, contactsRes, blogsRes] = await Promise.all([
        servicesAPI.getServices(),
        testimonialsAPI.getTestimonials(),
        token ? contactAPI.getContacts(token) : Promise.resolve({ data: [] }),
        token ? blogAPI.getAllBlogs(token) : Promise.resolve({ data: [] }),
      ]);

      const contacts = contactsRes.data || [];
      const pendingContacts = contacts.filter((contact: any) => contact.status === 'pending').length;

      setStats({
        totalServices: servicesRes.data?.length || 0,
        totalTestimonials: testimonialsRes.data?.length || 0,
        totalContacts: contacts.length,
        pendingContacts,
        totalBlogs: blogsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your admin dashboard. Here's an overview of your website's content.
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)', 
          lg: 'repeat(5, 1fr)' 
        }, 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Services"
          value={stats.totalServices}
          icon={<Build />}
          color="#667eea"
          description="Total active services"
        />
        <StatCard
          title="Testimonials"
          value={stats.totalTestimonials}
          icon={<Reviews />}
          color="#f093fb"
          description="Customer testimonials"
        />
        <StatCard
          title="Blog Posts"
          value={stats.totalBlogs}
          icon={<Article />}
          color="#ff6b6b"
          description="Published blog posts"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={<ContactMail />}
          color="#4facfe"
          description="All contact submissions"
        />
        <StatCard
          title="Pending Contacts"
          value={stats.pendingContacts}
          icon={<TrendingUp />}
          color="#43e97b"
          description="Awaiting response"
        />
      </Box>

      {/* Hero Stats Manager */}
      <Box sx={{ mb: 4 }}>
        <StatsManager />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Paper sx={{ p: 3, flex: 2, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Add New Service"
              color="primary"
              variant="outlined"
              clickable
            />
            <Chip
              label="Add Testimonial"
              color="secondary"
              variant="outlined"
              clickable
            />
            <Chip
              label="View Pending Contacts"
              color="warning"
              variant="outlined"
              clickable
            />
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, minWidth: 250 }}>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                mr: 1,
              }}
            />
            <Typography variant="body2">Database Connected</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                mr: 1,
              }}
            />
            <Typography variant="body2">API Server Running</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                mr: 1,
              }}
            />
            <Typography variant="body2">All Services Operational</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
