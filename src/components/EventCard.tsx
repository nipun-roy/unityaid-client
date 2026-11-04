'use client';

import React from 'react';
import Link from 'next/link';
import { EventItem } from '@/lib/types';
import { Calendar, MapPin, Users, ArrowRight, Tag } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  // Format readable date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Badge color based on category
  const getBadgeClass = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cleanup':
        return 'badge-info text-white';
      case 'plantation':
        return 'badge-success text-white';
      case 'donation':
        return 'badge-warning text-gray-900';
      case 'healthcare':
        return 'badge-error text-white';
      case 'education':
        return 'badge-primary text-white';
      default:
        return 'badge-neutral text-white';
    }
  };

  return (
    <div className="card bg-base-100 border border-base-200 hover:border-green-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group overflow-hidden rounded-2xl">
      {/* Thumbnail */}
      <figure className="relative h-48 w-full overflow-hidden bg-base-300">
        <img
          src={event.thumbnail}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`badge ${getBadgeClass(event.eventType)} font-semibold shadow-sm px-2.5 py-1 text-xs uppercase tracking-wider`}>
            {event.eventType}
          </span>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Title */}
          <h3 className="card-title text-base sm:text-lg font-bold text-base-content line-clamp-2 group-hover:text-green-600 transition-colors">
            {event.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-base-content/70 line-clamp-2 mt-2 leading-relaxed">
            {event.description}
          </p>

          {/* Meta Info */}
          <div className="space-y-2 mt-4 pt-4 border-t border-base-200 text-xs sm:text-sm text-base-content/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-medium">{formatDate(event.eventDate)}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>

            {typeof event.attendeesCount === 'number' && (
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{event.attendeesCount} volunteers joined</span>
              </div>
            )}
          </div>
        </div>

        {/* View Event Button */}
        <div className="card-actions mt-5 pt-3 border-t border-base-200">
          <Link
            href={`/events/${event._id}`}
            className="btn btn-sm w-full bg-base-200 hover:bg-green-600 text-base-content hover:text-white border-none group/btn transition-colors rounded-xl font-semibold flex items-center justify-center gap-1.5"
          >
            <span>View Event</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

