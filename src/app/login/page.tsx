'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, LogIn, HeartHandshake, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleSignInButton from '@/components/GoogleSignInButton';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/events';
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      const success = await login(email, password);
      if (success) {
        router.push(redirectUrl);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-base-100 border border-base-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-green-600/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-base-content tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-base-content/70">
            Log in to manage community events or register for volunteer causes.
          </p>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-green-600" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="volunteer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-600" />
              <span>Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-green-600 hover:bg-green-700 text-white border-none rounded-xl h-11 text-sm font-bold shadow-md shadow-green-600/20 flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-base-200 w-full"></div>
          <span className="bg-base-100 px-3 text-xs uppercase tracking-wider text-base-content/60 font-semibold absolute">
            or continue with
          </span>
        </div>

        {/* Google Login */}
        <GoogleSignInButton redirectUrl={redirectUrl} />

        {/* Redirect to Register */}
        <p className="text-center text-xs text-base-content/70">
          Don't have an account yet?{' '}
          <Link
            href={`/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="font-bold text-green-600 hover:underline"
          >
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-green-600"></span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

