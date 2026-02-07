/**
 * StudentCoursesPage - PRODUCTION VERSION
 * NO MOCK DATA - All data from useLISStore
 * Empty states when no data exists
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  X,
  Activity,
  Inbox,
} from 'lucide-react';
import { useLISStore } from '../../store/useLISStore';

interface EnhancedCourse {
  id: string;
  code: string;
  name: string;
  professorId: string;
  professorName: string;
  semester: string;
  department: string;
  enrolledCount: number;
  isActive: boolean;
  // Computed from real data
  schedule: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  nextClass: string | null;
  avgUnderstanding: number;
  understandingTrend: 'up' | 'down' | 'stable';
  pendingFeedback: number;
  color: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'cyan';
}

// Stats card component
function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
  progress,
  trend,
  alert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  color: string;
  progress?: number;
  trend?: 'up' | 'down';
  alert?: boolean;
}) {
  const colorMap: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  };

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorMap[color]} border backdrop-blur-sm`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg bg-white/5`}>{icon}</div>
        {trend && (
          <span className={trend === 'up' ? 'text-green-400' : 'text-orange-400'}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </span>
        )}
        {alert && <AlertCircle size={16} className="text-orange-400 animate-pulse" />}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-400 mt-1">{label}</p>
      {subtext && <p className="text-xs text-zinc-500 mt-0.5">{subtext}</p>}
      {progress !== undefined && (
        <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              color === 'green' ? 'bg-green-500' : color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function StudentCoursesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'needs-attention'>('all');
  const [selectedCourse, setSelectedCourse] = useState<EnhancedCourse | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get REAL data from store
  const {
    lectures,
    feedback,
    students,
    professors,
    getStudentCourses,
  } = useLISStore();

  // For now, use first student (would come from auth context)
  const currentStudent = students[0];
  const studentId = currentStudent?.id || '';

  // Get student's enrolled courses with computed metrics
  const enhancedCourses = useMemo<EnhancedCourse[]>(() => {
    if (!studentId) return [];
    
    const studentCourses = getStudentCourses(studentId);
    const colors: EnhancedCourse['color'][] = ['purple', 'blue', 'green', 'orange', 'pink', 'cyan'];

    return studentCourses.map((course, idx) => {
      // Get lectures for this course
      const courseLectures = lectures.filter(l => l.courseId === course.id);
      const completedLectures = courseLectures.filter(l => l.status === 'completed').length;
      const totalLectures = courseLectures.length;
      const progress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

      // Get feedback from this student for this course
      const studentFeedback = feedback.filter(
        f => f.studentId === studentId && f.courseId === course.id
      );
      
      // Calculate understanding from real feedback
      let avgUnderstanding = 0;
      if (studentFeedback.length > 0) {
        const understandingScores = studentFeedback.map(f => {
          if (f.understandingLevel === 'fully') return 100;
          if (f.understandingLevel === 'partial') return 60;
          return 20;
        });
        avgUnderstanding = Math.round(
          understandingScores.reduce((a, b) => a + b, 0) / understandingScores.length
        );
      }

      // Count pending feedback (completed lectures without feedback)
      const completedLectureIds = courseLectures
        .filter(l => l.status === 'completed')
        .map(l => l.id);
      const feedbackLectureIds = studentFeedback.map(f => f.lectureId);
      const pendingFeedback = completedLectureIds.filter(
        id => !feedbackLectureIds.includes(id)
      ).length;

      // Get professor name
      const professor = professors.find(p => p.id === course.professorId);
      const professorName = professor?.name || 'Unknown';

      // Get enrolled count (students enrolled in this course)
      const enrolledCount = students.filter(s => 
        s.enrolledCourses.includes(course.id)
      ).length;

      // Find next scheduled lecture
      const now = new Date();
      const upcomingLectures = courseLectures
        .filter(l => l.status === 'scheduled' && new Date(l.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let nextClass: string | null = null;
      if (upcomingLectures.length > 0) {
        const next = upcomingLectures[0];
        const date = new Date(next.date);
        const isToday = date.toDateString() === now.toDateString();
        const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();
        
        const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        if (isToday) {
          nextClass = `Today, ${timeStr}`;
        } else if (isTomorrow) {
          nextClass = `Tomorrow, ${timeStr}`;
        } else {
          nextClass = `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
        }
      }

      // Compute schedule from lectures
      let schedule = 'No schedule';
      if (courseLectures.length > 0) {
        const days = [...new Set(courseLectures.map(l => 
          new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' })
        ))];
        schedule = days.slice(0, 3).join(', ');
      }

      return {
        id: course.id,
        code: course.code,
        name: course.name,
        professorId: course.professorId,
        professorName,
        semester: course.semester,
        department: course.department,
        enrolledCount,
        isActive: true,
        schedule,
        progress,
        totalLectures,
        completedLectures,
        nextClass,
        avgUnderstanding,
        understandingTrend: 'stable' as const,
        pendingFeedback,
        color: colors[idx % colors.length],
      };
    });
  }, [studentId, getStudentCourses, lectures, feedback, students, professors]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return enhancedCourses.filter(course => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.professorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'active' && course.isActive) ||
        (filterStatus === 'needs-attention' && (course.pendingFeedback > 0 || course.avgUnderstanding < 70));

      return matchesSearch && matchesFilter;
    });
  }, [enhancedCourses, searchQuery, filterStatus]);

  // Calculate stats from REAL data
  const stats = useMemo(() => {
    const totalLectures = enhancedCourses.reduce((sum, c) => sum + c.totalLectures, 0);
    const completedLectures = enhancedCourses.reduce((sum, c) => sum + c.completedLectures, 0);
    const avgUnderstanding = enhancedCourses.length > 0
      ? Math.round(enhancedCourses.reduce((sum, c) => sum + c.avgUnderstanding, 0) / enhancedCourses.length)
      : 0;
    const totalPendingFeedback = enhancedCourses.reduce((sum, c) => sum + c.pendingFeedback, 0);
    const feedbackGiven = completedLectures - totalPendingFeedback;

    return {
      totalCourses: enhancedCourses.length,
      completedLectures,
      totalLectures,
      avgUnderstanding,
      feedbackGiven: Math.max(0, feedbackGiven),
      totalPendingFeedback,
    };
  }, [enhancedCourses]);

  const colorStyles: Record<string, { bg: string; border: string; text: string; gradient: string; glow: string }> = {
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      gradient: 'from-purple-600 to-purple-400',
      glow: 'shadow-purple-500/20',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      gradient: 'from-blue-600 to-blue-400',
      glow: 'shadow-blue-500/20',
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      gradient: 'from-green-600 to-green-400',
      glow: 'shadow-green-500/20',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      gradient: 'from-orange-600 to-orange-400',
      glow: 'shadow-orange-500/20',
    },
    pink: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/30',
      text: 'text-pink-400',
      gradient: 'from-pink-600 to-pink-400',
      glow: 'shadow-pink-500/20',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      gradient: 'from-cyan-600 to-cyan-400',
      glow: 'shadow-cyan-500/20',
    },
  };

  // EMPTY STATE - No courses enrolled
  if (enhancedCourses.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="p-6 rounded-full bg-zinc-800/50 border border-zinc-700 mb-6">
          <Inbox className="w-16 h-16 text-zinc-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">No Courses Yet</h2>
        <p className="text-zinc-400 max-w-md mb-6">
          You haven't been enrolled in any courses yet. Once a professor enrolls you in a course, it will appear here.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dev/student/dashboard')}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            My Courses
          </h1>
          <p className="text-zinc-400 mt-1">
            Track your enrolled courses and academic progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full max-w-[600px] rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-all ${
              showFilters || filterStatus !== 'all'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                : 'bg-slate-800/50 border-slate-700/50 text-zinc-400 hover:text-white hover:border-slate-600'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <span className="text-sm font-medium text-zinc-400">Filter by:</span>
              {(['all', 'active', 'needs-attention'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                      : 'bg-slate-800/50 border border-slate-700/50 text-zinc-400 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All Courses' : status === 'active' ? 'Active' : 'Needs Attention'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen size={18} />}
          label="Total Courses"
          value={stats.totalCourses.toString()}
          subtext={`${filteredCourses.length} showing`}
          color="purple"
        />
        <StatCard
          icon={<CheckCircle size={18} />}
          label="Lectures Attended"
          value={`${stats.completedLectures}`}
          subtext={stats.totalLectures > 0 ? `of ${stats.totalLectures} total` : 'No lectures yet'}
          color="green"
          progress={stats.totalLectures > 0 ? Math.round((stats.completedLectures / stats.totalLectures) * 100) : 0}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Avg Understanding"
          value={`${stats.avgUnderstanding}%`}
          subtext={stats.avgUnderstanding >= 70 ? 'Good standing' : 'Needs improvement'}
          color={stats.avgUnderstanding >= 70 ? 'blue' : 'orange'}
          trend={stats.avgUnderstanding >= 70 ? 'up' : 'down'}
        />
        <StatCard
          icon={<MessageSquare size={18} />}
          label="Feedback Given"
          value={stats.feedbackGiven.toString()}
          subtext={stats.totalPendingFeedback > 0 ? `${stats.totalPendingFeedback} pending` : 'All caught up!'}
          color={stats.totalPendingFeedback > 0 ? 'orange' : 'green'}
          alert={stats.totalPendingFeedback > 0}
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCourses.map((course, idx) => {
          const styles = colorStyles[course.color];
          const needsAttention = course.pendingFeedback > 0 || course.avgUnderstanding < 70;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedCourse(course)}
              className={`group relative p-5 rounded-2xl bg-white/[0.02] border transition-all cursor-pointer hover:shadow-lg ${
                needsAttention
                  ? 'border-orange-500/30 hover:border-orange-500/50'
                  : 'border-white/[0.06] hover:border-white/[0.15]'
              } ${styles.glow}`}
            >
              {needsAttention && (
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-medium flex items-center gap-1 shadow-lg">
                  <AlertCircle className="w-3 h-3" />
                  Attention
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1.5 rounded-xl ${styles.bg} ${styles.border} border`}>
                  <span className={`text-sm font-bold ${styles.text}`}>{course.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <Users size={14} />
                    <span className="text-xs">{course.enrolledCount}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors line-clamp-2">
                {course.name}
              </h3>
              <p className="text-sm text-zinc-500 mb-4 flex items-center gap-1">
                <GraduationCap size={14} />
                {course.professorName}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-400">Course Progress</span>
                  <span className={`font-bold ${styles.text}`}>{course.progress}%</span>
                </div>
                <div className="h-2.5 bg-zinc-800/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${styles.gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.08 }}
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-1.5">
                  {course.completedLectures} of {course.totalLectures} lectures completed
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={12} className="text-zinc-500" />
                    <span className="text-xs text-zinc-500">Schedule</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium truncate">
                    {course.schedule}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity size={12} className={course.avgUnderstanding >= 70 ? 'text-green-400' : 'text-orange-400'} />
                    <span className="text-xs text-zinc-500">Understanding</span>
                  </div>
                  <p className={`text-xs font-bold ${course.avgUnderstanding >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                    {course.avgUnderstanding}%
                  </p>
                </div>
              </div>

              {course.pendingFeedback > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <p className="text-xs text-orange-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      <strong>{course.pendingFeedback}</strong> feedback{course.pendingFeedback > 1 ? 's' : ''} pending
                    </span>
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-between group-hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${styles.bg}`}>
                    <Clock size={16} className={styles.text} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Next Class</p>
                    <p className="text-sm text-white font-medium">
                      {course.nextClass || 'No upcoming class'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-600 group-hover:text-purple-400 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && enhancedCourses.length > 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No courses match your search</h3>
          <p className="text-zinc-500">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-zinc-400 hover:text-white text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <motion.button
          onClick={() => navigate('/dev/student/schedule')}
          className="px-5 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition-all"
          whileHover={{ scale: 1.02 }}
        >
          <Calendar size={16} />
          View Full Schedule
          <ArrowRight size={14} />
        </motion.button>
      </div>

      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseDetailModal({
  course,
  onClose,
}: {
  course: EnhancedCourse;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { lectures } = useLISStore();
  const courseLectures = lectures.filter(l => l.courseId === course.id);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-bold">
                {course.code}
              </span>
              <h2 className="text-xl font-bold text-white mt-3">{course.name}</h2>
              <p className="text-zinc-400 mt-1">{course.professorName} • {course.semester}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Course Progress</span>
              <span className="text-purple-400 font-bold">{course.progress}%</span>
            </div>
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {course.completedLectures} of {course.totalLectures} lectures completed
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-white">{course.avgUnderstanding}%</p>
              <p className="text-xs text-zinc-500 mt-1">Understanding</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-white">{course.enrolledCount}</p>
              <p className="text-xs text-zinc-500 mt-1">Students</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-orange-400">{course.pendingFeedback}</p>
              <p className="text-xs text-zinc-500 mt-1">Pending Feedback</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Lectures</h3>
            {courseLectures.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No lectures scheduled yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {courseLectures.slice(0, 5).map(lecture => (
                  <div
                    key={lecture.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{lecture.title}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(lecture.date).toLocaleDateString()} • {lecture.duration}min
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        lecture.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : lecture.status === 'live'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-zinc-500/20 text-zinc-400'
                      }`}
                    >
                      {lecture.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-zinc-400 hover:text-white text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              navigate(`/dev/student/lectures?course=${course.id}`);
            }}
            className="px-5 py-3 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500"
          >
            View All Lectures
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StudentCoursesPage;
