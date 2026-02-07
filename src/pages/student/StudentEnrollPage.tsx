/**
 * Student Enrollment Page
 * Students enter an enrollment code to join a course
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import { useLISStore } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';

export default function StudentEnrollPage() {
  const { user } = useAuthStore();
  const studentId = user?.id || '';
  const enrollByCode = useLISStore((s) => s.enrollByCode);
  const getCourse = useLISStore((s) => s.getCourse);
  const getStudentCourses = useLISStore((s) => s.getStudentCourses);

  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const studentCourses = getStudentCourses(studentId);

  const handleEnroll = () => {
    if (!enrollmentCode.trim()) {
      setStatus('error');
      setMessage('Please enter an enrollment code');
      return;
    }
    if (!studentId) {
      setStatus('error');
      setMessage('Please sign in first');
      return;
    }
    const result = enrollByCode(studentId, enrollmentCode.trim().toUpperCase());
    if (result.success && result.courseId) {
      const course = getCourse(result.courseId);
      setStatus('success');
      setMessage(`Successfully enrolled in ${course?.code || 'course'} — ${course?.name || ''}`);
      setEnrollmentCode('');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setMessage(result.error || 'Invalid enrollment code or already enrolled');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            Enroll in Course
          </h1>
          <p className="text-slate-400 mt-1">Enter the enrollment code provided by your professor</p>
        </div>
      </div>

      {/* Enrollment Form */}
      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Enrollment Code</label>
            <input
              type="text"
              placeholder="e.g., ABC123"
              value={enrollmentCode}
              onChange={(e) => setEnrollmentCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleEnroll()}
              className="w-full px-4 py-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 font-mono text-xl text-center tracking-widest"
              maxLength={8}
            />
          </div>

          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
                  status === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleEnroll}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Enroll
          </button>
        </div>

        {/* How it works */}
        <div className="mt-6 p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <h3 className="text-sm font-medium text-slate-300 mb-3">How to enroll</h3>
          <ol className="text-sm text-slate-500 space-y-2 list-decimal list-inside">
            <li>Get the enrollment code from your professor</li>
            <li>Enter the code above and click Enroll</li>
            <li>The course will appear in your dashboard</li>
          </ol>
        </div>
      </div>

      {/* Already Enrolled */}
      {studentCourses.length > 0 && (
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
            Your Courses ({studentCourses.length})
          </h3>
          <div className="space-y-3">
            {studentCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-between"
              >
                <div>
                  <span className="text-indigo-400 font-medium text-sm">{course.code}</span>
                  <p className="text-sm text-white mt-0.5">{course.name}</p>
                </div>
                <span className="text-xs text-slate-500">{course.semester}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
