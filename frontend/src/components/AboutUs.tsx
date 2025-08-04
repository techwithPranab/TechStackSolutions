import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const aboutData = {
  title: 'About TechStack Solutions',
  subtitle: 'Your Partner in Digital Transformation',
  description:
    'TechStack Solutions is a consultancy focused on delivering high-quality mobile and web app development services. Our team of experts specializes in React Native, React.js, Node.js, and the latest cloud and DevOps technologies. We help startups and enterprises accelerate their digital journey with end-to-end support, from ideation to deployment and beyond.',
  values: [
    'Client-first approach',
    'Cutting-edge technology',
    'Transparent communication',
    'Agile delivery',
    'Long-term partnership',
  ],
  team: [
    {
      name: 'Pranab Paul',
      role: 'Founder & Lead Consultant',
      image: '',
    },
    {
      name: 'Amit Sharma',
      role: 'Full Stack Developer',
      image: '',
    },
    {
      name: 'Sara Lee',
      role: 'UI/UX Designer',
      image: '',
    },
  ],
};

const AboutUs: React.FC = () => (
  <Box id="about" sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}>
          {aboutData.title}
        </Typography>
        <Typography variant="h5" align="center" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
          {aboutData.subtitle}
        </Typography>
        <Typography align="center" sx={{ color: 'white', mb: 4, fontSize: { xs: '1.1rem', md: '1.2rem' } }}>
          {aboutData.description}
        </Typography>
        <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontWeight: 600 }}>
          Our Values
        </Typography>
        <Box sx={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 6
        }}>
          {aboutData.values.map((value) => (
            <Box key={value} sx={{
              flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 28%' },
              minWidth: 200,
              maxWidth: 320,
              background: 'rgba(255,255,255,0.10)',
              borderRadius: 2,
              p: 2,
              color: 'white',
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 2px 8px 0 rgba(102,126,234,0.10)',
            }}>{value}</Box>
          ))}
        </Box>
      </motion.div>
    </Container>
  </Box>
);

export default AboutUs;
