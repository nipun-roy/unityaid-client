'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { EventItem } from '@/lib/types';
import EventCard from '@/components/EventCard';
import EventSkeleton from '@/components/EventSkeleton';
import StatSection from '@/components/StatSection';
import { 
  HeartHandshake, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Globe2, 
  Users, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Fetch 6 recent upcoming events from backend using .limit(6)
  useEffect(() => {
    async function loadRecentEvents() {
      try {
        setLoading(true);
        // Note: the backend uses MongoDB's .limit() operator when ?limit=6 is passed
        const data = await api.get<EventItem[]>('/events?limit=6');
        setEvents(data || []);
      } catch (error) {
        console.error('Failed to load recent events:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecentEvents();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to UnityAid monthly impact newsletter!');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-500/10 via-base-100 to-base-100 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, Subtitle & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs sm:text-sm font-semibold border border-green-500/20">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span>Empowering Grassroots Social Welfare in Bangladesh</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-base-content tracking-tight leading-[1.15]">
                Turn Compassion Into <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                  Collective Action
                </span>
              </h1>

              <p className="text-base sm:text-lg text-base-content/75 max-w-2xl leading-relaxed">
                Connect with local neighborhood changemakers. Join winter clothing drives in Mirpur, tree plantations in Uttara, and emergency relief missions across your community with zero barriers.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/events"
                  className="w-full sm:w-auto btn bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-600/25 px-8 h-12 rounded-xl text-base font-bold flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Explore Upcoming Events
                </Link>

                <Link
                  href="/events/create"
                  className="w-full sm:w-auto btn btn-outline border-base-300 hover:border-green-600 hover:bg-base-200 text-base-content px-8 h-12 rounded-xl text-base font-semibold"
                >
                  Host an Event
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-base-content/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>100% Free Volunteer Registration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Real-time Local Attendance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Verified Civic Organizers</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Hero Grid */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-base-100 ring-1 ring-base-300">
                  <img
                    src="/images/common/hero-volunteer.jpg"
                    alt="Volunteers distributing relief in community"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-6 bg-base-100 border border-base-200 p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-xs animate-bounce-subtle">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">Active Campaign</p>
                    <p className="text-sm font-extrabold text-base-content line-clamp-1">Winter Clothes Drive</p>
                    <p className="text-xs text-base-content/60">Mirpur 10 • 28 joined</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatSection />

      {/* 3. PLATFORM FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="badge badge-outline badge-primary font-bold text-xs uppercase tracking-widest px-3 py-1">
            Why UnityAid
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Built For Grassroots Social Transformation
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            A reliable, transparent ecosystem engineered to simplify how community leaders organize and volunteers mobilize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-base-200/50 border border-base-200 hover:border-green-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-base-content mb-2">Hyper-Local Discovery</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Locate winter blanket drives, neighborhood cleanups, and blood donation camps happening right in your ward or upazila.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-base-200/50 border border-base-200 hover:border-green-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-base-content mb-2">Verified Accountability</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Every event is tied to an authenticated organizer email, ensuring genuine causes and safe community gatherings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-base-200/50 border border-base-200 hover:border-green-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-base-content mb-2">One-Click Participation</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Volunteers can RSVP instantly, track their upcoming social activities, and sync dates to their digital calendars.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-base-200/50 border border-base-200 hover:border-green-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-base-content mb-2">Host Dashboard</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Community hosts can monitor live headcount, update event itineraries, and manage logistics effortlessly.
            </p>
          </div>

        </div>
      </section>

      {/* 4. RECENT UPCOMING EVENTS SECTION (Using MongoDB .limit() operator) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Upcoming Drives</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
              Recent Upcoming Events
            </h2>
            <p className="text-sm sm:text-base text-base-content/70 mt-1">
              Top 6 upcoming community initiatives waiting for your support.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-bold text-sm text-green-600 hover:text-green-700 transition-colors group"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Cards on 2 or 3 Column Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-base-200/50 rounded-3xl border border-dashed border-base-300 p-8">
            <HeartHandshake className="w-12 h-12 mx-auto text-base-content/40 mb-3" />
            <h3 className="text-lg font-bold text-base-content">No Upcoming Events Found</h3>
            <p className="text-sm text-base-content/60 max-w-sm mx-auto mt-1 mb-4">
              Be the first community leader to host a social development event in your area!
            </p>
            <Link href="/events/create" className="btn btn-sm bg-green-600 text-white border-none">
              Create an Event
            </Link>
          </div>
        )}
      </section>

      {/* 5. STATIC GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="badge badge-outline badge-primary font-bold text-xs uppercase tracking-widest px-3 py-1">
            Photo Highlights
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Moments of Empathy & Impact
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            Real snapshots from previous voluntary initiatives organized by our passionate members across the country.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="group relative rounded-2xl overflow-hidden aspect-square bg-base-300 shadow-md">
            <img
              src="/images/events/winter-clothes.jpg"
              alt="Winter clothes collection drive"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white text-xs">
              <span className="font-bold text-sm">Winter Clothes Pack</span>
              <span className="text-white/80">Mirpur, Dhaka</span>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden aspect-square bg-base-300 shadow-md">
            <img
              src="/images/events/river-cleanup.jpg"
              alt="River cleanup team"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white text-xs">
              <span className="font-bold text-sm">Riverbank Cleanup</span>
              <span className="text-white/80">Buriganga, Sadarghat</span>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden aspect-square bg-base-300 shadow-md">
            <img
              src="/images/events/tree-plantation.jpg"
              alt="Youth planting trees"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white text-xs">
              <span className="font-bold text-sm">500 Tree Plantation</span>
              <span className="text-white/80">Uttara Sector 4, Dhaka</span>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden aspect-square bg-base-300 shadow-md">
            <img
              src="/images/events/flood-relief.jpg"
              alt="Relief food packages"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white text-xs">
              <span className="font-bold text-sm">Emergency Food Kits</span>
              <span className="text-white/80">Sunamganj Relief</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Stay Informed On Community Causes
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              Subscribe to our weekly social impact digest. Receive notifications for urgent winter relief drives, tree planting campaigns, and volunteer meets near you.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="input h-12 w-full rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="submit"
                className="btn h-12 bg-gray-950 hover:bg-black text-white border-none rounded-xl px-6 font-bold shrink-0"
              >
                Subscribe
              </button>
            </form>

            <p className="text-xs text-white/70">
              No spam guaranteed. You can unsubscribe anytime with a single click.
            </p>
          </div>

          {/* Background Decorative Circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-black/10 blur-2xl"></div>
        </div>
      </section>

    </div>
  );
}

