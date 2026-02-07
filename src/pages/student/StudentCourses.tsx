/**
 * LIS v2.0 - Student Courses Page
 * Course list with understanding metrics
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  Users,
  X,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useStudentCourses, type StudentCourse } from '../../hooks/useStudentData';

type FilterType = 'all' | 'core' | 'elective' | 'at-risk';

// Filter chip component
function FilterChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all
        ${active
          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
          : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
        }
      `}
    >
      {label}
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 rounded-full text-xs ${active ? 'bg-purple-500/30' : 'bg-white/10'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Understanding bar component
function UnderstandingBar({ value }: { value: number }) {
  const getColor = () => {
    if (value >= 80) return 'from-emerald-400 to-emerald-500';
    if (value >= 60) return 'from-amber-400 to-amber-500';
    return 'from-rose-400 to-rose-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">Your understanding</span>
        <span className={`font-medium ${value >= 80 ? 'text-emerald-400' : value >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
          {value}%
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Course card component
function CourseCard({
  course,
  index,
  onViewLectures,
  onReviewTopics,
}: {
  course: StudentCourse;
  index: number;
  onViewLectures: (id: string) => void;
  onReviewTopics: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-bold text-lg`}>
          {course.code.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {course.code}
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              course.type === 'core' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {course.type}
            </span>
          </div>
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">{course.instructor}</p>
        </div>
      </div>

      {/* Understanding bar */}
      <div className="mb-4">
        <UnderstandingBar value={course.understanding_pct} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{course.next_lecture}</span>
        </div>
        {course.pending_feedback > 0 ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            {course.pending_feedback} feedback pending
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            All caught up
          </span>
        )}
      </div>

      {/* Attendance */}
      <div className="text-xs text-zinc-500 mb-4">
        <span className="text-white font-medium">{course.attended_lectures}</span> / {course.total_lectures} lectures attended
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onViewLectures(course.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <Calendar className="w-4 h-4" />
          View lectures
        </motion.button>
        <motion.button
          onClick={() => onReviewTopics(course.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <TrendingUp className="w-4 h-4" />
          Review topics
        </motion.button>
      </div>
    </motion.div>
  );
}

// Course detail drawer
function CourseDetailDrawer({
  course,
  onClose,
}: {
  course: StudentCourse;
  onClose: () => void;
}) {
  const lectures = [
    { id: '1', topic: 'Introduction & Setup', date: 'Jan 15', understanding: 'full' as const },
    { id: '2', topic: 'Arrays & Strings', date: 'Jan 17', understanding: 'full' as const },
    { id: '3', topic: 'Linked Lists', date: 'Jan 20', understanding: 'partial' as const },
    { id: '4', topic: 'Stacks & Queues', date: 'Jan 22', understanding: 'need-clarity' as const },
    { id: '5', topic: 'Trees - Basics', date: 'Jan 24', understanding: 'partial' as const },
    { id: '6', topic: 'Binary Search Trees', date: 'Jan 27', understanding: undefined },
  ];

  const getUnderstandingBadge = (understanding?: string) => {
    if (!understanding) {
      return <span className="px-2 py-1 rounded-lg bg-zinc-500/20 text-zinc-400 text-xs">Pending</span>;
    }
    const styles = {
      'full': 'bg-emerald-500/20 text-emerald-400',
      'partial': 'bg-amber-500/20 text-amber-400',
      'need-clarity': 'bg-rose-500/20 text-rose-400',
    };
    const labels = {
      'full': 'Understood',
      'partial': 'Partial',
      'need-clarity': 'Need clarity',
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[understanding as keyof typeof styles]}`}>
        {labels[understanding as keyof typeof labels]}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-bold`}>
                {course.code.slice(0, 2)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{course.code}</h2>
                <p className="text-sm text-zinc-400">{course.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lectures list */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Recent Lectures</h3>
          <div className="space-y-2">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{lecture.topic}</p>
                  <p className="text-xs text-zinc-500">{lecture.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getUnderstandingBadge(lecture.understanding)}
                  {!lecture.understanding && (
                    <button className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium hover:bg-purple-500/30 transition-colors">
                      Give feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function StudentCourses() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);

  const { courses, totalCount } = useStudentCourses(filter);

  // Filter by search
  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  const filterCounts = {
    all: totalCount,
    core: courses.filter((c) => c.type === 'core').length,
    elective: courses.filter((c) => c.type === 'elective').length,
    'at-risk': courses.filter((c) => c.understanding_pct < 80).length,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-purple-400" />
            My Courses
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-sm font-medium text-zinc-300">
              {totalCount}
            </span>
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by code or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          label="All"
          active={filter === 'all'}
          count={filterCounts.all}
          onClick={() => setFilter('all')}
        />
        <FilterChip
          label="Core"
          active={filter === 'core'}
          count={filterCounts.core}
          onClick={() => setFilter('core')}
        />
        <FilterChip
          label="Elective"
          active={filter === 'elective'}
          count={filterCounts.elective}
          onClick={() => setFilter('elective')}
        />
        <FilterChip
          label="At Risk"
          active={filter === 'at-risk'}
          count={filterCounts['at-risk']}
          onClick={() => setFilter('at-risk')}
        />
      </div>

      {/* Courses grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No courses found</h3>
          <p className="text-zinc-500 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onViewLectures={(id) => {
                const c = courses.find((x) => x.id === id);
                if (c) setSelectedCourse(c);
              }}
              onReviewTopics={(id) => console.log('Review topics:', id)}
            />
          ))}
        </div>
      )}

      {/* Course detail drawer */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailDrawer
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
