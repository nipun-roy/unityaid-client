'use client';

import React from 'react';

export default function EventSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden animate-pulse flex flex-col h-full">
      {/* Thumbnail Skeleton */}
      <div className="h-48 w-full bg-base-300"></div>

      {/* Body Skeleton */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
        <div className="space-y-2.5">
          {/* Badge */}
          <div className="h-4 w-20 bg-base-300 rounded-full"></div>
          {/* Title */}
          <div className="h-5 w-5/6 bg-base-300 rounded"></div>
          <div className="h-5 w-3/4 bg-base-300 rounded"></div>
          {/* Description */}
          <div className="h-3 w-full bg-base-300 rounded mt-3"></div>
          <div className="h-3 w-4/5 bg-base-300 rounded"></div>
        </div>

        {/* Meta Skeleton */}
        <div className="space-y-2 pt-4 border-t border-base-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-base-300"></div>
            <div className="h-3 w-32 bg-base-300 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-base-300"></div>
            <div className="h-3 w-40 bg-base-300 rounded"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="pt-3 border-t border-base-200">
          <div className="h-9 w-full bg-base-300 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

