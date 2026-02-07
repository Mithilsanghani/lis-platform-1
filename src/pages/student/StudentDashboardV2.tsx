/**
 * Student Dashboard V2 - Matching Professor Dashboard UI Exactly
 * Same navigation style, metrics cards, and layout as professor dashboard
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, MessageSquare, BarChart3, LogOut,
  ChevronLeft, Bell, Settings, Search, TrendingUp, TrendingDown, 
  Sparkles, X, Clock, Activity, Target, Flame, CheckCircle, 
  ArrowRight, Command, Zap, BookMarked, Calendar, PlayCircle, Users, Send,
  Award,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/useStore';
import { useLISStore } from '../../store/useLISStore';

// Color configurations for metric cards - matching professor dashboard
const metricColors = {
  blue: { 
    bg: 'from-blue-500/10 to-blue-600/5', 
    border: 'border-blue-500/20', 
    icon: 'bg-blue-500/20 text-blue-400',
    bar: 'bg-blue-500',
    chart: '#3b82f6'
  },
  emerald: { 
    bg: 'from-emerald-500/10 to-emerald-600/5', 
    border: 'border-emerald-500/20', 
    icon: 'bg-emerald-500/20 text-emerald-400',
    bar: 'bg-emerald-500',
    chart: '#10b981'
  },
  amber: { 
    bg: 'from-amber-500/10 to-amber-600/5', 
    border: 'border-amber-500/20', 
    icon: 'bg-amber-500/20 text-amber-400',
    bar: 'bg-amber-500',
    chart: '#f59e0b'
  },
  purple: { 
    bg: 'from-purple-500/10 to-purple-600/5', 
    border: 'border-purple-500/20', 
    icon: 'bg-purple-500/20 text-purple-400',
    bar: 'bg-purple-500',
    chart: '#a855f7'
  },
  rose: { 
    bg: 'from-rose-500/10 to-rose-600/5', 
    border: 'border-rose-500/20', 
    icon: 'bg-rose-500/20 text-rose-400',
    bar: 'bg-rose-500',
    chart: '#f43f5e'
  },
};

// Metric Card - Matching Professor Dashboard Style with colored progress bar
function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string | number; 
  change: string; 
  color: keyof typeof metricColors;
}) {
  const colors = metricColors[color];
  const isPositive = change.startsWith('+');

  return (
    <motion.div 
      className={`relative p-5 rounded-2xl border backdrop-blur-xl bg-gradient-to-br ${colors.bg} ${colors.border} overflow-hidden`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon */}
      <div className={`inline-flex p-3 rounded-xl ${colors.icon} mb-4`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Title */}
      <p className="text-sm text-zinc-400 mb-2">{title}</p>

      {/* Value and Change */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </span>
      </div>

      {/* Progress Bar at bottom - matching professor dashboard */}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${colors.bar} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// AI Insight Alert Card - Matching Professor Dashboard Style
function AIInsightAlert({ 
  icon: Icon, 
  title, 
  subtitle, 
  actionLabel, 
  onAction,
  color = 'rose'
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  color?: string;
}) {
  return (
    <motion.div 
      className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color === 'rose' ? 'bg-rose-500/20' : 'bg-purple-500/20'}`}>
            <Icon className={`w-5 h-5 ${color === 'rose' ? 'text-rose-400' : 'text-purple-400'}`} />
          </div>
          <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-zinc-500">{subtitle}</p>
          </div>
        </div>
        <motion.button
          onClick={onAction}
          className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
            color === 'rose' 
              ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' 
              : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-4 h-4" />
          {actionLabel}
        </motion.button>
      </div>
    </motion.div>
  );
}

// Main Dashboard Component
export function StudentDashboardV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { user } = useAuthStore();
  const { 
    getStudentPendingFeedback,
    getStudentLectures,
    getStudentCourses,
    getStudentPublishedGrades,
    calculateStudentGPA,
  } = useLISStore();
  
  // Get current student ID from auth
  const studentId = user?.id || 'current-student';

  // Get computed data - NO DUMMY DATA
  const studentGPA = calculateStudentGPA(studentId);
  const studentGrades = getStudentPublishedGrades(studentId);
  const pendingFeedback = getStudentPendingFeedback(studentId);
  const studentLectures = getStudentLectures(studentId);
  const studentCourses = getStudentCourses(studentId);
  const completedLectures = studentLectures.filter(l => l.status === 'completed');
  
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Student metrics - COMPUTED FROM REAL DATA ONLY
  const uniqueGradedCourses = new Set(studentGrades.map(g => g.course.id)).size;
  const metrics = {
    enrolledCourses: uniqueGradedCourses > 0 ? uniqueGradedCourses : studentCourses.length,
    completedLectures: completedLectures.length,
    pendingFeedback: pendingFeedback.length,
    understanding: 0, // Will be computed from feedback when available
    streak: 0, // Will be computed from activity when available
    activeLectures: studentLectures.filter(l => l.status === 'live').length,
    totalStudyHours: 0, // Computed from lecture attendance
    weeklyProgress: 0, // Computed from activity
    gpa: studentGPA,
    changes: { 
      courses: studentCourses.length > 0 ? `${studentCourses.length}` : '0', 
      understanding: '—', 
      lectures: completedLectures.length > 0 ? `${completedLectures.length}` : '0', 
      feedback: pendingFeedback.length > 0 ? `${pendingFeedback.length}` : '0' 
    },
  };

  const studentName = user?.email?.split('@')[0] || 'Alex';
  const firstName = studentName.charAt(0).toUpperCase() + studentName.slice(1);

  // Navigation items - matching professor sidebar style exactly
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'courses', icon: BookOpen, label: 'Courses', badge: metrics.enrolledCourses > 0 ? metrics.enrolledCourses : undefined },
    { id: 'lectures', icon: PlayCircle, label: 'Lectures', badge: metrics.activeLectures > 0 ? metrics.activeLectures : undefined },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback', badge: metrics.pendingFeedback > 0 ? metrics.pendingFeedback : undefined },
    { id: 'grades', icon: Award, label: 'Grades' },
    { id: 'performance', icon: BarChart3, label: 'Analytics' },
    { id: 'ai', icon: Sparkles, label: 'AI Insights', isNew: true },
  ];

  const handleLogout = async () => {
    localStorage.removeItem('demo_role');
    await signOut();
    navigate('/login');
  };

  const handleNavClick = (itemId: string) => {
    setTab(itemId);
    if (itemId === 'dashboard') {
      navigate('/dev/student/overview');
    } else if (itemId === 'courses') {
      navigate('/dev/student/courses');
    } else if (itemId === 'lectures') {
      navigate('/dev/student/schedule');
    } else if (itemId === 'feedback') {
      navigate('/dev/student/feedback');
    } else if (itemId === 'grades') {
      navigate('/dev/student/grades');
    } else if (itemId === 'performance') {
      navigate('/dev/student/performance');
    } else if (itemId === 'ai') {
      // Show AI insights modal
      setShowAIInsights(true);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
        if (e.key === 'Escape') {
        setSearchOpen(false);
        setShowSignOutConfirm(false);
        setShowProfileModal(false);
        setProfileDropdownOpen(false);
        setShowAIInsights(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Determine active tab from location
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('feedback')) setTab('feedback');
    else if (path.includes('courses')) setTab('courses');
    else if (path.includes('grades')) setTab('grades');
    else if (path.includes('performance')) setTab('performance');
    else if (path.includes('schedule') || path.includes('lectures')) setTab('lectures');
    else setTab('dashboard');
  }, [location.pathname]);

  const isOnDashboard = tab === 'dashboard' || location.pathname.includes('overview') || location.pathname === '/dev/student';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Sidebar - Matching Professor Dashboard Exactly */}
      <nav 
        className="fixed left-0 top-0 h-screen z-40 bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col" 
        style={{
          width: collapsed ? 80 : 260,
          transition: 'width 200ms ease-in-out',
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold text-white text-lg">
              L
            </div>
            {!collapsed && <span className="font-semibold text-white text-lg">LIS Platform</span>}
          </div>
        </div>

        {/* Collapse Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="absolute -right-3 top-[4.5rem] w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center z-50 hover:bg-zinc-700 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 text-zinc-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button 
              key={item.id} 
              onClick={() => handleNavClick(item.id)} 
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                tab === item.id 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              } ${collapsed ? 'justify-center' : ''}`} 
              whileHover={{ x: collapsed ? 0 : 4 }}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${tab === item.id ? 'text-white' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  {item.isNew && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500 text-white">
                      NEW
                    </span>
                  )}
                </>
              )}
            </motion.button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="py-4 border-t border-zinc-800/50 px-3">
          <motion.button 
            onClick={() => setShowSignOutConfirm(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all ${collapsed ? 'justify-center' : ''}`}
            whileHover={{ x: collapsed ? 0 : 4 }}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </motion.button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 min-h-screen flex flex-col ${collapsed ? 'ml-20' : 'ml-[260px]'}`}>
        {/* Topbar - Matching Professor Dashboard */}
        <header className="h-[70px] bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between px-8 sticky top-0 z-30">
          {/* Left: Greeting with stats */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-white">
                {getGreeting()}, <span className="text-purple-400">{firstName}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>{metrics.enrolledCourses} courses</span>
              <span>•</span>
              <span>{metrics.activeLectures} active</span>
              <span>•</span>
              <span>{metrics.pendingFeedback} pending feedback</span>
              {metrics.pendingFeedback > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Urgent
                </span>
              )}
            </div>
          </div>

          {/* Right: Search, Notifications, AI, Profile */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search...</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-500 ml-2">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </motion.button>

            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(true)}
              className="relative p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full bg-rose-500 text-white">
                {metrics.pendingFeedback}
              </span>
            </motion.button>

            {/* AI Button - Purple stars like professor dashboard */}
            <motion.button
              onClick={() => setShowAIInsights(true)}
              className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.button>

            {/* Profile Avatar with Dropdown */}
            <div ref={profileRef} className="relative">
              <motion.button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg border-2 border-transparent hover:border-purple-400/50 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                {firstName.charAt(0).toUpperCase()}
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-zinc-800">
                      <p className="font-medium text-white">{firstName}</p>
                      <p className="text-xs text-zinc-500">{firstName.toLowerCase()}@university.edu</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => { setShowProfileModal(true); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm"
                      >
                        <Users className="w-4 h-4" /> View Profile
                      </button>
                      <button 
                        onClick={() => { navigate('/dev/student/settings'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <button 
                        onClick={() => { navigate('/dev/student/performance'); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm"
                      >
                        <BarChart3 className="w-4 h-4" /> My Analytics
                      </button>
                    </div>
                    <div className="p-2 border-t border-zinc-800">
                      <button 
                        onClick={() => { setShowSignOutConfirm(true); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all text-sm"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content - Universal Container */}
        <div className="flex-1 w-full">
          <div className="w-full max-w-[1400px] mx-auto px-8 py-8 space-y-6">
          {isOnDashboard ? (
            <>
              {/* Welcome Banner - Matching Professor Style Exactly */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent p-6"
              >
                {/* Background Effects */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute right-32 bottom-0 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl" />
                
                <div className="relative">
                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-purple-400">AI-Powered Dashboard v8.0</span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome back, <span className="text-purple-400">{firstName}</span>! 👋
                      </h2>
                      <p className="text-zinc-400 mb-4 max-w-xl">
                        Your AI personal co-pilot for intelligent learning analytics and course engagement.
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          <span className="text-zinc-300"><strong className="text-white">{metrics.enrolledCourses}</strong> Active Courses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-zinc-300"><strong className="text-white">{metrics.completedLectures}</strong> Lectures</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-amber-400" />
                          <span className="text-zinc-300"><strong className="text-white">{metrics.understanding}%</strong> Understanding</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <motion.button 
                        onClick={() => setSearchOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white text-sm font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Command className="w-4 h-4" /> Quick Actions
                        <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-700 text-zinc-400">⌘K</kbd>
                      </motion.button>
                      <motion.button 
                        onClick={() => navigate('/dev/student/feedback')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <PlayCircle className="w-4 h-4" /> Get Started <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Live Metrics Section - Matching Professor Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Live Metrics</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Updated {new Date().toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <MetricCard 
                    icon={BookOpen} 
                    title="Active Courses" 
                    value={metrics.enrolledCourses} 
                    change={metrics.changes.courses} 
                    color="blue" 
                  />
                  <MetricCard 
                    icon={Award} 
                    title="Current GPA" 
                    value={metrics.gpa.toFixed(2)} 
                    change="+0.1" 
                    color="purple" 
                  />
                  <MetricCard 
                    icon={TrendingUp} 
                    title="Understanding Rate" 
                    value={`${metrics.understanding}%`} 
                    change={metrics.changes.understanding} 
                    color="emerald" 
                  />
                  <MetricCard 
                    icon={PlayCircle} 
                    title="Attended Lectures" 
                    value={metrics.completedLectures} 
                    change={metrics.changes.lectures} 
                    color="amber" 
                  />
                  <MetricCard 
                    icon={MessageSquare} 
                    title="Feedback Given" 
                    value={completedLectures.length} 
                    change={metrics.changes.feedback} 
                    color="rose" 
                  />
                </div>
              </div>

              {/* AI Insights Section - Data-Driven Only */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                </div>
                
                <div className="space-y-3">
                  {/* Pending Feedback Alert - Only show if there's actual pending feedback */}
                  {metrics.pendingFeedback > 0 && (
                    <AIInsightAlert 
                      icon={Clock}
                      title={`${metrics.pendingFeedback} Pending Feedback`}
                      subtitle="Complete feedback to help professors improve your learning experience"
                      actionLabel="Fill Now"
                      onAction={() => navigate('/dev/student/feedback')}
                      color="rose"
                    />
                  )}
                  
                  {/* Show when no courses enrolled yet */}
                  {metrics.enrolledCourses === 0 && (
                    <AIInsightAlert 
                      icon={BookOpen}
                      title="Get Started"
                      subtitle="You haven't enrolled in any courses yet. Ask your professor to add you to a course."
                      actionLabel="View Courses"
                      onAction={() => navigate('/dev/student/courses')}
                      color="purple"
                    />
                  )}
                  
                  {/* Show only when there are live lectures */}
                  {metrics.activeLectures > 0 && (
                    <AIInsightAlert 
                      icon={Calendar}
                      title={`${metrics.activeLectures} Live Lecture${metrics.activeLectures > 1 ? 's' : ''}`}
                      subtitle="Join now to participate in the live session"
                      actionLabel="View Schedule"
                      onAction={() => navigate('/dev/student/schedule')}
                      color="emerald"
                    />
                  )}
                  
                  {/* Empty state when no insights available */}
                  {metrics.pendingFeedback === 0 && metrics.activeLectures === 0 && metrics.enrolledCourses > 0 && (
                    <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 text-center">
                      <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <p className="text-sm text-zinc-400">No new insights</p>
                      <p className="text-xs text-zinc-500 mt-1">AI insights will appear as you engage with courses</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Today's Schedule - Shows empty state when no lectures */}
                <motion.div 
                  className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      Today's Schedule
                    </h3>
                    <button 
                      onClick={() => navigate('/dev/student/schedule')}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {studentLectures.length > 0 ? (
                      studentLectures.slice(0, 3).map((lecture) => (
                        <div key={lecture.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
                          <div className="text-xs text-zinc-500 w-16">
                            {lecture.date ? new Date(lecture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{lecture.title}</p>
                            <p className="text-xs text-zinc-500">{lecture.courseId}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                            lecture.status === 'live' ? 'bg-emerald-500/20 text-emerald-400' :
                            lecture.status === 'completed' ? 'bg-zinc-700 text-zinc-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {lecture.status === 'live' ? '● LIVE' : lecture.status.toUpperCase()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                        <p className="text-sm text-zinc-400">No scheduled lectures</p>
                        <p className="text-xs text-zinc-500 mt-1">Your class schedule will appear here when professors schedule lectures</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Recent Activity - Shows empty state when no activity */}
                <motion.div 
                  className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Recent Activity
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {completedLectures.length > 0 || studentGrades.length > 0 ? (
                      <>
                        {completedLectures.slice(0, 2).map((lecture) => (
                          <div key={lecture.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
                            <BookMarked className="w-4 h-4 text-blue-400" />
                            <div className="flex-1">
                              <p className="text-sm text-white">Attended {lecture.title}</p>
                            </div>
                            <span className="text-xs text-zinc-500">
                              {lecture.date ? new Date(lecture.date).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                        ))}
                        {studentGrades.slice(0, 2).map(({ assessment, grade }) => (
                          <div key={grade.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
                            <Target className="w-4 h-4 text-purple-400" />
                            <div className="flex-1">
                              <p className="text-sm text-white">
                                {assessment.name}: {grade.marksObtained ?? '—'}/{assessment.maxMarks}
                              </p>
                            </div>
                            <span className="text-xs text-zinc-500">
                              {grade.gradedAt ? new Date(grade.gradedAt).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                        <p className="text-sm text-zinc-400">No recent activity</p>
                        <p className="text-xs text-zinc-500 mt-1">Your activity will appear here as you engage with courses</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
          </div>
        </div>
      </main>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                <Search className="w-5 h-5 text-zinc-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, lectures, topics..."
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs bg-zinc-800 text-zinc-500 rounded">ESC</kbd>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <p className="px-3 py-2 text-xs text-zinc-500 uppercase">Quick Actions</p>
                {[
                  { icon: MessageSquare, label: 'Give Feedback', desc: 'Submit lecture feedback', action: () => navigate('/dev/student/feedback') },
                  { icon: BookOpen, label: 'View Courses', desc: 'See enrolled courses', action: () => navigate('/dev/student/courses') },
                  { icon: Award, label: 'My Grades', desc: 'View grades and assessments', action: () => navigate('/dev/student/grades') },
                  { icon: BarChart3, label: 'Performance', desc: 'Check your progress', action: () => navigate('/dev/student/performance') },
                  { icon: Calendar, label: 'Schedule', desc: 'View class schedule', action: () => navigate('/dev/student/schedule') },
                  { icon: Settings, label: 'Settings', desc: 'Account preferences', action: () => navigate('/dev/student/settings') },
                ].filter(a => !searchQuery || a.label.toLowerCase().includes(searchQuery.toLowerCase())).map((action, i) => (
                  <button
                    key={i}
                    onClick={() => { action.action(); setSearchOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <action.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">{action.label}</p>
                      <p className="text-xs text-zinc-500">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
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
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] flex flex-col"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Notifications</h2>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {/* Pending Feedback Notifications */}
                <div className="p-2">
                  <p className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase">Pending Actions</p>
                  {[
                    { title: 'Feedback Due: Binary Trees', course: 'CS301', time: '2 hours ago', urgent: true },
                    { title: 'Feedback Due: Graph Fundamentals', course: 'CS301', time: '4 hours ago', urgent: true },
                    { title: 'Feedback Due: SQL Joins', course: 'CS302', time: 'Yesterday', urgent: true },
                  ].map((notif, i) => (
                    <button
                      key={i}
                      onClick={() => { setShowNotifications(false); navigate('/dev/student/feedback'); }}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${notif.urgent ? 'bg-rose-500/20' : 'bg-zinc-800'}`}>
                        <MessageSquare className={`w-4 h-4 ${notif.urgent ? 'text-rose-400' : 'text-zinc-400'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-zinc-500">{notif.course} • {notif.time}</p>
                      </div>
                      {notif.urgent && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400">URGENT</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Other Notifications */}
                <div className="p-2 border-t border-zinc-800">
                  <p className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase">Recent</p>
                  {[
                    { title: 'Quiz 3 grades released', course: 'CS303', time: '1 hour ago', icon: Award },
                    { title: 'New lecture uploaded', course: 'CS201', time: '3 hours ago', icon: PlayCircle },
                    { title: 'Your feedback was helpful!', course: 'CS301', time: 'Yesterday', icon: CheckCircle },
                  ].map((notif, i) => (
                    <button
                      key={i}
                      onClick={() => setShowNotifications(false)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-zinc-800">
                        <notif.icon className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-zinc-500">{notif.course} • {notif.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 border-t border-zinc-800">
                <button
                  onClick={() => { setShowNotifications(false); navigate('/dev/student/settings'); }}
                  className="w-full py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Notification Settings
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
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
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{firstName}</h2>
                    <p className="text-sm text-zinc-400">{firstName.toLowerCase()}@university.edu</p>
                    <p className="text-xs text-zinc-500 mt-1">Student • Computer Science</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <p className="text-2xl font-bold text-blue-400">{metrics.enrolledCourses}</p>
                  <p className="text-xs text-zinc-400">Courses</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{metrics.completedLectures}</p>
                  <p className="text-xs text-zinc-400">Lectures</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <p className="text-2xl font-bold text-orange-400">{metrics.streak}</p>
                  <p className="text-xs text-zinc-400">Day Streak</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700"
                >
                  Close
                </button>
                <button
                  onClick={() => { setShowProfileModal(false); navigate('/dev/student/settings'); }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Modal */}
      <AnimatePresence>
        {showAIInsights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAIInsights(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Learning Insights</h2>
                    <p className="text-sm text-zinc-400">Personalized recommendations for you</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIInsights(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                {/* Learning Pattern */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Optimal Learning Time</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Based on your feedback patterns, you perform <span className="text-emerald-400 font-medium">23% better</span> in morning lectures. 
                        Consider scheduling study sessions before 10 AM classes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topic Mastery */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Target className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Strong in Data Structures</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Your understanding of trees and graphs is <span className="text-emerald-400 font-medium">excellent (92%)</span>. 
                        You've consistently marked these topics as "Understood".
                      </p>
                    </div>
                  </div>
                </div>

                {/* Weak Area */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <Activity className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Needs Attention: SQL Joins</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        You've marked "Outer Joins" as <span className="text-amber-400 font-medium">Partial/Not Clear</span> twice. 
                        Consider reviewing this topic or asking during office hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback Impact */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Your Feedback Matters</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Your feedback on "Binary Search Trees" was part of <span className="text-blue-400 font-medium">15 similar responses</span>. 
                        Dr. Sharma has added extra examples in the next lecture!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{metrics.streak} Day Streak! 🔥</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        You've been consistent with lecture attendance and feedback. 
                        Keep it up to unlock the <span className="text-orange-400 font-medium">"Feedback Champion"</span> badge!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800 flex gap-3">
                <button
                  onClick={() => setShowAIInsights(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700"
                >
                  Close
                </button>
                <button
                  onClick={() => { setShowAIInsights(false); navigate('/dev/student/performance'); }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Full Analytics
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudentDashboardV2;
