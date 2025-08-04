import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { servicesAPI } from '../../services/api';
import { Service } from '../../types';
import { useAuth } from '../../contexts/AuthContext';


const emptyService: Partial<Service> = {
  title: '',
  description: '',
  features: [],
  technologies: [],
  icon: '',
  price: { startingPrice: 0, currency: 'USD' },
  isActive: true,
};

const ServicesManager: React.FC = () => {
  // Get token from localStorage for API calls
  const token = localStorage.getItem('adminToken') || '';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<Partial<Service>>(emptyService);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesAPI.getServices();
      setServices(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDialogOpen = (service?: Service) => {
    if (service) {
      setEditMode(true);
      setCurrent({ ...service });
    } else {
      setEditMode(false);
      setCurrent(emptyService);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrent(emptyService);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent((prev) => ({ ...prev, features: e.target.value.split('\n') }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent((prev) => ({ ...prev, technologies: e.target.value.split(',').map(t => t.trim()) }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        ...current,
        price: {
          startingPrice: Number(current.price?.startingPrice) || 0,
          currency: current.price?.currency || 'USD',
        },
        features: current.features || [],
        technologies: current.technologies || [],
      };
      if (editMode && current._id) {
        await servicesAPI.updateService(current._id, payload, token);
      } else {
        await servicesAPI.createService(payload, token);
      }
      await fetchServices();
      handleDialogClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      setLoading(true);
      setError(null);
      await servicesAPI.deleteService(id, token);
      await fetchServices();
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  let content;
  if (loading) {
    content = <Typography>Loading...</Typography>;
  } else if (services.length === 0) {
    content = <Typography>No services found.</Typography>;
  } else {
    content = (
      <Stack spacing={2}>
        {services.map((service) => (
          <Box key={service._id} display="flex" alignItems="center" justifyContent="space-between" p={1} borderRadius={1} sx={{ bgcolor: '#f7f7fa' }}>
            <Box>
              <Typography fontWeight={600}>{service.title}</Typography>
              <Typography variant="body2" color="text.secondary">{service.description}</Typography>
              <Typography variant="caption" color="text.secondary">Features: {service.features?.join(', ')}</Typography><br/>
              <Typography variant="caption" color="text.secondary">Technologies: {service.technologies?.join(', ')}</Typography>
              <Typography variant="caption" color="text.secondary">Price: {service.price?.startingPrice} {service.price?.currency}</Typography>
            </Box>
            <Box>
              <Tooltip title="Edit"><IconButton onClick={() => handleDialogOpen(service)}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(service._id)}><DeleteIcon /></IconButton></Tooltip>
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
          Manage Services
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => handleDialogOpen()}>
          Add Service
        </Button>
      </Box>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" mb={2}>Service List</Typography>
        {content}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" name="title" value={current.title || ''} onChange={handleChange} fullWidth required />
            <TextField label="Description" name="description" value={current.description || ''} onChange={handleChange} fullWidth multiline minRows={2} required />
            <TextField label="Features (one per line)" name="features" value={Array.isArray(current.features) ? current.features.join('\n') : ''} onChange={handleFeaturesChange} fullWidth multiline minRows={2} />
            <TextField label="Technologies (comma separated)" name="technologies" value={Array.isArray(current.technologies) ? current.technologies.join(', ') : ''} onChange={handleTechnologiesChange} fullWidth />
            <TextField label="Icon" name="icon" value={current.icon || ''} onChange={handleChange} fullWidth />
            <Box display="flex" gap={2}>
              <TextField label="Starting Price" name="startingPrice" type="number" value={current.price?.startingPrice ?? ''} onChange={e => setCurrent(prev => ({
                ...prev,
                price: {
                  startingPrice: Number(e.target.value),
                  currency: prev.price?.currency ?? 'USD',
                }
              }))} fullWidth />
              <TextField label="Currency" name="currency" value={current.price?.currency ?? 'USD'} onChange={e => setCurrent(prev => ({
                ...prev,
                price: {
                  startingPrice: prev.price?.startingPrice ?? 0,
                  currency: e.target.value,
                }
              }))} fullWidth />
            </Box>
            <Box>
              <label>
                <input type="checkbox" checked={current.isActive ?? true} onChange={e => setCurrent(prev => ({ ...prev, isActive: e.target.checked }))} /> Active
              </label>
            </Box>
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

export default ServicesManager;
