'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import StatsManager from '@/components/admin/StatsManager';
import ServicesManager from '@/components/admin/ServicesManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import ContactsManager from '@/components/admin/ContactsManager';
import BlogManager from '@/components/admin/BlogManager';
import { Box, CircularProgress } from '@mui/material';

export default function AdminDashboardPage() {
  const { admin, isLoading } = useAuth();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState('dashboard');

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push('/admin');
    }
  }, [admin, isLoading, router]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!admin) {
    return null; // Redirect is handled by useEffect
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'services':
        return <ServicesManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'contacts':
        return <ContactsManager />;
      case 'blog':
        return <BlogManager />;
      case 'stats':
        return <StatsManager />;
      case 'profile':
        return <div>Admin Profile - Coming Soon</div>;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout 
      currentSection={currentSection} 
      onSectionChange={setCurrentSection}
    >
      {renderCurrentSection()}
    </AdminLayout>
  );
}
