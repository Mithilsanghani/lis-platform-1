/**
 * CoursesPageV13 - LIS v13.0
 * Premium Courses page with advanced filtering, AI insights, infinite scroll
 * ALL MODALS USE DRAWER PATTERN with proper navigation
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  ChevronDown,
  Download,
  Plus,
  RefreshCw,
  Grid3X3,
  List,
  TrendingUp,
  Users,
  AlertTriangle,
  Activity,
  Heart,
  Loader2,
  X,
  SortAsc,
  SortDesc,
  FileText,
  Clock,
  CheckCircle,
  Sparkles,
  QrCode,
  MessageSquare,
  Eye,
  Send,
  Mail,
  Copy,
  ExternalLink,
  GraduationCap,
  Calendar,
  BarChart3,
  ArrowLeft,
  Bell,
} from 'lucide-react';
import { useCoursesQuery, type CoursesFilters, type CourseSort, type Course } from '../../hooks/useCoursesQuery';
import { CourseCardV13, CourseCardSkeleton } from './CourseCardV13';
import { AISuggestionBannerV13 } from './AISuggestionBannerV13';
import { FilterChipsV13 } from './FilterChipsV13';
import { BulkActionsBarV13 } from './BulkActionsBarV13';

// ===========================================
// DRAWER WRAPPER - Universal Navigation Pattern
// ===========================================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

function Drawer({ isOpen, onClose, title, subtitle, icon, iconBgColor = 'bg-blue-500/20', children, footer, width = 'lg' }: DrawerProps) {
  // Handle ESC key to close drawer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop - Click to close */}
      <motion.div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Drawer Panel - Slides from right */}
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`relative w-full ${widthClasses[width]} bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col h-full`}
      >
        {/* STICKY HEADER - Always visible */}
        <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
          {/* Back Navigation Bar */}
          <div className="px-5 py-3 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Courses</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Title Section */}
          <div className="p-5 bg-gradient-to-r from-blue-500/10 to-transparent">
            <div className="flex items-center gap-3">
              {icon && (
                <div className={`p-3 rounded-xl ${iconBgColor}`}>
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div className="flex-shrink-0 border-t border-zinc-800 p-4 bg-zinc-900">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface CoursesPageV13Props {
  professorId?: string;
}

// Stats card component - Enhanced
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  change?: { value: number; positive: boolean };
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'border-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', border: 'border-amber-500/20' },
    rose: { bg: 'bg-rose-500/10', icon: 'text-rose-400', border: 'border-rose-500/20' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div 
      className={`relative flex items-center gap-3 px-4 py-4 rounded-xl ${colors.bg} border ${colors.border} overflow-hidden`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.icon}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 truncate">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{value}</span>
          {change && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold ${change.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp className={`w-3 h-3 ${!change.positive ? 'rotate-180' : ''}`} />
              {change.positive ? '+' : ''}{change.value}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CoursesPageV13({ professorId }: CoursesPageV13Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModal, setActiveModal] = useState<'view' | 'feedback' | 'students' | 'qr' | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    courses,
    allCourses,
    stats,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    filters,
    setFilters,
    sort,
    setSort,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    bulkNudge,
    bulkExportPDF,
    bulkMarkReviewed,
  } = useCoursesQuery(professorId);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Show toast
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Handlers
  const handleBulkNudge = async () => {
    await bulkNudge();
    showToast(`Nudge sent to ${selectedIds.size} courses!`, 'success');
    clearSelection();
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    
    // Build CSV content
    const headers = ['Course Code', 'Course Name', 'Department', 'Students', 'Health %', 'Silent Students', 'Active Today', 'Last Activity', 'Semester'];
    const rows = allCourses.map(course => [
      course.code,
      course.name.replace(/,/g, ' '),
      course.department,
      course.student_count,
      course.health_pct,
      course.silent_count,
      course.active_today,
      new Date(course.last_activity_at).toLocaleDateString(),
      course.semester
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LIS_Courses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    showToast(`Exported ${allCourses.length} courses to CSV!`, 'success');
  };

  const handleCreateCourse = () => {
    setShowCreateModal(true);
  };

  // Course action handlers
  const handleViewCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setActiveModal('view');
    }
  };

  const handleViewFeedback = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setActiveModal('feedback');
    }
  };

  const handleViewStudents = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setActiveModal('students');
    }
  };

  const handleGenerateQR = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setActiveModal('qr');
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedCourse(null);
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handleCategoryChange = (category: CoursesFilters['category']) => {
    setFilters({ ...filters, category });
    setShowFilterDropdown(false);
  };

  const handleChipToggle = (chip: 'lowHealth' | 'highSilent' | 'largeClasses') => {
    setFilters({
      ...filters,
      chips: {
        ...filters.chips,
        [chip]: !filters.chips[chip],
      },
    });
  };

  const handleSortChange = (newSort: CourseSort) => {
    setSort(newSort);
    setShowSortDropdown(false);
  };

  // Calculate chip counts
  const chipCounts = {
    lowHealth: allCourses.filter(c => c.health_pct < 80).length,
    highSilent: allCourses.filter(c => c.silent_count > 10).length,
    largeClasses: allCourses.filter(c => c.student_count > 100).length,
  };

  // Calculate affected students for bulk actions
  const affectedStudents = Array.from(selectedIds)
    .map(id => courses.find(c => c.id === id)?.silent_count || 0)
    .reduce((a, b) => a + b, 0);

  const criticalCourses = allCourses.filter(c => c.health_pct < 75).length;

  const categoryLabels: Record<CoursesFilters['category'], string> = {
    'all': 'All Courses',
    'my-courses': 'My Courses',
    'low-health': 'Low Health (<80%)',
    'high-silent': 'High Silent (>10)',
    'recently-active': 'Recently Active',
  };

  const sortLabels: Record<CourseSort, string> = {
    'name-asc': 'Name A→Z',
    'name-desc': 'Name Z→A',
    'health-desc': 'Health: High→Low',
    'health-asc': 'Health: Low→High',
    'students-desc': 'Students: High→Low',
    'students-asc': 'Students: Low→High',
    'activity-desc': 'Last Active',
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header - Enhanced */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">Your Courses</h1>
                <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-sm font-semibold text-blue-300">
                  {allCourses.length}
                </span>
              </div>
              <p className="text-zinc-400 mt-0.5 flex items-center gap-3">
                <span>Student Activity Today</span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium text-sm">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{stats.activityChange}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500 text-sm">{stats.totalStudents.toLocaleString()} total students</span>
              </p>
            </div>
          </div>
        </div>

        {/* Header actions - Enhanced */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isExporting ? 1 : 1.02 }}
            whileTap={{ scale: isExporting ? 1 : 0.98 }}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export CSV
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleCreateCourse}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/25"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.35)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Course
          </motion.button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.totalCourses}
          color="blue"
        />
        <StatCard
          icon={Heart}
          label="Avg Health"
          value={`${stats.avgHealth}%`}
          change={{ value: 3, positive: true }}
          color="emerald"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents.toLocaleString()}
          color="purple"
        />
        <StatCard
          icon={Activity}
          label="Active Today"
          value={stats.activeToday.toLocaleString()}
          change={{ value: stats.activityChange, positive: true }}
          color="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Silent Students"
          value={stats.silentStudents.toLocaleString()}
          color="rose"
        />
      </div>

      {/* AI Suggestion Banner */}
      {stats.silentStudents > 50 && (
        <AISuggestionBannerV13
          silentCount={stats.silentStudents}
          criticalCourses={criticalCourses}
          onNudgeAll={handleBulkNudge}
          onViewDetails={() => handleCategoryChange('high-silent')}
        />
      )}

      {/* Controls row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 text-sm font-medium transition-all"
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-4 h-4" />
            {categoryLabels[filters.category]}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-20"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key as CoursesFilters['category'])}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                      ${filters.category === key 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <motion.button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 text-sm font-medium transition-all"
            whileTap={{ scale: 0.98 }}
          >
            {sort.includes('asc') ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            {sortLabels[sort]}
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-20"
              >
                {Object.entries(sortLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleSortChange(key as CourseSort)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                      ${sort === key 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Refresh */}
        <motion.button
          onClick={() => refetch()}
          disabled={isLoading}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Filter chips */}
      <FilterChipsV13
        chips={filters.chips}
        onToggle={handleChipToggle}
        counts={chipCounts}
      />

      {/* Error state */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/30"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span className="text-rose-300">Failed to load courses. Please try again.</span>
          </div>
          <motion.button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-medium transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Retry
          </motion.button>
        </motion.div>
      )}

      {/* Courses grid */}
      {isLoading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {Array.from({ length: 9 }).map((_, i) => (
            <CourseCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-24 h-24 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-zinc-500 mb-6 text-center max-w-md">
            {filters.search || filters.category !== 'all' || Object.values(filters.chips).some(v => v)
              ? "No courses match your current filters. Try adjusting your search or filter criteria."
              : "You haven't created any courses yet. Get started by creating your first course."
            }
          </p>
          {(filters.search || filters.category !== 'all' || Object.values(filters.chips).some(v => v)) ? (
            <motion.button
              onClick={() => setFilters({ search: '', category: 'all', chips: { lowHealth: false, highSilent: false, largeClasses: false } })}
              className="px-6 py-3 rounded-xl bg-blue-500/20 text-blue-400 font-medium hover:bg-blue-500/30 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              Clear all filters
            </motion.button>
          ) : (
            <motion.button
              onClick={handleCreateCourse}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-400 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Create your first course
            </motion.button>
          )}
        </motion.div>
      ) : (
        <>
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {courses.map((course, index) => (
              <CourseCardV13
                key={course.id}
                course={course}
                isSelected={selectedIds.has(course.id)}
                onToggleSelect={toggleSelect}
                onViewCourse={handleViewCourse}
                onViewFeedback={handleViewFeedback}
                onViewStudents={handleViewStudents}
                onGenerateQR={handleGenerateQR}
                index={index}
              />
            ))}
          </div>

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-3 text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more courses...</span>
              </div>
            )}
            {!hasNextPage && courses.length > 0 && (
              <p className="text-zinc-500 text-sm">
                Showing all {allCourses.length} courses
              </p>
            )}
          </div>
        </>
      )}

      {/* Bulk actions bar */}
      <BulkActionsBarV13
        selectedCount={selectedIds.size}
        totalCount={courses.length}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onBulkNudge={handleBulkNudge}
        onBulkExport={bulkExportPDF}
        onBulkMarkReviewed={bulkMarkReviewed}
        affectedStudents={affectedStudents}
      />

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`
              fixed bottom-6 right-6 z-50
              flex items-center gap-3 px-4 py-3 rounded-xl
              shadow-xl
              ${toast.type === 'success' 
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              }
            `}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateCourseModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={(courseName) => {
              setShowCreateModal(false);
              showToast(`Course "${courseName}" created successfully!`, 'success');
            }}
          />
        )}
      </AnimatePresence>

      {/* Course Detail Modals */}
      <AnimatePresence>
        {selectedCourse && activeModal === 'view' && (
          <CourseViewModal course={selectedCourse} onClose={closeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCourse && activeModal === 'feedback' && (
          <CourseFeedbackModal course={selectedCourse} onClose={closeModal} onNudge={(count) => showToast(`Nudge sent to ${count} students!`, 'success')} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCourse && activeModal === 'students' && (
          <CourseStudentsModal course={selectedCourse} onClose={closeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCourse && activeModal === 'qr' && (
          <CourseQRModal course={selectedCourse} onClose={closeModal} onCopy={() => showToast('QR code link copied!', 'success')} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Create Course Modal Component
function CreateCourseModal({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void; 
  onSuccess: (name: string) => void;
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    department: 'CS',
    semester: 'Spring 2026',
    schedule: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = [
    { value: 'CS', label: 'Computer Science' },
    { value: 'AI', label: 'Artificial Intelligence' },
    { value: 'EC', label: 'Electronics' },
    { value: 'EE', label: 'Electrical Engineering' },
    { value: 'ME', label: 'Mechanical Engineering' },
    { value: 'MA', label: 'Mathematics' },
    { value: 'HS', label: 'Humanities' },
    { value: 'CH', label: 'Chemistry' },
  ];

  const semesters = ['Spring 2026', 'Fall 2025', 'Summer 2026'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = 'Course code is required';
    if (formData.code.length < 3) newErrors.code = 'Code must be at least 3 characters';
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (formData.name.length < 5) newErrors.name = 'Name must be at least 5 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onSuccess(formData.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-zinc-800 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Course</h2>
              <p className="text-sm text-zinc-400">Set up a new course for your students</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course Code & Name */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Course Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="CS101"
                className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border ${errors.code ? 'border-rose-500/50' : 'border-zinc-700'} text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all`}
              />
              {errors.code && <p className="text-xs text-rose-400 mt-1">{errors.code}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Course Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Introduction to Computer Science"
                className={`w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border ${errors.name ? 'border-rose-500/50' : 'border-zinc-700'} text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all`}
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Department & Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
              >
                {departments.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
              >
                {semesters.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Schedule (Optional)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g., Mon/Wed/Fri 10:00 AM - 11:30 AM"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the course content..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>

          {/* Quick Actions */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-300">Next Steps After Creation</p>
                <ul className="text-xs text-zinc-400 mt-1 space-y-1">
                  <li>• Upload student enrollment via CSV</li>
                  <li>• Configure lecture schedule and QR attendance</li>
                  <li>• Enable AI-powered engagement tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-end gap-3">
          <motion.button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Course
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Course View Drawer - Shows full course details with DRAWER PATTERN
function CourseViewModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [announcing, setAnnouncing] = useState(false);

  const handleDownloadSyllabus = async () => {
    setDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${course.code}_Syllabus.pdf`;
    setDownloading(false);
  };

  const handleSendAnnouncement = () => {
    setAnnouncing(true);
    setTimeout(() => setAnnouncing(false), 1500);
  };

  const handleOpenLMS = () => {
    window.open(`https://lms.university.edu/course/${course.code.toLowerCase()}`, '_blank');
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title={course.name}
      subtitle={`${course.code} • ${course.department}`}
      icon={
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
          {course.code.slice(0, 2)}
        </div>
      }
      iconBgColor="bg-transparent"
      width="xl"
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {course.is_owner && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-500/20 text-blue-400">Owner</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <motion.button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Close
            </motion.button>
            <motion.button onClick={handleOpenLMS} className="px-5 py-2.5 rounded-xl bg-blue-500 text-white font-medium flex items-center gap-2 hover:bg-blue-400" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <ExternalLink className="w-4 h-4" />
              Open in LMS
            </motion.button>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Users className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{course.student_count}</p>
            <p className="text-xs text-zinc-400">Total Students</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Activity className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">{course.active_today}</p>
            <p className="text-xs text-zinc-400">Active Today</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400 mb-2" />
            <p className="text-2xl font-bold text-white">{course.silent_count}</p>
            <p className="text-xs text-zinc-400">Silent Students</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Heart className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{course.health_pct}%</p>
            <p className="text-xs text-zinc-400">Course Health</p>
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">Course Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
              <GraduationCap className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500">Department</p>
                <p className="text-sm font-medium text-white">{course.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-500">Semester</p>
                <p className="text-sm font-medium text-white">{course.semester}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-300">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              onClick={handleDownloadSyllabus}
              disabled={downloading}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {downloading ? <Loader2 className="w-5 h-5 text-blue-400 animate-spin" /> : <FileText className="w-5 h-5 text-blue-400" />}
              <span className="text-xs text-zinc-300">{downloading ? 'Downloading...' : 'Download Syllabus'}</span>
            </motion.button>
            <motion.button
              onClick={handleSendAnnouncement}
              disabled={announcing}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {announcing ? <Loader2 className="w-5 h-5 text-amber-400 animate-spin" /> : <Bell className="w-5 h-5 text-amber-400" />}
              <span className="text-xs text-zinc-300">{announcing ? 'Sending...' : 'Send Announcement'}</span>
            </motion.button>
            <motion.button
              onClick={handleOpenLMS}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-zinc-300">Open in LMS</span>
            </motion.button>
          </div>
        </div>

        {/* Quick Analytics */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-zinc-300">Quick Analytics</h3>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Engagement this week</span>
            <span className="text-emerald-400 font-semibold">+12%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-zinc-700 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${course.health_pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500" 
            />
          </div>
        </div>

        {/* AI Tip */}
        {course.ai_tip && (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-300 mb-1">AI Coach Recommendation</p>
                <p className="text-sm text-zinc-300">{course.ai_tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

// Course Feedback Drawer - DRAWER PATTERN
function CourseFeedbackModal({ course, onClose, onNudge }: { course: Course; onClose: () => void; onNudge: (count: number) => void }) {
  const [nudging, setNudging] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const mockFeedback = [
    { id: 1, student: 'Rahul S.', rating: 4, comment: 'Great explanation of recursion concepts!', date: '2 hours ago', resolved: false },
    { id: 2, student: 'Priya M.', rating: 5, comment: 'The examples were very helpful.', date: '5 hours ago', resolved: true },
    { id: 3, student: 'Amit K.', rating: 3, comment: 'Could use more practice problems.', date: '1 day ago', resolved: false },
    { id: 4, student: 'Sneha R.', rating: 4, comment: 'Clear and concise lecture.', date: '2 days ago', resolved: true },
  ];

  const handleNudge = async () => {
    setNudging(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNudging(false);
    onNudge(course.silent_count);
  };

  const handleReply = (id: number) => {
    if (replyText.trim()) {
      setReplyingTo(null);
      setReplyText('');
    }
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="Course Feedback"
      subtitle={`${course.code} • ${course.unread_count} unread`}
      icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
      iconBgColor="bg-blue-500/20"
      width="xl"
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">Avg Rating: <span className="text-amber-400 font-semibold">4.0 ★</span></div>
            {course.silent_count > 0 && (
              <motion.button 
                onClick={handleNudge}
                disabled={nudging}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-medium text-sm flex items-center gap-2 disabled:opacity-50" 
                whileHover={{ scale: nudging ? 1 : 1.02 }}
              >
                {nudging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {nudging ? 'Nudging...' : `Nudge Silent (${course.silent_count})`}
              </motion.button>
            )}
          </div>
          <motion.button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700" whileHover={{ scale: 1.02 }}>Close</motion.button>
        </div>
      }
    >
      <div className="p-6 space-y-4">
        {mockFeedback.map((fb) => (
          <div key={fb.id} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium text-white">{fb.student.charAt(0)}</div>
                <span className="font-medium text-white">{fb.student}</span>
                {fb.resolved && <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">Resolved</span>}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => <span key={i} className={`text-sm ${i < fb.rating ? 'text-amber-400' : 'text-zinc-600'}`}>★</span>)}</div>
                <span className="text-xs text-zinc-500">{fb.date}</span>
              </div>
            </div>
            <p className="text-sm text-zinc-300 mb-3">{fb.comment}</p>
            
            {/* Reply section */}
            {replyingTo === fb.id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  rows={2}
                />
                <div className="flex gap-2">
                  <motion.button onClick={() => handleReply(fb.id)} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm" whileTap={{ scale: 0.95 }}>Send Reply</motion.button>
                  <motion.button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 rounded-lg bg-zinc-700 text-zinc-300 text-sm" whileTap={{ scale: 0.95 }}>Cancel</motion.button>
                </div>
              </div>
            ) : (
              <motion.button 
                onClick={() => setReplyingTo(fb.id)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                whileHover={{ x: 2 }}
              >
                <MessageSquare className="w-3 h-3" />
                Reply
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// Course Students Drawer - DRAWER PATTERN
function CourseStudentsModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const mockStudents = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@uni.edu', status: 'active', lastActive: '10 min ago' },
    { id: 2, name: 'Priya Patel', email: 'priya.p@uni.edu', status: 'active', lastActive: '2 hours ago' },
    { id: 3, name: 'Amit Kumar', email: 'amit.k@uni.edu', status: 'silent', lastActive: '5 days ago' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.r@uni.edu', status: 'active', lastActive: '1 hour ago' },
    { id: 5, name: 'Vikram Joshi', email: 'vikram.j@uni.edu', status: 'silent', lastActive: '7 days ago' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [nudging, setNudging] = useState(false);
  const filtered = mockStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleNudgeSilent = async () => {
    setNudging(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNudging(false);
  };

  const handleEmailStudent = (studentId: number) => {
    // Mock email action
    console.log('Emailing student:', studentId);
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="Students"
      subtitle={`${course.code} • ${course.student_count} enrolled`}
      icon={<Users className="w-6 h-6 text-emerald-400" />}
      iconBgColor="bg-emerald-500/20"
      width="xl"
      footer={
        <div className="flex items-center justify-between">
          <motion.button 
            onClick={handleNudgeSilent}
            disabled={nudging}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-medium flex items-center gap-2 disabled:opacity-50" 
            whileHover={{ scale: nudging ? 1 : 1.02 }}
          >
            {nudging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {nudging ? 'Nudging...' : `Nudge Silent (${course.silent_count})`}
          </motion.button>
          <motion.button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700" whileHover={{ scale: 1.02 }}>Close</motion.button>
        </div>
      }
    >
      {/* Search */}
      <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="divide-y divide-zinc-800/50">
        {filtered.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">{student.name.charAt(0)}</div>
              <div>
                <p className="font-medium text-white">{student.name}</p>
                <p className="text-xs text-zinc-500">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {student.status}
              </span>
              <span className="text-xs text-zinc-500">{student.lastActive}</span>
              <motion.button 
                onClick={() => handleEmailStudent(student.id)}
                whileHover={{ scale: 1.1 }} 
                className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// Course QR Drawer - DRAWER PATTERN
function CourseQRModal({ course, onClose, onCopy }: { course: Course; onClose: () => void; onCopy: () => void }) {
  const qrLink = `https://lis.edu/attend/${course.code.toLowerCase()}`;
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(qrLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy();
  };

  const handleDownload = async () => {
    setDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock download
    setDownloading(false);
  };

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="Attendance QR Code"
      subtitle={`${course.code} • ${course.name}`}
      icon={<QrCode className="w-6 h-6 text-purple-400" />}
      iconBgColor="bg-purple-500/20"
      width="md"
      footer={
        <div className="flex justify-center gap-3">
          <motion.button 
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium flex items-center gap-2 hover:bg-zinc-700 disabled:opacity-50" 
            whileHover={{ scale: downloading ? 1 : 1.02 }}
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Downloading...' : 'Download PNG'}
          </motion.button>
          <motion.button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-400" whileHover={{ scale: 1.02 }}>Done</motion.button>
        </div>
      }
    >
      <div className="p-6">
        {/* QR Code Placeholder */}
        <div className="aspect-square max-w-[240px] mx-auto bg-white rounded-2xl p-4 mb-6">
          <div className="w-full h-full bg-zinc-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-24 h-24 text-zinc-800 mx-auto mb-2" />
              <p className="text-xs text-zinc-600">Scan to mark attendance</p>
            </div>
          </div>
        </div>

        {/* Link */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
          <input type="text" value={qrLink} readOnly className="flex-1 bg-transparent text-sm text-zinc-300 outline-none" />
          <motion.button 
            onClick={handleCopy} 
            className={`p-2 rounded-lg transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-zinc-700 text-zinc-400 hover:text-white'}`}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </motion.button>
        </div>

        <p className="text-xs text-zinc-500 text-center mt-4">QR code expires in 30 minutes</p>

        {/* Usage Tips */}
        <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-300 mb-1">Quick Tips</p>
              <ul className="text-xs text-zinc-400 space-y-1">
                <li>• Project this QR code at the start of class</li>
                <li>• Students scan with their phone camera</li>
                <li>• Attendance is logged automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
