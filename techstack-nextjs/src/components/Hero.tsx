'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Card,
  CardContent
} from '@mui/material';
import { 
  Code as CodeIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  Speed as SpeedIcon 
} from '@mui/icons-material';
import { statsAPI } from '@/services/api';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [stats, setStats] = useState([
    { label: 'Projects Delivered', value: '-', icon: <CodeIcon /> },
    { label: 'Years Experience', value: '-', icon: <SpeedIcon /> },
    { label: 'Mobile Apps Built', value: '-', icon: <PhoneIcon /> },
    { label: 'Web Applications', value: '-', icon: <WebIcon /> },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res: any = await statsAPI.getStats();
        const d = res.data || {};
        setStats([
          { label: 'Projects Delivered', value: d.totalProjects ? `${d.totalProjects}+` : '-', icon: <CodeIcon /> },
          { label: 'Years Experience', value: d.totalYears ? `${d.totalYears}+` : '-', icon: <SpeedIcon /> },
          { label: 'Mobile Apps Built', value: d.totalMobileApps ? `${d.totalMobileApps}+` : '-', icon: <PhoneIcon /> },
          { label: 'Web Applications', value: d.totalWebApps ? `${d.totalWebApps}+` : '-', icon: <WebIcon /> },
        ]);
      } catch {
        // fallback to default values if needed
      }
    };
    fetchStats();
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: '90px', md: '110px' },
        pb: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.2,
                }}
              >
                Mobile & Web App Development
                <Box component="span" sx={{ color: '#FFD700' }}>
                  {' '}with Cutting-Edge Tech
                </Box>
              </Typography>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.6,
                  }}
                >
                  We deliver high-performance React Native mobile apps, modern React.js web applications, 
                  and full-stack solutions with Node.js — managed professionally with end-to-end support.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={scrollToContact}
                    sx={{
                      backgroundColor: '#FFD700',
                      color: '#333',
                      fontWeight: 'bold',
                      px: 4,
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      '&:hover': {
                        backgroundColor: '#FFC107',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Free Consultation
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={scrollToServices}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 'bold',
                      px: 4,
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: '#FFD700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    View Our Services
                  </Button>
                </Box>
              </motion.div>
            </motion.div>
          </Box>

          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 3,
                }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <Card
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        p: 2,
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          backgroundColor: 'rgba(255,255,255,0.15)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CardContent sx={{ p: '16px !important' }}>
                        <Box sx={{ color: '#FFD700', mb: 1 }}>
                          {stat.icon}
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 0.5,
                            fontSize: { xs: '1.8rem', md: '2.2rem' },
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Box
            sx={{
              mt: 8,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Trusted by innovative companies
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography variant="body1">✅ 95% Client Retention</Typography>
              <Typography variant="body1">✅ 100% On-Time Delivery</Typography>
              <Typography variant="body1">✅ End-to-End Support</Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;
