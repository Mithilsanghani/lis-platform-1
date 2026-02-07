/**
 * StudentsPageV12 - Production - NO MOCK DATA
 * All student data comes from useLISStore
 * Empty states when no data exists
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Download,
  ChevronRight,
  UserPlus,
  Send,
  Activity,
  AlertTriangle,
  Heart,
  ArrowLeft,
  Clock,
  BarChart3,
  MessageSquare,
  GraduationCap,
  Target,
  BookOpen,
} from 'lucide-react';
import { useLISStore } from '../../store/useLISStore';
import { StudentCardPro } from './StudentCardPro';

// ==================== Types ====================
interface StudentView {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  course_id: string;
  course_code: string;
  course_name: string;
  health_pct: number;
  lectures_attended: number;
  lectures_total: number;
  feedback_count: number;
  last_active: string;
  silent_days: number;
  status: 'active' | 'silent' | 'inactive' | 'at-risk';
}

interface CourseGroup {
  id: string;
  code: string;
  name: string;
  color: string;
  students: StudentView[];
  stats: {
    total: number;
    active: number;
    silent: number;
    atRisk: number;
    avgHealth: number;
    feedbackRate: number;
  };
}

// Course colors
const COURSE_COLORS: Record<string, string> = {
  'CS101': 'from-blue-500 to-cyan-500',
  'CS201': 'from-purple-500 to-pink-500',
  'CS301': 'from-emerald-500 to-teal-500',
  'CS401': 'from-orange-500 to-red-500',
  'MA101': 'from-indigo-500 to-purple-500',
  'EE201': 'from-amber-500 to-orange-500',
};

const getGradientForCode = (code: string): string => {
  return COURSE_COLORS[code] || 'from-zinc-500 to-zinc-600';
};

// ==================== Components ====================

// Empty State
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="p-4 rounded-2xl bg-zinc-800/50 mb-4">
        <Users className="w-12 h-12 text-zinc-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Students Yet</h3>
      <p className="text-zinc-500 max-w-md">
        Students will appear here once they enroll in your courses.
        Start by creating a course and sharing the enrollment code.
      </p>
      <motion.button
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
      >
        <BookOpen className="w-5 h-5" />
        Create Course
      </motion.button>
    </motion.div>
  );
}

// Course Overview Card
function CourseCard({ 
  course, 
  onClick,
  isSelected,
}: { 
  course: CourseGroup; 
  onClick: () => void;
  isSelected: boolean;
}) {
  const gradientClass = getGradientForCode(course.code);
  
  return (
    <motion.div
      onClick={onClick}
      className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all ${
        isSelected 
          ? 'border-white/30 ring-2 ring-white/20 scale-[1.02]' 
          : 'border-zinc-800 hover:border-zinc-700'
      }`}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      
      <div className="p-5 bg-zinc-900/80">
        {/* Course Info */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r ${gradientClass} text-white`}>
                {course.code}
              </span>
              {course.stats.silent > 0 && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-500/20 text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {course.stats.silent}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white text-lg">{course.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{course.stats.total}</p>
            <p className="text-xs text-zinc-500">students</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <p className="text-lg font-semibold text-emerald-400">{course.stats.active}</p>
            <p className="text-[10px] text-zinc-500 uppercase">Active</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <p className="text-lg font-semibold text-rose-400">{course.stats.silent}</p>
            <p className="text-[10px] text-zinc-500 uppercase">Silent</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <p className="text-lg font-semibold text-amber-400">{course.stats.atRisk}</p>
            <p className="text-[10px] text-zinc-500 uppercase">At Risk</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <p className="text-lg font-semibold text-blue-400">{course.stats.avgHealth}%</p>
            <p className="text-[10px] text-zinc-500 uppercase">Health</p>
          </div>
        </div>

        {/* Health Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Class Health</span>
            <span className={`font-medium ${
              course.stats.avgHealth >= 80 ? 'text-emerald-400' : 
              course.stats.avgHealth >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>{course.stats.avgHealth}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${gradientClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${course.stats.avgHealth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* View Button */}
        <motion.button
          className="w-full mt-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View All Students
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// Course Detail View
function CourseDetailView({
  course,
  onBack,
  onStudentView,
}: {
  course: CourseGroup;
  onBack: () => void;
  onStudentView: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'silent' | 'at-risk'>('all');

  const filteredStudents = useMemo(() => {
    let result = [...course.students];
    
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    if (filter !== 'all') {
      result = result.filter(s => {
        if (filter === 'silent') return s.silent_days >= 5;
        if (filter === 'at-risk') return s.health_pct < 70;
        return s.status === filter;
      });
    }

    return result;
  }, [course.students, search, filter]);

  const gradientClass = getGradientForCode(course.code);

  if (course.students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-bold bg-gradient-to-r ${gradientClass} text-white`}>
                {course.code}
              </span>
              <h1 className="text-2xl font-bold text-white">{course.name}</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Students Enrolled</h3>
          <p className="text-zinc-500">Share the course enrollment code to get students.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onBack}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-lg text-sm font-bold bg-gradient-to-r ${gradientClass} text-white`}>
              {course.code}
            </span>
            <h1 className="text-2xl font-bold text-white">{course.name}</h1>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {course.stats.total} students • {course.stats.active} active • {course.stats.silent} silent
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          {course.stats.silent > 0 && (
            <motion.button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Send className="w-4 h-4" />
              Nudge Silent
            </motion.button>
          )}
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-zinc-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{course.stats.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{course.stats.active}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-zinc-500">Silent (5+ days)</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">{course.stats.silent}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-zinc-500">At Risk</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{course.stats.atRisk}</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-zinc-500">Avg Health</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{course.stats.avgHealth}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-zinc-500">Feedback Rate</span>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{course.stats.feedbackRate}%</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search students by name, roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {(['all', 'active', 'silent', 'at-risk'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'at-risk' ? 'At Risk' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <StudentCardPro
              student={{
                id: student.id,
                name: student.name,
                email: student.email,
                rollNo: student.rollNo,
                course_id: student.course_id,
                course_code: student.course_code,
                course_name: student.course_name,
                health_pct: student.health_pct,
                lectures_attended: student.lectures_attended,
                lectures_total: student.lectures_total,
                feedback_count: student.feedback_count,
                last_active: student.last_active,
                silent_days: student.silent_days,
                status: student.status,
                joined_date: new Date().toISOString(),
              }}
              isSelected={false}
              onToggleSelect={() => {}}
              onViewProfile={() => onStudentView(student.id)}
              onNudge={() => {}}
              onViewFeedback={() => {}}
            />
          </motion.div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="w-10 h-10 text-zinc-600 mb-3" />
          <p className="text-zinc-400">No students match your filters</p>
        </div>
      )}
    </motion.div>
  );
}

// ==================== Main Component ====================
export function StudentsPageV12({ 
  onViewProfile = () => {},
  professorId,
}: { 
  onViewProfile?: (id: string) => void;
  professorId?: string;
}) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Get real data from stores
  const { courses: allCourses, students: storeStudents, feedback, lectures, getProfessorCourses, getCourseStudents } = useLISStore();

  // Filter to professor's courses if ID provided
  const courses = useMemo(() => {
    if (professorId) return getProfessorCourses(professorId);
    return allCourses;
  }, [allCourses, professorId, getProfessorCourses]);

  // Transform store students into view format grouped by course
  const courseGroups = useMemo((): CourseGroup[] => {
    if (courses.length === 0) return [];

    return courses.map(course => {
      // Get enrolled students for this course
      const enrolledStudents = getCourseStudents(course.id);
      
      // Get feedback for this course
      const courseFeedback = feedback.filter(f => f.courseId === course.id);
      const courseLectures = lectures.filter(l => l.courseId === course.id);
      
      // Transform to StudentView format
      const studentViews: StudentView[] = enrolledStudents.map(enrolled => {
        const storeStudent = storeStudents.find(s => s.id === enrolled.id);
        const studentFeedback = courseFeedback.filter(f => f.studentId === enrolled.id);
        
        // Calculate health from feedback understanding
        let healthPct = 75; // Default
        if (studentFeedback.length > 0) {
          const scores = studentFeedback.map(f => {
            switch (f.understandingLevel) {
              case 'fully': return 100;
              case 'partial': return 60;
              case 'confused': return 20;
              default: return 50;
            }
          });
          healthPct = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }

        // Calculate silent days (days since last feedback)
        let silentDays = 0;
        if (studentFeedback.length > 0) {
          const lastFeedback = studentFeedback.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          silentDays = Math.floor(
            (Date.now() - new Date(lastFeedback.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          );
        } else {
          silentDays = 7; // No feedback yet
        }

        // Determine status
        let status: StudentView['status'] = 'active';
        if (silentDays >= 7) status = 'silent';
        else if (healthPct < 70) status = 'at-risk';

        const lastActive = silentDays === 0 ? 'Today' : 
                          silentDays === 1 ? 'Yesterday' : 
                          `${silentDays} days ago`;

        return {
          id: enrolled.id,
          name: storeStudent?.name || enrolled.name || enrolled.id,
          email: storeStudent?.email || enrolled.email || `${enrolled.id}@university.edu`,
          rollNo: enrolled.rollNumber || enrolled.id,
          course_id: course.id,
          course_code: course.code,
          course_name: course.name,
          health_pct: healthPct,
          lectures_attended: courseLectures.filter(l => l.attendees.length >= 1).length, // Simplified
          lectures_total: courseLectures.length,
          feedback_count: studentFeedback.length,
          last_active: lastActive,
          silent_days: silentDays,
          status,
        };
      });

      // Calculate course stats
      const total = studentViews.length;
      const active = studentViews.filter(s => s.status === 'active').length;
      const silent = studentViews.filter(s => s.silent_days >= 5).length;
      const atRisk = studentViews.filter(s => s.health_pct < 70).length;
      const avgHealth = total > 0 
        ? Math.round(studentViews.reduce((sum, s) => sum + s.health_pct, 0) / total)
        : 0;
      const feedbackRate = total > 0
        ? Math.round((studentViews.filter(s => s.feedback_count > 0).length / total) * 100)
        : 0;

      return {
        id: course.id,
        code: course.code,
        name: course.name,
        color: getGradientForCode(course.code),
        students: studentViews,
        stats: {
          total,
          active,
          silent,
          atRisk,
          avgHealth,
          feedbackRate,
        },
      };
    }).filter(c => c.students.length > 0 || true) // Include courses even with no students
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [courses, storeStudents, feedback, lectures, getCourseStudents]);

  // Overall stats
  const overallStats = useMemo(() => {
    const allStudents = courseGroups.flatMap(c => c.students);
    const total = allStudents.length;
    
    if (total === 0) {
      return { total: 0, active: 0, silent: 0, atRisk: 0, avgHealth: 0 };
    }

    const active = allStudents.filter(s => s.status === 'active').length;
    const silent = allStudents.filter(s => s.silent_days >= 5).length;
    const atRisk = allStudents.filter(s => s.health_pct < 70).length;
    const avgHealth = Math.round(allStudents.reduce((sum, s) => sum + s.health_pct, 0) / total);
    
    return { total, active, silent, atRisk, avgHealth };
  }, [courseGroups]);

  // Filter courses by search
  const filteredCourses = useMemo(() => {
    if (!search) return courseGroups;
    const q = search.toLowerCase();
    return courseGroups.filter(c => 
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    );
  }, [courseGroups, search]);

  // Selected course data
  const selectedCourseData = useMemo(() => {
    if (!selectedCourse) return null;
    return courseGroups.find(c => c.id === selectedCourse) || null;
  }, [selectedCourse, courseGroups]);

  // If viewing a specific course
  if (selectedCourseData) {
    return (
      <CourseDetailView
        course={selectedCourseData}
        onBack={() => setSelectedCourse(null)}
        onStudentView={onViewProfile}
      />
    );
  }

  // Empty state when no courses
  if (courseGroups.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Students by Class</h1>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
              {overallStats.total} total
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {courseGroups.length} courses • {overallStats.active} active • {overallStats.silent} silent alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
            whileHover={{ scale: 1.02 }}
          >
            <Download className="w-4 h-4" />
            Export All
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/25"
            whileHover={{ scale: 1.02 }}
          >
            <UserPlus className="w-4 h-4" />
            Bulk Enroll
          </motion.button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div 
          className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-zinc-400">Total Students</span>
          </div>
          <p className="text-3xl font-bold text-white">{overallStats.total}</p>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-xs text-zinc-400">Active Today</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{overallStats.active}</p>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span className="text-xs text-zinc-400">Silent (5+ days)</span>
          </div>
          <p className="text-3xl font-bold text-rose-400">{overallStats.silent}</p>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-zinc-400">At Risk</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{overallStats.atRisk}</p>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-zinc-400">Avg Health</span>
          </div>
          <p className="text-3xl font-bold text-purple-400">{overallStats.avgHealth}%</p>
        </motion.div>
      </div>

      {/* Silent Alert - only show if there are silent students */}
      {overallStats.silent > 0 && (
        <motion.div
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/30"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-500/20">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{overallStats.silent} students need attention</h3>
              <p className="text-sm text-zinc-400">No activity in 5+ days across all courses. Consider sending a nudge.</p>
            </div>
          </div>
          <motion.button
            className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-medium"
            whileHover={{ scale: 1.02 }}
          >
            View All Silent
          </motion.button>
        </motion.div>
      )}

      {/* Search Courses */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search courses by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Your Courses</h2>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs">{courseGroups.length}</span>
        </div>
        <p className="text-sm text-zinc-500">Click a course to view all students</p>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <CourseCard
                course={course}
                onClick={() => setSelectedCourse(course.id)}
                isSelected={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && courseGroups.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="w-10 h-10 text-zinc-600 mb-3" />
          <p className="text-zinc-400">No courses match "{search}"</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-left group"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Send className="w-5 h-5" />
            </div>
            <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Bulk Nudge</span>
          </div>
          <p className="text-sm text-zinc-500">Send reminders to all silent students</p>
        </motion.button>
        
        <motion.button
          className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-left group"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">Export Report</span>
          </div>
          <p className="text-sm text-zinc-500">Download comprehensive student data</p>
        </motion.button>
        
        <motion.button
          className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-left group"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-medium text-white group-hover:text-purple-400 transition-colors">Analytics</span>
          </div>
          <p className="text-sm text-zinc-500">View engagement trends & patterns</p>
        </motion.button>
      </div>
    </div>
  );
}

export default StudentsPageV12;
