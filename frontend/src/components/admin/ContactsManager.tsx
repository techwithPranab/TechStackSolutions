
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Tooltip, Chip, TextField, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { contactAPI } from '../../services/api';
import { Contact } from '../../types';
import EditIcon from '@mui/icons-material/Edit';

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  pending: 'warning',
  reviewed: 'primary',
  resolved: 'success',
  spam: 'error',
};

const ContactsManager: React.FC = () => {
  const token = localStorage.getItem('adminToken') || '';
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [current, setCurrent] = useState<Contact | null>(null);
  const [status, setStatus] = useState('');
  const statusOptions = [
    'pending',
    'reviewed',
    'resolved',
    'spam',
  ];

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await contactAPI.getContacts(token);
      setContacts(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line
  }, []);

  const handleDialogOpen = (contact: Contact) => {
    setCurrent(contact);
    setStatus(contact.status);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrent(null);
    setStatus('');
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setStatus(e.target.value);
  };

  const handleStatusUpdate = async () => {
    if (!current) return;
    try {
      setLoading(true);
      setError(null);
      await contactAPI.updateContactStatus(current._id, status, token);
      await fetchContacts();
      handleDialogClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  let content;
  if (loading) {
    content = <Typography>Loading...</Typography>;
  } else if (contacts.length === 0) {
    content = <Typography>No contacts found.</Typography>;
  } else {
    content = (
      <Stack spacing={2}>
        {contacts.map((c) => (
          <Box key={c._id} display="flex" alignItems="center" justifyContent="space-between" p={1} borderRadius={1} sx={{ bgcolor: '#f7f7fa' }}>
            <Box>
              <Typography fontWeight={600}>{c.name} <Typography component="span" variant="caption" color="text.secondary">({c.email}{c.company ? `, ${c.company}` : ''})</Typography></Typography>
              <Typography variant="body2" color="text.secondary">{c.message}</Typography>
              <Typography variant="caption" color="text.secondary">Project: {c.projectType} | Budget: {c.budget || '-'} | Timeline: {c.timeline || '-'}</Typography><br/>
              <Chip label={c.status} color={statusColors[c.status] || 'default'} size="small" sx={{ mt: 1 }} />
            </Box>
            <Box>
              <Tooltip title="View & Update Status"><IconButton onClick={() => handleDialogOpen(c)}><EditIcon /></IconButton></Tooltip>
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
          Manage Contacts
        </Typography>
      </Box>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" mb={2}>Contact Submissions</Typography>
        {content}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Details & Status</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {current && (
            <Stack spacing={2} mt={1}>
              <TextField label="Name" value={current.name} fullWidth inputProps={{ readOnly: true } as any} />
              <TextField label="Email" value={current.email} fullWidth inputProps={{ readOnly: true } as any} />
              <TextField label="Company" value={current.company || ''} fullWidth inputProps={{ readOnly: true } as any} />
              <TextField label="Phone" value={current.phone || ''} fullWidth inputProps={{ readOnly: true } as any} />
              <TextField label="Project Type" value={current.projectType} fullWidth inputProps={{ readOnly: true } as any} />
              <TextField label="Budget" value={current.budget || ''} fullWidth inputProps={{ readOnly: true } as any} />
              <TextField label="Timeline" value={current.timeline || ''} fullWidth inputProps={{ readOnly: true } as any} />
              <TextField label="Message" value={current.message} fullWidth multiline minRows={2} inputProps={{ readOnly: true } as any} />
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" color="primary">Update Status</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactsManager;
