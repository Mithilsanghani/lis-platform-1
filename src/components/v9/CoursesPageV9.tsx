/**
 * CoursesPageV9 - Production Courses Page with Infinite Scroll
 * Features: Bulk actions, export, infinite scroll, live search, advanced filters
 */

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Download,
  Search,
  X,
  Filter,
  ArrowUpDown,
  RefreshCw,
  LayoutGrid,
  List,
  Loader2,
  Sparkles,
  TrendingUp,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useInfiniteCourses, type SortOption, type FilterOption } from '../../hooks/useInfiniteCourses';
import { CourseCardPro } from './CourseCardPro';
import { StatsRow } from './StatsRow';
import { BulkActions } from './BulkActions';

interface CoursesPageV9Props {
  professorId?: string;
  onCreateCourse?: () => void;
  onViewCourse?: (id: string) => void;
  onEditCourse?: (id: string) => void;
  onDeleteCourse?: (id: string) => void;
  onQRLecture?: (id: string) => void;
}

const sortOptions: { value: SortOption; label: string; icon: 'up' | 'down' | null }[] = [
  { value: 'health-desc', label: 'Health (High→Low)', icon: 'down' },
  { value: 'health-asc', label: 'Health (Low→High)', icon: 'up' },
  { value: 'students-desc', label: 'Students (Most)', icon: 'down' },
  { value: 'students-asc', label: 'Students (Least)', icon: 'up' },
  { value: 'name-asc', label: 'Name (A→Z)', icon: null },
  { value: 'name-desc', label: 'Name (Z→A)', icon: null },
  { value: 'recent', label: 'Recently Active', icon: null },
];

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All Courses' },
  { value: 'active', label: 'Active Today' },
  { value: 'silent', label: 'Has Silent Students' },
  { value: 'low-health', label: 'Low Health (<80%)' },
  { value: 'archived', label: 'Archived' },
];

export function CoursesPageV9({
  professorId,
  onCreateCourse,
  onViewCourse,
  onEditCourse,
  onDeleteCourse,
  onQRLecture,
}: CoursesPageV9Props) {
  const {
    courses,
    stats,
    filterCounts,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    deselectAll,
    bulkArchive,
    bulkDelete,
    bulkNudge,
    exportCSV,
    refresh,
    isRefreshing,
  } = useInfiniteCourses(professorId);

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showSortDropdown, setShowSortDropdown] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const handleNudgeCourse = useCallback((courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      alert(`Nudge sent to ${course.silent_count} silent students in ${course.code}!`);
    }
  }, [courses]);

  // Activity sparkline data (mock)
  const activityData = [12, 18, 15, 22, 28, 32, 38];
  const activityTrend = '+32';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-blue-500/20">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Your Courses 
                <span className="text-zinc-500 text-lg font-normal ml-2">({stats.totalCourses})</span>
              </h1>
            </div>
          </div>
          
          {/* Activity Sparkline */}
          <div className="flex items-center gap-3 mt-2 ml-14">
            <span className="text-sm text-zinc-500">Student Activity Today</span>
            <div className="flex items-center gap-1.5">
              {/* Mini sparkline */}
              <div className="flex items-end gap-0.5 h-4">
                {activityData.map((value, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full opacity-60"
                    style={{ height: `${(value / 40) * 100}%` }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {activityTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedIds.size}
            totalCount={courses.length}
            isAllSelected={selectedIds.size === courses.length && courses.length > 0}
            onToggleSelectAll={toggleSelectAll}
            onArchive={bulkArchive}
            onDelete={bulkDelete}
            onNudge={bulkNudge}
            onExport={exportCSV}
            onDeselectAll={deselectAll}
          />

          {/* Export CSV */}
          <motion.button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>

          {/* Create Course */}
          <motion.button
            onClick={onCreateCourse}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Course
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <StatsRow stats={stats} isLoading={isLoading} />

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by code or title..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
              filterBy !== 'all'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4" />
            {filterOptions.find(f => f.value === filterBy)?.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 mt-2 w-56 py-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl z-50"
                >
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setFilterBy(option.value); setShowFilterDropdown(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-800 ${
                        filterBy === option.value ? 'text-purple-400' : 'text-zinc-300'
                      }`}
                    >
                      <span>{option.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">
                          {option.value === 'all' ? filterCounts.all :
                           option.value === 'active' ? filterCounts.active :
                           option.value === 'silent' ? filterCounts.silent :
                           option.value === 'low-health' ? filterCounts.lowHealth :
                           filterCounts.archived}
                        </span>
                        {filterBy === option.value && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium"
            whileTap={{ scale: 0.98 }}
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full right-0 mt-2 w-52 py-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl z-50"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-800 ${
                        sortBy === option.value ? 'text-blue-400' : 'text-zinc-300'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Refresh */}
        <motion.button
          onClick={refresh}
          disabled={isRefreshing}
          className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Selection Info Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
          >
            <span className="text-sm text-blue-400 font-medium">
              {selectedIds.size} course{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={deselectAll}
              className="text-sm text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestion Banner */}
      {stats.totalSilent > 10 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/10 border border-purple-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">AI Suggestion</p>
              <p className="text-xs text-zinc-400">
                {stats.totalSilent} silent students detected. Consider sending a bulk nudge to re-engage them.
              </p>
            </div>
          </div>
          <button
            onClick={bulkNudge}
            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30"
          >
            Nudge All Silent
          </button>
        </motion.div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No courses found</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-md">
            {searchQuery
              ? `No courses match "${searchQuery}". Try a different search term.`
              : filterBy !== 'all'
              ? 'No courses match the current filter. Try changing the filter.'
              : "You haven't created any courses yet. Create your first course to get started."}
          </p>
          {!searchQuery && filterBy === 'all' && (
            <motion.button
              onClick={onCreateCourse}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Create Your First Course
            </motion.button>
          )}
        </motion.div>
      ) : (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {courses.map((course, index) => (
              <CourseCardPro
                key={course.id}
                course={course}
                isSelected={selectedIds.has(course.id)}
                onToggleSelect={toggleSelect}
                onView={onViewCourse}
                onEdit={onEditCourse}
                onDelete={onDeleteCourse}
                onQRLecture={onQRLecture}
                onNudge={handleNudgeCourse}
                index={index}
              />
            ))}
          </div>

          {/* Load More / Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="flex items-center justify-center py-8">
            {isLoadingMore ? (
              <div className="flex items-center gap-3 text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading more courses...</span>
              </div>
            ) : hasMore ? (
              <button
                onClick={loadMore}
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium"
              >
                Load More
              </button>
            ) : courses.length > 0 ? (
              <div className="flex items-center gap-2 text-zinc-600 text-sm">
                <Check className="w-4 h-4" />
                All {courses.length} courses loaded
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

// Need React import for useState
import React from 'react';
