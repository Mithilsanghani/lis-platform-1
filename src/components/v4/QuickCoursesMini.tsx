/**
 * QuickCoursesMini - Show top 3 courses with progress bars
 * Minimal, spacious, scannable
 */

import { motion } from 'framer-motion';

interface Course {
  id: string;
  name: string;
  code: string;
  unread: number;
  lastUpdated: string;
}

interface QuickCoursesProps {
  courses: Course[];
  onCourseClick?: (courseId: string) => void;
}

export default function QuickCoursesMini({ courses, onCourseClick }: QuickCoursesProps) {
  // Show only top 3
  const topCourses = courses.slice(0, 3);

  // Mock health score (94%, 78%, 65%)
  const getHealthScore = (index: number) => [94, 78, 65][index] || 50;

  return (
    <div className="space-y-2">
      {topCourses.map((course, idx) => {
        const healthScore = getHealthScore(idx);
        const isHealthy = healthScore >= 80;

        return (
          <motion.button
            key={course.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onCourseClick?.(course.id)}
            className="w-full p-3 rounded-lg bg-[#1A1A2E] hover:bg-[#2A2A40] border border-[#2A2A40] hover:border-[#7C3AED]/30 transition group"
          >
            {/* Course Code + Name */}
            <div className="flex items-start justify-between mb-2">
              <div className="text-left">
                <p className="text-xs font-bold text-[#7C3AED] tracking-wide">
                  {course.code}
                </p>
                <p className="text-xs text-[#D1D5DB] truncate max-w-[180px] font-medium">
                  {course.name}
                </p>
              </div>
              {course.unread > 0 && (
                <span className="ml-2 flex-shrink-0 w-5 h-5 bg-orange-500/90 rounded-full flex items-center justify-center text-xs font-bold text-orange-50">
                  {course.unread}
                </span>
              )}
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-[#2A2A40] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full transition ${
                    isHealthy
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                  }`}
                />
              </div>
              <p className="text-[10px] text-[#6B7280] font-medium">
                {healthScore}% healthy
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
