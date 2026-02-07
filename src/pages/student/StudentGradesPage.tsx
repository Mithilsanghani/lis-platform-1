/**
 * LIS Student Grades Page
 * Course grades, assessments, and academic progress
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart2,
  FileText,
  CheckCircle,
  Clock,
  ChevronRight,
  Award,
  Target,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

interface Assessment {
  id: string;
  name: string;
  type: 'quiz' | 'assignment' | 'midterm' | 'final' | 'lab';
  score: number;
  maxScore: number;
  weight: number;
  date: string;
  status: 'graded' | 'pending';
}

interface CourseGrade {
  courseCode: string;
  courseName: string;
  professor: string;
  currentGrade: number;
  letterGrade: string;
  trend: 'up' | 'down' | 'stable';
  credits: number;
  assessments: Assessment[];
}

const courseGrades: CourseGrade[] = [
  {
    courseCode: 'CS301',
    courseName: 'Data Structures & Algorithms',
    professor: 'Dr. Sharma',
    currentGrade: 87,
    letterGrade: 'A',
    trend: 'up',
    credits: 4,
    assessments: [
      { id: '1', name: 'Quiz 1', type: 'quiz', score: 18, maxScore: 20, weight: 5, date: 'Jan 15', status: 'graded' },
      { id: '2', name: 'Quiz 2', type: 'quiz', score: 17, maxScore: 20, weight: 5, date: 'Jan 29', status: 'graded' },
      { id: '3', name: 'Assignment 1', type: 'assignment', score: 42, maxScore: 50, weight: 10, date: 'Jan 20', status: 'graded' },
      { id: '4', name: 'Midterm', type: 'midterm', score: 85, maxScore: 100, weight: 25, date: 'Feb 1', status: 'graded' },
      { id: '5', name: 'Quiz 3', type: 'quiz', score: 0, maxScore: 20, weight: 5, date: 'Feb 10', status: 'pending' },
    ],
  },
  {
    courseCode: 'CS302',
    courseName: 'Database Systems',
    professor: 'Dr. Patel',
    currentGrade: 79,
    letterGrade: 'B+',
    trend: 'stable',
    credits: 3,
    assessments: [
      { id: '6', name: 'Quiz 1', type: 'quiz', score: 16, maxScore: 20, weight: 5, date: 'Jan 18', status: 'graded' },
      { id: '7', name: 'Lab 1', type: 'lab', score: 28, maxScore: 30, weight: 10, date: 'Jan 22', status: 'graded' },
      { id: '8', name: 'Assignment 1', type: 'assignment', score: 38, maxScore: 50, weight: 10, date: 'Jan 25', status: 'graded' },
      { id: '9', name: 'Midterm', type: 'midterm', score: 72, maxScore: 100, weight: 25, date: 'Feb 3', status: 'graded' },
    ],
  },
  {
    courseCode: 'CS303',
    courseName: 'Operating Systems',
    professor: 'Dr. Kumar',
    currentGrade: 92,
    letterGrade: 'A+',
    trend: 'up',
    credits: 4,
    assessments: [
      { id: '10', name: 'Quiz 1', type: 'quiz', score: 19, maxScore: 20, weight: 5, date: 'Jan 16', status: 'graded' },
      { id: '11', name: 'Quiz 2', type: 'quiz', score: 20, maxScore: 20, weight: 5, date: 'Jan 30', status: 'graded' },
      { id: '12', name: 'Assignment 1', type: 'assignment', score: 48, maxScore: 50, weight: 10, date: 'Jan 23', status: 'graded' },
      { id: '13', name: 'Midterm', type: 'midterm', score: 94, maxScore: 100, weight: 25, date: 'Feb 2', status: 'graded' },
    ],
  },
];

export function StudentGradesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>('CS301');

  const selectedCourseData = courseGrades.find(c => c.courseCode === selectedCourse);

  // Calculate overall GPA
  const totalCredits = courseGrades.reduce((acc, c) => acc + c.credits, 0);
  const weightedGrades = courseGrades.reduce((acc, c) => acc + (c.currentGrade * c.credits), 0);
  const gpa = weightedGrades / totalCredits / 25; // Convert to 4.0 scale

  // Grade colors
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-400';
    if (grade >= 80) return 'text-blue-400';
    if (grade >= 70) return 'text-yellow-400';
    if (grade >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeBg = (grade: number) => {
    if (grade >= 90) return 'bg-green-500/10 border-green-500/30';
    if (grade >= 80) return 'bg-blue-500/10 border-blue-500/30';
    if (grade >= 70) return 'bg-yellow-500/10 border-yellow-500/30';
    if (grade >= 60) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const typeStyles = {
    quiz: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    assignment: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    midterm: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    final: { bg: 'bg-red-500/10', text: 'text-red-400' },
    lab: { bg: 'bg-green-500/10', text: 'text-green-400' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Academic Grades
          </h1>
          <p className="text-zinc-400 mt-1">Your performance across all courses</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-medium text-sm">
            Spring 2025
          </span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 border border-yellow-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-zinc-400">Current GPA</span>
          </div>
          <p className="text-2xl font-bold text-white">{gpa.toFixed(2)}</p>
          <p className="text-xs text-yellow-400 mt-1">/ 4.00</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-zinc-400">Credits</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCredits}</p>
          <p className="text-xs text-zinc-400 mt-1">This semester</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-xs text-zinc-400">Avg Grade</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.round(courseGrades.reduce((a, c) => a + c.currentGrade, 0) / courseGrades.length)}%
          </p>
          <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> +3% this month
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-zinc-400">Graded Items</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {courseGrades.reduce((acc, c) => acc + c.assessments.filter(a => a.status === 'graded').length, 0)}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Assessments completed</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Courses</h3>
          
          {courseGrades.map((course) => (
            <motion.button
              key={course.courseCode}
              onClick={() => setSelectedCourse(course.courseCode)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`
                w-full p-4 rounded-xl border text-left transition-all
                ${selectedCourse === course.courseCode
                  ? 'bg-purple-600/20 border-purple-500/40'
                  : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50'
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-purple-400 font-medium">{course.courseCode}</p>
                  <p className="text-white font-medium mt-0.5">{course.courseName}</p>
                </div>
                <div className={`text-xl font-bold ${getGradeColor(course.currentGrade)}`}>
                  {course.letterGrade}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400">{course.currentGrade}%</span>
                  {course.trend === 'up' && <TrendingUp size={14} className="text-green-400" />}
                  {course.trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
                </div>
                <ChevronRight size={16} className={selectedCourse === course.courseCode ? 'text-purple-400' : 'text-zinc-600'} />
              </div>

              {/* Mini Progress Bar */}
              <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${course.currentGrade >= 90 ? 'bg-green-500' : course.currentGrade >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                  style={{ width: `${course.currentGrade}%` }}
                />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Course Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCourseData ? (
            <>
              {/* Course Header */}
              <div className={`p-6 rounded-2xl border ${getGradeBg(selectedCourseData.currentGrade)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-purple-400 font-medium">{selectedCourseData.courseCode}</p>
                    <h3 className="text-xl font-bold text-white mt-1">{selectedCourseData.courseName}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{selectedCourseData.professor}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${getGradeColor(selectedCourseData.currentGrade)}`}>
                      {selectedCourseData.letterGrade}
                    </p>
                    <p className="text-lg text-white font-medium">{selectedCourseData.currentGrade}%</p>
                  </div>
                </div>
              </div>

              {/* Assessment List */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Assessments</h4>
                  <span className="text-sm text-zinc-400">
                    {selectedCourseData.assessments.filter(a => a.status === 'graded').length} of {selectedCourseData.assessments.length} graded
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedCourseData.assessments.map((assessment, idx) => {
                    const style = typeStyles[assessment.type];
                    const percentage = assessment.status === 'graded' 
                      ? Math.round((assessment.score / assessment.maxScore) * 100)
                      : 0;

                    return (
                      <motion.div
                        key={assessment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`
                          p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50
                          ${assessment.status === 'pending' ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${style.bg}`}>
                              <FileText className={`w-4 h-4 ${style.text}`} />
                            </div>
                            <div>
                              <p className="text-white font-medium">{assessment.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs ${style.text} ${style.bg} px-2 py-0.5 rounded`}>
                                  {assessment.type}
                                </span>
                                <span className="text-xs text-zinc-500">{assessment.date}</span>
                                <span className="text-xs text-zinc-500">• {assessment.weight}% weight</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {assessment.status === 'graded' ? (
                              <>
                                <p className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                                  {assessment.score}/{assessment.maxScore}
                                </p>
                                <p className="text-xs text-zinc-400">{percentage}%</p>
                              </>
                            ) : (
                              <span className="flex items-center gap-1.5 text-sm text-yellow-400">
                                <Clock size={14} />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {assessment.status === 'graded' && (
                          <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percentage >= 90 ? 'bg-green-500' :
                                percentage >= 80 ? 'bg-blue-500' :
                                percentage >= 70 ? 'bg-yellow-500' :
                                percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <BarChart2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">Select a course to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-400">Upcoming Assessment</p>
          <p className="text-sm text-zinc-400 mt-1">
            Quiz 3 for CS301 (Data Structures) is scheduled for Feb 10. Topics flagged for revision: Graphs, AVL Trees.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentGradesPage;
