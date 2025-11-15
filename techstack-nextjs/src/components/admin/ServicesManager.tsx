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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { servicesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Service } from '../../types';

interface ServiceFormData {
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  icon: string;
  price: {
    startingPrice: number;
    currency: string;
  };
  isActive: boolean;
}

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token } = useAuth();

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    features: [],
    technologies: [],
    icon: '',
    price: {
      startingPrice: 0,
      currency: 'USD',
    },
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await servicesAPI.getServices();
      if (response.success) {
        setServices(response.data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        features: service.features || [],
        technologies: service.technologies || [],
        icon: service.icon,
        price: service.price || { startingPrice: 0, currency: 'USD' },
        isActive: service.isActive,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        features: [],
        technologies: [],
        icon: '',
        price: {
          startingPrice: 0,
          currency: 'USD',
        },
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
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
      const serviceData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        technologies: formData.technologies.filter(t => t.trim() !== ''),
      };

      let response;
      if (editingService) {
        response = await fetch(`/api/services/${editingService._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      } else {
        response = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(editingService ? 'Service updated successfully!' : 'Service created successfully!');
        handleCloseDialog();
        fetchServices();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to save service');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!token || !confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Service deleted successfully!');
        fetchServices();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to delete service');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleTechnologyChange = (index: number, value: string) => {
    const newTechnologies = [...formData.technologies];
    newTechnologies[index] = value;
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const handleAddTechnology = () => {
    setFormData({ ...formData, technologies: [...formData.technologies, ''] });
  };

  const handleRemoveTechnology = (index: number) => {
    const newTechnologies = formData.technologies.filter((_, i) => i !== index);
    setFormData({ ...formData, technologies: newTechnologies });
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
          Services Management
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
          Add Service
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
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Technologies</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BuildIcon color="primary" />
                    <Typography variant="body2" fontWeight="medium">
                      {service.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {service.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {service.technologies?.slice(0, 3).map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {service.technologies && service.technologies.length > 3 && (
                      <Chip
                        label={`+${service.technologies.length - 3}`}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    ${service.price?.startingPrice || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={service.isActive ? 'Active' : 'Inactive'}
                    color={service.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(service)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(service._id)}
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

      {/* Service Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
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
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., mobile, web, fullstack"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              required
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />
            <TextField
              fullWidth
              label="Starting Price"
              type="number"
              value={formData.price.startingPrice}
              onChange={(e) => setFormData({
                ...formData,
                price: { ...formData.price, startingPrice: Number(e.target.value) }
              })}
            />
            <TextField
              fullWidth
              label="Currency"
              value={formData.price.currency}
              onChange={(e) => setFormData({
                ...formData,
                price: { ...formData.price, currency: e.target.value }
              })}
            />

            {/* Features */}
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <Typography variant="h6" gutterBottom>
                Features
              </Typography>
              {formData.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter feature"
                  />
                  <Button
                    color="error"
                    onClick={() => handleRemoveFeature(index)}
                    size="small"
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddFeature}
                size="small"
                startIcon={<AddIcon />}
              >
                Add Feature
              </Button>
            </Box>

            {/* Technologies */}
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <Typography variant="h6" gutterBottom>
                Technologies
              </Typography>
              {formData.technologies.map((tech, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={tech}
                    onChange={(e) => handleTechnologyChange(index, e.target.value)}
                    placeholder="Enter technology"
                  />
                  <Button
                    color="error"
                    onClick={() => handleRemoveTechnology(index)}
                    size="small"
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddTechnology}
                size="small"
                startIcon={<CodeIcon />}
              >
                Add Technology
              </Button>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Active"
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !formData.title || !formData.description}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesManager;
