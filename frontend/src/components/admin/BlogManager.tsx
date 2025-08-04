
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Tooltip, Switch, FormControlLabel, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { blogAPI } from '../../services/api';
import { Blog } from '../../types';

const emptyBlog: Partial<Blog> = {
  title: '',
  summary: '',
  content: '',
  image: '',
  client: '',
  technologies: [],
  isActive: true,
};

const BlogManager: React.FC = () => {
  const token = localStorage.getItem('adminToken') || '';
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState<Partial<Blog>>(emptyBlog);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await blogAPI.getAllBlogs(token);
      setBlogs(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, []);

  const handleDialogOpen = (blog?: Blog) => {
    if (blog) {
      setEditMode(true);
      setCurrent({ ...blog });
    } else {
      setEditMode(false);
      setCurrent(emptyBlog);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrent(emptyBlog);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent((prev) => ({ ...prev, technologies: e.target.value.split(',').map(t => t.trim()) }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        ...current,
        technologies: current.technologies || [],
        isActive: typeof current.isActive === 'boolean' ? current.isActive : true,
      };
      if (editMode && current._id) {
        await blogAPI.updateBlog(current._id, payload, token);
      } else {
        await blogAPI.createBlog(payload, token);
      }
      await fetchBlogs();
      handleDialogClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      setLoading(true);
      setError(null);
      await blogAPI.deleteBlog(id, token);
      await fetchBlogs();
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog');
    } finally {
      setLoading(false);
    }
  };

  let content;
  if (loading) {
    content = <Typography>Loading...</Typography>;
  } else if (blogs.length === 0) {
    content = <Typography>No blog posts found.</Typography>;
  } else {
    content = (
      <Stack spacing={2}>
        {blogs.map((b) => (
          <Box key={b._id} display="flex" alignItems="center" justifyContent="space-between" p={1} borderRadius={1} sx={{ bgcolor: '#f7f7fa' }}>
            <Box>
              <Typography fontWeight={600}>{b.title}</Typography>
              <Typography variant="body2" color="text.secondary">{b.summary}</Typography>
              {b.client && <Typography variant="caption" color="text.secondary">Client: {b.client}</Typography>}
              {b.technologies && b.technologies.length > 0 && <Typography variant="caption" color="text.secondary">Technologies: {b.technologies.join(', ')}</Typography>}
              <Chip label={b.isActive ? 'Active' : 'Inactive'} size="small" color={b.isActive ? 'success' : 'default'} sx={{ ml: 1, mt: 0.5 }} />
            </Box>
            <Box>
              <Tooltip title="Edit"><IconButton onClick={() => handleDialogOpen(b)}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(b._id)}><DeleteIcon /></IconButton></Tooltip>
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
          Blog
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => handleDialogOpen()}>
          Add New
        </Button>
      </Box>
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" mb={2}>Blog Posts</Typography>
        {content}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" name="title" value={current.title || ''} onChange={handleChange} fullWidth required />
            <TextField label="Summary" name="summary" value={current.summary || ''} onChange={handleChange} fullWidth multiline minRows={2} required />
            <TextField label="Content" name="content" value={current.content || ''} onChange={handleChange} fullWidth multiline minRows={4} required />
            <TextField label="Image URL" name="image" value={current.image || ''} onChange={handleChange} fullWidth />
            <TextField label="Client" name="client" value={current.client || ''} onChange={handleChange} fullWidth />
            <TextField label="Technologies (comma separated)" name="technologies" value={Array.isArray(current.technologies) ? current.technologies.join(', ') : ''} onChange={handleTechChange} fullWidth />
            <FormControlLabel
              control={<Switch checked={!!current.isActive} onChange={e => setCurrent(prev => ({ ...prev, isActive: e.target.checked }))} />}
              label={current.isActive ? 'Active' : 'Inactive'}
            />
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

export default BlogManager;
