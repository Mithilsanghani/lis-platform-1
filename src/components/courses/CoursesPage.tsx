/**
 * CoursesPage Component
 * Full courses management page with grid, search, filter, and stats
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Plus, Filter, ChevronDown, RefreshCw,
  Users, TrendingUp, UserX, MessageSquare, Sparkles,
  SortAsc, Grid3X3, List, X, Loader2,
} from 'lucide-react';
import { useCourses, type SortOption, type FilterOption } from '../../hooks/useCourses';
import { CourseCard } from './CourseCard';

interface CoursesPageProps {
  professorId?: string;
  onCreateCourse?: () => void;
  onViewCourse?: (courseId: string) => void;
  onQRLecture?: (courseId: string) => void;
}

export function CoursesPage({ professorId, onCreateCourse, onViewCourse, onQRLecture }: CoursesPageProps) {
  const {
    courses,
    loading,
    stats,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    refresh,
  } = useCourses(professorId);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'health-desc', label: 'Health (High-Low)' },
    { value: 'health-asc', label: 'Health (Low-High)' },
    { value: 'students', label: 'Most Students' },
    { value: 'silent', label: 'Silent Alerts First' },
    { value: 'recent', label: 'Recently Added' },
  ];

  const filterOptions: { value: FilterOption; label: string; count?: number }[] = [
    { value: 'all', label: 'All Courses', count: stats.totalCourses },
    { value: 'active', label: 'Active (≥80%)', count: courses.filter(c => c.health_pct >= 80).length },
    { value: 'silent-alert', label: 'Silent Alerts', count: courses.filter(c => c.silent_count > 0).length },
    { value: 'low-health', label: 'Low Health (<75%)', count: courses.filter(c => c.health_pct < 75).length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            Your Courses
            <span className="text-lg font-normal text-zinc-500">({stats.totalCourses})</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your courses, track engagement, and monitor student activity
          </p>
        </div>
        <motion.button
          onClick={() => { onCreateCourse?.(); setShowCreateModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          New Course
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Total Courses', value: stats.totalCourses, color: 'blue' },
          { icon: TrendingUp, label: 'Avg Health', value: `${stats.avgHealth}%`, color: stats.avgHealth >= 80 ? 'emerald' : 'amber' },
          { icon: Users, label: 'Total Students', value: stats.totalStudents, color: 'purple' },
          { icon: UserX, label: 'Silent Students', value: stats.totalSilent, color: stats.totalSilent > 10 ? 'rose' : 'zinc' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center gap-3`}
          >
            <div className={`p-2 rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search courses by code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-blue-500/50 text-white placeholder-zinc-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-zinc-800"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors min-w-[160px]"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">{filterOptions.find(f => f.value === filterBy)?.label}</span>
            <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 left-0 w-56 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20"
              >
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilterBy(opt.value); setShowFilters(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm ${filterBy === opt.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300 hover:bg-zinc-800'}`}
                  >
                    <span>{opt.label}</span>
                    {opt.count !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-xs text-zinc-500">{opt.count}</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none px-4 py-3 pr-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm cursor-pointer outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <SortAsc className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Refresh */}
        <motion.button
          onClick={refresh}
          className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchQuery ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-zinc-500 mb-6 max-w-sm">
            {searchQuery
              ? `No courses match "${searchQuery}". Try a different search.`
              : 'Create your first course to start managing lectures and tracking student engagement.'}
          </p>
          {!searchQuery && (
            <motion.button
              onClick={() => { onCreateCourse?.(); setShowCreateModal(true); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Create Your First Course
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onView={(c) => onViewCourse?.(c.id)}
              onQR={(c) => onQRLecture?.(c.id)}
            />
          ))}
        </div>
      )}

      {/* AI Suggestion */}
      {!loading && courses.length > 0 && stats.totalSilent > 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">AI Suggestion</p>
              <p className="text-xs text-zinc-400">
                {stats.totalSilent} silent students detected across courses. Consider sending personalized nudges.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors">
            View Insights
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default CoursesPage;
