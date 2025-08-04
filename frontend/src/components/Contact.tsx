import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { contactAPI } from '../services/api';
import { ContactForm } from '../types';

const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: 'other',
      budget: '',
      timeline: '',
      message: '',
    },
  });

  const projectTypes = [
    { value: 'mobile-app', label: 'Mobile App Development' },
    { value: 'web-app', label: 'Web Application' },
    { value: 'full-stack', label: 'Full-Stack Solution' },
    { value: 'consulting', label: 'Technical Consulting' },
    { value: 'other', label: 'Other' },
  ];

  const budgetRanges = [
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k+', label: '$100,000+' },
  ];

  const timelines = [
    { value: '1-3 months', label: '1-3 months' },
    { value: '3-6 months', label: '3-6 months' },
    { value: '6-12 months', label: '6-12 months' },
    { value: '12+ months', label: '12+ months' },
  ];

  const onSubmit = async (data: ContactForm) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response: any = await contactAPI.submitContact(data);
      
      if (response.success) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch contact info from Stat model
  const [statContact, setStatContact] = useState<{ email?: string; contactNumber?: string }>({});
  useEffect(() => {
    const fetchStatContact = async () => {
      try {
        const res = await import('../services/api').then(m => m.statsAPI.getStats());
        const d = res.data || {};
        setStatContact({ email: d.email, contactNumber: d.contactNumber });
      } catch {
        // fallback to default values if needed
      }
    };
    fetchStatContact();
  }, []);

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 36 }} />, 
      title: 'Email Us',
      content: statContact.email || 'contact@techstacksolutions.com',
      action: 'Send Email',
      link: statContact.email ? `mailto:${statContact.email}` : 'mailto:contact@techstacksolutions.com',
      color: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 36 }} />, 
      title: 'Call Us',
      content: statContact.contactNumber || '+1 (555) 123-4567',
      action: 'Call Now',
      link: statContact.contactNumber ? `tel:${statContact.contactNumber}` : 'tel:+15551234567',
      color: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
    },
  ];

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                color: 'white',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Let's Build Something Amazing Together
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              Ready to turn your ideas into reality? Get in touch and let's discuss 
              how we can help accelerate your digital transformation.
            </Typography>
          </Box>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 6,
          }}
        >
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  color: '#1a202c',
                }}
              >
                Get Free Consultation
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Full Name"
                          fullWidth
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email Address"
                          type="email"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Number"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box>
                    <Controller
                      name="company"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Company Name"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box>
                    <Controller
                      name="projectType"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Project Type"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        >
                          {projectTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Box>

                  <Box>
                    <Controller
                      name="budget"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Budget Range"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        >
                          {budgetRanges.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Controller
                      name="timeline"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Project Timeline"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        >
                          {timelines.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Controller
                      name="message"
                      control={control}
                      rules={{ required: 'Message is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Project Description"
                          multiline
                          rows={4}
                          fullWidth
                          error={!!errors.message}
                          helperText={errors.message?.message}
                          placeholder="Tell us about your project, goals, and requirements..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      endIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2,
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
                        },
                        '&:disabled': {
                          background: '#cccccc',
                        },
                      }}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: '100%',
              minWidth: 0,
              maxWidth: '100%',
              alignItems: 'stretch',
              justifyContent: 'center',
            }}>
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      background: info.color,
                      boxShadow: '0 4px 24px 0 rgba(102,126,234,0.15)',
                      border: '1.5px solid #fff',
                      color: '#fff',
                      cursor: info.link ? 'pointer' : 'default',
                      transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                      width: '100%',
                      minHeight: 170,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      '&:hover': {
                        filter: info.link ? 'brightness(1.08)' : undefined,
                        transform: info.link ? 'translateY(-5px) scale(1.03)' : 'none',
                        boxShadow: '0 8px 24px 0 rgba(118,75,162,0.18)',
                      },
                    }}
                    component={info.link ? 'a' : 'div'}
                    href={info.link || undefined}
                    style={{ textDecoration: 'none' }}
                  >
                    <Box sx={{ color: '#FFD700', mb: 1 }}>{info.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#fff' }}>
                      {info.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                      {info.content}
                    </Typography>
                    {info.link && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          mt: 1,
                          background: 'rgba(255,255,255,0.15)',
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: 'none',
                          '&:hover': {
                            background: 'rgba(255,255,255,0.25)',
                          },
                        }}
                        href={info.link}
                        target={info.link.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                      >
                        {info.action}
                      </Button>
                    )}
                  </Paper>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    Response Time
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    ⚡ Initial response within 2 hours
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📞 Free consultation call within 24 hours
                  </Typography>
                  <Typography variant="body1">
                    📋 Detailed proposal within 3-5 business days
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
