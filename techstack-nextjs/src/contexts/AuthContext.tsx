'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { adminAPI } from '@/services/api';
import { Admin } from '@/types';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response: any = await adminAPI.getProfile(token);
      
      if (response.success) {
        setAdmin(response.data);
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response: any = await adminAPI.login({ email, password });

      if (response.success) {
        const { token, admin: adminData } = response.data;
        localStorage.setItem('adminToken', token);
        setAdmin(adminData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = useMemo(() => ({
    admin,
    isAuthenticated: !!admin,
    isLoading,
    token: typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null,
    login,
    logout,
    checkAuth,
  }), [admin, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
