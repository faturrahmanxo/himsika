import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between h-full animate-pulse">
      <div>
        {/* Top Bar Skeleton */}
        <div className="flex items-start justify-between gap-2 mb-5">
          <div className="flex gap-2">
            <div className="w-16 h-6 bg-white/10 rounded-full"></div>
            <div className="w-20 h-6 bg-white/10 rounded-full"></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10"></div>
        </div>

        {/* Title Skeleton */}
        <div className="w-full h-7 bg-white/10 rounded-lg mb-3"></div>
        <div className="w-2/3 h-7 bg-white/10 rounded-lg mb-6"></div>

        {/* Organizer Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-4 rounded-full bg-white/10"></div>
          <div className="w-32 h-4 bg-white/10 rounded-md"></div>
        </div>

        {/* Dates Skeleton (Bento) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-2xl p-3.5 h-20 border border-white/5"></div>
          <div className="bg-white/5 rounded-2xl p-3.5 h-20 border border-white/5"></div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="w-32 h-4 bg-white/10 rounded-md"></div>
        <div className="w-8 h-8 rounded-full bg-white/10"></div>
      </div>
    </div>
  );
}
