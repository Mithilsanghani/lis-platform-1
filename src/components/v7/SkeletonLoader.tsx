/**
 * SkeletonLoader v7.0 - Premium Loading Skeletons
 * For metrics, banners, and content cards
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

// Base shimmer animation
const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear' as const,
  },
};

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <motion.div
    className={`rounded-lg bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 
      bg-[length:200%_100%] ${className}`}
    animate={shimmer.animate}
    transition={shimmer.transition}
  />
);

export const MetricCardSkeleton: React.FC = () => (
  <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="w-11 h-11" />
      <Skeleton className="w-8 h-8" />
    </div>
    <Skeleton className="w-20 h-4 mb-2" />
    <div className="flex items-baseline gap-3 mb-3">
      <Skeleton className="w-24 h-8" />
      <Skeleton className="w-12 h-5" />
    </div>
    <Skeleton className="w-full h-12" />
  </div>
);

export const AIBannerSkeleton: React.FC = () => (
  <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50">
    <div className="flex items-center gap-4">
      <Skeleton className="w-11 h-11 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="w-48 h-5 mb-2" />
        <Skeleton className="w-32 h-4" />
      </div>
      <Skeleton className="w-24 h-9 rounded-lg" />
    </div>
  </div>
);

export const CourseCardSkeleton: React.FC = () => (
  <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="w-3/4 h-5 mb-2" />
    <Skeleton className="w-1/2 h-4 mb-4" />
    <div className="flex items-center gap-4">
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-20 h-4" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border-b border-zinc-800/50">
    <Skeleton className="w-10 h-10 rounded-full" />
    <div className="flex-1">
      <Skeleton className="w-32 h-4 mb-2" />
      <Skeleton className="w-24 h-3" />
    </div>
    <Skeleton className="w-16 h-6 rounded-full" />
    <Skeleton className="w-20 h-8 rounded-lg" />
  </div>
);

interface DashboardSkeletonProps {
  metricsCount?: number;
  bannersCount?: number;
  cardsCount?: number;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  metricsCount = 4,
  bannersCount = 3,
  cardsCount = 6,
}) => (
  <div className="space-y-6 animate-pulse">
    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: metricsCount }).map((_, i) => (
        <MetricCardSkeleton key={`metric-${i}`} />
      ))}
    </div>

    {/* AI Banners */}
    <div className="space-y-4">
      {Array.from({ length: bannersCount }).map((_, i) => (
        <AIBannerSkeleton key={`banner-${i}`} />
      ))}
    </div>

    {/* Content Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: cardsCount }).map((_, i) => (
        <CourseCardSkeleton key={`card-${i}`} />
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;
