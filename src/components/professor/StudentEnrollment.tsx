import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Upload, Download, Trash2 } from 'lucide-react';

interface StudentEnrollmentProps {
  courses: any[];
}

export default function StudentEnrollment({ courses }: StudentEnrollmentProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState('all');

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    // Mock student data
    const mockStudents = [
      { id: '1', name: 'Aarav Patel', email: 'aarav@iitgn.ac.in', rollNumber: 'CS001', enrolledDate: '2026-01-15', status: 'active', engagement: 85 },
      { id: '2', name: 'Bhavna Singh', email: 'bhavna@iitgn.ac.in', rollNumber: 'CS002', enrolledDate: '2026-01-15', status: 'active', engagement: 72 },
      { id: '3', name: 'Chirag Gupta', email: 'chirag@iitgn.ac.in', rollNumber: 'CS003', enrolledDate: '2026-01-16', status: 'inactive', engagement: 45 },
    ];
    setStudents(mockStudents);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const filteredStudents = students.filter((s) => {
    if (filter === 'active') return s.status === 'active';
    if (filter === 'inactive') return s.status === 'inactive';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Upload
          </h3>
          <label className="block border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition">
            <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 mb-1">Drop CSV file here</p>
            <p className="text-slate-500 text-sm">Format: email, name, roll_number</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </motion.div>

        {/* Statistics */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur border border-slate-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Enrollment Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Enrolled</span>
              <span className="text-2xl font-bold text-white">{students.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Active</span>
              <span className="text-2xl font-bold text-emerald-400">{students.filter(s => s.status === 'active').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Inactive</span>
              <span className="text-2xl font-bold text-orange-400">{students.filter(s => s.status === 'inactive').length}</span>
            </div>
          </div>
        </motion.div>

        {/* Export */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Export Data</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition"
          >
            <Download className="w-5 h-5" />
            Download CSV
          </motion.button>
        </motion.div>
      </div>

      {/* Upload Progress */}
      {loading && uploadProgress < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold">Uploading students...</p>
            <p className="text-blue-400">{uploadProgress}%</p>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>
        </motion.div>
      )}

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
            <p className="text-sm text-slate-400 mt-1">{course.students} students enrolled</p>
          </motion.button>
        ))}
      </div>

      {/* Students List */}
      {selectedCourse ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Students</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  filter === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  filter === 'inactive' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Roll Number</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Engagement</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredStudents.map((student) => (
                  <motion.tr
                    key={student.id}
                    whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.3)' }}
                    className="transition"
                  >
                    <td className="px-4 py-3 text-white font-medium">{student.name}</td>
                    <td className="px-4 py-3 text-slate-400">{student.rollNumber}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{student.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                            style={{ width: `${student.engagement}%` }}
                          />
                        </div>
                        <span className="text-white font-bold text-sm">{student.engagement}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded font-semibold ${
                        student.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 backdrop-blur border-2 border-dashed border-slate-600 rounded-lg p-12 text-center"
        >
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Select a course to manage students</p>
        </motion.div>
      )}
    </div>
  );
}
