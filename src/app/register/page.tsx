'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock, Image as ImageIcon, HeartHandshake, UserPlus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/events';
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  // Live password validation checks
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasMinLength = formData.password.length >= 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Password validation according to assignment rules
    if (!hasUppercase) {
      toast.error('Password must contain at least one uppercase letter (A-Z)');
      return;
    }

    if (!hasLowercase) {
      toast.error('Password must contain at least one lowercase letter (a-z)');
      return;
    }

    if (!hasMinLength) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const success = await register(
        formData.name,
        formData.email,
        formData.photoURL || '/images/common/default-avatar.jpg',
        formData.password
      );

      if (success) {
        router.push(redirectUrl);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-base-100 border border-base-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-green-600/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-base-content tracking-tight">
            Create Volunteer Account
          </h2>
          <p className="text-xs sm:text-sm text-base-content/70">
            Join thousands of active social changemakers making a difference across Bangladesh.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-green-600" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Tanvir Ahmed"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-green-600" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="tanvir@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* photoURL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-green-600" />
              <span>Profile Photo URL</span>
            </label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://images.unsplash.com/..."
              value={formData.photoURL}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-600" />
              <span>Password *</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Password Validation Requirements Checkbox list */}
            <div className="pt-2 space-y-1 text-xs">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-green-600 font-semibold' : 'text-base-content/60'}`}>
                {hasMinLength ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                <span>At least 6 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-green-600 font-semibold' : 'text-base-content/60'}`}>
                {hasUppercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-green-600 font-semibold' : 'text-base-content/60'}`}>
                {hasLowercase ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                <span>At least one lowercase letter (a-z)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-green-600 hover:bg-green-700 text-white border-none rounded-xl h-11 text-sm font-bold shadow-md shadow-green-600/20 flex items-center justify-center gap-2 mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-xs text-base-content/70">
          Already have an account?{' '}
          <Link
            href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="font-bold text-green-600 hover:underline"
          >
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-green-600"></span>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

