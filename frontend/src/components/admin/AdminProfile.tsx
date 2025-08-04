import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Stack, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';

const AdminProfile: React.FC = () => {
  const { admin, checkAuth } = useAuth();
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await adminAPI.updateProfile({ name, email });
      setSuccess('Profile updated successfully');
      await checkAuth();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    try {
      await adminAPI.changePassword({ currentPassword, newPassword });
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>Profile</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleProfileUpdate}>
          <Stack spacing={2}>
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required />
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required />
            <Button type="submit" variant="contained" disabled={loading}>Update Profile</Button>
          </Stack>
        </form>
      </Paper>
      <Typography variant="h6" fontWeight={600} mb={2}>Change Password</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handlePasswordChange}>
          <Stack spacing={2}>
            <TextField label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} fullWidth required />
            <TextField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth required />
            <TextField label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} fullWidth required />
            <Button type="submit" variant="contained" disabled={loading}>Change Password</Button>
          </Stack>
        </form>
      </Paper>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default AdminProfile;
