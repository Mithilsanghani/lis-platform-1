/**
 * LIS v2.0 - Professor Students Page
 * Student roster with engagement tracking — uses useLISStore only
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Users,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Mail,
  Download,
  Eye,
  Trash2,
} from 'lucide-react';
import { useProfessorStudents, useSilentStudents, useProfessorCourses } from '../../hooks/useProfessorData';
import { EmptyState, Modal } from '../../components/shared';
import { useLISStore, type Student } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';

export default function ProfessorStudents() {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || '';

  const { user } = useAuthStore();
  const professorId = user?.id || '';

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>(initialFilter === 'silent' ? 'silent' : 'all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { courses } = useProfessorCourses();
  const { students: hookStudents, total: _total } = useProfessorStudents({
    courseId: selectedCourseId || undefined,
    isSilent: riskFilter === 'silent' ? true : undefined,
    riskLevel: riskFilter !== 'all' && riskFilter !== 'silent' ? riskFilter as any : undefined,
  });
  const { count: silentCount } = useSilentStudents(selectedCourseId || undefined);

  // Get all enrolled students from useLISStore
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);
  const getCourseStudents = useLISStore((s) => s.getCourseStudents);
  const deleteStudent = useLISStore((s) => s.deleteStudent);

  const allStudents = useMemo(() => {
    const profCourses = getProfessorCourses(professorId);
    const relevantCourses = selectedCourseId
      ? profCourses.filter((c) => c.id === selectedCourseId)
      : profCourses;
    const studentMap = new Map<string, Student>();
    relevantCourses.forEach((c) => {
      const cs = getCourseStudents(c.id);
      cs.forEach((s) => studentMap.set(s.id, s));
    });
    return Array.from(studentMap.values());
  }, [professorId, selectedCourseId, getProfessorCourses, getCourseStudents]);

  // Filter by search
  const filteredStudents = allStudents.filter((s) => {
    if (!searchQuery) return true;
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Students</h1>
          <p className="text-slate-400 mt-1">{allStudents.length} students across {selectedCourseId ? '1 course' : 'all courses'}</p>
        </div>
        <button
          onClick={() => {/* Export logic */}}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
        >
          <Download className="w-5 h-5" />
          Export List
        </button>
      </div>

      {/* Silent Students Banner */}
      {silentCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">
                {silentCount} Silent Student{silentCount > 1 ? 's' : ''} Detected
              </h3>
              <p className="text-sm text-slate-400">
                These students show low engagement patterns — consider reaching out
              </p>
            </div>
            <button
              onClick={() => setRiskFilter(riskFilter === 'silent' ? 'all' : 'silent')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                riskFilter === 'silent'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
              }`}
            >
              {riskFilter === 'silent' ? 'Show All' : 'Show Only Silent'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-[600px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, email, or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>

        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 min-w-[200px]"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} — {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{allStudents.length}</p>
        </div>
        <div className="rounded-xl p-4 bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Silent</span>
          </div>
          <p className="text-2xl font-bold text-white">{silentCount}</p>
        </div>
        <div className="rounded-xl p-4 bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">High Risk</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {hookStudents.filter((s) => s.risk_level === 'high').length}
          </p>
        </div>
        <div className="rounded-xl p-4 bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {hookStudents.filter((s) => s.risk_level === 'low' && !s.is_silent).length}
          </p>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No students found"
          description={searchQuery ? "Try adjusting your search" : "Enroll students via Courses page or Grades page"}
        />
      ) : (
        <div className="rounded-xl overflow-hidden border border-slate-700/50">
          <table className="w-full">
            <thead className="bg-slate-800/80">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Student</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Roll Number</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Enrolled Courses</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-white">{student.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-300">{student.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-400 font-mono">{student.rollNumber || '—'}</td>
                  <td className="px-4 py-4 text-sm text-slate-400">{student.enrolledCourses?.length || 0}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`mailto:${student.email}`}
                        className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${student.name}" from all your courses? This will delete their feedback and grades.`)) {
                            deleteStudent(student.id);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Detail Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Details"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedStudent.name}</h3>
                <p className="text-slate-400">{selectedStudent.email}</p>
                {selectedStudent.rollNumber && (
                  <p className="text-sm text-slate-500 mt-1">Roll: {selectedStudent.rollNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1">Enrolled Courses</p>
                <p className="text-lg font-bold text-white">{selectedStudent.enrolledCourses?.length || 0}</p>
              </div>
              <div className="rounded-xl p-3 bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-1">Last Active</p>
                <p className="text-sm text-white">{selectedStudent.lastActiveAt ? new Date(selectedStudent.lastActiveAt).toLocaleDateString() : 'Never'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`mailto:${selectedStudent.email}`}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-center transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex-1 py-3 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
