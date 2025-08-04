import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

interface Stats {
  totalProjects: number;
  totalYears: number;
  totalMobileApps: number;
  totalWebApps: number;
  email: string;
  contactNumber: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setStats(res.data.data);
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
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('adminToken') || '';
      await axios.put(`${API_URL}/stats`, stats, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Stats updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update stats');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box p={3}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>Configure Hero Stats</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Projects Delivered" name="totalProjects" type="number" value={stats.totalProjects} onChange={handleChange} fullWidth />
        <TextField label="Years Experience" name="totalYears" type="number" value={stats.totalYears} onChange={handleChange} fullWidth />
        <TextField label="Mobile Apps Built" name="totalMobileApps" type="number" value={stats.totalMobileApps} onChange={handleChange} fullWidth />
        <TextField label="Web Applications" name="totalWebApps" type="number" value={stats.totalWebApps} onChange={handleChange} fullWidth />
        <TextField label="Contact Email" name="email" type="email" value={stats.email} onChange={handleChange} fullWidth />
        <TextField label="Contact Number" name="contactNumber" type="text" value={stats.contactNumber} onChange={handleChange} fullWidth />
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}
      </Box>
    </Paper>
  );
};

export default StatsManager;
