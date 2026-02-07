import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, QrCode, Trash2, Play } from 'lucide-react';

interface LectureManagerProps {
  courses: any[];
}

export default function LectureManager({ courses }: LectureManagerProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [lectures, setLectures] = useState<any[]>([]);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    // Mock lectures data
    const mockLectures = [
      { id: '1', title: 'Introduction to Data Structures', date: '2026-01-20', status: 'completed', students: 42 },
      { id: '2', title: 'Arrays and Linked Lists', date: '2026-01-22', status: 'active', students: 45 },
      { id: '3', title: 'Trees and Graphs', date: '2026-01-27', status: 'scheduled', students: 0 },
    ];
    setLectures(mockLectures);
  };

  return (
    <div className="space-y-6">
      {/* Course Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.button
            key={course.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCourseSelect(course.id)}
            className={`p-4 rounded-lg border transition text-left ${
              selectedCourse === course.id
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
            }`}
          >
            <p className="font-bold">{course.code}</p>
            <p className="text-sm text-slate-400 mt-1">{course.name.substring(0, 30)}</p>
          </motion.button>
        ))}
      </div>

      {/* Lectures List */}
      {selectedCourse ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Lectures</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Lecture
            </motion.button>
          </div>

          <div className="space-y-3">
            {lectures.length > 0 ? (
              lectures.map((lecture) => (
                <motion.div
                  key={lecture.id}
                  whileHover={{ x: 4 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-slate-600 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-white font-bold">{lecture.title}</p>
                      <span className={`px-2 py-1 text-xs rounded font-semibold ${
                        lecture.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        lecture.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-slate-600/50 text-slate-300'
                      }`}>
                        {lecture.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(lecture.date).toLocaleDateString()}
                      </span>
                      <span>{lecture.students} students</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {lecture.status === 'scheduled' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition"
                      >
                        <Play className="w-4 h-4" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => console.log('Show QR for lecture', lecture.id)}
                      className="p-2 hover:bg-purple-500/20 text-purple-400 rounded-lg transition"
                    >
                      <QrCode className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No lectures yet. Create one to get started!</p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur border-2 border-dashed border-slate-600 rounded-lg p-12 text-center"
        >
          <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Select a course to view lectures</p>
        </motion.div>
      )}
    </div>
  );
}
