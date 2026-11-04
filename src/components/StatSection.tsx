'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { HeartHandshake, CalendarCheck, Users, MapPin } from 'lucide-react';

export default function StatSection() {
  const [stats, setStats] = useState({
    totalEvents: 18,
    totalJoined: 142,
    totalVolunteers: 320,
    impactCities: 12,
  });

  useEffect(() => {
    api.get<any>('/stats')
      .then((data) => {
        if (data && data.totalEvents) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 bg-base-100 border-y border-base-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.totalEvents}+</p>
            <p className="text-xs sm:text-sm text-base-content/60 font-medium mt-1">Community Drives</p>
          </div>

          <div className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.totalVolunteers}+</p>
            <p className="text-xs sm:text-sm text-base-content/60 font-medium mt-1">Active Volunteers</p>
          </div>

          <div className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.totalJoined}+</p>
            <p className="text-xs sm:text-sm text-base-content/60 font-medium mt-1">Joined Acts of Kindness</p>
          </div>

          <div className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.impactCities}+</p>
            <p className="text-xs sm:text-sm text-base-content/60 font-medium mt-1">Local Districts</p>
          </div>

        </div>
      </div>
    </section>
  );
}

