'use client';

import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

const Footer: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (href: string, type: 'route' | 'section') => {
    if (type === 'route') {
      if (href === '/' && window.location.pathname === '/') {
        // Already on home, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push(href);
      }
    } else if (type === 'section') {
      if (window.location.pathname !== '/') {
        router.push('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 400);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        py: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ mb: { xs: 1, md: 0 } }}>
          © {new Date().getFullYear()} TechStack Solutions. All rights reserved.
        </Typography>
        <Box>
          <Link 
            component="button"
            onClick={() => handleNavigation('/', 'route')}
            color="inherit" 
            underline="hover" 
            sx={{ 
              mx: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
          >
            Home
          </Link>
          <Link 
            component="button"
            onClick={() => handleNavigation('#services', 'section')}
            color="inherit" 
            underline="hover" 
            sx={{ 
              mx: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
          >
            Services
          </Link>
          <Link 
            component="button"
            onClick={() => handleNavigation('#contact', 'section')}
            color="inherit" 
            underline="hover" 
            sx={{ 
              mx: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
          >
            Contact
          </Link>
          <Link 
            component="button"
            onClick={() => handleNavigation('/blog', 'route')}
            color="inherit" 
            underline="hover" 
            sx={{ 
              mx: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit'
            }}
          >
            Blog
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
