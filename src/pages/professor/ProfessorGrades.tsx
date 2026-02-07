/**
 * LIS v2.0 - Professor Grades Page
 * Assessment & grade management using useLISStore (single source of truth)
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  BookOpen,
  Users,
  Upload,
  Award,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useLISStore, type Assessment } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';
import { Modal, EmptyState } from '../../components/shared';

type AssessmentType = 'quiz' | 'assignment' | 'midterm' | 'final' | 'lab' | 'project';

const TYPE_COLORS: Record<AssessmentType, string> = {
  quiz: 'bg-blue-500/20 text-blue-400',
  assignment: 'bg-emerald-500/20 text-emerald-400',
  midterm: 'bg-amber-500/20 text-amber-400',
  final: 'bg-red-500/20 text-red-400',
  lab: 'bg-purple-500/20 text-purple-400',
  project: 'bg-cyan-500/20 text-cyan-400',
};

// getLetterGrade helper for future use
// function getLetterGrade(pct: number): string {
//   if (pct >= 93) return 'A';
//   if (pct >= 90) return 'A-';
//   if (pct >= 87) return 'B+';
//   if (pct >= 83) return 'B';
//   if (pct >= 80) return 'B-';
//   if (pct >= 77) return 'C+';
//   if (pct >= 73) return 'C';
//   if (pct >= 70) return 'C-';
//   if (pct >= 67) return 'D+';
//   if (pct >= 60) return 'D';
//   return 'F';
// }

export default function ProfessorGrades() {
  const user = useAuthStore((s) => s.user);
  const professorId = user?.id || '';

  // Store actions & getters
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);
  const getCourse = useLISStore((s) => s.getCourse);
  const getCourseStudents = useLISStore((s) => s.getCourseStudents);
  const getCourseAssessments = useLISStore((s) => s.getCourseAssessments);
  const getAssessmentGrades = useLISStore((s) => s.getAssessmentGrades);
  const createAssessment = useLISStore((s) => s.createAssessment);
  const updateAssessment = useLISStore((s) => s.updateAssessment);
  const deleteAssessment = useLISStore((s) => s.deleteAssessment);
  const bulkSetGrades = useLISStore((s) => s.bulkSetGrades);
  const publishGrades = useLISStore((s) => s.publishGrades);
  const unpublishGrades = useLISStore((s) => s.unpublishGrades);
  const enrollStudent = useLISStore((s) => s.enrollStudent);
  const bulkEnrollStudents = useLISStore((s) => s.bulkEnrollStudents);

  // UI state
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Assessment form
  const [assessmentForm, setAssessmentForm] = useState({
    name: '',
    type: 'assignment' as AssessmentType,
    maxMarks: 100,
    weightPct: 10,
    dueDate: '',
  });

  // Enroll form
  const [enrollForm, setEnrollForm] = useState({ name: '', email: '', rollNumber: '' });
  const [bulkEnrollText, setBulkEnrollText] = useState('');
  const [enrollTab, setEnrollTab] = useState<'single' | 'bulk'>('single');
  const [enrollError, setEnrollError] = useState('');

  // Grade entries (studentId -> marks)
  const [gradeEntries, setGradeEntries] = useState<Record<string, number | ''>>({});

  // Computed data
  const professorCourses = useMemo(() => getProfessorCourses(professorId), [professorId, getProfessorCourses]);
  // const currentCourse = selectedCourseId ? getCourse(selectedCourseId) : undefined;
  const enrolledStudents = selectedCourseId ? getCourseStudents(selectedCourseId) : [];
  const courseAssessments = selectedCourseId ? getCourseAssessments(selectedCourseId) : [];

  // Auto-select first course
  if (!selectedCourseId && professorCourses.length > 0) {
    setSelectedCourseId(professorCourses[0].id);
  }

  const calculateStats = (assessmentId: string) => {
    const grades = getAssessmentGrades(assessmentId);
    if (grades.length === 0) return { avg: 0, high: 0, low: 0, graded: 0, total: enrolledStudents.length };
    const marks = grades.map((g) => g.marksObtained).filter((m): m is number => m !== null);
    if (marks.length === 0) return { avg: 0, high: 0, low: 0, graded: 0, total: enrolledStudents.length };
    return {
      avg: Math.round(marks.reduce((a, b) => a + b, 0) / marks.length),
      high: Math.max(...marks),
      low: Math.min(...marks),
      graded: grades.length,
      total: enrolledStudents.length,
    };
  };

  // --- Handlers ---

  const handleSaveAssessment = () => {
    if (!selectedCourseId || !assessmentForm.name.trim()) return;
    if (editingAssessment) {
      updateAssessment(editingAssessment.id, {
        name: assessmentForm.name.trim(),
        type: assessmentForm.type,
        maxMarks: assessmentForm.maxMarks,
        weightPct: assessmentForm.weightPct,
        dueDate: assessmentForm.dueDate || undefined,
      });
    } else {
      createAssessment(selectedCourseId, {
        name: assessmentForm.name.trim(),
        type: assessmentForm.type,
        maxMarks: assessmentForm.maxMarks,
        weightPct: assessmentForm.weightPct,
        dueDate: assessmentForm.dueDate || undefined,
        status: 'draft',
      });
    }
    setShowAssessmentModal(false);
    setEditingAssessment(null);
    setAssessmentForm({ name: '', type: 'assignment', maxMarks: 100, weightPct: 10, dueDate: '' });
    showToast(editingAssessment ? 'Assessment updated' : 'Assessment created');
  };

  const openEditAssessment = (a: Assessment) => {
    setEditingAssessment(a);
    setAssessmentForm({
      name: a.name,
      type: a.type as AssessmentType,
      maxMarks: a.maxMarks,
      weightPct: a.weightPct,
      dueDate: a.dueDate || '',
    });
    setShowAssessmentModal(true);
  };

  const openGradeEntry = (a: Assessment) => {
    setSelectedAssessment(a);
    const existingGrades = getAssessmentGrades(a.id);
    const entries: Record<string, number | ''> = {};
    enrolledStudents.forEach((s) => {
      const g = existingGrades.find((gr) => gr.studentId === s.id);
      entries[s.id] = g && g.marksObtained !== null ? g.marksObtained : '';
    });
    setGradeEntries(entries);
    setShowGradeModal(true);
  };

  const handleSaveGrades = (publish: boolean) => {
    if (!selectedAssessment) return;
    const grades = Object.entries(gradeEntries)
      .filter(([, marks]) => marks !== '' && marks !== undefined)
      .map(([studentId, marks]) => ({ studentId, marks: Number(marks) }));
    bulkSetGrades(selectedAssessment.id, grades);
    if (publish) {
      publishGrades(selectedAssessment.id);
    }
    setShowGradeModal(false);
    setSelectedAssessment(null);
    showToast(publish ? 'Grades published' : 'Grades saved as draft');
  };

  const handleEnrollStudent = () => {
    if (!selectedCourseId) return;
    if (!enrollForm.name.trim() || !enrollForm.email.trim()) {
      setEnrollError('Name and email are required');
      return;
    }
    setEnrollError('');
    const course = getCourse(selectedCourseId);
    enrollStudent(selectedCourseId, {
      name: enrollForm.name.trim(),
      email: enrollForm.email.trim(),
      rollNumber: enrollForm.rollNumber.trim() || '',
      department: course?.department || 'General',
    });
    setEnrollForm({ name: '', email: '', rollNumber: '' });
    showToast('Student enrolled');
  };

  const handleBulkEnroll = () => {
    if (!selectedCourseId || !bulkEnrollText.trim()) return;
    const course = getCourse(selectedCourseId);
    const lines = bulkEnrollText.trim().split('\n');
    const students: { name: string; email: string; rollNumber: string; department: string }[] = [];
    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        students.push({
          name: parts[0],
          email: parts[1],
          rollNumber: parts[2] || '',
          department: course?.department || 'General',
        });
      }
    }
    if (students.length === 0) {
      setEnrollError('No valid entries found. Use format: Name, Email, RollNumber (per line)');
      return;
    }
    setEnrollError('');
    bulkEnrollStudents(selectedCourseId, students);
    setBulkEnrollText('');
    showToast(`${students.length} students enrolled`);
  };

  const showToast = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  // --- Render ---

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
          >
            <CheckCircle className="w-4 h-4" />
            {saveSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Grades & Assessments</h1>
          <p className="text-slate-400 mt-1">Manage assessments, enter grades, and publish results</p>
        </div>
      </div>

      {/* No Courses */}
      {professorCourses.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No courses yet"
          description="Create a course from the Courses page first, then come back to manage grades."
        />
      ) : (
        <>
          {/* Course Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-slate-400 mb-2">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              >
                {professorCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} ({c.semester})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-4 h-4" />
                {enrolledStudents.length} students
              </span>
              <button
                onClick={() => { setEnrollError(''); setShowEnrollModal(true); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Enroll
              </button>
            </div>
          </div>

          {/* No students message */}
          {enrolledStudents.length === 0 && selectedCourseId ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-slate-700/50">
              <Users className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 mb-2">No students enrolled in this course</p>
              <p className="text-slate-500 text-sm mb-4">Enroll students to start creating assessments and entering grades</p>
              <button
                onClick={() => { setEnrollError(''); setShowEnrollModal(true); }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                Enroll Students
              </button>
            </div>
          ) : selectedCourseId && (
            <>
              {/* Assessment Action Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>{courseAssessments.length} assessments</span>
                  <span className="text-slate-600">•</span>
                  <span>{courseAssessments.filter((a) => a.status === 'published').length} published</span>
                </div>
                <button
                  onClick={() => {
                    setEditingAssessment(null);
                    setAssessmentForm({ name: '', type: 'assignment', maxMarks: 100, weightPct: 10, dueDate: '' });
                    setShowAssessmentModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Assessment
                </button>
              </div>

              {/* Assessments Grid */}
              {courseAssessments.length === 0 ? (
                <EmptyState
                  icon={<Award className="w-8 h-8" />}
                  title="No assessments yet"
                  description="Create your first assessment to start grading"
                  action={{
                    label: 'Add Assessment',
                    onClick: () => {
                      setEditingAssessment(null);
                      setAssessmentForm({ name: '', type: 'assignment', maxMarks: 100, weightPct: 10, dueDate: '' });
                      setShowAssessmentModal(true);
                    },
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courseAssessments.map((assessment) => {
                    const stats = calculateStats(assessment.id);
                    const progressPct = stats.total > 0 ? Math.round((stats.graded / stats.total) * 100) : 0;

                    return (
                      <motion.div
                        key={assessment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl p-5 bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
                      >
                        {/* Type Badge & Status */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${TYPE_COLORS[assessment.type as AssessmentType] || 'bg-slate-500/20 text-slate-400'}`}>
                            {assessment.type}
                          </span>
                          <span className={`text-xs font-medium ${assessment.status === 'published' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {assessment.status === 'published' ? '● Published' : '○ Draft'}
                          </span>
                        </div>

                        {/* Name & Details */}
                        <h3 className="text-lg font-semibold text-white mb-1">{assessment.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
                          <span>Max: {assessment.maxMarks}</span>
                          <span>Weight: {assessment.weightPct}%</span>
                        </div>

                        {assessment.dueDate && (
                          <p className="text-xs text-slate-500 mb-3">
                            Due: {new Date(assessment.dueDate).toLocaleDateString()}
                          </p>
                        )}

                        {/* Grading Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Graded</span>
                            <span>{stats.graded}/{stats.total}</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        {stats.graded > 0 && (
                          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                            <span>Avg: {stats.avg}</span>
                            <span>High: {stats.high}</span>
                            <span>Low: {stats.low}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                          <button
                            onClick={() => openGradeEntry(assessment)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Enter Grades
                          </button>

                          {assessment.status === 'draft' ? (
                            <button
                              onClick={() => {
                                publishGrades(assessment.id);
                                showToast('Assessment published');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                unpublishGrades(assessment.id);
                                showToast('Assessment unpublished');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 text-xs font-medium transition-colors"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              Unpublish
                            </button>
                          )}

                          <button
                            onClick={() => openEditAssessment(assessment)}
                            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors ml-auto"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${assessment.name}"? All grades will be lost.`)) {
                                deleteAssessment(assessment.id);
                                showToast('Assessment deleted');
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ===== MODALS ===== */}

      {/* Assessment Modal (Create/Edit) */}
      <Modal
        isOpen={showAssessmentModal}
        onClose={() => { setShowAssessmentModal(false); setEditingAssessment(null); }}
        title={editingAssessment ? 'Edit Assessment' : 'Create Assessment'}
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Name *</label>
            <input
              type="text"
              placeholder="e.g., Quiz 1, Midterm Exam"
              value={assessmentForm.name}
              onChange={(e) => setAssessmentForm({ ...assessmentForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
            <select
              value={assessmentForm.type}
              onChange={(e) => setAssessmentForm({ ...assessmentForm, type: e.target.value as AssessmentType })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="lab">Lab</option>
              <option value="project">Project</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Max Marks</label>
              <input
                type="number"
                min={1}
                value={assessmentForm.maxMarks}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, maxMarks: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Weight %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={assessmentForm.weightPct}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, weightPct: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Due Date</label>
            <input
              type="date"
              value={assessmentForm.dueDate}
              onChange={(e) => setAssessmentForm({ ...assessmentForm, dueDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => { setShowAssessmentModal(false); setEditingAssessment(null); }}
              className="flex-1 py-3 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAssessment}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            >
              {editingAssessment ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Grade Entry Modal */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => { setShowGradeModal(false); setSelectedAssessment(null); }}
        title={`Enter Grades — ${selectedAssessment?.name || ''}`}
        size="lg"
      >
        {selectedAssessment && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-slate-400 pb-3 border-b border-slate-700/50">
              <span>Max Marks: {selectedAssessment.maxMarks}</span>
              <span>Weight: {selectedAssessment.weightPct}%</span>
              <span>Status: {selectedAssessment.status}</span>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {enrolledStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-slate-800/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{student.name}</p>
                    <p className="text-xs text-slate-500 truncate">{student.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={selectedAssessment.maxMarks}
                      placeholder="—"
                      value={gradeEntries[student.id] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setGradeEntries({ ...gradeEntries, [student.id]: val });
                      }}
                      className="w-20 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-center text-sm focus:outline-none focus:border-indigo-500/50"
                    />
                    <span className="text-xs text-slate-500">/ {selectedAssessment.maxMarks}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => { setShowGradeModal(false); setSelectedAssessment(null); }}
                className="flex-1 py-3 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveGrades(false)}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSaveGrades(true)}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Publish Grades
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Enroll Students Modal */}
      <Modal
        isOpen={showEnrollModal}
        onClose={() => { setShowEnrollModal(false); setEnrollError(''); }}
        title="Enroll Students"
        size="md"
      >
        <div className="space-y-5">
          {enrollError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {enrollError}
            </div>
          )}

          {/* Tab Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-700/50">
            <button
              onClick={() => setEnrollTab('single')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${enrollTab === 'single' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800/50 text-slate-400'}`}
            >
              Single Student
            </button>
            <button
              onClick={() => setEnrollTab('bulk')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${enrollTab === 'bulk' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800/50 text-slate-400'}`}
            >
              <Upload className="w-4 h-4 inline mr-1" />
              Bulk Import
            </button>
          </div>

          {enrollTab === 'single' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Student Name *</label>
                <input
                  type="text"
                  placeholder="e.g., John Doe"
                  value={enrollForm.name}
                  onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="e.g., john@university.edu"
                  value={enrollForm.email}
                  onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g., CS2024001"
                  value={enrollForm.rollNumber}
                  onChange={(e) => setEnrollForm({ ...enrollForm, rollNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
              <button
                onClick={handleEnrollStudent}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Enroll Student
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Paste CSV (Name, Email, RollNumber per line)</label>
                <textarea
                  rows={6}
                  placeholder="John Doe, john@uni.edu, CS001&#10;Jane Smith, jane@uni.edu, CS002"
                  value={bulkEnrollText}
                  onChange={(e) => setBulkEnrollText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 font-mono text-sm"
                />
              </div>
              <button
                onClick={handleBulkEnroll}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Import Students
              </button>
            </>
          )}

          {/* Current enrolled list */}
          {enrolledStudents.length > 0 && (
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400 mb-2">Currently Enrolled ({enrolledStudents.length})</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {enrolledStudents.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-800/30 text-sm">
                    <div>
                      <span className="text-white">{s.name}</span>
                      <span className="text-slate-500 ml-2">{s.email}</span>
                    </div>
                    {s.rollNumber && <span className="text-xs text-slate-500 font-mono">{s.rollNumber}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
