'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/lib/types';
import { DEFAULT_EVENTS } from '@/lib/defaultEvents';
import EventCard from '@/components/EventCard';
import EventSkeleton from '@/components/EventSkeleton';
import { Search, Filter, Calendar, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Donation', 'Cleanup', 'Plantation', 'Healthcare', 'Education'];

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        setLoading(true);
        // Build query string
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const data = await api.get<EventItem[]>(`/events?${params.toString()}`);
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          let filtered = [...DEFAULT_EVENTS];
          if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(e => e.eventType.toLowerCase() === selectedCategory.toLowerCase());
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
          }
          setEvents(filtered);
        }
      } catch (error) {
        console.warn('Backend unavailable, showing default community events:', error);
        let filtered = [...DEFAULT_EVENTS];
        if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter(e => e.eventType.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
        }
        setEvents(filtered);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchUpcomingEvents();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>Community Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-base-content tracking-tight">
          Explore Upcoming Events
        </h1>
        <p className="text-sm sm:text-base text-base-content/70 max-w-2xl">
          Discover active social service drives across Dhaka and beyond. Only upcoming, verified community initiatives are listed below.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-base-200/60 border border-base-200">
        
        {/* Search Bar */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-base-content/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search by event title or location (e.g. Mirpur, Uttara)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-sm sm:input-md w-full !pl-11 rounded-xl bg-base-100 border-base-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category Filter Pills / Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-base-content/50 shrink-0 hidden sm:block" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-xs sm:btn-sm rounded-xl font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-green-600 hover:bg-green-700 text-white border-none'
                  : 'bg-base-100 hover:bg-base-300 text-base-content/80 border-base-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
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
        <div className="text-center py-20 bg-base-200/40 rounded-3xl border border-dashed border-base-300 p-8 space-y-3">
          <Sparkles className="w-12 h-12 mx-auto text-base-content/40" />
          <h3 className="text-xl font-bold text-base-content">No Matching Events Found</h3>
          <p className="text-sm text-base-content/60 max-w-md mx-auto">
            We couldn't find any upcoming drives matching "{searchQuery}" under {selectedCategory}. Try adjusting your keywords or clearing the filter!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="btn btn-sm bg-base-100 hover:bg-base-200 text-base-content border-base-300 rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

