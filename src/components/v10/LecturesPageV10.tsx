/**
 * LecturesPageV10 - Production Lectures Page with Infinite Scroll
 * Core LIS feature: Lecture management with feedback analytics
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Presentation,
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
  MessageSquare,
  Brain,

  AlertTriangle,
  Radio,
  Calendar,
  CheckSquare,
  Square,
  Archive,
  Bell,
  Eye,
  Save,
  Clock,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { useInfiniteLectures, type LectureSortOption, type LectureFilterOption } from '../../hooks/useInfiniteLectures';
import { LectureCardPro } from './LectureCardPro';

interface LecturesPageV10Props {
  professorId?: string;
  onCreateLecture?: () => void;
  onViewFeedback?: (id: string) => void;
  onEditLecture?: (id: string) => void;
  onDeleteLecture?: (id: string) => void;
  onQRCode?: (id: string) => void;
}

const sortOptions: { value: LectureSortOption; label: string }[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'understanding-desc', label: 'Understanding (High→Low)' },
  { value: 'understanding-asc', label: 'Understanding (Low→High)' },
  { value: 'feedback-desc', label: 'Most Feedback' },
  { value: 'course', label: 'By Course' },
  { value: 'title', label: 'By Title' },
];

const filterOptions: { value: LectureFilterOption; label: string }[] = [
  { value: 'all', label: 'All Lectures' },
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'live', label: 'Live Now' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'unread', label: 'Unread Feedback' },
  { value: 'low-understanding', label: 'Low Understanding (<80%)' },
];

// Animated Counter Component
function AnimatedCounter({ value, duration = 1.5, delay = 0 }: { value: number; duration?: number; delay?: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(value * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [value, duration, delay]);

  return <span>{displayValue.toLocaleString()}</span>;
}

// Stats Card Component
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix = '', 
  trend, 
  color, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  suffix?: string; 
  trend?: number; 
  color: string;
  delay?: number;
}) {
  const colorStyles: Record<string, { bg: string; border: string; icon: string; value: string }> = {
    blue: { bg: 'from-blue-500/15 to-blue-600/5', border: 'border-blue-500/30', icon: 'bg-blue-500/20 text-blue-400', value: 'text-blue-400' },
    emerald: { bg: 'from-emerald-500/15 to-emerald-600/5', border: 'border-emerald-500/30', icon: 'bg-emerald-500/20 text-emerald-400', value: 'text-emerald-400' },
    purple: { bg: 'from-purple-500/15 to-purple-600/5', border: 'border-purple-500/30', icon: 'bg-purple-500/20 text-purple-400', value: 'text-purple-400' },
    amber: { bg: 'from-amber-500/15 to-amber-600/5', border: 'border-amber-500/30', icon: 'bg-amber-500/20 text-amber-400', value: 'text-amber-400' },
    rose: { bg: 'from-rose-500/15 to-rose-600/5', border: 'border-rose-500/30', icon: 'bg-rose-500/20 text-rose-400', value: 'text-rose-400' },
  };
  const styles = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={`p-4 rounded-2xl border backdrop-blur-xl cursor-pointer bg-gradient-to-br ${styles.bg} ${styles.border} hover:shadow-lg transition-all group`}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2.5 rounded-xl ${styles.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${styles.value} flex items-baseline gap-1`}>
        <AnimatedCounter value={value} delay={delay * 0.1} />
        {suffix && <span className="text-base font-medium opacity-70">{suffix}</span>}
      </div>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </motion.div>
  );
}

// Bulk Actions Dropdown
function BulkActionsDropdown({
  selectedCount,
  totalCount,
  isAllSelected,
  onToggleSelectAll,
  onMarkRead,
  onNudgeSilent,
  onArchive,
  onExport,
  onDeselectAll,
}: {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onMarkRead: () => void;
  onNudgeSilent: () => void;
  onArchive: () => void;
  onExport: () => void;
  onDeselectAll: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
          selectedCount > 0
            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {selectedCount > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
        {selectedCount > 0 ? `${selectedCount} Selected` : 'Bulk Actions'}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-56 py-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl z-50"
            >
              <button
                onClick={() => onToggleSelectAll()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                {isAllSelected ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4" />}
                {isAllSelected ? 'Deselect All' : `Select All (${totalCount})`}
              </button>

              {selectedCount > 0 && (
                <>
                  <div className="my-2 border-t border-zinc-800" />
                  <button
                    onClick={() => { onMarkRead(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Eye className="w-4 h-4" />
                    Mark All Read
                  </button>
                  <button
                    onClick={() => { onNudgeSilent(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10"
                  >
                    <Bell className="w-4 h-4" />
                    Nudge Silent Students
                  </button>
                  <button
                    onClick={() => { onExport(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10"
                  >
                    <Download className="w-4 h-4" />
                    Export Selected
                  </button>
                  <div className="my-2 border-t border-zinc-800" />
                  <button
                    onClick={() => { onArchive(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10"
                  >
                    <Archive className="w-4 h-4" />
                    Archive Selected
                  </button>
                  <div className="my-2 border-t border-zinc-800" />
                  <button
                    onClick={() => { onDeselectAll(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800"
                  >
                    <X className="w-4 h-4" />
                    Clear Selection
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE LECTURE MODAL - Full modal with form validation
// ═══════════════════════════════════════════════════════════════════════════════
function CreateLectureModal({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const courses = [
    { code: 'CS101', name: 'Introduction to Programming' },
    { code: 'CS201', name: 'Data Structures & Algorithms' },
    { code: 'CS301', name: 'Database Systems' },
    { code: 'MA101', name: 'Linear Algebra' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!courseCode) newErrors.courseCode = 'Please select a course';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call
    onSave({ title, courseCode, date, time, duration: parseInt(duration) });
    setIsSaving(false);
    onClose();
  };

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Plus className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Lecture</h2>
              <p className="text-sm text-zinc-400">Schedule a new lecture for your course</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Lecture Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800/50 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
                errors.title ? 'border-rose-500 focus:ring-rose-500/20' : 'border-zinc-700 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
              placeholder="e.g., Introduction to Arrays"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Course *</label>
            <select
              value={courseCode}
              onChange={(e) => { setCourseCode(e.target.value); setErrors(prev => ({ ...prev, courseCode: '' })); }}
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800/50 border text-white focus:outline-none focus:ring-2 transition-all ${
                errors.courseCode ? 'border-rose-500 focus:ring-rose-500/20' : 'border-zinc-700 focus:border-purple-500 focus:ring-purple-500/20'
              }`}
            >
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
            {errors.courseCode && <p className="text-xs text-rose-400 mt-1">{errors.courseCode}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Time *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Duration (minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes (1 hour)</option>
              <option value="90">90 minutes (1.5 hours)</option>
              <option value="120">120 minutes (2 hours)</option>
            </select>
          </div>

          {/* Info Card */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-300 mb-1">What happens next?</p>
                <ul className="text-xs text-zinc-400 space-y-1">
                  <li>• Students will see this lecture in their dashboard</li>
                  <li>• A QR code will be generated for attendance</li>
                  <li>• You can start the lecture anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-xs text-zinc-500">* Required fields</p>
          <div className="flex gap-3">
            <motion.button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-medium flex items-center gap-2 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={!isSaving ? { scale: 1.02 } : {}}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Lecture
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function LecturesPageV10({
  professorId,
  onCreateLecture,
  onViewFeedback,
  onEditLecture,
  onDeleteLecture,
  onQRCode,
}: LecturesPageV10Props) {
  const {
    lectures,
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
    bulkMarkRead,
    bulkNudgeSilent,
    bulkArchive,
    exportCSV,
    refresh,
    isRefreshing,
  } = useInfiniteLectures(professorId);

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showSortDropdown, setShowSortDropdown] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Handle create lecture - use internal modal if no external handler
  const handleCreateLecture = () => {
    if (onCreateLecture) {
      onCreateLecture();
    } else {
      setShowCreateModal(true);
    }
  };

  const handleLectureCreated = (data: any) => {
    console.log('Lecture created:', data);
    refresh();
  };

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) loadMore();
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [hasMore, isLoadingMore, loadMore]);

  // Activity sparkline (mock)
  const activityData = [65, 72, 78, 85, 82, 88, 85];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-purple-500/20">
              <Presentation className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Your Lectures
                <span className="text-zinc-500 text-lg font-normal ml-2">({stats.totalLectures})</span>
              </h1>
            </div>
          </div>
          
          {/* Feedback Activity Sparkline */}
          <div className="flex items-center gap-3 mt-2 ml-14">
            <span className="text-sm text-zinc-500">Feedback Activity Today</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-0.5 h-4">
                {activityData.map((value, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-500 rounded-full opacity-60"
                    style={{ height: `${(value / 100) * 100}%` }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-purple-400 flex items-center gap-0.5">
                {stats.avgUnderstanding}%
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <BulkActionsDropdown
            selectedCount={selectedIds.size}
            totalCount={lectures.length}
            isAllSelected={selectedIds.size === lectures.length && lectures.length > 0}
            onToggleSelectAll={toggleSelectAll}
            onMarkRead={bulkMarkRead}
            onNudgeSilent={bulkNudgeSilent}
            onArchive={bulkArchive}
            onExport={exportCSV}
            onDeselectAll={deselectAll}
          />

          <motion.button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>

          <motion.button
            onClick={handleCreateLecture}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Lecture
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Presentation} label="Total Lectures" value={stats.totalLectures} trend={5} color="purple" delay={0} />
          <StatCard icon={Brain} label="Avg Understanding" value={stats.avgUnderstanding} suffix="%" trend={stats.avgUnderstanding > 80 ? 3 : -2} color="emerald" delay={1} />
          <StatCard icon={MessageSquare} label="Feedback Responses" value={stats.totalFeedback} trend={12} color="blue" delay={2} />
          <StatCard icon={AlertTriangle} label="Silent Flags" value={stats.totalSilent} trend={-5} color="amber" delay={3} />
          {stats.liveLectures > 0 ? (
            <StatCard icon={Radio} label="Live Now" value={stats.liveLectures} color="rose" delay={4} />
          ) : (
            <StatCard icon={Calendar} label="Today's Lectures" value={stats.todayLectures} color="rose" delay={4} />
          )}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, date, or course..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
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
                  className="absolute top-full left-0 mt-2 w-60 py-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl z-50"
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
                           option.value === 'today' ? filterCounts.today :
                           option.value === 'this-week' ? filterCounts.thisWeek :
                           option.value === 'live' ? filterCounts.live :
                           option.value === 'scheduled' ? filterCounts.scheduled :
                           option.value === 'unread' ? filterCounts.unread :
                           filterCounts.lowUnderstanding}
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
                        sortBy === option.value ? 'text-purple-400' : 'text-zinc-300'
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
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
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

      {/* Selection Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10 border border-purple-500/30"
          >
            <span className="text-sm text-purple-400 font-medium">
              {selectedIds.size} lecture{selectedIds.size > 1 ? 's' : ''} selected
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

      {/* AI Suggestion */}
      {stats.lowUnderstandingCount > 3 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">AI Suggestion</p>
              <p className="text-xs text-zinc-400">
                {stats.lowUnderstandingCount} lectures have understanding below 80%. Consider revising these topics.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterBy('low-understanding')}
            className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30"
          >
            View Lectures
          </button>
        </motion.div>
      )}

      {/* Live Lectures Banner */}
      {stats.liveLectures > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-rose-500/20 to-rose-600/10 border border-rose-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 animate-pulse">
              <Radio className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{stats.liveLectures} Live Lecture{stats.liveLectures > 1 ? 's' : ''}</p>
              <p className="text-xs text-zinc-400">Students are currently attending</p>
            </div>
          </div>
          <button
            onClick={() => setFilterBy('live')}
            className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30"
          >
            View Live
          </button>
        </motion.div>
      )}

      {/* Lectures Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <Presentation className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No lectures found</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-md">
            {searchQuery
              ? `No lectures match "${searchQuery}". Try a different search.`
              : filterBy !== 'all'
              ? 'No lectures match the current filter.'
              : "You haven't created any lectures yet."}
          </p>
          {!searchQuery && filterBy === 'all' && (
            <motion.button
              onClick={handleCreateLecture}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Create Your First Lecture
            </motion.button>
          )}
        </motion.div>
      ) : (
        <>
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {lectures.map((lecture, index) => (
              <LectureCardPro
                key={lecture.id}
                lecture={lecture}
                isSelected={selectedIds.has(lecture.id)}
                onToggleSelect={toggleSelect}
                onViewFeedback={onViewFeedback}
                onEdit={onEditLecture}
                onDelete={onDeleteLecture}
                onQRCode={onQRCode}
                index={index}
              />
            ))}
          </div>

          {/* Load More */}
          <div ref={loadMoreRef} className="flex items-center justify-center py-8">
            {isLoadingMore ? (
              <div className="flex items-center gap-3 text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading more lectures...</span>
              </div>
            ) : hasMore ? (
              <button
                onClick={loadMore}
                className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-medium"
              >
                Load More
              </button>
            ) : lectures.length > 0 ? (
              <div className="flex items-center gap-2 text-zinc-600 text-sm">
                <Check className="w-4 h-4" />
                All {lectures.length} lectures loaded
              </div>
            ) : null}
          </div>
        </>
      )}

      {/* Create Lecture Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateLectureModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleLectureCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
