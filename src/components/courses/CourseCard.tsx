/**
 * CourseCard Component
 * Displays individual course with stats, health bar, and actions
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, Presentation, MessageSquare, UserX,
  Eye, QrCode, MoreVertical, TrendingUp, Clock,
  ChevronRight, Sparkles,
} from 'lucide-react';
import type { Course } from '../../hooks/useCourses';

interface CourseCardProps {
  course: Course;
  onView?: (course: Course) => void;
  onQR?: (course: Course) => void;
  onEdit?: (course: Course) => void;
  index?: number;
}

// Color schemes for course cards
const colorSchemes: Record<string, { bg: string; border: string; badge: string; bar: string }> = {
  blue: { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20 hover:border-blue-500/40', badge: 'bg-blue-500/20 text-blue-400', bar: 'bg-blue-500' },
  purple: { bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20 hover:border-purple-500/40', badge: 'bg-purple-500/20 text-purple-400', bar: 'bg-purple-500' },
  emerald: { bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20 hover:border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400', bar: 'bg-emerald-500' },
  amber: { bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20 hover:border-amber-500/40', badge: 'bg-amber-500/20 text-amber-400', bar: 'bg-amber-500' },
  rose: { bg: 'from-rose-500/10 to-rose-600/5', border: 'border-rose-500/20 hover:border-rose-500/40', badge: 'bg-rose-500/20 text-rose-400', bar: 'bg-rose-500' },
  cyan: { bg: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20 hover:border-cyan-500/40', badge: 'bg-cyan-500/20 text-cyan-400', bar: 'bg-cyan-500' },
  indigo: { bg: 'from-indigo-500/10 to-indigo-600/5', border: 'border-indigo-500/20 hover:border-indigo-500/40', badge: 'bg-indigo-500/20 text-indigo-400', bar: 'bg-indigo-500' },
  teal: { bg: 'from-teal-500/10 to-teal-600/5', border: 'border-teal-500/20 hover:border-teal-500/40', badge: 'bg-teal-500/20 text-teal-400', bar: 'bg-teal-500' },
  orange: { bg: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/20 hover:border-orange-500/40', badge: 'bg-orange-500/20 text-orange-400', bar: 'bg-orange-500' },
  pink: { bg: 'from-pink-500/10 to-pink-600/5', border: 'border-pink-500/20 hover:border-pink-500/40', badge: 'bg-pink-500/20 text-pink-400', bar: 'bg-pink-500' },
};

export function CourseCard({ course, onView, onQR, onEdit, index = 0 }: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const colors = colorSchemes[course.color || 'blue'] || colorSchemes.blue;

  // Health color based on percentage
  const getHealthColor = (health: number) => {
    if (health >= 85) return 'bg-emerald-500';
    if (health >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`group relative p-6 rounded-2xl border backdrop-blur-xl bg-gradient-to-br ${colors.bg} ${colors.border} cursor-pointer transition-all duration-300`}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => onView?.(course)}
    >
      {/* Header: Code Badge + Menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${colors.badge}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors.badge}`}>
              {course.code}
            </span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/50 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 w-40 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-10">
              <button onClick={(e) => { e.stopPropagation(); onView?.(course); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                <Eye className="w-4 h-4" /> View Details
              </button>
              <button onClick={(e) => { e.stopPropagation(); onQR?.(course); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                <QrCode className="w-4 h-4" /> QR Lecture
              </button>
              <button onClick={(e) => { e.stopPropagation(); onEdit?.(course); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                <Sparkles className="w-4 h-4" /> AI Insights
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
        {course.title}
      </h3>

      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Course Health
          </span>
          <span className={`text-xs font-bold ${course.health_pct >= 85 ? 'text-emerald-400' : course.health_pct >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
            {course.health_pct}%
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getHealthColor(course.health_pct)} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${course.health_pct}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-300">{course.student_count}</span>
          <span className="text-zinc-600 text-xs">students</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Presentation className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-300">{course.lecture_count}</span>
          <span className="text-zinc-600 text-xs">lectures</span>
        </div>
      </div>

      {/* Alerts Row */}
      <div className="flex items-center gap-3">
        {course.unread > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{course.unread} unread</span>
          </div>
        )}
        {course.silent_count > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400">
            <UserX className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{course.silent_count} silent</span>
          </div>
        )}
        {course.unread === 0 && course.silent_count === 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">All caught up!</span>
          </div>
        )}
      </div>

      {/* Hover Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-all rounded-b-2xl flex items-center justify-center gap-3">
        <motion.button
          onClick={(e) => { e.stopPropagation(); onView?.(course); }}
          className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium flex items-center gap-2 hover:bg-blue-500/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-4 h-4" /> View
        </motion.button>
        <motion.button
          onClick={(e) => { e.stopPropagation(); onQR?.(course); }}
          className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-medium flex items-center gap-2 hover:bg-purple-500/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <QrCode className="w-4 h-4" /> QR Lecture
        </motion.button>
      </div>

      {/* Arrow indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
        <ChevronRight className="w-5 h-5 text-zinc-600" />
      </div>
    </motion.div>
  );
}

export default CourseCard;
