'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Avatar, Rating, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { testimonialsAPI } from '../services/api';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Testimonial {
  name: string;
  company: string;
  position: string;
  content: string;
  rating: number;
  image?: string;
}

const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    testimonialsAPI.getTestimonials()
      .then((res: any) => setTestimonials(res.data || []))
      .catch(() => setTestimonials([]));
  }, []);

  let visibleCount = 3;
  if (isXs) visibleCount = 1;
  else if (isSm) visibleCount = 2;
  else if (isMdUp) visibleCount = 3;

  const maxIndex = testimonials.length > visibleCount ? testimonials.length - visibleCount : 0;

  const handlePrev = () => setIndex(i => Math.max(i - 1, 0));
  const handleNext = () => setIndex(i => Math.min(i + 1, maxIndex));

  // Reset index if visibleCount changes or testimonials change
  useEffect(() => {
    setIndex(0);
  }, [visibleCount, testimonials.length]);

  const visibleTestimonials = testimonials.slice(index, index + visibleCount);

  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: 'bold', color: 'white', mb: 6 }}
          >
            What Our Clients Say
          </Typography>
        </motion.div>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <IconButton onClick={handlePrev} disabled={index === 0} sx={{ color: 'white', mr: 2 }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 4, width: '100%', maxWidth: 1200, justifyContent: 'center' }}>
            {visibleTestimonials.map((t, idx) => (
              <motion.div
                key={t.name + idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 4px 24px 0 rgba(102,126,234,0.10)',
                  background: 'rgba(255,255,255,0.97)',
                  minHeight: 220,
                  width: { xs: 260, sm: 320, md: 340 },
                  mx: 'auto',
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={t.image} alt={t.name} sx={{ width: 56, height: 56, mr: 2, bgcolor: '#764ba2', color: '#fff', fontWeight: 700 }}>
                        {t.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{t.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{t.position} @ {t.company}</Typography>
                        <Rating value={t.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic' }}>
                      "{t.content}"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
          <IconButton onClick={handleNext} disabled={index === maxIndex} sx={{ color: 'white', ml: 2 }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialSection;
