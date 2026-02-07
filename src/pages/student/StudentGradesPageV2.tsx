/**
 * LIS Student Grades Page - Connected to Professor Grades Store
 * Shows ONLY published grades from professors
 * NO DUMMY DATA - Empty state until professor publishes grades
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  BarChart2,
  FileText,
  Clock,
  ChevronRight,
  Award,
  Target,
  BookOpen,
  EyeOff,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useLISStore, type AssessmentType } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';

// Assessment type configuration
const typeStyles: Record<AssessmentType, { bg: string; text: string }> = {
  quiz: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  assignment: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  midterm: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  final: { bg: 'bg-red-500/10', text: 'text-red-400' },
  lab: { bg: 'bg-green-500/10', text: 'text-green-400' },
  project: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
};

function getLetterGrade(pct: number): string {
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 67) return 'D+';
  if (pct >= 60) return 'D';
  return 'F';
}

interface CourseSummary {
  courseId: string;
  courseCode: string;
  courseName: string;
  professorName: string;
  credits: number;
  semester: string;
  assessments: { id: string; name: string; type: AssessmentType; maxMarks: number; weightPct: number; dueDate?: string; marksObtained: number | null }[];
  currentGrade: number | null;
  letterGrade: string | null;
}

// Empty State Component
function EmptyState({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-zinc-600" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-zinc-500 text-center max-w-md">{description}</p>
    </div>
  );
}

export function StudentGradesPage() {
  const { user } = useAuthStore();
  const { getStudentPublishedGrades, calculateStudentGPA } = useLISStore();
  const professors = useLISStore((s) => s.professors);
  
  // Get current student ID from auth
  const studentId = user?.id || 'current-student';

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Transform flat {course, assessment, grade}[] into grouped CourseSummary[]
  const rawGrades = getStudentPublishedGrades(studentId);
  const gpa = calculateStudentGPA(studentId);

  const studentGrades: CourseSummary[] = useMemo(() => {
    const courseMap = new Map<string, CourseSummary>();
    rawGrades.forEach(({ course, assessment, grade }) => {
      if (!courseMap.has(course.id)) {
        const prof = professors.find((p) => p.id === course.professorId);
        courseMap.set(course.id, {
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          professorName: prof?.name || 'Professor',
          credits: course.credits,
          semester: course.semester,
          assessments: [],
          currentGrade: null,
          letterGrade: null,
        });
      }
      const entry = courseMap.get(course.id)!;
      entry.assessments.push({
        id: assessment.id,
        name: assessment.name,
        type: assessment.type,
        maxMarks: assessment.maxMarks,
        weightPct: assessment.weightPct,
        dueDate: assessment.dueDate,
        marksObtained: grade.marksObtained,
      });
    });
    // Calculate current grade per course
    courseMap.forEach((summary) => {
      const graded = summary.assessments.filter((a) => a.marksObtained !== null);
      if (graded.length > 0) {
        let weightedSum = 0;
        let totalWeight = 0;
        graded.forEach((a) => {
          const pct = ((a.marksObtained as number) / a.maxMarks) * 100;
          weightedSum += pct * a.weightPct;
          totalWeight += a.weightPct;
        });
        summary.currentGrade = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : null;
        if (summary.currentGrade !== null) {
          summary.letterGrade = getLetterGrade(summary.currentGrade);
        }
      }
    });
    return Array.from(courseMap.values());
  }, [rawGrades, professors]);

  // Set default selected course
  useEffect(() => {
    if (studentGrades.length > 0 && !selectedCourse) {
      setSelectedCourse(studentGrades[0].courseId);
    }
  }, [studentGrades, selectedCourse]);

  const selectedCourseData = studentGrades.find(c => c.courseId === selectedCourse);

  // Grade colors
  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-slate-400';
    if (grade >= 90) return 'text-green-400';
    if (grade >= 80) return 'text-blue-400';
    if (grade >= 70) return 'text-yellow-400';
    if (grade >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeBg = (grade: number | null) => {
    if (grade === null) return 'bg-slate-500/10 border-slate-500/30';
    if (grade >= 90) return 'bg-green-500/10 border-green-500/30';
    if (grade >= 80) return 'bg-blue-500/10 border-blue-500/30';
    if (grade >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
    if (grade >= 60) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  // Calculate total credits from published grades only
  const totalCredits = studentGrades.reduce((acc, c) => acc + c.credits, 0);
  
  // Count graded items
  const gradedItems = studentGrades.reduce(
    (acc, c) => acc + c.assessments.filter(a => a.marksObtained !== null).length,
    0
  );

  // Calculate average grade
  const avgGrade = studentGrades.length > 0
    ? studentGrades.filter(c => c.currentGrade !== null).reduce((sum, c) => sum + (c.currentGrade || 0), 0) / 
      Math.max(studentGrades.filter(c => c.currentGrade !== null).length, 1)
    : 0;

  // Empty state - No grades published yet
  if (studentGrades.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              My Grades
            </h1>
            <p className="text-zinc-500 mt-1">View your published academic performance</p>
          </div>
        </div>

        <EmptyState
          icon={GraduationCap}
          title="No Grades Published Yet"
          description="Your professors haven't published any grades yet. Check back later or contact your professor for updates on your academic progress."
        />

        {/* Info Box */}
        <div className="max-w-md mx-auto p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400 mb-1">How grades work</h4>
              <p className="text-sm text-zinc-400">
                Grades appear here automatically when your professors publish them. 
                Only published grades are visible - draft grades remain hidden until the professor releases them.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            My Grades
          </h1>
          <p className="text-zinc-500 mt-1">View your published academic performance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-zinc-400">Current GPA</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {gpa > 0 ? gpa.toFixed(2) : '—'}
          </div>
          {gpa > 0 && (
            <div className="text-xs text-zinc-500 mt-1">Out of 4.0</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-zinc-400">Active Courses</span>
          </div>
          <div className="text-3xl font-bold text-white">{studentGrades.length}</div>
          <div className="text-xs text-zinc-500 mt-1">{totalCredits} credits</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Graded Items</span>
          </div>
          <div className="text-3xl font-bold text-white">{gradedItems}</div>
          <div className="text-xs text-zinc-500 mt-1">Assessments completed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm text-zinc-400">Avg Performance</span>
          </div>
          <div className={`text-3xl font-bold ${getGradeColor(avgGrade)}`}>
            {avgGrade > 0 ? `${Math.round(avgGrade)}%` : '—'}
          </div>
          <div className="text-xs text-zinc-500 mt-1">Across all courses</div>
        </motion.div>
      </div>

      {/* Course Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Courses ({studentGrades.length})
          </h3>
          <div className="space-y-2">
            {studentGrades.map((course) => (
              <motion.button
                key={course.courseId}
                onClick={() => setSelectedCourse(course.courseId)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedCourse === course.courseId
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{course.courseCode}</span>
                  <span className={`text-lg font-bold ${getGradeColor(course.currentGrade)}`}>
                    {course.letterGrade || '—'}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 truncate">{course.courseName}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
                  <span>{course.credits} credits</span>
                  <span>{course.assessments.length} assessments</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Assessment Details */}
        <div className="lg:col-span-2">
          {selectedCourseData ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
              {/* Course Header */}
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedCourseData.courseCode} - {selectedCourseData.courseName}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      {selectedCourseData.professorName} • {selectedCourseData.semester}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border ${getGradeBg(selectedCourseData.currentGrade)}`}>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getGradeColor(selectedCourseData.currentGrade)}`}>
                        {selectedCourseData.letterGrade || '—'}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {selectedCourseData.currentGrade !== null 
                          ? `${Math.round(selectedCourseData.currentGrade)}%` 
                          : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessments Table */}
              <div className="divide-y divide-zinc-800">
                {selectedCourseData.assessments.length === 0 ? (
                  <div className="p-12 text-center">
                    <EyeOff className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500">No assessments published yet</p>
                    <p className="text-zinc-600 text-sm mt-1">Check back when your professor releases grades</p>
                  </div>
                ) : (
                  selectedCourseData.assessments.map((assessment, index) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-zinc-800/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-lg ${typeStyles[assessment.type].bg}`}>
                            <span className={`text-xs font-medium capitalize ${typeStyles[assessment.type].text}`}>
                              {assessment.type}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{assessment.name}</h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {assessment.weightPct}% weight
                              </span>
                              {assessment.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(assessment.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {assessment.marksObtained !== null ? (
                            <>
                              <div className={`text-lg font-bold ${getGradeColor((assessment.marksObtained / assessment.maxMarks) * 100)}`}>
                                {assessment.marksObtained}/{assessment.maxMarks}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {Math.round((assessment.marksObtained / assessment.maxMarks) * 100)}%
                              </div>
                            </>
                          ) : (
                            <div className="text-zinc-600">Not graded</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <div className="text-center p-8">
                <Award className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Select a course to view grades</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentGradesPage;
