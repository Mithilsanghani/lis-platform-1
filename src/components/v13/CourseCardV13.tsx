/**
 * CourseCardV13 - LIS v13.0
 * Premium course card with health visualization, hover actions, AI tips
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  QrCode,
  Sparkles,
  MoreHorizontal,
  CheckSquare,
  Square,
  ExternalLink,
  Bell,
  FileText,
  ChevronRight,
} from 'lucide-react';
import type { Course } from '../../hooks/useCoursesQuery';

interface CourseCardV13Props {
  course: Course;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewCourse: (id: string) => void;
  onViewFeedback: (id: string) => void;
  onViewStudents: (id: string) => void;
  onGenerateQR: (id: string) => void;
  index?: number;
}

// Health color utilities
function getHealthColor(health: number): {
  gradient: string;
  bg: string;
  text: string;
  ring: string;
} {
  if (health >= 90) {
    return {
      gradient: 'from-emerald-400 to-emerald-500',
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      ring: 'ring-emerald-500/30',
    };
  } else if (health >= 75) {
    return {
      gradient: 'from-amber-400 to-yellow-500',
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      ring: 'ring-amber-500/30',
    };
  } else {
    return {
      gradient: 'from-rose-400 to-red-500',
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      ring: 'ring-rose-500/30',
    };
  }
}

function formatLastActivity(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function CourseCardV13({
  course,
  isSelected,
  onToggleSelect,
  onViewCourse,
  onViewFeedback,
  onViewStudents,
  onGenerateQR,
  index = 0,
}: CourseCardV13Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAITip, setShowAITip] = useState(false);
  const [healthAnimated, setHealthAnimated] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const healthColors = getHealthColor(course.health_pct);

  // Animate health bar on mount/hover
  useEffect(() => {
    const timer = setTimeout(() => {
      setHealthAnimated(course.health_pct);
    }, 100 + index * 50);
    return () => clearTimeout(timer);
  }, [course.health_pct, index]);

  const needsAttention = course.health_pct < 75;
  const hasCriticalSilent = course.silent_count > 15;

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative group
        bg-white/[0.03] backdrop-blur-xl
        rounded-2xl border
        transition-all duration-300 ease-out
        overflow-hidden
        ${isSelected 
          ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
          : 'border-white/[0.08] hover:border-white/[0.15]'
        }
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActions(false);
        setShowAITip(false);
      }}
      whileHover={{ 
        y: -2, 
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)',
      }}
      style={{ padding: 24 }}
    >
      {/* Selection checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(course.id);
        }}
        className={`
          absolute top-4 left-4 z-10
          w-5 h-5 rounded-md
          flex items-center justify-center
          transition-all duration-200
          ${isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-white/5 border border-white/20 text-transparent hover:border-white/40'
          }
        `}
      >
        {isSelected ? (
          <CheckSquare className="w-3.5 h-3.5" />
        ) : (
          <Square className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Quick actions bar - appears on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 right-4 z-20 flex items-center gap-1"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewCourse(course.id)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
              title="View Course"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewFeedback(course.id)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
              title="View Feedback"
            >
              <MessageSquare className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewStudents(course.id)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
              title="View Students"
            >
              <Users className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGenerateQR(course.id)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
              title="Generate QR"
            >
              <QrCode className="w-4 h-4" />
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>
              
              {/* Dropdown menu */}
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-30"
                  >
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white text-left">
                      <FileText className="w-4 h-4" />
                      Download Syllabus
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white text-left">
                      <Bell className="w-4 h-4" />
                      Send Announcement
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white text-left">
                      <ExternalLink className="w-4 h-4" />
                      Open in LMS
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course header */}
      <div className="flex items-start gap-4 mb-4 ml-6">
        {/* Course icon */}
        <div className={`
          w-12 h-12 rounded-xl
          bg-gradient-to-br ${course.color}
          flex items-center justify-center
          text-white font-bold text-lg
          shadow-lg
        `}>
          {course.code.slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Course code */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {course.code}
            </span>
            {course.is_owner && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-500/20 text-blue-400">
                Owner
              </span>
            )}
          </div>
          
          {/* Course name - 2 line max with ellipsis */}
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
            {course.name}
          </h3>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

      {/* Meta row */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatLastActivity(course.last_activity_at)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Users className="w-3.5 h-3.5" />
          <span>{course.student_count.toLocaleString()}</span>
        </div>
        
        {/* Badges */}
        <div className="flex items-center gap-2 ml-auto">
          {course.silent_count > 0 && (
            <span className={`
              flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${hasCriticalSilent ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}
            `}>
              <AlertTriangle className="w-3 h-3" />
              {course.silent_count}
            </span>
          )}
          {course.unread_count > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              <MessageSquare className="w-3 h-3" />
              {course.unread_count}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

      {/* Health bar section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Course Health</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${healthColors.text}`}>
              {course.health_pct}%
            </span>
            {/* Trend arrow */}
            <span className={`
              flex items-center gap-0.5 text-xs font-medium
              ${course.health_trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}
            `}>
              {course.health_trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {course.health_trend >= 0 ? '+' : ''}{course.health_trend}%
            </span>
          </div>
        </div>
        
        {/* Animated health bar */}
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${healthColors.gradient} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${healthAnimated}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          />
        </div>

        {/* Needs attention chip */}
        {needsAttention && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 mt-2"
          >
            <span className="px-2 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Needs attention
            </span>
          </motion.div>
        )}
      </div>

      {/* AI Tip button */}
      <div className="mt-4 relative">
        <motion.button
          onClick={() => setShowAITip(!showAITip)}
          className={`
            w-full flex items-center justify-between gap-2
            px-3 py-2 rounded-xl
            bg-gradient-to-r from-purple-500/10 to-indigo-500/10
            border border-purple-500/20
            text-purple-300 text-sm
            hover:from-purple-500/20 hover:to-indigo-500/20
            transition-all duration-200
          `}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-medium">AI Coach Tip</span>
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${showAITip ? 'rotate-90' : ''}`} />
        </motion.button>

        {/* AI Tip tooltip */}
        <AnimatePresence>
          {showAITip && course.ai_tip && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20"
            >
              <p className="text-sm text-purple-200 leading-relaxed">
                {course.ai_tip}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.06), transparent 40%)`,
        }}
      />
    </motion.div>
  );
}

// Skeleton loader for cards
export function CourseCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
          <div className="h-5 w-full bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-px bg-white/5 mb-4" />
      <div className="flex items-center gap-4 mb-4">
        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="h-px bg-white/5 mb-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-2.5 bg-white/10 rounded-full" />
      </div>
    </motion.div>
  );
}
