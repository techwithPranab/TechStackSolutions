import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard2';
import ServicesManager from './ServicesManager';
import TestimonialsManager from './TestimonialsManager';
import ContactsManager from './ContactsManager';
import AdminProfile from './AdminProfile';
import BlogManager from './BlogManager';
import StatsManager from './StatsManager';
import { CircularProgress, Box } from '@mui/material';

const AdminPanel: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const renderSection = () => {
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
        return <AdminProfile />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      {renderSection()}
    </AdminLayout>
  );
};

export default AdminPanel;
