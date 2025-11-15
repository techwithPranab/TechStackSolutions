'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Rating,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import ImageUpload from '../common/ImageUpload';
import { testimonialsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Testimonial } from '../../types';

interface TestimonialFormData {
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  imagePublicId?: string;
  isActive: boolean;
}

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token } = useAuth();

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    image: '',
    imagePublicId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await testimonialsAPI.getTestimonials();
      if (response.success) {
        setTestimonials(response.data);
      } else {
        setError('Failed to fetch testimonials');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        position: testimonial.position,
        company: testimonial.company,
        content: testimonial.content,
        rating: testimonial.rating,
        image: testimonial.image,
        imagePublicId: (testimonial as any).imagePublicId || '',
        isActive: testimonial.isActive,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        image: '',
        imagePublicId: '',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTestimonial(null);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const testimonialData = { ...formData };

      let response;
      if (editingTestimonial) {
        response = await fetch(`/api/testimonials/${editingTestimonial._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(testimonialData),
        });
      } else {
        response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(testimonialData),
        });
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(editingTestimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
        handleCloseDialog();
        fetchTestimonials();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to save testimonial');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!token || !confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Testimonial deleted successfully!');
        fetchTestimonials();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to delete testimonial');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete testimonial');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Testimonials Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
            },
          }}
        >
          Add Testimonial
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Message</strong></TableCell>
              <TableCell><strong>Rating</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{ width: 40, height: 40 }}
                    >
                      {testimonial.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.position} at {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {testimonial.content}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={testimonial.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({testimonial.rating})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={testimonial.isActive ? 'Active' : 'Inactive'}
                    color={testimonial.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(testimonial)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(testimonial._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Testimonial Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mt: 1
          }}>
            <TextField
              fullWidth
              label="Client Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <Typography variant="body2" gutterBottom>
                Rating
              </Typography>
              <Rating
                value={formData.rating}
                onChange={(_, newValue) => setFormData({ ...formData, rating: newValue || 5 })}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              label="Testimonial Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              multiline
              rows={4}
              required
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <Typography variant="body2" gutterBottom>
                Client Image
              </Typography>
              <ImageUpload
                currentImage={formData.image}
                onImageUploaded={(imageUrl, publicId) => {
                  setFormData({ 
                    ...formData, 
                    image: imageUrl,
                    imagePublicId: publicId 
                  });
                }}
                onImageRemoved={() => {
                  setFormData({ 
                    ...formData, 
                    image: '',
                    imagePublicId: '' 
                  });
                }}
                type="testimonial"
                maxSize={2}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !formData.name || !formData.position || !formData.company || !formData.content}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestimonialsManager;
