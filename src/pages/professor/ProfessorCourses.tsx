/**
 * LIS v2.0 - Professor Courses Page
 * Course list with health indicators, topics, and management
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  BookOpen,
  Trash2,
  Copy,
} from 'lucide-react';
import { useProfessorCourses } from '../../hooks/useProfessorData';
import { useLISStore } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';
import { CourseCard, RiskBadge, EmptyState, Modal } from '../../components/shared';
import { UNDERSTANDING_COLORS } from '../../components/shared/Charts';

type ViewMode = 'grid' | 'list';

export default function ProfessorCourses() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create course form state
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDept, setNewCourseDept] = useState('Computer Science');
  const [newCourseSemester, setNewCourseSemester] = useState('Spring 2026');
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const deleteCourse = useLISStore((s) => s.deleteCourse);

  const copyEnrollmentCode = (courseId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(courseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const { courses, total, isLoading } = useProfessorCourses({
    search: searchQuery,
    semester: selectedSemester !== 'all' ? selectedSemester : undefined,
    riskLevel: selectedRisk !== 'all' ? selectedRisk as 'low' | 'medium' | 'high' : undefined,
  });

  const semesters = ['Spring 2026', 'Fall 2025', 'Spring 2025'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-slate-400 mt-1">{total} courses this semester</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-[600px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
            isFilterOpen || selectedSemester !== 'all' || selectedRisk !== 'all'
              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          {(selectedSemester !== 'all' || selectedRisk !== 'all') && (
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
              {(selectedSemester !== 'all' ? 1 : 0) + (selectedRisk !== 'all' ? 1 : 0)}
            </span>
          )}
        </button>

        {/* View Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-slate-700/50">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 transition-colors ${
              viewMode === 'list' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-5 bg-slate-800/50 border border-slate-700/50 overflow-hidden"
          >
            <div className="flex flex-wrap gap-4">
              {/* Semester Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-2">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              {/* Risk Level Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-400 mb-2">Health Status</label>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                >
                  <option value="all">All Courses</option>
                  <option value="high">Needs Attention (&lt;70%)</option>
                  <option value="medium">Moderate (70-85%)</option>
                  <option value="low">Healthy (85%+)</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedSemester('all');
                    setSelectedRisk('all');
                  }}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl p-5 bg-slate-800/50 border border-slate-700/50 animate-pulse">
              <div className="h-4 w-16 bg-slate-700 rounded mb-3" />
              <div className="h-6 w-40 bg-slate-700 rounded mb-4" />
              <div className="h-4 w-24 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No courses found"
          description={searchQuery ? "Try adjusting your search or filters" : "Create your first course to get started"}
          action={{
            label: 'Create Course',
            onClick: () => setIsCreateModalOpen(true),
          }}
        />
      ) : viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <CourseCard
                code={course.code}
                title={course.title}
                instructor={`${course.student_count} students`}
                lectureCount={course.lecture_count}
                healthPct={course.health_pct}
                semester={course.semester}
                onClick={() => navigate(`/professor/courses/${course.id}`)}
              />
              {/* Enrollment Code & Actions Overlay */}
              <div className="mt-2 flex items-center justify-between gap-2 px-2">
                <button
                  onClick={(e) => { e.stopPropagation(); copyEnrollmentCode(course.id, course.enrollmentCode); }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 text-xs transition-colors"
                  title="Copy enrollment code"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-300 font-mono">
                    {copiedId === course.id ? 'Copied!' : course.enrollmentCode || 'No code'}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${course.title}"? This will remove all lectures, feedback, grades, and unenroll all students.`)) {
                      deleteCourse(course.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-slate-700/50">
          <table className="w-full">
            <thead className="bg-slate-800/80">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Course</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Enrollment Code</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Students</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Lectures</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Health</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  onClick={() => navigate(`/professor/courses/${course.id}`)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4">
                    <div>
                      <span className="text-xs font-medium text-indigo-400">{course.code}</span>
                      <p className="text-sm text-white font-medium">{course.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyEnrollmentCode(course.id, course.enrollmentCode); }}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 hover:bg-indigo-500/20 transition-colors"
                      title="Click to copy"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-mono text-slate-300">
                        {copiedId === course.id ? 'Copied!' : course.enrollmentCode || '—'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">{course.student_count}</td>
                  <td className="px-4 py-4 text-sm text-slate-300">{course.lecture_count || 0}</td>
                  <td className="px-4 py-4">
                    <RiskBadge
                      level={
                        (course.health_pct || 100) >= 85
                          ? 'low'
                          : (course.health_pct || 100) >= 70
                            ? 'medium'
                            : 'high'
                      }
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${course.title}"? This will remove all lectures, feedback, grades, and unenroll all students.`)) {
                          deleteCourse(course.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setCreateError(''); }}
        title="Create New Course"
        size="md"
      >
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          if (!newCourseCode.trim() || !newCourseName.trim()) {
            setCreateError('Course code and name are required');
            return;
          }
          setIsCreating(true);
          setCreateError('');
          try {
            const user = useAuthStore.getState().user;
            const professorId = user?.id || '';
            const createCourse = useLISStore.getState().createCourse;
            createCourse(professorId, {
              code: newCourseCode.trim(),
              name: newCourseName.trim(),
              professorId,
              semester: newCourseSemester,
              department: newCourseDept,
              credits: newCourseCredits,
            });
            // Reset form
            setNewCourseCode('');
            setNewCourseName('');
            setNewCourseDept('Computer Science');
            setNewCourseSemester('Spring 2026');
            setNewCourseCredits(3);
            setIsCreateModalOpen(false);
          } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create course');
          } finally {
            setIsCreating(false);
          }
        }}>
          {createError && (
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {createError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Course Code *</label>
            <input
              type="text"
              placeholder="e.g., CS201"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
              className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Course Title *</label>
            <input
              type="text"
              placeholder="e.g., Data Structures & Algorithms"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
            <select
              value={newCourseDept}
              onChange={(e) => setNewCourseDept(e.target.value)}
              className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Semester</label>
              <select
                value={newCourseSemester}
                onChange={(e) => setNewCourseSemester(e.target.value)}
                className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              >
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Credits</label>
              <input
                type="number"
                min={1}
                max={6}
                value={newCourseCredits}
                onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => { setIsCreateModalOpen(false); setCreateError(''); }}
              className="flex-1 h-11 rounded-[10px] border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 h-11 rounded-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
