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
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import ImageUpload from '../common/ImageUpload';
import { blogAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Blog } from '../../types';

interface BlogFormData {
  title: string;
  summary: string;
  content: string;
  image: string;
  imagePublicId?: string;
  client: string;
  technologies: string[];
  isActive: boolean;
}

const BlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token } = useAuth();

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    summary: '',
    content: '',
    image: '',
    imagePublicId: '',
    client: '',
    technologies: [],
    isActive: true,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response: any = await blogAPI.getAllBlogs(token);
      if (response.success) {
        setBlogs(response.data);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        image: blog.image || '',
        imagePublicId: (blog as any).imagePublicId || '',
        client: blog.client || '',
        technologies: blog.technologies || [],
        isActive: blog.isActive,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        summary: '',
        content: '',
        image: '',
        imagePublicId: '',
        client: '',
        technologies: [],
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBlog(null);
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
      const blogData = {
        ...formData,
        technologies: formData.technologies.filter(t => t.trim() !== ''),
      };

      let response;
      if (editingBlog) {
        response = await fetch(`/api/blog/${editingBlog._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(blogData),
        });
      } else {
        response = await fetch('/api/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(blogData),
        });
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(editingBlog ? 'Blog post updated successfully!' : 'Blog post created successfully!');
        handleCloseDialog();
        fetchBlogs();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to save blog post');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!token || !confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Blog post deleted successfully!');
        fetchBlogs();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to delete blog post');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog post');
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          Blog Management
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
          Add Blog Post
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
              <TableCell><strong>Summary</strong></TableCell>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Technologies</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={blog.image}
                      alt={blog.title}
                      sx={{ width: 40, height: 40 }}
                    >
                      <ArticleIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium" sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {blog.title}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{
                    maxWidth: 250,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {blog.summary}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {blog.client || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {blog.technologies?.slice(0, 2).map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {blog.technologies && blog.technologies.length > 2 && (
                      <Chip
                        label={`+${blog.technologies.length - 2}`}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={blog.isActive ? 'Published' : 'Draft'}
                    color={blog.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(blog.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(blog)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(blog._id)}
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

      {/* Blog Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
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
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />
            <TextField
              fullWidth
              label="Summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              multiline
              rows={2}
              required
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              multiline
              rows={6}
              required
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />
            <TextField
              fullWidth
              label="Client (Optional)"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder="Client name or company"
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />

            {/* Blog Image Upload */}
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <Typography variant="h6" gutterBottom>
                Blog Featured Image
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
                type="blog"
                maxSize={5}
              />
            </Box>

            {/* Technologies */}
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <Typography variant="h6" gutterBottom>
                Technologies Used
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
              label="Published"
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
            disabled={saving || !formData.title || !formData.summary || !formData.content}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManager;
