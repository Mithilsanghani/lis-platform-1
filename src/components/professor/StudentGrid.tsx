import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import { fetchStudents, deleteStudent, flagSilentStudent } from '../../lib/ai-analytics';

interface StudentGridProps {
  courseId: string;
  refreshTrigger?: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  roll_number: string;
  total_feedback: number;
  clarity_score: number;
  is_silent: boolean;
  streak_count: number;
}

export default function StudentGrid({ courseId, refreshTrigger }: StudentGridProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      const data = await fetchStudents(courseId);
      setStudents(data as Student[]);
      setLoading(false);
    };
    loadStudents();
  }, [courseId, refreshTrigger]);

  const handleDelete = async (studentId: string) => {
    if (confirm('Remove this student?')) {
      await deleteStudent(studentId);
      setStudents(students.filter((s) => s.id !== studentId));
    }
  };

  const handleToggleSilent = async (studentId: string, isSilent: boolean) => {
    await flagSilentStudent(studentId, !isSilent);
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, is_silent: !isSilent } : s))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">👥 Enrolled Students ({students.length})</h2>
        <p className="text-gray-600 text-sm mt-1">
          {students.filter((s) => s.is_silent).length} silent • {students.filter((s) => s.clarity_score > 0.8).length} high clarity
        </p>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-gray-600">No students enrolled yet. Upload a CSV to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Header with clarity score */}
              <div className={`h-1 ${
                student.clarity_score > 0.8 ? 'bg-emerald-500' :
                student.clarity_score > 0.5 ? 'bg-amber-500' :
                'bg-rose-500'
              }`}></div>

              <div className="p-4">
                {/* Name */}
                <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
                <p className="text-sm text-gray-600 truncate">{student.email}</p>

                {/* Stats */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Feedback count:</span>
                    <span className="font-semibold">{student.total_feedback}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Clarity:</span>
                    <span className="font-semibold">{(student.clarity_score * 100).toFixed(0)}%</span>
                  </div>

                  {student.streak_count > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🔥 Streak:</span>
                      <span className="font-semibold text-amber-600">{student.streak_count}</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${student.clarity_score * 100}%` }}
                    transition={{ duration: 0.6 }}
                  ></motion.div>
                </div>

                {/* Silent flag */}
                {student.is_silent && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-xs">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    <span className="text-red-700 font-semibold">Silent Student</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleToggleSilent(student.id, student.is_silent)}
                    className={`flex-1 px-3 py-1 text-xs font-medium rounded transition ${
                      student.is_silent
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {student.is_silent ? 'Unmark' : 'Mark'}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(student.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
