import axios from 'axios';

export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export const blogAPI = {
  getBlogs: () => api.get('/blog'),
  getAllBlogs: (token: string) => api.get('/blog/all', { headers: { Authorization: `Bearer ${token}` } }),
  getBlog: (id: string) => api.get(`/blog/${id}`),
  createBlog: (data: any, token: string) => api.post('/blog', data, { headers: { Authorization: `Bearer ${token}` } }),
  updateBlog: (id: string, data: any, token: string) => api.put(`/blog/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  deleteBlog: (id: string, token: string) => api.delete(`/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

export const adminAPI = {
  updateProfile: (data: { name: string; email: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return api.put('/admin/profile', data, { headers: { Authorization: `Bearer ${token}` } });
  },
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return api.put('/admin/change-password', data, { headers: { Authorization: `Bearer ${token}` } });
  },
};


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(new Error(error.response?.data?.message || error.message || 'API request failed'));
  }
);

export const contactAPI = {
  submitContact: (data: any) => api.post('/contact', data),
  getContacts: (token: string) => api.get('/contact', { headers: { Authorization: `Bearer ${token}` } }),
  updateContactStatus: (id: string, status: string, token: string) => api.patch(`/contact/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } }),
};

export const servicesAPI = {
  getServices: () => api.get('/services'),
  getService: (id: string) => api.get(`/services/${id}`),
  seedServices: () => api.post('/services/seed'),
  createService: (data: any, token: string) => api.post('/services', data, { headers: { Authorization: `Bearer ${token}` } }),
  updateService: (id: string, data: any, token: string) => api.put(`/services/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  deleteService: (id: string, token: string) => api.delete(`/services/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

export const testimonialsAPI = {
  getTestimonials: () => api.get('/testimonials'),
  getAllTestimonials: (token: string) => api.get('/testimonials/all', { headers: { Authorization: `Bearer ${token}` } }),
  createTestimonial: (data: any, token: string) => api.post('/testimonials', data, { headers: { Authorization: `Bearer ${token}` } }),
  updateTestimonial: (id: string, data: any, token: string) => api.put(`/testimonials/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  deleteTestimonial: (id: string, token: string) => api.delete(`/testimonials/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;
