/**
 * FeedbackPageV11 - LIS v11.0
 * Production Feedback page with infinite scroll, filtering, bulk actions
 * LECTURE-WISE organization for easy professor review
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  ChevronDown,
  Check,
  CheckCircle,
  Star,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
  X,
  RefreshCw,
  Eye,
  BookOpen,
  Users,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react';
import { useInfiniteFeedback, type FeedbackFilter, type FeedbackSort, type FeedbackItem } from '../../hooks/useInfiniteFeedback';
import { FeedbackCardPro } from './FeedbackCardPro';

interface FeedbackPageV11Props {
  professorId?: string;
  onResolve?: (id: string) => void;
  onReply?: (id: string, reply: string) => void;
  onViewSimilar?: (id: string) => void;
}

// Animated counter
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="tabular-nums"
    >
      {value.toLocaleString()}{suffix}
    </motion.span>
  );
}

// Stats card
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix = '', 
  color,
  trend,
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number | string; 
  suffix?: string;
  color: string;
  trend?: { value: number; direction: 'up' | 'down' };
}) {
  const colorMap: Record<string, { bg: string; icon: string }> = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400' },
    rose: { bg: 'bg-rose-500/10', icon: 'text-rose-400' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400' },
  };
  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      className={`p-4 rounded-2xl border border-zinc-800 ${colors.bg} backdrop-blur-xl`}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-xl ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">
        {typeof value === 'number' ? <AnimatedCounter value={value} suffix={suffix} /> : value}
      </p>
      <p className="text-xs text-zinc-500">{label}</p>
    </motion.div>
  );
}

// Bulk actions dropdown
function BulkActionsDropdown({ 
  selectedCount, 
  onSelectAll, 
  onClearSelection,
  onMarkRead,
  onResolve,
  onExport,
  isAllSelected,
}: {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onMarkRead: () => void;
  onResolve: () => void;
  onExport: () => void;
  isAllSelected: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <motion.button
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
          selectedCount > 0 
            ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
        }`}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.02 }}
      >
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedCount > 0 ? `${selectedCount} selected` : 'Bulk Actions'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-56 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={() => { onSelectAll(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Check className="w-4 h-4" />
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </button>
            {selectedCount > 0 && (
              <button
                onClick={() => { onClearSelection(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <X className="w-4 h-4" />
                Clear Selection
              </button>
            )}
            <div className="h-px bg-zinc-800 my-1" />
            <button
              onClick={() => { onMarkRead(); setOpen(false); }}
              disabled={selectedCount === 0}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" />
              Mark as Read
            </button>
            <button
              onClick={() => { onResolve(); setOpen(false); }}
              disabled={selectedCount === 0}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Resolve Selected
            </button>
            <div className="h-px bg-zinc-800 my-1" />
            <button
              onClick={() => { onExport(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FeedbackPageV11({
  professorId,
  onResolve = (id) => console.log('Resolve:', id),
  onReply = (id, reply) => console.log('Reply:', id, reply),
  onViewSimilar = (id) => console.log('View similar:', id),
}: FeedbackPageV11Props) {
  const {
    feedback,
    isLoading,
    hasMore,
    loadMore,
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort,
    stats,
    filteredCount,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    bulkMarkRead,
    bulkResolve,
    exportCSV,
  } = useInfiniteFeedback({ professorId });

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'lecture' | 'grid'>('lecture');
  const [expandedLectures, setExpandedLectures] = React.useState<Set<string>>(new Set());
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Group feedback by lecture
  const groupedByLecture = useMemo(() => {
    const groups: Record<string, { lecture: { id: string; title: string; courseCode: string }; feedback: FeedbackItem[]; stats: { avg: number; count: number; unresolved: number } }> = {};
    
    feedback.forEach((item: FeedbackItem) => {
      if (!groups[item.lecture_id]) {
        groups[item.lecture_id] = {
          lecture: { id: item.lecture_id, title: item.lecture_title, courseCode: item.course_code },
          feedback: [],
          stats: { avg: 0, count: 0, unresolved: 0 }
        };
      }
      groups[item.lecture_id].feedback.push(item);
    });

    // Calculate stats for each lecture
    Object.values(groups).forEach(group => {
      const total = group.feedback.reduce((sum: number, f: FeedbackItem) => sum + f.understanding, 0);
      group.stats.avg = group.feedback.length > 0 ? parseFloat((total / group.feedback.length).toFixed(1)) : 0;
      group.stats.count = group.feedback.length;
      group.stats.unresolved = group.feedback.filter((f: FeedbackItem) => !f.resolved).length;
    });

    // Sort by most recent feedback
    return Object.values(groups).sort((a, b) => {
      const aLatest = Math.max(...a.feedback.map((f: FeedbackItem) => new Date(f.timestamp).getTime()));
      const bLatest = Math.max(...b.feedback.map((f: FeedbackItem) => new Date(f.timestamp).getTime()));
      return bLatest - aLatest;
    });
  }, [feedback]);

  const toggleLecture = (lectureId: string) => {
    setExpandedLectures(prev => {
      const next = new Set(prev);
      if (next.has(lectureId)) next.delete(lectureId);
      else next.add(lectureId);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedLectures(new Set(groupedByLecture.map(g => g.lecture.id)));
  };

  const collapseAll = () => {
    setExpandedLectures(new Set());
  };

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const filters: { value: FeedbackFilter; label: string; count?: number }[] = [
    { value: 'all', label: 'All Feedback', count: stats.totalFeedback },
    { value: 'unread', label: 'Unread', count: stats.unreadCount },
    { value: 'unresolved', label: 'Unresolved', count: stats.unresolvedCount },
    { value: 'today', label: 'Today', count: stats.todayCount },
    { value: 'this-week', label: 'This Week' },
    { value: 'low-rating', label: 'Low Rating (1-2)', count: stats.lowRatingCount },
    { value: 'pace', label: 'Pace Issues', count: stats.categoryStats.pace },
    { value: 'examples', label: 'Need Examples', count: stats.categoryStats.examples },
    { value: 'clarity', label: 'Clarity', count: stats.categoryStats.clarity },
  ];

  const sorts: { value: FeedbackSort; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating-asc', label: 'Rating (Low to High)' },
    { value: 'rating-desc', label: 'Rating (High to Low)' },
    { value: 'course', label: 'Course' },
    { value: 'student', label: 'Student Name' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Student Feedback</h1>
              <p className="text-sm text-zinc-500">
                {stats.unreadCount} unread • {stats.unresolvedCount} unresolved • {stats.avgRating}⭐ avg
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
              {stats.totalFeedback}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('lecture')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'lecture' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              By Lecture
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              All
            </button>
          </div>

          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
            onClick={exportCSV}
            whileHover={{ scale: 1.02 }}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export CSV</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard icon={MessageSquare} label="Total Feedback" value={stats.totalFeedback} color="blue" />
        <StatCard icon={Clock} label="Today" value={stats.todayCount} color="emerald" trend={{ value: 12, direction: 'up' }} />
        <StatCard icon={AlertCircle} label="Unread" value={stats.unreadCount} color="amber" />
        <StatCard icon={CheckCircle} label="Unresolved" value={stats.unresolvedCount} color="rose" />
        <StatCard icon={Star} label="Avg Rating" value={`${stats.avgRating}⭐`} color="purple" />
        <StatCard icon={TrendingUp} label="Low Ratings" value={stats.lowRatingCount} color="rose" />
      </div>

      {/* Unresolved Alert */}
      {stats.unresolvedCount > 10 && (
        <motion.div
          className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-white">{stats.unresolvedCount} unresolved feedback items</p>
              <p className="text-sm text-zinc-400">Students are waiting for your response.</p>
            </div>
          </div>
          <motion.button
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium"
            onClick={() => setFilter('unresolved')}
            whileHover={{ scale: 1.02 }}
          >
            View Unresolved
          </motion.button>
        </motion.div>
      )}

      {/* Search, Filter, Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by student, lecture, topic, feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          <motion.button
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 min-w-[180px]"
            onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
            whileHover={{ scale: 1.02 }}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm flex-1 text-left">{filters.find(f => f.value === filter)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                className="absolute top-full left-0 mt-2 w-64 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-20 max-h-80 overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setFilter(f.value); setFilterOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-800 ${
                      filter === f.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
                    }`}
                  >
                    <span>{f.label}</span>
                    {f.count !== undefined && (
                      <span className="text-xs text-zinc-500">{f.count}</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort */}
        <div className="relative">
          <motion.button
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 min-w-[180px]"
            onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
            whileHover={{ scale: 1.02 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm flex-1 text-left">{sorts.find(s => s.value === sort)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-56 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {sorts.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { setSort(s.value); setSortOpen(false); }}
                    className={`w-full flex items-center px-4 py-2.5 text-sm hover:bg-zinc-800 ${
                      sort === s.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        <BulkActionsDropdown
          selectedCount={selectedIds.size}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onMarkRead={bulkMarkRead}
          onResolve={bulkResolve}
          onExport={exportCSV}
          isAllSelected={selectedIds.size === feedback.length && feedback.length > 0}
        />
      </div>

      {/* Selection Info */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="text-sm text-blue-400">
              {selectedIds.size} feedback item{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={clearSelection}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Clear selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {viewMode === 'lecture' 
            ? `${groupedByLecture.length} lectures with ${feedback.length} feedback items`
            : `Showing ${feedback.length} of ${filteredCount} feedback items`
          }
        </p>
        {viewMode === 'lecture' && (
          <div className="flex items-center gap-2">
            <button onClick={expandAll} className="text-sm text-blue-400 hover:text-blue-300">Expand All</button>
            <span className="text-zinc-600">|</span>
            <button onClick={collapseAll} className="text-sm text-zinc-400 hover:text-white">Collapse All</button>
          </div>
        )}
      </div>

      {/* LECTURE-WISE VIEW */}
      {viewMode === 'lecture' && (
        <div className="space-y-4">
          {groupedByLecture.map((group, groupIndex) => {
            const isExpanded = expandedLectures.has(group.lecture.id);
            const hasUnresolved = group.stats.unresolved > 0;
            const avgColor = group.stats.avg >= 4 ? 'text-emerald-400' : group.stats.avg >= 3 ? 'text-amber-400' : 'text-rose-400';
            
            return (
              <motion.div
                key={group.lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.05 }}
                className={`rounded-2xl border overflow-hidden ${
                  hasUnresolved ? 'border-amber-500/30 bg-amber-500/5' : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                {/* Lecture Header */}
                <button
                  onClick={() => toggleLecture(group.lecture.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${hasUnresolved ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                      <BookOpen className={`w-5 h-5 ${hasUnresolved ? 'text-amber-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">{group.lecture.courseCode}</span>
                        <h3 className="font-semibold text-white">{group.lecture.title}</h3>
                        {hasUnresolved && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                            {group.stats.unresolved} unresolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 mt-0.5">
                        {group.stats.count} feedback • <span className={avgColor}>{group.stats.avg}⭐ avg</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400">{group.stats.count}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* Expanded Feedback List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 border-t border-zinc-800/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                          {group.feedback.map((item: FeedbackItem, index: number) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <FeedbackCardPro
                                feedback={item}
                                isSelected={selectedIds.has(item.id)}
                                onToggleSelect={toggleSelect}
                                onResolve={onResolve}
                                onReply={onReply}
                                onViewSimilar={onViewSimilar}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* GRID VIEW (Original) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {feedback.map((item: FeedbackItem, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
              >
                <FeedbackCardPro
                  feedback={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={toggleSelect}
                  onResolve={onResolve}
                  onReply={onReply}
                  onViewSimilar={onViewSimilar}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More (Grid view only) */}
      {viewMode === 'grid' && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more feedback...</span>
            </div>
          ) : hasMore ? (
            <button
              onClick={loadMore}
              className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
            >
              Load More
            </button>
          ) : feedback.length > 0 ? (
            <p className="text-zinc-500">All feedback loaded</p>
          ) : null}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && feedback.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
            <MessageSquare className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No feedback found</h3>
          <p className="text-zinc-500 mb-6 text-center">
            {search ? 'Try adjusting your search or filters' : 'Feedback from students will appear here'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
