/**
 * CourseCardPro v9.0 - Production Course Card with Checkbox & Hover Actions
 * Features: Bulk select, health bar, hover menu, low-health warning
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  Activity,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  QrCode,
  BarChart3,
  MoreVertical,
  MessageSquare,
  Check,
  Clock,
  TrendingUp,
  Send,
} from 'lucide-react';
import type { Course } from '../../hooks/useInfiniteCourses';

interface CourseCardProProps {
  course: Course;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onQRLecture?: (id: string) => void;
  onStats?: (id: string) => void;
  onNudge?: (id: string) => void;
  index?: number;
}

const colorSchemes: Record<string, { bg: string; border: string; badge: string; text: string; glow: string }> = {
  blue: {
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-400',
    text: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/20',
  },
  emerald: {
    bg: 'from-emerald-500/15 to-emerald-600/5',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-400',
    text: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  purple: {
    bg: 'from-purple-500/15 to-purple-600/5',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-400',
    text: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/20',
  },
  amber: {
    bg: 'from-amber-500/15 to-amber-600/5',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-400',
    text: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/20',
  },
  rose: {
    bg: 'from-rose-500/15 to-rose-600/5',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-400',
    text: 'text-rose-400',
    glow: 'group-hover:shadow-rose-500/20',
  },
  cyan: {
    bg: 'from-cyan-500/15 to-cyan-600/5',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-400',
    text: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  orange: {
    bg: 'from-orange-500/15 to-orange-600/5',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-400',
    text: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/20',
  },
  indigo: {
    bg: 'from-indigo-500/15 to-indigo-600/5',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500/20 text-indigo-400',
    text: 'text-indigo-400',
    glow: 'group-hover:shadow-indigo-500/20',
  },
  teal: {
    bg: 'from-teal-500/15 to-teal-600/5',
    border: 'border-teal-500/30',
    badge: 'bg-teal-500/20 text-teal-400',
    text: 'text-teal-400',
    glow: 'group-hover:shadow-teal-500/20',
  },
  pink: {
    bg: 'from-pink-500/15 to-pink-600/5',
    border: 'border-pink-500/30',
    badge: 'bg-pink-500/20 text-pink-400',
    text: 'text-pink-400',
    glow: 'group-hover:shadow-pink-500/20',
  },
};

export function CourseCardPro({
  course,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
  onQRLecture,
  onStats,
  onNudge,
  index = 0,
}: CourseCardProProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const colors = colorSchemes[course.color] || colorSchemes.blue;
  const isLowHealth = course.health < 80;
  const healthColor = course.health >= 85 ? 'bg-emerald-500' : course.health >= 70 ? 'bg-amber-500' : 'bg-rose-500';
  const healthGlow = course.health >= 85 ? 'shadow-emerald-500/30' : course.health >= 70 ? 'shadow-amber-500/30' : 'shadow-rose-500/30';

  const formatLastActivity = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`
        relative group rounded-2xl border backdrop-blur-xl overflow-hidden
        bg-gradient-to-br ${colors.bg}
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : isLowHealth ? 'border-amber-500/50' : colors.border}
        ${colors.glow} hover:shadow-lg
        transition-all duration-300
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
    >
      {/* Low Health Warning Frame */}
      {isLowHealth && (
        <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/40 pointer-events-none">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500/20 backdrop-blur-sm rounded-b-lg border border-t-0 border-amber-500/30">
            <span className="text-[10px] font-medium text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Revise?
            </span>
          </div>
        </div>
      )}

      {/* Checkbox (always visible but more prominent on hover) */}
      <div 
        className={`absolute top-4 left-4 z-20 transition-opacity duration-200 ${isHovered || isSelected ? 'opacity-100' : 'opacity-40'}`}
        onClick={(e) => { e.stopPropagation(); onToggleSelect(course.id); }}
      >
        <motion.div
          className={`
            w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer
            ${isSelected 
              ? 'bg-blue-500 border-blue-500' 
              : 'bg-zinc-900/80 border-zinc-600 hover:border-blue-400'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </motion.div>
      </div>

      {/* Hover Actions Menu */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-1"
          >
            <motion.button
              onClick={() => onView?.(course.id)}
              className="p-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 text-zinc-400 hover:text-white hover:border-blue-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="View Course"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onQRLecture?.(course.id)}
              className="p-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="QR Lecture"
            >
              <QrCode className="w-4 h-4" />
            </motion.button>
            <div className="relative">
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreVertical className="w-4 h-4" />
              </motion.button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute top-full right-0 mt-1 w-44 py-1 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl z-30"
                  >
                    <button
                      onClick={() => { onEdit?.(course.id); setShowMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Course
                    </button>
                    <button
                      onClick={() => { onStats?.(course.id); setShowMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Analytics
                    </button>
                    {course.silent_count > 0 && (
                      <button
                        onClick={() => { onNudge?.(course.id); setShowMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10"
                      >
                        <Send className="w-4 h-4" />
                        Nudge Silent ({course.silent_count})
                      </button>
                    )}
                    <div className="my-1 border-t border-zinc-800" />
                    <button
                      onClick={() => { onDelete?.(course.id); setShowMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Course
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className="p-5 pt-12">
        {/* Course Code Badge */}
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${colors.badge}`}>
            <BookOpen className="w-3.5 h-3.5" />
            {course.code}
          </span>
          
          {/* Alert Badges */}
          <div className="flex items-center gap-1.5">
            {course.unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"
              >
                <MessageSquare className="w-3 h-3" />
                {course.unread}
              </motion.span>
            )}
            {course.silent_count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400"
              >
                <AlertTriangle className="w-3 h-3" />
                {course.silent_count}
              </motion.span>
            )}
          </div>
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-blue-300 transition-colors">
          {course.title}
        </h3>
        
        {/* Last Activity */}
        <p className="text-xs text-zinc-500 mb-4 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Last activity: {formatLastActivity(course.last_activity)}
        </p>

        {/* Health Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-zinc-400">Course Health</span>
            <span className={`text-sm font-bold ${course.health >= 85 ? 'text-emerald-400' : course.health >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
              {course.health}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.health}%` }}
              transition={{ duration: 1, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
              className={`h-full rounded-full ${healthColor} shadow-lg ${healthGlow}`}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-zinc-400 mb-0.5">
              <Users className="w-3 h-3" />
            </div>
            <span className="text-lg font-bold text-white">{course.students}</span>
            <p className="text-[10px] text-zinc-500">Students</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
              <Activity className="w-3 h-3" />
            </div>
            <span className="text-lg font-bold text-white">{course.active_today}</span>
            <p className="text-[10px] text-zinc-500">Active</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
              <TrendingUp className="w-3 h-3" />
            </div>
            <span className="text-lg font-bold text-white">{course.lecture_count}</span>
            <p className="text-[10px] text-zinc-500">Lectures</p>
          </div>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="px-5 py-3 bg-zinc-900/30 border-t border-zinc-800/50 flex items-center justify-between">
        <button
          onClick={() => onView?.(course.id)}
          className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </button>
        <button
          onClick={() => onQRLecture?.(course.id)}
          className={`text-xs font-medium ${colors.text} hover:underline transition-colors flex items-center gap-1.5`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Start Lecture
        </button>
      </div>
    </motion.div>
  );
}
