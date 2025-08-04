import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer: React.FC = () => {
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
          <Link href="/" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Home
          </Link>
          <Link href="/services" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Services
          </Link>
          <Link href="/contact" color="inherit" underline="hover" sx={{ mx: 1 }}>
            Contact
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
