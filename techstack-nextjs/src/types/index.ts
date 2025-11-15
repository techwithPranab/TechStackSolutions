export interface Blog {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  imagePublicId?: string;
  client?: string;
  technologies?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: 'mobile-app' | 'web-app' | 'full-stack' | 'consulting' | 'other';
  budget?: string;
  timeline?: string;
  message: string;
}

export interface Service {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  company: string;
  position: string;
  content: string;
  rating: number;
  image: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalProjects: number;
  totalYears: number;
  totalMobileApps: number;
  totalWebApps: number;
  email: string;
  contactNumber: string;
}

export interface Admin {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
