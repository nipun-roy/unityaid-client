'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { JoinedEventItem } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function JoinedEventsPage() {
  const [joinedEvents, setJoinedEvents] = useState<JoinedEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true);
      // Backend returns events joined by logged-in user, sorted by eventDate as required
      const data = await api.get<JoinedEventItem[]>('/joined-events');
      setJoinedEvents(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load your joined events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  const handleCancelRegistration = async (id: string) => {
    try {
      setCancellingId(id);
      const res = await api.delete<{ message: string }>(`/joined-events/${id}`);
      toast.success(res.message || 'Registration cancelled');
      setJoinedEvents(joinedEvents.filter((item) => item._id !== id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Volunteer Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            My Joined Events
          </h1>
          <p className="text-sm text-base-content/70">
            All the community initiatives you have registered to volunteer for, sorted sequentially by event date.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-base-200 rounded-2xl w-full"></div>
            ))}
          </div>
        ) : joinedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedEvents.map((item) => (
              <div
                key={item._id}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-base-300">
                    <img
                      src={item.thumbnail}
                      alt={item.eventTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-success text-white text-xs font-bold uppercase shadow">
                        {item.eventType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-base-content line-clamp-2">
                      {item.eventTitle}
                    </h3>

                    <div className="space-y-1.5 text-xs text-base-content/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600 shrink-0" />
                        <span className="font-semibold">{item.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-base-200 flex items-center justify-between gap-2 mt-4">
                  <Link
                    href={`/events/${item.eventId}`}
                    className="btn btn-xs sm:btn-sm btn-ghost text-green-600 hover:bg-green-500/10 font-bold rounded-lg flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleCancelRegistration(item._id)}
                    disabled={cancellingId === item._id}
                    className="btn btn-xs sm:btn-sm btn-ghost text-rose-500 hover:bg-rose-500/10 font-medium rounded-lg flex items-center gap-1"
                    title="Cancel your participation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{cancellingId === item._id ? 'Cancelling...' : 'Leave'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-base-200/40 rounded-3xl border border-dashed border-base-300 p-8 space-y-3">
            <Sparkles className="w-12 h-12 mx-auto text-base-content/40" />
            <h3 className="text-xl font-bold text-base-content">You Haven't Joined Any Events Yet</h3>
            <p className="text-sm text-base-content/60 max-w-md mx-auto">
              Ready to give back to the community? Browse upcoming events and join a drive near you.
            </p>
            <Link href="/events" className="btn btn-sm bg-green-600 text-white rounded-xl">
              Browse Upcoming Events
            </Link>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}

