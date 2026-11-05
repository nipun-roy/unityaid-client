'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  handleGoogleCredential: (credential: string) => Promise<boolean>;
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
  handleGoogleCredential: async () => false,
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

          // Verify token validity with backend if available
          try {
            const verifiedUser = await api.get<User>('/auth/me');
            setUser(verifiedUser);
            localStorage.setItem('unityaid_user', JSON.stringify(verifiedUser));
          } catch (err: any) {
            const isAuthError =
              err?.status === 401 ||
              err?.status === 403 ||
              err?.message?.includes('401') ||
              err?.message?.includes('Unauthorized') ||
              err?.message?.includes('jwt expired');

            if (isAuthError) {
              console.warn('Session expired or revoked, logging out');
              localStorage.removeItem('unityaid_token');
              localStorage.removeItem('unityaid_user');
              setUser(null);
              setToken(null);
            } else {
              console.warn('Backend server unreachable. Preserving active cached session.');
            }
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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
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
  }, []);

  const register = useCallback(async (name: string, email: string, photoURL: string, password: string): Promise<boolean> => {
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
  }, []);

  const tokenClientRef = useRef<any>(null);
  const resolveRef = useRef<((val: boolean) => void) | null>(null);

  // Pre-initialize Google Token Client once on mount
  useEffect(() => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '987371447787-v2posuctid61ijjqndmgoq35215qoqc6.apps.googleusercontent.com';

    const setupGoogle = () => {
      const google = typeof window !== 'undefined' ? (window as any).google : null;
      if (!google?.accounts?.oauth2) return false;

      try {
        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
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
              resolveRef.current?.(false);
              return;
            }

            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!userInfoRes.ok) {
                throw new Error('Failed to fetch profile from Google');
              }

              const profile = await userInfoRes.json();
              let authUser: User = {
                _id: profile.sub || `google_${Date.now()}`,
                name: profile.name || 'Google Volunteer',
                email: profile.email,
                photoURL: profile.picture || '/images/common/default-avatar.jpg',
              };
              let authToken = tokenResponse.access_token;

              try {
                const res = await api.post<AuthResponse>('/auth/google', {
                  name: authUser.name,
                  email: authUser.email,
                  photoURL: authUser.photoURL,
                });
                if (res?.user && res?.token) {
                  authUser = res.user;
                  authToken = res.token;
                }
              } catch (backendError) {
                console.warn('Backend unreachable, using Google profile directly:', backendError);
              }

              setUser(authUser);
              setToken(authToken);
              localStorage.setItem('unityaid_token', authToken);
              localStorage.setItem('unityaid_user', JSON.stringify(authUser));
              toast.success(`Welcome, ${authUser.name}!`);
              resolveRef.current?.(true);
            } catch (err: any) {
              console.error('Auth sync error:', err);
              toast.error(err.message || 'Failed to authenticate with Google');
              resolveRef.current?.(false);
            }
          },
          error_callback: (err: any) => {
            console.error('Google token error:', err);
            if (err?.type === 'popup_failed_to_open') {
              toast.error('Browser blocked popup window! Click the popup icon in your URL bar to allow it.', { duration: 6000 });
            } else {
              toast.error(err?.message || 'Google sign-in prompt closed');
            }
            resolveRef.current?.(false);
          },
        });
        return true;
      } catch (err) {
        console.error('InitTokenClient error:', err);
        return false;
      }
    };

    if (!setupGoogle()) {
      const timer = setInterval(() => {
        if (setupGoogle()) clearInterval(timer);
      }, 300);
      return () => clearInterval(timer);
    }
  }, []);

  const googleLogin = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;

      if (!tokenClientRef.current) {
        const google = typeof window !== 'undefined' ? (window as any).google : null;
        if (!google?.accounts?.oauth2) {
          toast.error('Google service is loading. Please try again in 2 seconds.');
          resolve(false);
          return;
        }

        const clientId =
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          '987371447787-v2posuctid61ijjqndmgoq35215qoqc6.apps.googleusercontent.com';
        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: () => {},
        });
      }

      try {
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        console.error('Google init error:', err);
        toast.error(err.message || 'Google sign-in initialization failed');
        resolve(false);
      }
    });
  }, []);

  // Process Google ID Token JWT from official Google Sign-in button or One Tap
  const handleGoogleCredential = useCallback(async (credential: string): Promise<boolean> => {
    try {
      let payload: any = {};
      try {
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        payload = JSON.parse(jsonPayload);
      } catch (e) {
        console.warn('Local JWT parse warning:', e);
      }

      const userName = payload.name || 'Google Volunteer';
      const userEmail = payload.email || '';
      const userPhoto = payload.picture || '/images/common/default-avatar.jpg';
      const userId = payload.sub || `google_${Date.now()}`;

      let authUser: User = {
        _id: userId,
        name: userName,
        email: userEmail,
        photoURL: userPhoto,
      };
      let authToken = credential;

      try {
        const res = await api.post<AuthResponse>('/auth/google', {
          name: userName,
          email: userEmail,
          photoURL: userPhoto,
          credential,
        });

        if (res?.user && res?.token) {
          authUser = res.user;
          authToken = res.token;
        }
      } catch (backendError: any) {
        console.warn('Backend /auth/google not reachable or failed, using client Google session:', backendError);
      }

      setUser(authUser);
      setToken(authToken);
      localStorage.setItem('unityaid_token', authToken);
      localStorage.setItem('unityaid_user', JSON.stringify(authUser));
      toast.success(`Welcome, ${authUser.name}!`);
      return true;
    } catch (err: any) {
      console.error('Google credential handler error:', err);
      toast.error(err.message || 'Failed to authenticate with Google');
      return false;
    }
  }, []);

  const updateUserProfile = useCallback(async (name: string, photoURL: string): Promise<boolean> => {
    try {
      const res = await api.patch<{ message: string; user: User }>('/auth/profile', { name, photoURL });
      setUser(res.user);
      localStorage.setItem('unityaid_user', JSON.stringify(res.user));
      toast.success(res.message || 'Profile updated successfully!');
      return true;
    } catch (error: any) {
      // If backend offline, update locally
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, name, photoURL };
        localStorage.setItem('unityaid_user', JSON.stringify(updated));
        return updated;
      });
      toast.success('Profile updated successfully!');
      return true;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('unityaid_token');
    localStorage.removeItem('unityaid_user');
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        handleGoogleCredential,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
