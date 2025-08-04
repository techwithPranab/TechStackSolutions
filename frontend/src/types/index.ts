export interface Blog {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
