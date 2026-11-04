'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { EventItem } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  MapPin, 
  Users, 
  UserCheck, 
  Share2, 
  ArrowLeft, 
  Clock, 
  Mail, 
  CheckCircle, 
  HeartHandshake,
  CalendarPlus
} from 'lucide-react';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadEventData() {
      try {
        setLoading(true);
        const data = await api.get<EventItem>(`/events/${id}`);
        setEvent(data);

        // If user is logged in, check if they already joined
        if (user) {
          try {
            const check = await api.get<{ hasJoined: boolean }>(`/joined-events/check/${id}`);
            setHasJoined(check.hasJoined);
          } catch {
            // ignore
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    }

    loadEventData();
  }, [id, user]);

  const handleJoinEvent = async () => {
    // If not logged in, redirect to login
    if (!user) {
      toast.error('Please login to join this community event');
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    if (hasJoined) {
      toast('You are already registered for this event!', { icon: 'ℹ️' });
      return;
    }

    try {
      setJoining(true);
      const res = await api.post<{ message: string }>('/joined-events', { eventId: id });
      toast.success(res.message || 'Successfully joined the event!');
      setHasJoined(true);
      if (event) {
        setEvent({
          ...event,
          attendeesCount: (event.attendeesCount || 0) + 1,
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Could not join event');
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const getGoogleCalendarUrl = () => {
    if (!event) return '#';
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description}\n\nOrganized by UnityAid community.`);
    const location = encodeURIComponent(event.location);
    // Format YYYYMMDD
    const dateFormatted = event.eventDate.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}/${dateFormatted}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-40 bg-base-300 rounded-lg"></div>
        <div className="h-96 w-full bg-base-300 rounded-3xl"></div>
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-base-300 rounded"></div>
          <div className="h-4 w-full bg-base-300 rounded"></div>
          <div className="h-4 w-5/6 bg-base-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-base-content">Event Not Found</h2>
        <p className="text-sm text-base-content/70">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link href="/events" className="btn btn-sm bg-green-600 text-white">
          Back to Upcoming Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      
      {/* Back Link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/70 hover:text-green-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Upcoming Events</span>
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (2 Cols): Image & Deep Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-base-300 shadow-lg border border-base-200">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="badge badge-success text-white font-bold px-3 py-1.5 text-xs uppercase tracking-wider shadow">
                {event.eventType}
              </span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-green-600 shrink-0" />
                <span>
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-base-200/50 rounded-2xl p-6 border border-base-200 space-y-3">
            <h3 className="font-bold text-lg text-base-content">About This Initiative</h3>
            <p className="text-base-content/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Organizer Card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-base-100 border border-base-200">
            <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold text-lg shrink-0">
              {event.creatorName ? event.creatorName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider font-semibold text-base-content/60">Organized By</p>
              <p className="font-bold text-base-content truncate">{event.creatorName || 'Community Member'}</p>
              <p className="text-xs text-base-content/60 truncate flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-base-content/40" />
                {event.creatorEmail}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-base-100 border border-base-200 rounded-3xl p-6 shadow-xl space-y-6 sticky top-24">
            
            <div className="space-y-2 text-center pb-4 border-b border-base-200">
              <p className="text-xs uppercase tracking-wider font-bold text-green-600">Volunteer Registration</p>
              <div className="flex items-center justify-center gap-2 text-2xl font-black text-base-content">
                <Users className="w-6 h-6 text-green-600" />
                <span>{event.attendeesCount || 0} Volunteers</span>
              </div>
              <p className="text-xs text-base-content/60">Confirmed to participate</p>
            </div>

            {/* Join Event Button */}
            <div>
              {hasJoined ? (
                <div className="w-full py-3.5 px-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 font-bold text-sm flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>You Are Registered!</span>
                </div>
              ) : (
                <button
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="w-full btn bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-600/30 h-12 rounded-xl text-base font-bold flex items-center justify-center gap-2"
                >
                  <HeartHandshake className="w-5 h-5" />
                  <span>{joining ? 'Registering...' : 'Join Event'}</span>
                </button>
              )}
              
              {!user && (
                <p className="text-[11px] text-center text-base-content/60 mt-2">
                  * You will be prompted to log in before registering.
                </p>
              )}
            </div>

            {/* Action Tools */}
            <div className="space-y-2 pt-2 border-t border-base-200">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn btn-sm btn-ghost hover:bg-base-200 text-base-content justify-start gap-2.5 font-medium rounded-xl"
              >
                <CalendarPlus className="w-4 h-4 text-blue-500" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                onClick={handleShare}
                type="button"
                className="w-full btn btn-sm btn-ghost hover:bg-base-200 text-base-content justify-start gap-2.5 font-medium rounded-xl"
              >
                <Share2 className="w-4 h-4 text-emerald-500" />
                <span>Share With Friends</span>
              </button>
            </div>

            {/* Quick Summary Box */}
            <div className="bg-base-200/60 rounded-2xl p-4 text-xs text-base-content/75 space-y-2">
              <p className="font-semibold text-base-content">Volunteer Instructions:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Arrive 15 minutes before the stated gathering time.</li>
                <li>Wear comfortable clothes and footwear.</li>
                <li>Hydration and protective gloves will be provided on-site.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

