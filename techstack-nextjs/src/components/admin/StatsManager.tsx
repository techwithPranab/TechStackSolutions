'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { statsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  totalProjects: number;
  totalYears: number;
  totalMobileApps: number;
  totalWebApps: number;
  email: string;
  contactNumber: string;
}

const StatsManager: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalYears: 0,
    totalMobileApps: 0,
    totalWebApps: 0,
    email: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await statsAPI.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to fetch stats');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setStats({
      ...stats,
      [name]: type === 'number' ? Number(value) : value
    });
    // Clear messages when user starts editing
    if (success) setSuccess(null);
    if (error) setError(null);
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
      // Since we don't have statsAPI.updateStats, we'll need to implement it or use fetch directly
      const response = await fetch('/api/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stats)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Stats updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to update stats');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update stats');
    } finally {
      setSaving(false);
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
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        Configure Hero Stats
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Update the statistics displayed on your homepage hero section and contact information.
      </Typography>

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

      <Paper sx={{ p: 4 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 3 
        }}>
          <TextField
            label="Projects Delivered"
            name="totalProjects"
            type="number"
            value={stats.totalProjects}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Years Experience"
            name="totalYears"
            type="number"
            value={stats.totalYears}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Mobile Apps Built"
            name="totalMobileApps"
            type="number"
            value={stats.totalMobileApps}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Web Applications"
            name="totalWebApps"
            type="number"
            value={stats.totalWebApps}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Contact Email"
            name="email"
            type="email"
            value={stats.email}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            type="tel"
            value={stats.contactNumber}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
              },
              '&:disabled': {
                background: '#cccccc',
              },
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StatsManager;
