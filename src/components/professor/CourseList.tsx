import { motion } from 'framer-motion';
import { BookOpen, Users, TrendingUp, Trash2, Settings } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  students: number;
  lectures: number;
  avgEngagement: number;
  status: string;
}

interface CourseListProps {
  courses: Course[];
  onSelect?: (course: Course) => void;
  onRefresh?: () => void;
}

export default function CourseList({ courses, onSelect }: CourseListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, idx) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          onClick={() => onSelect?.(course)}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6 cursor-pointer hover:border-blue-500/50 transition group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-semibold">{course.code}</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-semibold">Active</span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button className="p-2 hover:bg-slate-600 rounded-lg transition"><Settings className="w-4 h-4 text-slate-400" /></button>
              <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
          <p className="text-slate-400 text-sm mb-4">{course.semester}</p>

          <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-600">
            <div className="text-center">
              <Users className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <p className="text-white font-bold">{course.students}</p>
              <p className="text-xs text-slate-400">Students</p>
            </div>
            <div className="text-center">
              <BookOpen className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <p className="text-white font-bold">{course.lectures}</p>
              <p className="text-xs text-slate-400">Lectures</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <p className="text-emerald-400 font-bold">{course.avgEngagement}%</p>
              <p className="text-xs text-slate-400">Engaged</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg font-semibold transition"
          >
            View Course
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}
