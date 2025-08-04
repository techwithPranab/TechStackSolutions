import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  PhoneAndroid as MobileIcon,
  Web as WebIcon,
  Build as FullStackIcon,
  Psychology as ConsultingIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { servicesAPI } from '../services/api';
import { Service } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconMap: { [key: string]: React.ReactElement } = {
    mobile: <MobileIcon sx={{ fontSize: 40 }} />,
    web: <WebIcon sx={{ fontSize: 40 }} />,
    fullstack: <FullStackIcon sx={{ fontSize: 40 }} />,
    consulting: <ConsultingIcon sx={{ fontSize: 40 }} />,
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response: any = await servicesAPI.getServices();
        if (response.success) {
          setServices(response.data);
        } else {
          // Try to seed services if none exist
          await servicesAPI.seedServices();
          const seededResponse: any = await servicesAPI.getServices();
          if (seededResponse.success) {
            setServices(seededResponse.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      id="services"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#1a202c',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Services We Provide
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              Comprehensive mobile and web development solutions with cutting-edge technologies 
              and end-to-end support for your digital transformation journey.
            </Typography>
          </Box>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 4,
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    '& .service-icon': {
                      transform: 'scale(1.1)',
                      color: '#667eea',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    className="service-icon"
                    sx={{
                      color: '#764ba2',
                      mb: 3,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {iconMap[service.icon] || <WebIcon sx={{ fontSize: 40 }} />}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: '#1a202c',
                    }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      mb: 3,
                      lineHeight: 1.6,
                      flex: 1,
                    }}
                  >
                    {service.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 'bold', mb: 2, color: '#374151' }}
                    >
                      Key Features:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      {service.features.slice(0, 3).map((feature) => (
                        <Typography
                          key={`${service._id}-feature-${feature}`}
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            '&:before': {
                              content: '"✓"',
                              color: '#10b981',
                              fontWeight: 'bold',
                              marginRight: 1,
                            },
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 'bold', mb: 1, color: '#374151' }}
                    >
                      Technologies:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {service.technologies.slice(0, 4).map((tech) => (
                        <Chip
                          key={`${service._id}-tech-${tech}`}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      mt: 'auto',
                    }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<ArrowIcon />}
                      onClick={scrollToContact}
                      sx={{
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                          transform: 'translateX(5px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Get Quote
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: '#1a202c',
              }}
            >
              Need a Custom Solution?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                mb: 4,
                maxWidth: '500px',
                mx: 'auto',
              }}
            >
              Every project is unique. Let's discuss your specific requirements and create 
              a tailored solution that fits your business needs perfectly.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={scrollToContact}
              sx={{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Discuss Your Project
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Services;
