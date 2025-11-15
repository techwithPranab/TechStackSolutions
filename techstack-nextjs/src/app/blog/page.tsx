'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Chip, CircularProgress } from '@mui/material';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { blogAPI } from '@/services/api';
import { Blog } from '@/types';

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res: any = await blogAPI.getBlogs();
        setBlogs(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <Navigation />
      {/* Hero Section */}
      <Box sx={{ pt: 12, pb: 8, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} align="center" mb={2}>
            Success Stories
          </Typography>
          <Typography variant="h5" align="center" sx={{ opacity: 0.85 }}>
            Explore our latest projects, technical insights, and success stories in mobile and web app development.
          </Typography>
        </Container>
      </Box>

      {/* Blog List Section */}
      <Box sx={{ background: '#f8fafc', py: 8 }}>
        <Container maxWidth="md">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : blogs.length === 0 ? (
            <Typography align="center">No blog posts found.</Typography>
          ) : (
            <Box>
              {blogs.map((blog, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <Box
                    key={blog._id}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
                      alignItems: 'stretch',
                      mb: 6,
                      boxShadow: 3,
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: '#fff',
                    }}
                  >
                    {/* Blog Image */}
                    {blog.image && (
                      <Box
                        sx={{
                          flex: { xs: '0 0 220px', md: '0 0 320px' },
                          minHeight: 220,
                          background: `url(${blog.image}) center/cover no-repeat`,
                          width: { xs: '100%', md: 320 },
                        }}
                      />
                    )}
                    {/* Blog Content */}
                    <Box sx={{ flex: 1, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="h5" fontWeight={700} mb={1} color="primary.main">
                        {blog.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" mb={1}>
                        {blog.summary}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ whiteSpace: 'pre-line' }}>
                        {blog.content}
                      </Typography>
                      {blog.client && <Chip label={blog.client} size="small" sx={{ mr: 1, mb: 1 }} />}
                      {blog.technologies && blog.technologies.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1, overflowX: 'auto', mb: 1 }}>
                          {blog.technologies.map((tech, i) => (
                            <Chip
                              key={tech}
                              label={tech}
                              size="small"
                              sx={{
                                background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`,
                                color: '#fff',
                                fontWeight: 600
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default BlogPage;
