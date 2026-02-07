import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfessor } from '../hooks/useProfessor';
import { useAnalyticsStore } from '../store/useStore';
import EnrollmentUploader from '../components/professor/EnrollmentUploader';
import StudentGrid from '../components/professor/StudentGrid';
import QRGenerator from '../components/professor/QRGenerator';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { downloadPDF, generatePDFFromHTML } from '../lib/pdfExport';

export default function EnterpriseWorkspace() {
  const { user, signOut } = useAuth();
  const { courses, lectures, createCourse, createLecture } = useProfessor(user?.id || '');
  const { insights, analyzing, analyzeFullCourse } = useAnalyticsStore();
  
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [lectureTitle, setLectureTitle] = useState('');
  const [refreshStudents, setRefreshStudents] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const currentCourse = courses.find((c) => c.id === selectedCourse);
  const currentLectures = selectedCourse
    ? lectures.filter((l) => l.course_id === selectedCourse)
    : [];

  const handleCreateCourse = async () => {
    if (!courseName.trim()) return;
    await createCourse(courseName);
    setCourseName('');
    setShowCourseForm(false);
  };

  const handleCreateLecture = async () => {
    if (!lectureTitle.trim() || !selectedCourse) return;
    await createLecture(selectedCourse, lectureTitle, []);
    setLectureTitle('');
    setShowLectureForm(false);
  };

  const handleAnalyze = async () => {
    if (!selectedCourse || !currentCourse) return;
    await analyzeFullCourse(selectedCourse, currentCourse.name, user?.email || 'Professor');
    setShowAnalytics(true);
  };

  const handleExport = async (format: string) => {
    if (!insights) return;

    try {
      if (format === 'pdf') {
        await downloadPDF(insights, currentCourse?.name || 'Course', user?.email || 'Professor');
      } else if (format === 'png') {
        await generatePDFFromHTML('analytics-panel', `LIS-Charts-${currentCourse?.name}-${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (format === 'share') {
        const shareData = {
          title: `LIS Analytics - ${currentCourse?.name}`,
          text: `Check out the AI analysis for ${currentCourse?.name}!`,
          url: window.location.href,
        };
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          alert('Share link: ' + window.location.href);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎓 LIS Enterprise v2.0</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => signOut()}
              className="px-4 py-2 bg-slate-200 text-gray-700 rounded-lg font-medium hover:bg-slate-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showAnalytics && insights ? (
          // Analytics View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            id="analytics-panel"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAnalytics(false)}
              className="mb-6 px-4 py-2 bg-slate-200 text-gray-700 rounded-lg font-medium hover:bg-slate-300"
            >
              ← Back to Dashboard
            </motion.button>
            <AnalyticsPanel
              insights={insights}
              courseName={currentCourse?.name || 'Course'}
              onExport={handleExport}
              isLoading={analyzing}
            />
          </motion.div>
        ) : (
          // Main Dashboard
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Courses */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📚 Courses</h2>

                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {courses.map((course) => (
                    <motion.button
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedCourse(course.id);
                        setSelectedLecture(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition ${
                        selectedCourse === course.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                      }`}
                    >
                      {course.name}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCourseForm(true)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center gap-2 mb-2"
                >
                  + New Course
                </motion.button>

                {selectedCourse && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {analyzing ? 'Analyzing...' : 'AI Analysis'}
                  </motion.button>
                )}

                {showCourseForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2"
                  >
                    <input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="Course name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateCourse}
                        className="flex-1 px-3 py-1 bg-emerald-500 text-white text-sm rounded font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowCourseForm(false)}
                        className="flex-1 px-3 py-1 bg-slate-300 text-gray-700 text-sm rounded font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 space-y-6"
            >
              {selectedCourse ? (
                <>
                  {/* Course Header */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentCourse?.name}</h2>
                    <p className="text-gray-600 mb-4">{currentLectures.length} lectures</p>

                    {/* Lectures List */}
                    <div className="space-y-2 mb-6">
                      {currentLectures.map((lecture) => (
                        <motion.button
                          key={lecture.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedLecture(lecture.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                            selectedLecture === lecture.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                          }`}
                        >
                          📝 {lecture.title}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowLectureForm(true)}
                      className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"
                    >
                      + New Lecture
                    </motion.button>

                    {showLectureForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 space-y-2"
                      >
                        <input
                          type="text"
                          value={lectureTitle}
                          onChange={(e) => setLectureTitle(e.target.value)}
                          placeholder="Lecture title"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleCreateLecture}
                            className="flex-1 px-3 py-2 bg-emerald-500 text-white rounded font-medium"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowLectureForm(false)}
                            className="flex-1 px-3 py-2 bg-slate-300 text-gray-700 rounded font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Enrollment Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                    <EnrollmentUploader
                      courseId={selectedCourse}
                      onSuccess={(count) => {
                        alert(`${count} students enrolled!`);
                        setRefreshStudents((prev) => prev + 1);
                      }}
                    />
                  </div>

                  {/* Student Grid */}
                  <StudentGrid courseId={selectedCourse} refreshTrigger={refreshStudents} />

                  {/* QR Generator - for selected lecture */}
                  {selectedLecture && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
                      <QRGenerator
                        lectureId={selectedLecture}
                        lectureTitle={currentLectures.find((l) => l.id === selectedLecture)?.title || ''}

                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                  <p className="text-gray-600 text-lg">Select a course to get started</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
