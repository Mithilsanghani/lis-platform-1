/**
 * LIS v3.0 - Student Layout with Enhanced Navigation
 * Premium TopBar matching Professor dashboard style
 * Dark theme with glassmorphism and all v3.0 features
 */

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentSidebarV4 } from '../../components/student/StudentSidebarV4';
import { useAuth } from '../../hooks/useAuth';
import {
  User,
  LogOut,
  ChevronDown,
  Search,
  Command,
  Bell,
  Sparkles,
  Wifi,
  Settings,
  TrendingUp,
  Check,
  MessageSquare,
  AlertTriangle,
  X,
} from 'lucide-react';

// ================== Types ==================

interface StudentLayoutV3Props {
  children?: React.ReactNode;
}

interface Notification {
  id: string;
  type: 'feedback' | 'alert' | 'system' | 'ai';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ================== TopBar Component ==================

interface TopBarProps {
  studentName: string;
  sidebarWidth: number;
  pendingFeedback?: number;
  activeCourses?: number;
  weeklyProgress?: number;
  onSignOut?: () => void;
  onViewProfile?: () => void;
  onSettings?: () => void;
  onMyPerformance?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  studentName,
  sidebarWidth,
  pendingFeedback = 2,
  activeCourses = 3,
  weeklyProgress = 78,
  onSignOut,
  onViewProfile,
  onSettings,
  onMyPerformance,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const [notifications] = useState<Notification[]>([
    { id: '1', type: 'feedback', title: 'Feedback Due', message: 'Binary Trees lecture feedback due in 2 hours', read: false, createdAt: new Date(Date.now() - 3600000) },
    { id: '2', type: 'ai', title: 'AI Insight', message: 'Your understanding improved 15% this week!', read: false, createdAt: new Date(Date.now() - 7200000) },
    { id: '3', type: 'system', title: 'New Material', message: 'CS301 lecture notes uploaded', read: true, createdAt: new Date(Date.now() - 86400000) },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = studentName.split(' ')[0] || 'Student';
  const initials = firstName.charAt(0).toUpperCase();

  // Notification icon
  const NotifIcon = ({ type }: { type: Notification['type'] }) => {
    const config = {
      feedback: { icon: MessageSquare, bg: 'bg-purple-500/20', color: 'text-purple-400' },
      alert: { icon: AlertTriangle, bg: 'bg-orange-500/20', color: 'text-orange-400' },
      system: { icon: Settings, bg: 'bg-blue-500/20', color: 'text-blue-400' },
      ai: { icon: Sparkles, bg: 'bg-cyan-500/20', color: 'text-cyan-400' },
    };
    const { icon: Icon, bg, color } = config[type];
    return (
      <div className={`p-2 rounded-lg ${bg}`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    );
  };

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <header
      className="fixed top-0 right-0 h-[70px] z-30 transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      <div className="h-full px-8 flex items-center justify-between bg-gradient-to-r from-zinc-900/95 via-purple-950/5 to-zinc-900/95 backdrop-blur-xl border-b border-white/10">
        {/* Left: Greeting + Stats */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="min-w-0">
            {/* Dynamic Greeting */}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold text-white truncate">
                {getGreeting()}, <span className="text-purple-400">{firstName}</span>
              </h1>
            </div>

            {/* Stats Subtitle */}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span>{activeCourses} courses</span>
              <span className="text-zinc-600">•</span>
              <span>{weeklyProgress}% weekly progress</span>
              {pendingFeedback > 0 && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-500/20 text-orange-400 animate-pulse">
                    {pendingFeedback} feedback due
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Live Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Wifi className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <motion.button
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Search...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-500">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
              whileHover={{ scale: 1.05, rotate: 8 }}
              whileTap={{ scale: 0.95, rotate: -5 }}
            >
              <Bell className="w-5 h-5 text-zinc-400" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-rose-500 text-white ring-2 ring-zinc-950"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        className={`flex items-start gap-3 p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer transition-colors ${!notif.read ? 'bg-zinc-800/30' : ''}`}
                        whileHover={{ x: 2 }}
                      >
                        <NotifIcon type={notif.type} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-white truncate">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-zinc-600 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
                    <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 py-1">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Assistant Button */}
          <motion.button
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 hover:border-purple-500/50 relative group"
            whileHover={{ scale: 1.08, rotate: 12 }}
            whileTap={{ scale: 0.95, rotate: -8 }}
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-zinc-800 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              AI Study Assistant
            </span>
          </motion.button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                {initials}
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">{studentName}</p>
                          <p className="text-xs text-zinc-400 truncate">alex.johnson@university.edu</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => { onViewProfile?.(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">View Profile</span>
                      </button>
                      <button
                        onClick={() => { onSettings?.(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={() => { onMyPerformance?.(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">My Performance</span>
                      </button>
                    </div>
                    <div className="py-2 border-t border-zinc-800">
                      <button
                        onClick={() => { onSignOut?.(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
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
  );
};

// ================== Main Layout ==================

export const StudentLayoutV3: React.FC<StudentLayoutV3Props> = ({ children }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();

  // Handle sign out
  const handleSignOut = async () => {
    localStorage.removeItem('demo_role');
    await signOut();
    navigate('/login');
  };

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
      // ESC to close modals
      if (e.key === 'Escape') {
        setShowSignOutConfirm(false);
        setShowProfileModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sidebarWidth = isCollapsed ? 80 : 260;

  // Mock data - in real app, this comes from API/store
  const mockStudentData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    weeklyProgress: 78,
    feedbackStreak: 12,
    pendingFeedback: 2,
    totalFeedback: 12,
    activeCourses: 3,
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Background Gradient - subtle, not blocking */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-transparent pointer-events-none z-0" />

      {/* Sidebar */}
      <StudentSidebarV4
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        onSignOut={() => setShowSignOutConfirm(true)}
        studentName={mockStudentData.name}
        weeklyProgress={mockStudentData.weeklyProgress}
        feedbackStreak={mockStudentData.feedbackStreak}
        pendingFeedback={mockStudentData.pendingFeedback}
        totalFeedback={mockStudentData.totalFeedback}
        activeCourses={mockStudentData.activeCourses}
        isOnline={isOnline}
      />

      {/* TopBar */}
      <TopBar
        studentName={mockStudentData.name}
        sidebarWidth={sidebarWidth}
        pendingFeedback={mockStudentData.pendingFeedback}
        activeCourses={mockStudentData.activeCourses}
        weeklyProgress={mockStudentData.weeklyProgress}
        onSignOut={() => setShowSignOutConfirm(true)}
        onViewProfile={() => setShowProfileModal(true)}
        onSettings={() => navigate('/dev/student/settings')}
        onMyPerformance={() => navigate('/dev/student/performance')}
      />

      {/* Main Content */}
      <main
        className="pt-[70px] min-h-screen transition-all duration-300 relative z-10 flex flex-col"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="flex-1 w-full">
          <div className="w-full max-w-[1400px] mx-auto px-8 py-8">
            {/* Page Content */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children || <Outlet />}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSignOutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/20">
                    <LogOut className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Sign Out</h2>
                    <p className="text-sm text-zinc-400">Are you sure you want to sign out?</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex gap-3">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 px-4 py-3 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                    {mockStudentData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{mockStudentData.name}</h2>
                    <p className="text-sm text-zinc-400">{mockStudentData.email}</p>
                    <p className="text-xs text-zinc-500 mt-1">Student • Computer Science</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Stats */}
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <p className="text-2xl font-bold text-purple-400">{mockStudentData.activeCourses}</p>
                  <p className="text-xs text-zinc-400">Active Courses</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{mockStudentData.totalFeedback}</p>
                  <p className="text-xs text-zinc-400">Feedback Given</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <p className="text-2xl font-bold text-orange-400">{mockStudentData.feedbackStreak}</p>
                  <p className="text-xs text-zinc-400">Day Streak</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => { setShowProfileModal(false); navigate('/dev/student/settings'); }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm flex items-center gap-2 backdrop-blur-xl z-50"
          >
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            You're offline. Changes will sync when reconnected.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentLayoutV3;
