'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/lib/types';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, photoURL: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  updateUserProfile: (name: string, photoURL: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  googleLogin: async () => false,
  updateUserProfile: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Auth state from localStorage and verify with backend
  useEffect(() => {
    async function initAuth() {
      try {
        const savedToken = localStorage.getItem('unityaid_token');
        const savedUserStr = localStorage.getItem('unityaid_user');

        if (savedToken && savedUserStr) {
          const parsedUser = JSON.parse(savedUserStr);
          setUser(parsedUser);
          setToken(savedToken);

          // Verify token validity with backend
          try {
            const verifiedUser = await api.get<User>('/auth/me');
            setUser(verifiedUser);
            localStorage.setItem('unityaid_user', JSON.stringify(verifiedUser));
          } catch (err) {
            // Token expired or invalid
            console.warn('Session expired, logging out');
            localStorage.removeItem('unityaid_token');
            localStorage.removeItem('unityaid_user');
            setUser(null);
            setToken(null);
          }
        }
      } catch (e) {
        console.error('Error restoring session:', e);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('unityaid_token', res.token);
      localStorage.setItem('unityaid_user', JSON.stringify(res.user));
      toast.success(res.message || 'Welcome back!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const register = async (name: string, email: string, photoURL: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post<AuthResponse>('/auth/register', { name, email, photoURL, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('unityaid_token', res.token);
      localStorage.setItem('unityaid_user', JSON.stringify(res.user));
      toast.success(res.message || 'Account created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  // Real Google Sign-in with Google Identity Services (OAuth 2.0)
  const googleLogin = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '987371447787-v2posuctid61ijjqndmgoq35215qoqc6.apps.googleusercontent.com';

      // Check if Google Identity script is loaded
      const google = typeof window !== 'undefined' ? (window as any).google : null;
      if (!google || !google.accounts || !google.accounts.oauth2) {
        toast.error('Google service is loading. Please try again in 2 seconds.');
        resolve(false);
        return;
      }

      try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.error('Google OAuth error:', tokenResponse);
              if (tokenResponse.error === 'popup_closed_by_user') {
                toast.error('Google sign-in popup was closed');
              } else {
                toast.error(tokenResponse.error_description || 'Google sign-in failed');
              }
              resolve(false);
              return;
            }

            try {
              // Fetch user profile from Google UserInfo endpoint
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!userInfoRes.ok) {
                throw new Error('Failed to fetch profile from Google');
              }

              const profile = await userInfoRes.json();

              // Send authenticated profile to backend API
              const res = await api.post<AuthResponse>('/auth/google', {
                name: profile.name,
                email: profile.email,
                photoURL: profile.picture || '/images/common/default-avatar.jpg',
              });

              setUser(res.user);
              setToken(res.token);
              localStorage.setItem('unityaid_token', res.token);
              localStorage.setItem('unityaid_user', JSON.stringify(res.user));
              toast.success(`Welcome, ${res.user.name}!`);
              resolve(true);
            } catch (err: any) {
              console.error('Auth sync error:', err);
              toast.error(err.message || 'Failed to sync Google user with server');
              resolve(false);
            }
          },
          error_callback: (err: any) => {
            console.error('Google token error:', err);
            toast.error(err.message || 'Google sign-in prompt closed');
            resolve(false);
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        console.error('Google init error:', err);
        toast.error(err.message || 'Google sign-in initialization failed');
        resolve(false);
      }
    });
  };

  const updateUserProfile = async (name: string, photoURL: string): Promise<boolean> => {
    try {
      const res = await api.patch<{ message: string; user: User }>('/auth/profile', { name, photoURL });
      setUser(res.user);
      localStorage.setItem('unityaid_user', JSON.stringify(res.user));
      toast.success(res.message || 'Profile updated successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('unityaid_token');
    localStorage.removeItem('unityaid_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

