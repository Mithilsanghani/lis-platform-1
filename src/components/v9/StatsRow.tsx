/**
 * StatsRow v9.0 - Animated Stats Cards with Counters
 * Features: Animated counters, trend arrows, click to details modal
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Heart,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  X,
  BarChart3,
} from 'lucide-react';
import type { CourseStats } from '../../hooks/useInfiniteCourses';

interface StatsRowProps {
  stats: CourseStats;
  isLoading?: boolean;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
  onClick?: () => void;
  delay?: number;
}

const colorStyles = {
  blue: {
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/30 hover:border-blue-500/50',
    icon: 'bg-blue-500/20 text-blue-400',
    value: 'text-blue-400',
  },
  emerald: {
    bg: 'from-emerald-500/15 to-emerald-600/5',
    border: 'border-emerald-500/30 hover:border-emerald-500/50',
    icon: 'bg-emerald-500/20 text-emerald-400',
    value: 'text-emerald-400',
  },
  purple: {
    bg: 'from-purple-500/15 to-purple-600/5',
    border: 'border-purple-500/30 hover:border-purple-500/50',
    icon: 'bg-purple-500/20 text-purple-400',
    value: 'text-purple-400',
  },
  amber: {
    bg: 'from-amber-500/15 to-amber-600/5',
    border: 'border-amber-500/30 hover:border-amber-500/50',
    icon: 'bg-amber-500/20 text-amber-400',
    value: 'text-amber-400',
  },
  rose: {
    bg: 'from-rose-500/15 to-rose-600/5',
    border: 'border-rose-500/30 hover:border-rose-500/50',
    icon: 'bg-rose-500/20 text-rose-400',
    value: 'text-rose-400',
  },
};

function AnimatedCounter({ value, duration = 1.5, delay = 0 }: { value: number; duration?: number; delay?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (value - startValue) * eased);
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, duration, delay]);

  return <span>{displayValue.toLocaleString()}</span>;
}

function StatCard({ icon: Icon, label, value, suffix = '', trend, color, onClick, delay = 0 }: StatCardProps) {
  const styles = colorStyles[color];
  const isPositive = trend && trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl border backdrop-blur-xl cursor-pointer
        bg-gradient-to-br ${styles.bg} ${styles.border}
        hover:shadow-lg transition-all duration-300 group
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2.5 rounded-xl ${styles.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay * 0.1 + 0.5 }}
            className={`flex items-center gap-1 text-xs font-medium ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            {Math.abs(trend)}%
          </motion.div>
        )}
      </div>
      
      <div className="mt-3">
        <div className={`text-2xl font-bold ${styles.value} flex items-baseline gap-1`}>
          <AnimatedCounter value={value} delay={delay * 0.1} />
          {suffix && <span className="text-base font-medium opacity-70">{suffix}</span>}
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      </div>

      {/* Click indicator */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <BarChart3 className="w-4 h-4 text-zinc-600" />
      </div>
    </motion.div>
  );
}

export function StatsRow({ stats, isLoading }: StatsRowProps) {
  const [detailsModal, setDetailsModal] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const statItems = [
    { 
      icon: BookOpen, 
      label: 'Total Courses', 
      value: stats.totalCourses, 
      trend: 5, 
      color: 'blue' as const,
      details: 'All courses you are teaching this semester.',
    },
    { 
      icon: Heart, 
      label: 'Avg Health', 
      value: stats.avgHealth, 
      suffix: '%',
      trend: stats.avgHealth > 80 ? 3 : -2, 
      color: 'emerald' as const,
      details: 'Average engagement score across all courses.',
    },
    { 
      icon: Users, 
      label: 'Total Students', 
      value: stats.totalStudents, 
      trend: 12, 
      color: 'purple' as const,
      details: 'Students enrolled across all courses.',
    },
    { 
      icon: Activity, 
      label: 'Active Today', 
      value: stats.totalActive, 
      trend: 8, 
      color: 'amber' as const,
      details: 'Students who participated today.',
    },
    { 
      icon: AlertTriangle, 
      label: 'Silent Students', 
      value: stats.totalSilent, 
      trend: stats.totalSilent > 20 ? -5 : 2, 
      color: 'rose' as const,
      details: 'Students with no activity in 7+ days.',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            suffix={item.suffix}
            trend={item.trend}
            color={item.color}
            delay={index}
            onClick={() => setDetailsModal(item.label)}
          />
        ))}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {detailsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDetailsModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h3 className="text-lg font-semibold text-white">{detailsModal}</h3>
                <button
                  onClick={() => setDetailsModal(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {statItems.find(s => s.label === detailsModal) && (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      {(() => {
                        const item = statItems.find(s => s.label === detailsModal)!;
                        const styles = colorStyles[item.color];
                        return (
                          <div className={`p-4 rounded-xl ${styles.icon}`}>
                            <item.icon className="w-8 h-8" />
                          </div>
                        );
                      })()}
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {statItems.find(s => s.label === detailsModal)?.value.toLocaleString()}
                          {statItems.find(s => s.label === detailsModal)?.suffix}
                        </div>
                        <p className="text-zinc-400">{detailsModal}</p>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4">
                      {statItems.find(s => s.label === detailsModal)?.details}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30">
                        View Details
                      </button>
                      <button className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700">
                        Export Data
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
