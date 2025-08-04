
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Tooltip, Rating, Switch, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { testimonialsAPI } from '../../services/api';
import { Testimonial } from '../../types';

const emptyTestimonial: Partial<Testimonial> = {
  name: '',
  company: '',
  position: '',
  content: '',
  rating: 5,
  image: '',
  isActive: true,
};

const TestimonialsManager: React.FC = () => {
  const token = localStorage.getItem('adminToken') || '';
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<Partial<Testimonial>>(emptyTestimonial);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await testimonialsAPI.getAllTestimonials(token);
      setTestimonials(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line
  }, []);

  const handleDialogOpen = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditMode(true);
      setCurrent({ ...testimonial });
    } else {
      setEditMode(false);
      setCurrent(emptyTestimonial);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrent(emptyTestimonial);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        ...current,
        rating: Number(current.rating) || 5,
        isActive: current.isActive ?? true,
      };
      if (editMode && current._id) {
        await testimonialsAPI.updateTestimonial(current._id, payload, token);
      } else {
        await testimonialsAPI.createTestimonial(payload, token);
      }
      await fetchTestimonials();
      handleDialogClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      setLoading(true);
      setError(null);
      await testimonialsAPI.deleteTestimonial(id, token);
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.message || 'Failed to delete testimonial');
    } finally {
      setLoading(false);
    }
  };

  let content;
  if (loading) {
    content = <Typography>Loading...</Typography>;
  } else if (testimonials.length === 0) {
    content = <Typography>No testimonials found.</Typography>;
  } else {
    content = (
      <Stack spacing={2}>
        {testimonials.map((t) => (
          <Box key={t._id} display="flex" alignItems="center" justifyContent="space-between" p={1} borderRadius={1} sx={{ bgcolor: '#f7f7fa' }}>
            <Box>
              <Typography fontWeight={600}>{t.name} <Typography component="span" variant="caption" color="text.secondary">({t.company}, {t.position})</Typography></Typography>
              <Typography variant="body2" color="text.secondary">{t.content}</Typography>
              <Rating value={t.rating} readOnly size="small" />
              <Typography variant="caption" color="text.secondary">Active: {t.isActive ? 'Yes' : 'No'}</Typography>
            </Box>
            <Box>
              <Tooltip title="Edit"><IconButton onClick={() => handleDialogOpen(t)}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(t._id)}><DeleteIcon /></IconButton></Tooltip>
            </Box>
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Manage Testimonials
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => handleDialogOpen()}>
          Add Testimonial
        </Button>
      </Box>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" mb={2}>Testimonial List</Typography>
        {content}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" name="name" value={current.name || ''} onChange={handleChange} fullWidth required />
            <TextField label="Company" name="company" value={current.company || ''} onChange={handleChange} fullWidth />
            <TextField label="Position" name="position" value={current.position || ''} onChange={handleChange} fullWidth />
            <TextField label="Content" name="content" value={current.content || ''} onChange={handleChange} fullWidth multiline minRows={2} required />
            <TextField label="Image URL" name="image" value={current.image || ''} onChange={handleChange} fullWidth />
            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating name="rating" value={Number(current.rating) || 5} onChange={(_, value) => setCurrent(prev => ({ ...prev, rating: value || 5 }))} />
            </Box>
            <FormControlLabel control={<Switch checked={current.isActive ?? true} onChange={e => setCurrent(prev => ({ ...prev, isActive: e.target.checked }))} />} label="Active" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestimonialsManager;
