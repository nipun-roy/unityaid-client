'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User, Mail, Image as ImageIcon, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile(name.trim(), photoURL.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
        
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Volunteer Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            My Profile & Settings
          </h1>
          <p className="text-sm text-base-content/70">
            Keep your volunteer identification and contact details up to date.
          </p>
        </div>

        <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
          
          {/* Profile Picture Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-base-200 text-center sm:text-left">
            <img
              src={photoURL || '/images/common/default-avatar.jpg'}
              alt={name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-green-600/30 shadow-md"
            />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-base-content">{user?.name}</h3>
              <p className="text-sm text-base-content/60 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-green-600" />
                <span>{user?.email}</span>
              </p>
              <span className="badge badge-success text-white text-xs font-semibold mt-1">
                Verified Volunteer
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-green-600" />
                <span>Display Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-green-600" />
                <span>Email Address (Read-only)</span>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input input-bordered w-full rounded-xl bg-base-200 text-sm text-base-content/60 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-green-600" />
                <span>Profile Photo URL</span>
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://..."
                className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn bg-green-600 hover:bg-green-700 text-white border-none rounded-xl h-11 px-6 text-sm font-bold shadow-md shadow-green-600/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
            </button>
          </form>

        </div>

      </div>
    </ProtectedRoute>
  );
}

