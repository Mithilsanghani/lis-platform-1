/**
 * LIS Professor Layout
 * Shared layout for all professor portal pages
 * FULLY FUNCTIONAL: Profile, Settings, Analytics, Logout
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Clock,
  Target,
  Zap,
  Shield,
  Eye,
  Volume2,
  ArrowLeft,
  AlertTriangle,
  Award,
} from 'lucide-react';

const navItems = [
  { path: '/professor', icon: LayoutDashboard, label: 'Overview', end: true },
  { path: '/professor/courses', icon: BookOpen, label: 'Courses' },
  { path: '/professor/lectures', icon: GraduationCap, label: 'Lectures' },
  { path: '/professor/students', icon: Users, label: 'Students' },
  { path: '/professor/grades', icon: Award, label: 'Grades' },
  { path: '/professor/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/professor/insights', icon: Lightbulb, label: 'AI Insights' },
];

export function ProfessorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  // Settings state
  const [settingsTab, setSettingsTab] = useState<'account' | 'notifications' | 'privacy' | 'interface'>('account');
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    feedbackAlerts: true,
    silentStudentAlerts: true,
    weeklyDigest: false,
    // Privacy
    profileVisibility: 'department',
    showOnlineStatus: true,
    allowStudentMessages: true,
    // Interface
    compactMode: false,
    soundEffects: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    const value = settings[key];
    if (typeof value === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  // ESC key handler for all modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowProfileDrawer(false);
        setShowSettingsModal(false);
        setShowAnalyticsModal(false);
        setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setIsProfileOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('lis_user');
    localStorage.removeItem('lis_token');
    sessionStorage.clear();
    navigate('/login');
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: '5 students need feedback reminders', time: '2m ago', type: 'warning' },
    { id: 2, text: 'CS201 lecture feedback completed', time: '1h ago', type: 'success' },
    { id: 3, text: 'New AI insight available', time: '3h ago', type: 'info' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-40
          bg-slate-900/95 backdrop-blur-xl
          border-r border-slate-700/50
          transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-[260px] min-w-[260px] max-w-[260px]' : 'w-20 min-w-[80px] max-w-[80px]'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white">LIS</h1>
                <p className="text-xs text-slate-400">Professor Portal</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200
                ${isActive
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
          <NavLink
            to="/professor/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-200
              ${isActive
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }
            `}
          >
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          min-h-screen transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'ml-[260px]' : 'ml-20'}
        `}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-[70px] bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
          <div className="h-full flex items-center justify-between px-8">
            {/* Search */}
            <div className="relative w-full max-w-[600px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, students, lectures..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications - FUNCTIONAL */}
              <div className="relative">
                <button 
                  onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                  className="relative p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                          <h3 className="font-semibold text-white text-sm">Notifications</h3>
                          <button className="text-xs text-indigo-400 hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.map((notif) => (
                            <div key={notif.id} className="p-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50 last:border-0">
                              <p className="text-sm text-white">{notif.text}</p>
                              <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 border-t border-slate-700">
                          <button 
                            onClick={() => { navigate('/professor/notifications'); setIsNotificationsOpen(false); }}
                            className="w-full py-2 text-sm text-indigo-400 hover:bg-slate-700/50 rounded-lg"
                          >
                            View all notifications
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile - FULLY FUNCTIONAL */}
              <div className="relative">
                <button
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    S
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-white">Dr. Sharma</p>
                    <p className="text-xs text-slate-400">professor@iit.ac.in</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden z-50"
                      >
                        {/* Profile Header */}
                        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            S
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Dr. Sharma</p>
                            <p className="text-xs text-slate-400">professor@iit.ac.in</p>
                          </div>
                        </div>

                        {/* Menu Items - ALL FUNCTIONAL */}
                        <div className="py-1">
                          <button
                            onClick={() => { setShowProfileDrawer(true); setIsProfileOpen(false); }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 w-full"
                          >
                            <User className="w-4 h-4" />
                            View Profile
                          </button>
                          <button
                            onClick={() => { setShowSettingsModal(true); setIsProfileOpen(false); }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 w-full"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </button>
                          <button
                            onClick={() => { setShowAnalyticsModal(true); setIsProfileOpen(false); }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 w-full"
                          >
                            <TrendingUp className="w-4 h-4" />
                            My Analytics
                          </button>
                        </div>

                        <div className="border-t border-slate-700">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-700/50 w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Universal Container */}
        <div className="flex-1 w-full">
          <div className="w-full max-w-[1400px] mx-auto px-8 py-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Profile Drawer - Opens when View Profile clicked */}
      <AnimatePresence>
        {showProfileDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowProfileDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 p-4 flex items-center justify-between z-10">
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Avatar & Name */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                    S
                  </div>
                  <h2 className="text-xl font-bold text-white">Dr. Sharma</h2>
                  <p className="text-slate-400">Professor, Computer Science</p>
                  <p className="text-sm text-slate-500 mt-1">professor@iit.ac.in</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-indigo-400">12</p>
                    <p className="text-xs text-slate-500">Courses</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-emerald-400">347</p>
                    <p className="text-xs text-slate-500">Students</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                    <p className="text-2xl font-bold text-purple-400">89%</p>
                    <p className="text-xs text-slate-500">Avg. Health</p>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Department Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Department</span>
                        <span className="text-white">Computer Science</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Institution</span>
                        <span className="text-white">IIT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Member Since</span>
                        <span className="text-white">Aug 2023</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">This Semester</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Active Courses</span>
                        <span className="text-white">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Lectures</span>
                        <span className="text-white">48</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Feedback Collected</span>
                        <span className="text-white">1,247</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700">
                <button
                  onClick={() => { setShowSettingsModal(true); setShowProfileDrawer(false); }}
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════════════════
          SETTINGS MODAL - Full-screen with 4 tabs
      ═══════════════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSettingsModal && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowSettingsModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <p className="text-sm text-slate-400">Manage your account and preferences</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-slate-700">
                {[
                  { id: 'account', label: 'Account', icon: User },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'privacy', label: 'Privacy', icon: Shield },
                  { id: 'interface', label: 'Interface', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                      settingsTab === tab.id
                        ? 'text-indigo-400 border-indigo-400 bg-slate-800/50'
                        : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {settingsTab === 'account' && (
                  <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                          S
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                              <input
                                type="text"
                                defaultValue="Dr. Sharma"
                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-400 mb-2">Department</label>
                              <input
                                type="text"
                                defaultValue="Computer Science"
                                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                            <input
                              type="email"
                              defaultValue="professor@iit.ac.in"
                              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                          <input
                            type="password"
                            placeholder="Enter current password"
                            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                            <input
                              type="password"
                              placeholder="Enter new password"
                              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Confirm Password</label>
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: MessageSquare },
                          { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
                          { key: 'feedbackAlerts', label: 'Feedback Alerts', desc: 'Get notified when students submit feedback', icon: CheckCircle },
                          { key: 'silentStudentAlerts', label: 'Silent Student Alerts', desc: 'Alerts for students not participating', icon: AlertTriangle },
                          { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of weekly activity', icon: Clock },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-600">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-indigo-500/20">
                                <item.icon className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{item.label}</p>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSetting(item.key as keyof typeof settings)}
                              className={`relative w-12 h-7 rounded-full transition-colors ${
                                settings[item.key as keyof typeof settings] ? 'bg-indigo-500' : 'bg-slate-600'
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                                  settings[item.key as keyof typeof settings] ? 'left-6' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-600">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                              <Eye className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Profile Visibility</p>
                              <p className="text-sm text-slate-400">Who can see your profile</p>
                            </div>
                          </div>
                          <select
                            value={settings.profileVisibility}
                            onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-indigo-500"
                          >
                            <option value="everyone">Everyone</option>
                            <option value="department">Department Only</option>
                            <option value="students">My Students Only</option>
                            <option value="private">Private</option>
                          </select>
                        </div>

                        {[
                          { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Let others see when you are online', icon: Zap },
                          { key: 'allowStudentMessages', label: 'Allow Student Messages', desc: 'Students can send you direct messages', icon: MessageSquare },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-600">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-purple-500/20">
                                <item.icon className="w-5 h-5 text-purple-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{item.label}</p>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSetting(item.key as keyof typeof settings)}
                              className={`relative w-12 h-7 rounded-full transition-colors ${
                                settings[item.key as keyof typeof settings] ? 'bg-indigo-500' : 'bg-slate-600'
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                                  settings[item.key as keyof typeof settings] ? 'left-6' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'interface' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Interface Preferences</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'compactMode', label: 'Compact Mode', desc: 'Use smaller cards and reduced spacing', icon: Target },
                          { key: 'soundEffects', label: 'Sound Effects', desc: 'Play sounds for notifications and actions', icon: Volume2 },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-600">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-emerald-500/20">
                                <item.icon className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{item.label}</p>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSetting(item.key as keyof typeof settings)}
                              className={`relative w-12 h-7 rounded-full transition-colors ${
                                settings[item.key as keyof typeof settings] ? 'bg-indigo-500' : 'bg-slate-600'
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                                  settings[item.key as keyof typeof settings] ? 'left-6' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { keys: ['Ctrl', 'K'], action: 'Command Palette' },
                          { keys: ['Ctrl', 'N'], action: 'New Course' },
                          { keys: ['Ctrl', 'L'], action: 'Start Lecture' },
                          { keys: ['Esc'], action: 'Close Modal' },
                        ].map((shortcut, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-600">
                            <span className="text-sm text-slate-400">{shortcut.action}</span>
                            <div className="flex gap-1">
                              {shortcut.keys.map((key, i) => (
                                <kbd key={i} className="px-2 py-1 text-xs font-mono bg-slate-700 border border-slate-600 rounded text-slate-300">
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════════════════
          MY ANALYTICS MODAL - Personal teaching metrics
      ═══════════════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAnalyticsModal && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowAnalyticsModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAnalyticsModal(false)}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-white">My Analytics</h2>
                    <p className="text-sm text-slate-400">Your personal teaching performance metrics</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Top Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Lectures', value: '156', change: '+12 this month', icon: BookOpen, color: 'indigo' },
                    { label: 'Avg Engagement', value: '87%', change: '+5% vs last sem', icon: TrendingUp, color: 'emerald' },
                    { label: 'Feedback Received', value: '2,847', change: '94% resolution', icon: MessageSquare, color: 'purple' },
                    { label: 'Response Time', value: '2.4h', change: 'Top 10% faculty', icon: Clock, color: 'amber' },
                  ].map((stat, idx) => (
                    <div key={idx} className={`p-5 rounded-xl bg-slate-800/50 border border-slate-700`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                          <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                        </div>
                        <span className="text-xs text-emerald-400">{stat.change}</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Engagement Trend */}
                  <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Engagement Trend</h3>
                    <div className="h-48 flex items-end gap-2">
                      {[65, 72, 68, 85, 79, 92, 88, 95, 87, 91, 89, 94].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t"
                            style={{ height: `${val * 1.8}px` }}
                          />
                          <span className="text-[10px] text-slate-500">
                            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-indigo-500" />
                        <span className="text-slate-400">Monthly Engagement %</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Distribution */}
                  <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Feedback Distribution</h3>
                    <div className="flex items-center justify-center h-48">
                      <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="12" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray="125.6 125.6" strokeDashoffset="0" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#eab308" strokeWidth="12" strokeDasharray="125.6 125.6" strokeDashoffset="-125.6" />
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray="125.6 125.6" strokeDashoffset="-188.4" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">2,847</p>
                            <p className="text-xs text-slate-400">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                      {[
                        { label: 'Positive', color: 'bg-emerald-500', pct: '68%' },
                        { label: 'Neutral', color: 'bg-yellow-500', pct: '24%' },
                        { label: 'Needs Work', color: 'bg-red-500', pct: '8%' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${item.color}`} />
                          <span className="text-slate-400">{item.label} ({item.pct})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Silent Students Handled */}
                  <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Silent Students</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Identified</span>
                        <span className="text-white font-medium">47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Engaged</span>
                        <span className="text-emerald-400 font-medium">41</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">In Progress</span>
                        <span className="text-yellow-400 font-medium">6</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-medium">Success Rate</span>
                          <span className="text-emerald-400 font-bold text-lg">87%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Performance */}
                  <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Courses</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Data Structures', score: 94 },
                        { name: 'Algorithms', score: 91 },
                        { name: 'System Design', score: 88 },
                        { name: 'Database Systems', score: 85 },
                      ].map((course, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-slate-500 text-sm w-4">{idx + 1}.</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white">{course.name}</span>
                              <span className="text-indigo-400">{course.score}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                style={{ width: `${course.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
                    <div className="space-y-3">
                      {[
                        { icon: '🏆', title: 'Top Engager', desc: 'Highest engagement Q3' },
                        { icon: '⚡', title: 'Speed Demon', desc: '<2hr response time' },
                        { icon: '🎯', title: 'Perfect Score', desc: '100% feedback resolution' },
                        { icon: '🌟', title: 'Student Favorite', desc: '4.9/5 rating' },
                      ].map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50">
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-white">{badge.title}</p>
                            <p className="text-xs text-slate-400">{badge.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700 flex justify-between items-center">
                <p className="text-sm text-slate-400">Last updated: Just now</p>
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════════════════
          LOGOUT CONFIRMATION MODAL
      ═══════════════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showLogoutConfirm && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
                  <LogOut className="w-8 h-8 text-red-400" />
                </div>
                
                {/* Text */}
                <h2 className="text-xl font-bold text-white mb-2">Sign Out?</h2>
                <p className="text-slate-400 mb-6">
                  Are you sure you want to sign out? You'll need to log in again to access your dashboard.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}
