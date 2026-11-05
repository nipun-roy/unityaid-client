'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import { PlusCircle, Calendar, MapPin, Image as ImageIcon, Tag, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const EVENT_TYPES = ['Donation', 'Cleanup', 'Plantation', 'Healthcare', 'Education', 'Other'];

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Donation',
    thumbnail: '',
    location: '',
    eventDate: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Minimum date must be tomorrow or today
  const todayStr = new Date().toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter a location');
      return;
    }
    if (!formData.thumbnail.trim()) {
      toast.error('Please provide a thumbnail image URL');
      return;
    }
    if (!formData.eventDate) {
      toast.error('Please select an event date');
      return;
    }

    // Strict future date validation according to assignment requirement
    if (formData.eventDate < todayStr) {
      toast.error('Event date must be in the future. Past dates are not allowed.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please provide an event description');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post<{ message: string; event: any }>('/events', formData);
      toast.success(res.message || 'Event created successfully!');
      router.push('/events');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
        
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/70 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" />
            <span>Civic Initiative</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Host a Social Development Event
          </h1>
          <p className="text-sm text-base-content/70">
            Publish a community drive, recruit fellow citizens, and lead humanitarian change in your neighborhood.
          </p>
        </div>

        {/* Create Form */}
        <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span>Event Title *</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                value={formData.title}
                onChange={handleChange}
                required
                className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Event Type & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Event Type Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-base-content flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span>Event Type *</span>
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="select select-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date (Must be in future) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-base-content flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>Event Date (Future Only) *</span>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  min={todayStr}
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Location / Gathering Point *</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Mohammadpur Town Hall Market, Dhaka"
                value={formData.location}
                onChange={handleChange}
                required
                className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>Thumbnail Image URL *</span>
              </label>
              <input
                type="text"
                name="thumbnail"
                placeholder="e.g. /images/events/winter-clothes.jpg or https://..."
                value={formData.thumbnail}
                onChange={handleChange}
                required
                className="input input-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-[11px] text-base-content/60">
                Provide a local image path (e.g. /images/events/...) or direct image URL.
              </p>
            </div>

            {/* Image Preview if provided */}
            {formData.thumbnail && (
              <div className="rounded-2xl overflow-hidden border border-base-200 aspect-video max-h-48 bg-base-200">
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content">
                Event Description & Volunteer Itinerary *
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the mission, items to distribute, required materials, assembly spot, and safety guidelines..."
                value={formData.description}
                onChange={handleChange}
                required
                className="textarea textarea-bordered w-full rounded-xl bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 leading-relaxed"
              ></textarea>
            </div>

            {/* Creator Email Notice */}
            <div className="p-3.5 rounded-xl bg-base-200/60 text-xs text-base-content/70">
              Posting as: <strong className="text-base-content">{user?.name}</strong> ({user?.email})
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn bg-green-600 hover:bg-green-700 text-white border-none h-12 rounded-xl text-base font-bold shadow-md shadow-green-600/25"
            >
              {submitting ? 'Publishing Event...' : 'Publish Event'}
            </button>
          </form>
        </div>

      </div>
    </ProtectedRoute>
  );
}

