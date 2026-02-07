import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { LogOut, Menu, X, BookOpen, TrendingUp, Clock, Home, Settings, Smile, CheckCircle2, Loader, Target } from 'lucide-react';

type TabType = 'overview' | 'courses' | 'feedback' | 'performance' | 'settings';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock enrolled courses
      const mockCourses = [
        {
          id: '1',
          code: 'CS201',
          name: 'Advanced Data Structures',
          professor: 'Dr. Rajesh Sharma',
          semester: 'Spring 2026',
          attendance: 92,
          clarityScore: 78,
          engagementStreak: 12,
          status: 'active',
        },
        {
          id: '2',
          code: 'CS202',
          name: 'Algorithms & Complexity',
          professor: 'Dr. Priya Verma',
          semester: 'Spring 2026',
          attendance: 88,
          clarityScore: 85,
          engagementStreak: 8,
          status: 'active',
        },
      ];

      // Mock feedback history
      const mockFeedback = [
        { id: '1', lecture: 'Arrays and Linked Lists', clarity: 'fully', submitted: '2 days ago', course: 'CS201' },
        { id: '2', lecture: 'Tree Traversals', clarity: 'partial', submitted: '4 days ago', course: 'CS201' },
        { id: '3', lecture: 'Graph Algorithms', clarity: 'need_clarity', submitted: '1 week ago', course: 'CS201' },
      ];

      setEnrolledCourses(mockCourses);
      setFeedbackHistory(mockFeedback);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navTabs = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'courses', icon: BookOpen, label: 'Courses' },
    { id: 'feedback', icon: Smile, label: 'My Feedback' },
    { id: 'performance', icon: TrendingUp, label: 'Performance' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition text-slate-200"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
                LIS
              </div>
              <div>
                <h1 className="font-bold text-white">Student Dashboard</h1>
                <p className="text-xs text-slate-400">Learning & Engagement Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex gap-0 pt-20">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] z-30 w-64 bg-slate-800/50 backdrop-blur border-r border-slate-700/50 overflow-y-auto transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="p-4 space-y-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Welcome back, {user?.email?.split('@')[0]}!</h2>
                <p className="text-slate-400 mt-1">Your learning dashboard</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'from-blue-500 to-blue-600' },
                  { icon: CheckCircle2, label: 'Feedback Submitted', value: feedbackHistory.length, color: 'from-emerald-500 to-emerald-600' },
                  { icon: Target, label: 'Avg Clarity Score', value: '82%', color: 'from-purple-500 to-purple-600' },
                  { icon: TrendingUp, label: 'Engagement Streak', value: '12 days', color: 'from-pink-500 to-pink-600' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-6 bg-gradient-to-br ${stat.color} rounded-lg border border-slate-600 shadow-lg hover:shadow-xl transition`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                          <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                        </div>
                        <Icon className="w-12 h-12 text-white/20" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Active Courses */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Active Courses
                </h3>
                <div className="space-y-3">
                  {enrolledCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{course.name}</p>
                        <p className="text-slate-400 text-sm">{course.code} • Prof. {course.professor.split(' ')[1]}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{course.clarityScore}%</p>
                          <p className="text-xs text-slate-400">Clarity</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-400 font-bold">{course.engagementStreak}d</p>
                          <p className="text-xs text-slate-400">Streak</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white">My Courses</h2>
                <p className="text-slate-400 mt-1">Manage your enrollments and track progress</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -4 }}
                      className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6 hover:border-blue-500/50 transition"
                    >
                      <div className="mb-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-semibold">{course.code}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                      <p className="text-slate-400 text-sm mb-4">Instructor: {course.professor}</p>

                      <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-600 mb-4">
                        <div className="text-center">
                          <p className="text-white font-bold">{course.attendance}%</p>
                          <p className="text-xs text-slate-400">Attendance</p>
                        </div>
                        <div className="text-center">
                          <p className="text-emerald-400 font-bold">{course.clarityScore}%</p>
                          <p className="text-xs text-slate-400">Clarity</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-400 font-bold">{course.engagementStreak}</p>
                          <p className="text-xs text-slate-400">Days</p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg font-semibold transition"
                      >
                        View Details
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white">My Feedback</h2>
                <p className="text-slate-400 mt-1">Track your lecture feedback and clarity submissions</p>
              </div>

              <div className="space-y-3">
                {feedbackHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 4 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-slate-600 transition"
                  >
                    <div className="flex-1">
                      <p className="text-white font-bold">{item.lecture}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {item.course}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.submitted}
                        </span>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.clarity === 'fully' ? 'bg-emerald-500/20 text-emerald-300' :
                      item.clarity === 'partial' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {item.clarity === 'fully' ? 'Fully Understood' :
                       item.clarity === 'partial' ? 'Partially Understood' :
                       'Need Clarity'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Performance Analytics</h2>
                <p className="text-slate-400 mt-1">Your learning trends and insights</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clarity Trend */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Clarity Progress</h3>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id}>
                        <div className="flex justify-between mb-2">
                          <p className="text-slate-300 text-sm">{course.code}</p>
                          <p className="text-white font-bold">{course.clarityScore}%</p>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.clarityScore}%` }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Engagement Stats */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Engagement Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-400 mb-2">Feedback Submitted This Week</p>
                      <p className="text-3xl font-bold text-emerald-400">{feedbackHistory.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-2">Average Clarity Score</p>
                      <p className="text-3xl font-bold text-blue-400">82%</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-2">Current Engagement Streak</p>
                      <p className="text-3xl font-bold text-purple-400">12 days 🔥</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Email</label>
                      <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Roll Number</label>
                      <input type="text" placeholder="CS001" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:border-blue-500 transition" />
                    </div>
                  </div>
                </motion.div>

                {/* Preferences */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Preferences</h3>
                  <div className="space-y-3">
                    {['Email notifications', 'Course reminders', 'Achievement badges'].map((pref) => (
                      <label key={pref} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-slate-700 border-slate-600" />
                        <span className="text-slate-300">{pref}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
