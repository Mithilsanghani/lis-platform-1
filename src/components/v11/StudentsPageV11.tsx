/**
 * StudentsPageV11 - LIS v11.0
 * Production Students page with infinite scroll, filtering, bulk actions
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  ChevronDown,
  Check,
  UserPlus,
  Send,
  Mail,
  Activity,
  AlertTriangle,
  TrendingUp,
  Heart,
  Loader2,
  X,
  RefreshCw,
} from 'lucide-react';
import { useInfiniteStudents, type StudentFilter, type StudentSort } from '../../hooks/useInfiniteStudents';
import { StudentCardPro } from './StudentCardPro';

interface StudentsPageV11Props {
  professorId?: string;
  onBulkEnroll?: () => void;
  onViewProfile?: (id: string) => void;
  onNudge?: (id: string) => void;
  onViewFeedback?: (id: string) => void;
}

// Animated counter component
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

// Stats card component
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
  value: number; 
  suffix?: string;
  color: string;
  trend?: { value: number; direction: 'up' | 'down' };
}) {
  const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', text: 'text-blue-400' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', text: 'text-emerald-400' },
    rose: { bg: 'bg-rose-500/10', icon: 'text-rose-400', text: 'text-rose-400' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', text: 'text-amber-400' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', text: 'text-purple-400' },
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
        <AnimatedCounter value={value} suffix={suffix} />
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
  onNudge,
  onEmail,
  onExport,
  isAllSelected,
}: {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onNudge: () => void;
  onEmail: () => void;
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
            <div className="h-px bg-zinc-800 my-1" />
            <button
              onClick={() => { onNudge(); setOpen(false); }}
              disabled={selectedCount === 0}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Nudge Selected
            </button>
            <button
              onClick={() => { onEmail(); setOpen(false); }}
              disabled={selectedCount === 0}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-4 h-4" />
              Email Selected
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

export function StudentsPageV11({
  professorId,
  onBulkEnroll = () => console.log('Bulk enroll'),
  onViewProfile = (id) => console.log('View profile:', id),
  onNudge = (id) => console.log('Nudge:', id),
  onViewFeedback = (id) => console.log('View feedback:', id),
}: StudentsPageV11Props) {
  const {
    students,
    isLoading,
    hasMore,
    loadMore,
    searchQuery,
    setSearchQuery,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    stats,
    totalFiltered,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
  } = useInfiniteStudents({ professorId });
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
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

  const filters: { value: StudentFilter; label: string; count?: number }[] = [
    { value: 'all', label: 'All Students', count: stats.total },
    { value: 'active', label: 'Active Today', count: stats.activeToday },
    { value: 'silent', label: 'Silent (5+ days)', count: stats.silentCount },
    { value: 'at-risk', label: 'At Risk', count: stats.atRisk },
    { value: 'low-health', label: 'Low Health (<75%)', count: undefined },
    { value: 'high-performers', label: 'High Performers (90%+)', count: undefined },
  ];

  const sorts: { value: StudentSort; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'health-desc', label: 'Health (High to Low)' },
    { value: 'health-asc', label: 'Health (Low to High)' },
    { value: 'silent-desc', label: 'Most Silent' },
    { value: 'activity-desc', label: 'Most Active' },
    { value: 'course', label: 'Course' },
    { value: 'rollno', label: 'Roll Number' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Your Students</h1>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
              {stats.total}
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {stats.silentCount} silent • {stats.activeToday} active today • {stats.avgHealth}% avg health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
            onClick={() => {
              const csv = ['Name,Roll No,Email,Course,Health,Status'].concat(
                students.map(s => `${s.name},${s.rollNo},${s.email},${s.course_code},${s.health_pct}%,${s.status}`)
              ).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'students.csv';
              a.click();
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/25"
            onClick={onBulkEnroll}
            whileHover={{ scale: 1.02 }}
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-sm">Bulk Enroll</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Total Students" value={stats.total} color="blue" />
        <StatCard icon={Activity} label="Active Today" value={stats.activeToday} color="emerald" trend={{ value: 8, direction: 'up' }} />
        <StatCard icon={AlertTriangle} label="Silent (5+ days)" value={stats.silentCount} color="rose" trend={{ value: 3, direction: 'down' }} />
        <StatCard icon={Heart} label="At Risk" value={stats.atRisk} color="amber" />
        <StatCard icon={TrendingUp} label="Avg Health" value={stats.avgHealth} suffix="%" color="purple" />
        <StatCard icon={Users} label="High Performers" value={0} color="emerald" />
      </div>

      {/* Silent Alert Banner */}
      {stats.silentCount > 5 && (
        <motion.div
          className="flex items-center justify-between p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="font-medium text-white">{stats.silentCount} students need attention</p>
              <p className="text-sm text-zinc-400">No activity in 5+ days. Consider sending a nudge.</p>
            </div>
          </div>
          <motion.button
            className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-medium"
            onClick={() => { setFilterBy('silent'); }}
            whileHover={{ scale: 1.02 }}
          >
            View Silent
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
            placeholder="Search by name, roll no, email, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <motion.button
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 min-w-[180px]"
            onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
            whileHover={{ scale: 1.02 }}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm flex-1 text-left">{filters.find(f => f.value === filterBy)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                className="absolute top-full left-0 mt-2 w-64 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setFilterBy(f.value); setFilterOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-zinc-800 ${
                      filterBy === f.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
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

        {/* Sort Dropdown */}
        <div className="relative">
          <motion.button
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 min-w-[180px]"
            onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
            whileHover={{ scale: 1.02 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm flex-1 text-left">{sorts.find(s => s.value === sortBy)?.label}</span>
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
                    onClick={() => { setSortBy(s.value); setSortOpen(false); }}
                    className={`w-full flex items-center px-4 py-2.5 text-sm hover:bg-zinc-800 ${
                      sortBy === s.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
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
          onNudge={() => console.log('Bulk nudge:', Array.from(selectedIds))}
          onEmail={() => console.log('Bulk email:', Array.from(selectedIds))}
          onExport={() => {
            const selectedStudents = students.filter(s => selectedIds.has(s.id));
            const csv = ['Name,Roll No,Email,Course,Health,Status'].concat(
              selectedStudents.map(s => `${s.name},${s.rollNo},${s.email},${s.course_code},${s.health_pct}%,${s.status}`)
            ).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'students.csv';
            a.click();
          }}
          isAllSelected={selectedIds.size === students.length && students.length > 0}
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
              {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected
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
          Showing {students.length} of {totalFiltered} students
        </p>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
            >
              <StudentCardPro
                student={student}
                isSelected={selectedIds.has(student.id)}
                onToggleSelect={toggleSelect}
                onViewProfile={onViewProfile}
                onNudge={onNudge}
                onViewFeedback={onViewFeedback}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isLoading ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more students...</span>
          </div>
        ) : hasMore ? (
          <button
            onClick={loadMore}
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
          >
            Load More
          </button>
        ) : students.length > 0 ? (
          <p className="text-zinc-500">All students loaded</p>
        ) : null}
      </div>

      {/* Empty State */}
      {!isLoading && students.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
          <p className="text-zinc-500 mb-6 text-center">
            {searchQuery ? 'Try adjusting your search or filters' : 'Start by enrolling students in your courses'}
          </p>
          <motion.button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
            onClick={onBulkEnroll}
            whileHover={{ scale: 1.02 }}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Bulk Enroll Students
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
