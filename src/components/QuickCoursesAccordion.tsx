/**
 * QuickCoursesAccordion - Expandable list of courses with progress indicators
 * Shows unread counts, progress bars, chevron indicators
 * Mobile-optimized with proper spacing (56px items)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp } from 'lucide-react';

interface CourseQuick {
  id: string;
  name: string;
  code: string;
  unread: number;
  lastUpdated: string;
  progress?: number;
  students?: number;
}

interface QuickCoursesAccordionProps {
  courses: CourseQuick[];
}

export default function QuickCoursesAccordion({
  courses,
}: QuickCoursesAccordionProps) {
  const [expanded, setExpanded] = useState(true);

  // Get course color based on unread count
  const getProgressColor = (unread: number): string => {
    if (unread > 10) return 'bg-red-500';
    if (unread > 5) return 'bg-yellow-500';
    if (unread > 0) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  // Get progress percentage (mock)
  const getProgress = (unread: number): number => {
    return Math.max(20, Math.min(100, 100 - unread * 3));
  };

  const totalUnread = courses.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="space-y-0">
      {/* Header */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:bg-slate-700/50 transition min-h-[56px]"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
          <TrendingUp className="w-5 h-5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold text-white">
              Quick Courses
            </div>
            <p className="text-xs text-slate-400">
              {courses.length} courses • {totalUnread} unread
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Course List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 px-3 py-2 bg-slate-700/20 border-t border-slate-700/30"
          >
            {courses.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm">
                No courses found
              </div>
            ) : (
              courses.map((course, idx) => {
                const progress = getProgress(course.unread);
                const progressColor = getProgressColor(course.unread);

                return (
                  <motion.button
                    key={course.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition group text-left min-h-[56px] active:bg-slate-700/70"
                  >
                    {/* Course Avatar */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${
                        course.unread > 10
                          ? 'bg-red-600/30 text-red-400'
                          : course.unread > 5
                            ? 'bg-yellow-600/30 text-yellow-400'
                            : 'bg-blue-600/30 text-blue-400'
                      }`}
                    >
                      {course.code.substring(0, 2)}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-white truncate">
                            {course.code}
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {course.name}
                          </p>
                        </div>

                        {/* Unread Badge */}
                        {course.unread > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              course.unread > 10
                                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                                : course.unread > 5
                                  ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                                  : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {course.unread}
                          </motion.span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${progressColor}`}
                        />
                      </div>

                      {/* Last Updated */}
                      <p className="text-xs text-slate-500 mt-1">
                        Updated {course.lastUpdated}
                      </p>
                    </div>
                  </motion.button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
