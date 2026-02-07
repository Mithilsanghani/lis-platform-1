import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/useStore';
import { useLISStore } from '../store/useLISStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, BarChart3, LogOut,
  ChevronLeft, ChevronRight, Presentation, MessageSquare, Zap,
  Search, TrendingUp, TrendingDown, Sparkles, X, Plus,
  Clock, Calendar, Activity, UserX, Send, CheckCircle, ArrowRight,
  QrCode, Download, AlertTriangle, Settings,
  Mail, UserPlus, Bell, Command, Rocket, Target, PlayCircle, Award,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TopbarV8 } from '../components/v8/TopbarV8';
import { CoursesPageV13 } from '../components/v13';
import { LecturesPageV10 } from '../components/v10/LecturesPageV10';
import { StudentsPageV12, FeedbackPageV11, AnalyticsPageV11, AIInsightsPageV11 } from '../components/v11';
import ProfessorGrades from './professor/ProfessorGrades';

// Types
interface MetricTrend { day: string; value: number; }
interface SilentStudent { id: string; name: string; lastActive: string; risk: 'high' | 'medium' | 'low'; }

// Color map for metrics
const colorMap: Record<string, { bg: string; border: string; icon: string; chart: string }> = {
  blue: { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', icon: 'text-blue-400 bg-blue-500/15', chart: '#3b82f6' },
  emerald: { bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', icon: 'text-emerald-400 bg-emerald-500/15', chart: '#10b981' },
  amber: { bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', icon: 'text-amber-400 bg-amber-500/15', chart: '#f59e0b' },
  purple: { bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20', icon: 'text-purple-400 bg-purple-500/15', chart: '#a855f7' },
};

// MetricCard Component
function MetricCard({ icon: Icon, title, value, change, trend, color }: { 
  icon: React.ElementType; title: string; value: string | number; change: string; trend: MetricTrend[]; color: string;
}) {
  const colors = colorMap[color] || colorMap.blue;
  const isPositive = change.startsWith('+');
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div className={`relative p-5 rounded-2xl border backdrop-blur-xl bg-gradient-to-br ${colors.bg} ${colors.border} overflow-hidden`} whileHover={{ scale: 1.02, y: -2 }}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.icon}`}><Icon className="w-5 h-5" /></div>
      </div>
      <div className="mb-3">
        <h3 className="text-sm text-zinc-400 mb-1">{title}</h3>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            <TrendIcon className="w-4 h-4" />{change}
          </span>
        </div>
      </div>
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.chart} stopOpacity={0.4} />
                <stop offset="100%" stopColor={colors.chart} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={colors.chart} strokeWidth={2} fill={`url(#grad-${color})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// SilentBanner Component
function SilentBanner({ count, students }: { count: number; students: SilentStudent[] }) {
  const [expanded, setExpanded] = useState(false);
  const [nudged, setNudged] = useState<Set<string>>(new Set());
  const riskColors = { high: 'bg-rose-500/20 text-rose-400', medium: 'bg-amber-500/20 text-amber-400', low: 'bg-zinc-500/20 text-zinc-400' };

  return (
    <motion.div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400"><UserX className="w-5 h-5" /></div>
          <div>
            <h3 className="font-semibold text-white">{count} Silent Students Detected</h3>
            <p className="text-sm text-zinc-400">No participation in last 7 days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setNudged(new Set(students.map(s => s.id))); }} whileHover={{ scale: 1.02 }}>
            <Send className="w-4 h-4" />Nudge All
          </motion.button>
          <ChevronRight className={`w-5 h-5 text-zinc-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-zinc-800">
            <div className="p-4 space-y-2">
              {students.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium text-white">{s.name.charAt(0)}</div>
                    <div><p className="text-sm font-medium text-white">{s.name}</p><p className="text-xs text-zinc-500">Last active: {s.lastActive}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${riskColors[s.risk]}`}>{s.risk}</span>
                    {nudged.has(s.id) ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="w-4 h-4" />Sent</span> : <button onClick={() => setNudged(p => new Set([...p, s.id]))} className="p-1.5 rounded-lg hover:bg-zinc-800"><Send className="w-4 h-4 text-zinc-400" /></button>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main Dashboard
export default function ProfessorDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionIndex, setSelectedActionIndex] = useState(0);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Command Palette Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Settings State - Comprehensive & Functional
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    dailyDigest: true,
    silentAlerts: true,
    weeklyReport: false,
    feedbackAlerts: true,
    // AI Preferences
    autoAiInsights: true,
    aiNudgeSuggestions: true,
    aiResponseSuggestions: true,
    // Lecture Defaults
    defaultLectureDuration: '60',
    autoGenerateQR: true,
    qrExpiryMinutes: '45',
    // Feedback Settings
    anonymousFeedback: true,
    requireRating: true,
    feedbackReminder: true,
    // Privacy & Data
    shareAnalytics: false,
    dataRetentionMonths: '12',
  });
  
  const toggleSetting = (key: keyof typeof settings) => {
    const value = settings[key];
    if (typeof value === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };
  
  const updateSetting = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Settings Tab State
  const [settingsTab, setSettingsTab] = useState<'notifications' | 'ai' | 'lectures' | 'feedback' | 'privacy'>('notifications');

  // Quick Actions Configuration
  const quickActions = [
    { id: 'create-course', icon: Plus, label: 'Create New Course', desc: 'Set up a new course for this semester', shortcut: 'C', color: 'from-purple-500 to-pink-500', category: 'courses' },
    { id: 'start-lecture', icon: Presentation, label: 'Start Live Lecture', desc: 'Begin a new lecture session with QR', shortcut: 'L', color: 'from-blue-500 to-cyan-500', category: 'lectures' },
    { id: 'view-students', icon: Users, label: 'View All Students', desc: 'See student roster and health scores', shortcut: 'S', color: 'from-emerald-500 to-green-500', category: 'students' },
    { id: 'view-analytics', icon: BarChart3, label: 'View Analytics', desc: 'Course performance & insights', shortcut: 'A', color: 'from-amber-500 to-orange-500', category: 'analytics' },
    { id: 'ai-insights', icon: Sparkles, label: 'AI Insights', desc: 'Get AI-powered recommendations', shortcut: 'I', color: 'from-violet-500 to-purple-500', category: 'ai' },
    { id: 'nudge-silent', icon: Send, label: 'Nudge Silent Students', desc: 'Send reminders to inactive students', shortcut: 'N', color: 'from-rose-500 to-red-500', category: 'students' },
    { id: 'generate-qr', icon: QrCode, label: 'Generate QR Code', desc: 'Create attendance QR for lecture', shortcut: 'Q', color: 'from-indigo-500 to-blue-500', category: 'lectures' },
    { id: 'bulk-enroll', icon: UserPlus, label: 'Bulk Enroll Students', desc: 'Upload CSV to enroll students', shortcut: 'E', color: 'from-teal-500 to-cyan-500', category: 'students' },
    { id: 'export-report', icon: Download, label: 'Export Report', desc: 'Download course/student data', shortcut: 'R', color: 'from-slate-500 to-zinc-500', category: 'analytics' },
    { id: 'view-feedback', icon: MessageSquare, label: 'View Feedback', desc: 'Check recent student feedback', shortcut: 'F', color: 'from-sky-500 to-blue-500', category: 'feedback' },
    { id: 'email-students', icon: Mail, label: 'Email Students', desc: 'Send announcement to class', shortcut: 'M', color: 'from-pink-500 to-rose-500', category: 'students' },
    { id: 'schedule-lecture', icon: Calendar, label: 'Schedule Lecture', desc: 'Plan upcoming lecture sessions', shortcut: 'D', color: 'from-orange-500 to-amber-500', category: 'lectures' },
    { id: 'view-silent', icon: AlertTriangle, label: 'View Silent Alerts', desc: 'Students needing attention', shortcut: 'V', color: 'from-red-500 to-rose-500', category: 'alerts' },
    { id: 'settings', icon: Settings, label: 'Settings', desc: 'Configure preferences', shortcut: ',', color: 'from-zinc-500 to-slate-500', category: 'system' },
  ];

  // Filter actions based on search
  const filteredActions = quickActions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle action execution
  const executeAction = (actionId: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    
    switch (actionId) {
      case 'create-course':
        setActiveModal('create-course');
        break;
      case 'start-lecture':
        setActiveModal('start-lecture');
        break;
      case 'view-students':
        setTab('students');
        break;
      case 'view-analytics':
        setTab('analytics');
        break;
      case 'ai-insights':
        setTab('ai-insights');
        break;
      case 'nudge-silent':
        setActiveModal('nudge-silent');
        break;
      case 'generate-qr':
        setActiveModal('generate-qr');
        break;
      case 'bulk-enroll':
        setActiveModal('bulk-enroll');
        break;
      case 'export-report':
        setActiveModal('export-report');
        break;
      case 'view-feedback':
        setTab('feedback');
        break;
      case 'email-students':
        setActiveModal('email-students');
        break;
      case 'schedule-lecture':
        setActiveModal('schedule-lecture');
        break;
      case 'view-silent':
        setActiveModal('view-silent');
        break;
      case 'settings':
        setActiveModal('settings');
        break;
      default:
        console.log('Action:', actionId);
    }
  };

  // Show feedback toast
  const showFeedback = (type: 'success' | 'info', message: string) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      
      if (!searchOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedActionIndex(i => Math.min(i + 1, filteredActions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedActionIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredActions[selectedActionIndex]) {
            executeAction(filteredActions[selectedActionIndex].id);
          }
          break;
        case 'Escape':
          setSearchOpen(false);
          setSearchQuery('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, filteredActions, selectedActionIndex]);

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      setSelectedActionIndex(0);
    }
  }, [searchOpen]);

  // Get data from stores - NO HARDCODED DATA
  const professorId = user?.id || 'current-professor';
  const {
    getProfessorCourses: getLISCourses,
    getSilentStudents,
    getCourseEngagement,
    getCourseStudents,
    lectures: lisLectures,
    feedback: lisFeedback,
    seedDemoData,
  } = useLISStore();
  
  // Seed demo data on first load if no courses exist
  useEffect(() => {
    if (professorId) {
      seedDemoData(professorId);
    }
  }, [professorId, seedDemoData]);
  
  // Computed metrics from real data
  const professorCourses = getLISCourses(professorId);
  const professorCourseIds = professorCourses.map(c => c.id);
  const professorLectures = lisLectures.filter(l => professorCourseIds.includes(l.courseId));
  const silentStudents = getSilentStudents(professorId);
  const activeFeedback = lisFeedback.filter(f => professorCourseIds.includes(f.courseId));
  
  // Get all enrolled students from LIS store
  const enrolledStudents = professorCourses.flatMap(c => getCourseStudents(c.id));
  
  // Use professorCourses for metrics (consistent type)
  const allCourses = professorCourses;
  
  // Calculate engagement from actual data
  const courseEngagement = allCourses.length > 0 
    ? Math.round(allCourses.reduce((acc, c) => acc + getCourseEngagement(c.id), 0) / allCourses.length)
    : 0;
  
  const todaysLectures = professorLectures.filter((l) => {
    const today = new Date().toDateString();
    return l.date && new Date(l.date).toDateString() === today;
  });

  // Generate empty trend data (no fake data)
  const emptyTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, value: 0 }));
  
  const metrics = {
    courses: allCourses.length,
    engagement: courseEngagement,
    lectures: todaysLectures.length,
    students: enrolledStudents.length,
    silent: silentStudents.length,
    trends: { 
      courses: emptyTrend, 
      engagement: emptyTrend, 
      lectures: emptyTrend, 
      students: emptyTrend 
    },
    changes: { 
      courses: allCourses.length > 0 ? `${allCourses.length}` : '0',
      engagement: courseEngagement > 0 ? `${courseEngagement}%` : '—',
      lectures: todaysLectures.length > 0 ? `${todaysLectures.length}` : '0',
      students: enrolledStudents.length > 0 ? `${enrolledStudents.length}` : '0'
    },
    silentStudents: silentStudents.map(s => ({
      id: s.id,
      name: s.name,
      lastActive: 'Recently',
      risk: 'medium' as const,
    })),
    feedbackCount: activeFeedback.length,
  };

  const handleLogout = async () => { localStorage.removeItem('demo_role'); await signOut(); navigate('/login'); };
  const profName = user?.email?.split('@')[0] ? `Dr. ${user.email.split('@')[0].charAt(0).toUpperCase()}${user.email.split('@')[0].slice(1)}` : 'Professor';

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'courses', icon: BookOpen, label: 'Courses', badge: allCourses.length > 0 ? allCourses.length : undefined },
    { id: 'lectures', icon: Presentation, label: 'Lectures', badge: todaysLectures.length > 0 ? todaysLectures.length : undefined },
    { id: 'students', icon: Users, label: 'Students', badge: metrics.silent > 0 ? metrics.silent : undefined },
    { id: 'grades', icon: Award, label: 'Grades' },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback', badge: metrics.feedbackCount > 0 ? metrics.feedbackCount : undefined },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'ai', icon: Zap, label: 'AI Insights', isNew: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <motion.nav className="fixed left-0 top-0 h-screen z-40 bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col" animate={{ width: collapsed ? 72 : 260 }}>
        <div className="h-16 flex items-center justify-center px-4 border-b border-zinc-800/50">
          {!collapsed ? <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">L</div><span className="font-semibold text-white">LIS Platform</span></div> : <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">L</div>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center z-50">
          {collapsed ? <ChevronRight className="w-4 h-4 text-zinc-400" /> : <ChevronLeft className="w-4 h-4 text-zinc-400" />}
        </button>
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <motion.button key={item.id} onClick={() => setTab(item.id)} className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${tab === item.id ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white border border-blue-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'} ${collapsed ? 'justify-center' : ''}`} whileHover={{ x: collapsed ? 0 : 4 }}>
              <div className="relative">
                <item.icon className={`w-5 h-5 ${tab === item.id ? 'text-blue-400' : ''}`} />
                {item.badge && <span className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full ${item.id === 'students' ? 'bg-rose-500' : 'bg-blue-500'} text-white`}>{item.badge > 99 ? '99+' : item.badge}</span>}
                {item.isNew && !item.badge && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />}
              </div>
              {!collapsed && <span className="text-sm font-medium flex-1 text-left">{item.label}</span>}
              {!collapsed && item.isNew && <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400">NEW</span>}
            </motion.button>
          ))}
        </div>
        <div className="py-4 border-t border-zinc-800/50 px-3">
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 ${collapsed ? 'justify-center' : ''}`}>
            <LogOut className="w-5 h-5" />{!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.nav>

      {/* Main */}
      <main className={`transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        {/* V8 AI Topbar */}
        <TopbarV8
          professorName={profName}
          professorEmail={user?.email}
          userId={user?.id}
          onLogout={handleLogout}
          onSearch={() => setSearchOpen(true)}
          onViewProfile={() => setActiveModal('view-profile')}
          onSettings={() => setActiveModal('settings')}
          onMyAnalytics={() => setTab('analytics')}
          onQuickActions={() => setSearchOpen(true)}
          sidebarCollapsed={collapsed}
        />

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Conditionally render based on active tab */}
          {tab === 'courses' ? (
            <CoursesPageV13
              professorId={user?.id}
            />
          ) : tab === 'lectures' ? (
            <LecturesPageV10
              professorId={user?.id}
              onCreateLecture={() => console.log('Create lecture')}
              onViewFeedback={(id) => console.log('View feedback:', id)}
              onEditLecture={(id) => console.log('Edit lecture:', id)}
              onDeleteLecture={(id) => console.log('Delete lecture:', id)}
              onQRCode={(id) => console.log('QR Code:', id)}
            />
          ) : tab === 'dashboard' ? (
            <>
              {/* Welcome Banner - Enhanced */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-transparent p-6"
              >
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute right-20 bottom-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Rocket className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-blue-400">AI-Powered Dashboard v8.0</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome back, <span className="text-blue-400">{profName.split(' ')[1]}</span>! 👋
                    </h2>
                    <p className="text-zinc-400 mb-4">Your AI personal co-pilot for intelligent lecture analytics and student engagement.</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span className="text-zinc-300"><span className="font-semibold text-white">{metrics.courses}</span> Active Courses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-zinc-300"><span className="font-semibold text-white">{metrics.students}</span> Students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span className="text-zinc-300"><span className="font-semibold text-white">{metrics.engagement > 0 ? `${metrics.engagement}%` : '—'}</span> Engagement</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button 
                      onClick={() => setSearchOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-300 font-medium flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Command className="w-4 h-4" />
                      Quick Actions
                      <kbd className="ml-1 px-1.5 py-0.5 rounded bg-zinc-700 text-[10px] text-zinc-400">⌘K</kbd>
                    </motion.button>
                    <motion.button 
                      onClick={() => setShowGetStarted(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25"
                      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PlayCircle className="w-4 h-4" />
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Metrics */}
              <section>
                <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" />Live Metrics</h3><div className="flex items-center gap-2 text-xs text-zinc-500"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Updated {new Date().toLocaleTimeString()}</div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <MetricCard icon={BookOpen} title="Active Courses" value={metrics.courses} change={metrics.changes.courses} trend={metrics.trends.courses} color="blue" />
                  <MetricCard icon={TrendingUp} title="Engagement Rate" value={`${metrics.engagement}%`} change={metrics.changes.engagement} trend={metrics.trends.engagement} color="emerald" />
                  <MetricCard icon={Presentation} title="Today's Lectures" value={metrics.lectures} change={metrics.changes.lectures} trend={metrics.trends.lectures} color="amber" />
                  <MetricCard icon={Users} title="Student Feedback" value={metrics.students} change={metrics.changes.students} trend={metrics.trends.students} color="purple" />
                </div>
              </section>

              {/* AI Banner - Only show if there are silent students */}
              {metrics.silent > 0 ? (
                <section><h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-purple-400" />AI Insights</h3><SilentBanner count={metrics.silent} students={metrics.silentStudents} /></section>
              ) : (
                <section>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-purple-400" />AI Insights</h3>
                  <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-center">
                    <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400">No AI insights yet</p>
                    <p className="text-xs text-zinc-500 mt-1">Create courses and enroll students to get AI-powered insights</p>
                  </div>
                </section>
              )}

              {/* Quick + Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-cyan-400" />Quick Actions</h3>
                  <div className="space-y-2">{[{ icon: Plus, label: 'Create New Course', action: () => setTab('courses') }, { icon: Presentation, label: 'Start Live Lecture', action: () => setTab('lectures') }, { icon: Users, label: 'View All Students', action: () => setTab('students') }, { icon: TrendingUp, label: 'Generate Report', action: () => setTab('analytics') }].map((a) => (<motion.button key={a.label} onClick={a.action} className="w-full flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-left" whileHover={{ x: 4 }}><div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><a.icon className="w-5 h-5" /></div><span className="font-medium text-white">{a.label}</span></motion.button>))}</div>
                </section>
                <section className="lg:col-span-2"><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400" />Recent Activity</h3>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                    {(activeFeedback.length > 0 || professorLectures.length > 0) ? (
                      <>
                        {activeFeedback.slice(0, 2).map((fb: { id: string; courseId: string; timestamp: string }, i: number) => (
                          <motion.div key={fb.id} className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <div><p className="font-medium text-white">New feedback</p><p className="text-sm text-zinc-500">{fb.courseId}</p></div>
                            </div>
                            <span className="text-xs text-zinc-500">{new Date(fb.timestamp).toLocaleDateString()}</span>
                          </motion.div>
                        ))}
                        {professorLectures.slice(0, 2).map((lec: { id: string; status: string; title: string; date: string }, i: number) => (
                          <motion.div key={lec.id} className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i + 2) * 0.1 }}>
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <div><p className="font-medium text-white">{lec.status === 'completed' ? 'Lecture completed' : lec.status === 'live' ? 'Lecture live' : 'Lecture scheduled'}</p><p className="text-sm text-zinc-500">{lec.title}</p></div>
                            </div>
                            <span className="text-xs text-zinc-500">{lec.date ? new Date(lec.date).toLocaleDateString() : '—'}</span>
                          </motion.div>
                        ))}
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-400">No recent activity</p>
                        <p className="text-xs text-zinc-500 mt-1">Activity will appear as you create courses and lectures</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Upcoming Lectures - Empty state when no lectures */}
              <section><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-400" />Upcoming Lectures</h3>
                {professorLectures.filter(l => l.status === 'scheduled').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {professorLectures.filter(l => l.status === 'scheduled').slice(0, 4).map((l) => (
                      <motion.div key={l.id} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50" whileHover={{ y: -2, scale: 1.01 }}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><Presentation className="w-5 h-5" /></div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-500/20 text-zinc-400">scheduled</span>
                        </div>
                        <h4 className="font-semibold text-white mb-1">{l.courseId}</h4>
                        <p className="text-sm text-zinc-400 mb-3">{l.title}</p>
                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{l.date ? new Date(l.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{l.attendees?.length || 0}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-center">
                    <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400">No upcoming lectures</p>
                    <p className="text-xs text-zinc-500 mt-1">Schedule lectures from the Lectures tab</p>
                    <motion.button 
                      onClick={() => setTab('lectures')}
                      className="mt-4 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                    >
                      Go to Lectures
                    </motion.button>
                  </div>
                )}
              </section>
            </>
          ) : tab === 'students' ? (
            <StudentsPageV12
              professorId={user?.id}
            />
          ) : tab === 'grades' ? (
            <ProfessorGrades />
          ) : tab === 'feedback' ? (
            <FeedbackPageV11
              professorId={user?.id}
            />
          ) : tab === 'analytics' ? (
            <AnalyticsPageV11
              professorId={user?.id}
            />
          ) : tab === 'ai' ? (
            <AIInsightsPageV11
              professorId={user?.id}
            />
          ) : null}
        </div>
      </main>

      {/* Enhanced Command Palette / Quick Actions Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-md" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          >
            <motion.div 
              className="w-full max-w-2xl mx-4 bg-zinc-900/95 border border-zinc-700/50 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden backdrop-blur-xl" 
              initial={{ y: -30, scale: 0.95, opacity: 0 }} 
              animate={{ y: 0, scale: 1, opacity: 1 }} 
              exit={{ y: -30, scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Command className="w-4 h-4 text-purple-400" />
                </div>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSelectedActionIndex(0); }}
                  placeholder="Type a command or search..." 
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg" 
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 bg-zinc-800 rounded border border-zinc-700">
                  ESC
                </kbd>
                <motion.button 
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }} 
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </motion.button>
              </div>

              {/* Actions List */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {/* Category Header */}
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 py-2">
                  {searchQuery ? `Results for "${searchQuery}"` : 'Quick Actions'} 
                  <span className="ml-2 text-zinc-600">({filteredActions.length})</span>
                </p>

                {/* Actions */}
                <div className="space-y-1">
                  {filteredActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => executeAction(action.id)}
                      onMouseEnter={() => setSelectedActionIndex(index)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                        selectedActionIndex === index 
                          ? 'bg-purple-500/20 border border-purple-500/30' 
                          : 'hover:bg-zinc-800/50 border border-transparent'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white text-sm">{action.label}</p>
                        <p className="text-xs text-zinc-500">{action.desc}</p>
                      </div>

                      {/* Category Tag */}
                      <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 uppercase">
                        {action.category}
                      </span>

                      {/* Shortcut */}
                      <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-zinc-500 bg-zinc-800 rounded border border-zinc-700">
                        ⌘{action.shortcut}
                      </kbd>
                    </motion.button>
                  ))}
                </div>

                {/* Empty State */}
                {filteredActions.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 font-medium">No actions found</p>
                    <p className="text-zinc-600 text-sm mt-1">Try a different search term</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">ESC</kbd> Close
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>LIS Command Palette</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Feedback Toast */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${
              actionFeedback.type === 'success' 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
            }`}
          >
            {actionFeedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
            <span className="font-medium">{actionFeedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Get Started Modal */}
      <AnimatePresence>
        {showGetStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGetStarted(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-zinc-800 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent">
                <div className="absolute right-0 top-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
                <button
                  onClick={() => setShowGetStarted(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Get Started with LIS</h2>
                      <p className="text-sm text-zinc-400">Complete these steps to set up your dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedSteps.size / 4) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm text-zinc-400">{completedSteps.size}/4 completed</span>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
                {[
                  { 
                    id: 'create-course', 
                    icon: BookOpen, 
                    title: 'Create Your First Course', 
                    desc: 'Set up a course with name, code, and schedule',
                    action: () => { setShowGetStarted(false); setTab('courses'); showFeedback('info', 'Click "Create Course" to add a new course'); },
                    color: 'from-blue-500 to-cyan-500'
                  },
                  { 
                    id: 'enroll-students', 
                    icon: UserPlus, 
                    title: 'Enroll Students', 
                    desc: 'Add students via CSV upload or manual entry',
                    action: () => { setShowGetStarted(false); setTab('courses'); showFeedback('info', 'Select a course and click "Manage Students"'); },
                    color: 'from-emerald-500 to-green-500'
                  },
                  { 
                    id: 'start-lecture', 
                    icon: Presentation, 
                    title: 'Start a Live Lecture', 
                    desc: 'Begin a lecture session with QR attendance',
                    action: () => { setShowGetStarted(false); setTab('lectures'); showFeedback('info', 'Click "New Lecture" to start a live session'); },
                    color: 'from-purple-500 to-pink-500'
                  },
                  { 
                    id: 'view-analytics', 
                    icon: BarChart3, 
                    title: 'View Analytics', 
                    desc: 'Track engagement and student performance',
                    action: () => { setShowGetStarted(false); setTab('analytics'); },
                    color: 'from-amber-500 to-orange-500'
                  },
                ].map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      completedSteps.has(step.id) 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600'
                    }`}
                    onClick={step.action}
                  >
                    {/* Step Number */}
                    <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${
                      completedSteps.has(step.id) 
                        ? 'bg-emerald-500/20' 
                        : `bg-gradient-to-br ${step.color}`
                    } shadow-lg`}>
                      {completedSteps.has(step.id) ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <step.icon className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className={`font-semibold ${completedSteps.has(step.id) ? 'text-emerald-400' : 'text-white'}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-zinc-400">{step.desc}</p>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-2">
                      {completedSteps.has(step.id) ? (
                        <span className="text-sm text-emerald-400 font-medium">Completed</span>
                      ) : (
                        <>
                          <motion.button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setCompletedSteps(prev => new Set([...prev, step.id]));
                              showFeedback('success', `"${step.title}" marked as complete!`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-zinc-700/50 text-zinc-300 text-xs font-medium hover:bg-zinc-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Mark Done
                          </motion.button>
                          <motion.button
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400"
                            whileHover={{ scale: 1.05, x: 4 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Target className="w-4 h-4" />
                  <span>Complete all steps to unlock AI features</span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setShowGetStarted(false)}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Skip for now
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setCompletedSteps(new Set(['create-course', 'enroll-students', 'start-lecture', 'view-analytics']));
                      showFeedback('success', 'All steps completed! Welcome to LIS 🎉');
                      setTimeout(() => setShowGetStarted(false), 1500);
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Complete All
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      {/* COMMAND PALETTE MODALS - All Quick Actions                                      */}
      {/* ═══════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {/* Create Course Modal */}
        {activeModal === 'create-course' && (
          <CommandModal
            title="Create New Course"
            subtitle="Set up a new course for this semester"
            icon={<Plus className="w-5 h-5 text-white" />}
            iconBg="from-purple-500 to-pink-500"
            onClose={() => setActiveModal(null)}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Course Name</label>
                <input type="text" placeholder="e.g., Introduction to Computer Science" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Course Code</label>
                  <input type="text" placeholder="e.g., CS101" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Semester</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-purple-500">
                    <option>Spring 2026</option>
                    <option>Fall 2025</option>
                    <option>Summer 2025</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Schedule</label>
                <div className="flex gap-2 flex-wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                    <button key={day} className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-purple-500 hover:text-purple-400 transition-all">{day}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Cancel</motion.button>
                <motion.button onClick={() => { setActiveModal(null); setTab('courses'); showFeedback('success', 'Course created successfully!'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium" whileHover={{ scale: 1.02 }}>Create Course</motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Start Live Lecture Modal */}
        {activeModal === 'start-lecture' && (
          <CommandModal
            title="Start Live Lecture"
            subtitle="Begin a new lecture session with QR attendance"
            icon={<Presentation className="w-5 h-5 text-white" />}
            iconBg="from-blue-500 to-cyan-500"
            onClose={() => setActiveModal(null)}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Select Course</label>
                <select className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-blue-500">
                  <option>CS101 - Introduction to Programming</option>
                  <option>CS201 - Data Structures</option>
                  <option>CS301 - Algorithms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Lecture Title</label>
                <input type="text" placeholder="e.g., Introduction to Arrays" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <QrCode className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-blue-400">QR Code will be generated automatically</span>
                </div>
                <p className="text-xs text-zinc-500">Students can scan to mark attendance and submit feedback</p>
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Cancel</motion.button>
                <motion.button onClick={() => { setActiveModal(null); setTab('lectures'); showFeedback('success', 'Lecture started! QR code is ready.'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                  <PlayCircle className="w-4 h-4" />Start Lecture
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Nudge Silent Students Modal */}
        {activeModal === 'nudge-silent' && (
          <CommandModal
            title="Nudge Silent Students"
            subtitle="Send reminders to inactive students"
            icon={<Send className="w-5 h-5 text-white" />}
            iconBg="from-rose-500 to-red-500"
            onClose={() => setActiveModal(null)}
            size="lg"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-rose-400">18 Silent Students Detected</span>
                  <span className="text-xs text-zinc-500">No activity in 7+ days</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[18%] bg-gradient-to-r from-rose-500 to-red-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {['Rahul S.', 'Priya M.', 'Amit K.', 'Neha P.', 'Vikram R.'].map((name, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white text-sm font-bold">{name[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-white">{name}</p>
                        <p className="text-xs text-zinc-500">Last active: {7 + i} days ago</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400">High Risk</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nudge Message</label>
                <textarea rows={3} placeholder="Hi! We noticed you haven't submitted feedback recently..." className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 resize-none" defaultValue="Hi! We noticed you haven't been active recently. Your feedback helps improve the learning experience. Please take a moment to share your thoughts on recent lectures." />
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Cancel</motion.button>
                <motion.button onClick={() => { setActiveModal(null); showFeedback('success', 'Nudge sent to 18 students!'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-medium flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Send className="w-4 h-4" />Send Nudge to All
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Generate QR Code Modal */}
        {activeModal === 'generate-qr' && (
          <CommandModal
            title="Generate QR Code"
            subtitle="Create attendance QR for lecture"
            icon={<QrCode className="w-5 h-5 text-white" />}
            iconBg="from-indigo-500 to-blue-500"
            onClose={() => setActiveModal(null)}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Select Lecture</label>
                <select className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-indigo-500">
                  <option>CS101 - Arrays & Loops (Today)</option>
                  <option>CS201 - Binary Trees</option>
                  <option>CS301 - Dynamic Programming</option>
                </select>
              </div>
              <div className="flex justify-center p-6">
                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-white" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-zinc-400">Scan code expires in <span className="text-indigo-400 font-medium">45 minutes</span></p>
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button onClick={() => { showFeedback('success', 'QR Code copied to clipboard!'); }} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Download className="w-4 h-4" />Copy Link
                </motion.button>
                <motion.button onClick={() => { setActiveModal(null); showFeedback('success', 'QR Code downloaded!'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Download className="w-4 h-4" />Download QR
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Bulk Enroll Students Modal */}
        {activeModal === 'bulk-enroll' && (
          <CommandModal
            title="Bulk Enroll Students"
            subtitle="Upload CSV to enroll students"
            icon={<UserPlus className="w-5 h-5 text-white" />}
            iconBg="from-teal-500 to-cyan-500"
            onClose={() => setActiveModal(null)}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Select Course</label>
                <select className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-teal-500">
                  <option>CS101 - Introduction to Programming</option>
                  <option>CS201 - Data Structures</option>
                  <option>CS301 - Algorithms</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors cursor-pointer">
                <UserPlus className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">Drop CSV file here or click to upload</p>
                <p className="text-xs text-zinc-500">Supports .csv files with name, email, roll number columns</p>
              </div>
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <p className="text-sm text-teal-400 font-medium mb-2">CSV Format Required:</p>
                <code className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">name, email, roll_number</code>
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Cancel</motion.button>
                <motion.button onClick={() => { setActiveModal(null); showFeedback('success', '45 students enrolled successfully!'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium" whileHover={{ scale: 1.02 }}>Upload & Enroll</motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Export Report Modal */}
        {activeModal === 'export-report' && (
          <CommandModal
            title="Export Report"
            subtitle="Download course/student data"
            icon={<Download className="w-5 h-5 text-white" />}
            iconBg="from-slate-500 to-zinc-500"
            onClose={() => setActiveModal(null)}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Report Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'course', label: 'Course Summary', desc: 'Attendance, feedback stats' },
                    { id: 'student', label: 'Student Report', desc: 'Individual performance' },
                    { id: 'feedback', label: 'Feedback Analysis', desc: 'All feedback with AI insights' },
                    { id: 'analytics', label: 'Full Analytics', desc: 'Complete data export' },
                  ].map(type => (
                    <button key={type.id} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-500 text-left transition-all">
                      <p className="text-sm font-medium text-white">{type.label}</p>
                      <p className="text-xs text-zinc-500">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-500" />
                  <input type="date" className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-zinc-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Format</label>
                <div className="flex gap-3">
                  {['PDF', 'CSV', 'Excel'].map(fmt => (
                    <button key={fmt} className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-all">{fmt}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Cancel</motion.button>
                <motion.button onClick={() => { 
                  setActiveModal(null); 
                  showFeedback('success', 'Report exported successfully!');
                  const data = { exported: new Date().toISOString(), courses: 24, students: 245 };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'lis-report.json';
                  a.click();
                }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-500 to-zinc-500 text-white font-medium flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Download className="w-4 h-4" />Export Report
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Email Students Modal */}
        {activeModal === 'email-students' && (
          <CommandModal
            title="Email Students"
            subtitle="Send announcement to class"
            icon={<Mail className="w-5 h-5 text-white" />}
            iconBg="from-pink-500 to-rose-500"
            onClose={() => setActiveModal(null)}
            size="lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Recipients</label>
                <select className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-pink-500">
                  <option>All Students (245)</option>
                  <option>CS101 - Introduction to Programming (85)</option>
                  <option>CS201 - Data Structures (72)</option>
                  <option>Silent Students Only (18)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Subject</label>
                <input type="text" placeholder="Enter email subject..." className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                <textarea rows={5} placeholder="Write your announcement..." className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 resize-none" />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700" />
                  Send copy to myself
                </label>
                <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700" />
                  Schedule for later
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Cancel</motion.button>
                <motion.button onClick={() => { setActiveModal(null); showFeedback('success', 'Email sent to 245 students!'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Send className="w-4 h-4" />Send Email
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Schedule Lecture Modal */}
        {activeModal === 'schedule-lecture' && (
          <CommandModal
            title="Schedule Lecture"
            subtitle="Plan upcoming lecture sessions"
            icon={<Calendar className="w-5 h-5 text-white" />}
            iconBg="from-orange-500 to-amber-500"
            onClose={() => setActiveModal(null)}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Course</label>
                <select className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500">
                  <option>CS101 - Introduction to Programming</option>
                  <option>CS201 - Data Structures</option>
                  <option>CS301 - Algorithms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Lecture Title</label>
                <input type="text" placeholder="e.g., Introduction to Functions" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Time</label>
                  <input type="time" className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Duration</label>
                <select className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-orange-500">
                  <option>45 minutes</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Cancel</motion.button>
                <motion.button onClick={() => { setActiveModal(null); setTab('lectures'); showFeedback('success', 'Lecture scheduled successfully!'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
                  <Calendar className="w-4 h-4" />Schedule
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* View Silent Alerts Modal */}
        {activeModal === 'view-silent' && (
          <CommandModal
            title="Silent Alerts"
            subtitle="Students needing attention"
            icon={<AlertTriangle className="w-5 h-5 text-white" />}
            iconBg="from-red-500 to-rose-500"
            onClose={() => setActiveModal(null)}
            size="lg"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-2xl font-bold text-red-400">8</p>
                  <p className="text-xs text-zinc-500">High Risk</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-2xl font-bold text-amber-400">12</p>
                  <p className="text-xs text-zinc-500">Medium Risk</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-center">
                  <p className="text-2xl font-bold text-zinc-400">5</p>
                  <p className="text-xs text-zinc-500">Low Risk</p>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[
                  { name: 'Rahul Sharma', days: 14, risk: 'high', course: 'CS101' },
                  { name: 'Priya Mehta', days: 12, risk: 'high', course: 'CS201' },
                  { name: 'Amit Kumar', days: 10, risk: 'high', course: 'CS101' },
                  { name: 'Neha Patel', days: 8, risk: 'medium', course: 'CS301' },
                  { name: 'Vikram Rao', days: 7, risk: 'medium', course: 'CS201' },
                ].map((student, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${student.risk === 'high' ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>{student.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-white">{student.name}</p>
                        <p className="text-xs text-zinc-500">{student.course} • Last active: {student.days} days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.risk === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{student.risk}</span>
                      <button className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white"><Send className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <motion.button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" whileHover={{ scale: 1.02 }}>Close</motion.button>
                <motion.button onClick={() => { setActiveModal(null); setTab('students'); }} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium" whileHover={{ scale: 1.02 }}>View All Students</motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* Settings Modal - Comprehensive Tabbed Interface */}
        {activeModal === 'settings' && (
          <CommandModal
            title="Settings"
            subtitle="Configure your LIS preferences"
            icon={<Settings className="w-5 h-5 text-white" />}
            iconBg="from-zinc-500 to-slate-500"
            onClose={() => { setActiveModal(null); setSettingsTab('notifications'); }}
            size="lg"
          >
            <div className="space-y-4">
              {/* Settings Tabs */}
              <div className="flex gap-1 p-1 bg-zinc-800/50 rounded-xl">
                {[
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'ai', label: 'AI', icon: Sparkles },
                  { id: 'lectures', label: 'Lectures', icon: Presentation },
                  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                  { id: 'privacy', label: 'Privacy', icon: Activity },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSettingsTab(t.id as typeof settingsTab)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      settingsTab === t.id 
                        ? 'bg-zinc-700 text-white' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                    }`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[320px]">
                {/* Notifications Tab */}
                {settingsTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs text-zinc-500 mb-4">Control how and when you receive notifications about your courses and students.</p>
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Email Notifications</span>
                        <p className="text-xs text-zinc-500">Receive email alerts for important updates</p>
                      </div>
                      <button onClick={() => toggleSetting('emailNotifications')} className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Push Notifications</span>
                        <p className="text-xs text-zinc-500">Browser notifications for real-time alerts</p>
                      </div>
                      <button onClick={() => toggleSetting('pushNotifications')} className={`w-12 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Daily Activity Digest</span>
                        <p className="text-xs text-zinc-500">Summary of student activity sent each morning</p>
                      </div>
                      <button onClick={() => toggleSetting('dailyDigest')} className={`w-12 h-6 rounded-full transition-colors ${settings.dailyDigest ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.dailyDigest ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Silent Student Alerts</span>
                        <p className="text-xs text-zinc-500">Get notified when students become inactive</p>
                      </div>
                      <button onClick={() => toggleSetting('silentAlerts')} className={`w-12 h-6 rounded-full transition-colors ${settings.silentAlerts ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.silentAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">New Feedback Alerts</span>
                        <p className="text-xs text-zinc-500">Instant notification when students submit feedback</p>
                      </div>
                      <button onClick={() => toggleSetting('feedbackAlerts')} className={`w-12 h-6 rounded-full transition-colors ${settings.feedbackAlerts ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.feedbackAlerts ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Weekly Analytics Report</span>
                        <p className="text-xs text-zinc-500">Comprehensive weekly performance summary</p>
                      </div>
                      <button onClick={() => toggleSetting('weeklyReport')} className={`w-12 h-6 rounded-full transition-colors ${settings.weeklyReport ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.weeklyReport ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* AI Tab */}
                {settingsTab === 'ai' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs text-zinc-500 mb-4">Configure AI-powered features to enhance your teaching experience.</p>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Auto-generate AI Insights</span>
                        <p className="text-xs text-zinc-500">Automatically analyze feedback patterns and trends</p>
                      </div>
                      <button onClick={() => toggleSetting('autoAiInsights')} className={`w-12 h-6 rounded-full transition-colors ${settings.autoAiInsights ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.autoAiInsights ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">AI Nudge Suggestions</span>
                        <p className="text-xs text-zinc-500">Get smart suggestions for student outreach</p>
                      </div>
                      <button onClick={() => toggleSetting('aiNudgeSuggestions')} className={`w-12 h-6 rounded-full transition-colors ${settings.aiNudgeSuggestions ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.aiNudgeSuggestions ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">AI Response Suggestions</span>
                        <p className="text-xs text-zinc-500">Generate suggested replies to student feedback</p>
                      </div>
                      <button onClick={() => toggleSetting('aiResponseSuggestions')} className={`w-12 h-6 rounded-full transition-colors ${settings.aiResponseSuggestions ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.aiResponseSuggestions ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">AI Features Active</span>
                      </div>
                      <p className="text-xs text-zinc-400">AI analyzes feedback patterns, identifies at-risk students, and suggests personalized interventions to improve learning outcomes.</p>
                    </div>
                  </motion.div>
                )}

                {/* Lectures Tab */}
                {settingsTab === 'lectures' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs text-zinc-500 mb-4">Set default values for your lecture sessions.</p>

                    <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-white font-medium">Default Lecture Duration</span>
                      </div>
                      <select 
                        value={settings.defaultLectureDuration}
                        onChange={(e) => updateSetting('defaultLectureDuration', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Auto-generate QR Code</span>
                        <p className="text-xs text-zinc-500">Automatically create QR when starting a lecture</p>
                      </div>
                      <button onClick={() => toggleSetting('autoGenerateQR')} className={`w-12 h-6 rounded-full transition-colors ${settings.autoGenerateQR ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.autoGenerateQR ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm text-white font-medium">QR Code Expiry Time</span>
                          <p className="text-xs text-zinc-500">How long the attendance QR stays valid</p>
                        </div>
                      </div>
                      <select 
                        value={settings.qrExpiryMinutes}
                        onChange={(e) => updateSetting('qrExpiryMinutes', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="0">Never expires</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Feedback Tab */}
                {settingsTab === 'feedback' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs text-zinc-500 mb-4">Configure how students submit and you receive feedback.</p>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Allow Anonymous Feedback</span>
                        <p className="text-xs text-zinc-500">Students can submit feedback without identification</p>
                      </div>
                      <button onClick={() => toggleSetting('anonymousFeedback')} className={`w-12 h-6 rounded-full transition-colors ${settings.anonymousFeedback ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.anonymousFeedback ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Require Understanding Rating</span>
                        <p className="text-xs text-zinc-500">Students must rate their understanding (1-5)</p>
                      </div>
                      <button onClick={() => toggleSetting('requireRating')} className={`w-12 h-6 rounded-full transition-colors ${settings.requireRating ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.requireRating ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Feedback Reminder</span>
                        <p className="text-xs text-zinc-500">Remind students who haven't submitted feedback</p>
                      </div>
                      <button onClick={() => toggleSetting('feedbackReminder')} className={`w-12 h-6 rounded-full transition-colors ${settings.feedbackReminder ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.feedbackReminder ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Feedback Stats</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-white">847</p>
                          <p className="text-xs text-zinc-500">Total Received</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-400">92%</p>
                          <p className="text-xs text-zinc-500">Response Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-amber-400">4.2★</p>
                          <p className="text-xs text-zinc-500">Avg Rating</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Privacy Tab */}
                {settingsTab === 'privacy' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs text-zinc-500 mb-4">Manage your data privacy and retention preferences.</p>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div>
                        <span className="text-sm text-white font-medium">Share Analytics with Institution</span>
                        <p className="text-xs text-zinc-500">Allow anonymized data for institutional reports</p>
                      </div>
                      <button onClick={() => toggleSetting('shareAnalytics')} className={`w-12 h-6 rounded-full transition-colors ${settings.shareAnalytics ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${settings.shareAnalytics ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm text-white font-medium">Data Retention Period</span>
                          <p className="text-xs text-zinc-500">How long to keep student feedback data</p>
                        </div>
                      </div>
                      <select 
                        value={settings.dataRetentionMonths}
                        onChange={(e) => updateSetting('dataRetentionMonths', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="6">6 months</option>
                        <option value="12">1 year</option>
                        <option value="24">2 years</option>
                        <option value="36">3 years</option>
                        <option value="0">Indefinitely</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 mt-4">
                      <h4 className="text-sm font-medium text-white mb-3">Data Management</h4>
                      <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                          <span className="text-sm text-zinc-300">Export All My Data</span>
                          <Download className="w-4 h-4 text-zinc-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                          <span className="text-sm text-zinc-300">Download Course Reports</span>
                          <Download className="w-4 h-4 text-zinc-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors">
                          <span className="text-sm text-rose-400">Delete All Feedback Data</span>
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2 border-t border-zinc-800">
                <motion.button 
                  onClick={() => { setActiveModal(null); setSettingsTab('notifications'); }} 
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" 
                  whileHover={{ scale: 1.02 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  onClick={() => { 
                    setActiveModal(null); 
                    setSettingsTab('notifications');
                    showFeedback('success', 'Settings saved successfully!'); 
                  }} 
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium flex items-center justify-center gap-2" 
                  whileHover={{ scale: 1.02 }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}

        {/* View Profile Modal */}
        {activeModal === 'view-profile' && (
          <CommandModal
            title={profName}
            subtitle="Professor Profile"
            icon={<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">{profName.split(' ')[1]?.charAt(0) || 'P'}</div>}
            iconBg="from-blue-500 to-purple-500"
            onClose={() => setActiveModal(null)}
            size="md"
          >
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                  {profName.split(' ')[1]?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{profName}</h3>
                  <p className="text-zinc-400">{user?.email || 'professor@iit.ac.in'}</p>
                  <p className="text-sm text-zinc-500 mt-1">Associate Professor</p>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <BookOpen className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-xs text-zinc-400">Courses</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <Users className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
                  <p className="text-2xl font-bold text-white">1,245</p>
                  <p className="text-xs text-zinc-400">Students</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-center">
                  <Presentation className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl font-bold text-white">156</p>
                  <p className="text-xs text-zinc-400">Lectures</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">Contact Information</h4>
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-white">{user?.email || 'professor@iit.ac.in'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-white">Computer Science Department</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button 
                  onClick={() => setActiveModal(null)} 
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium" 
                  whileHover={{ scale: 1.02 }}
                >
                  Close
                </motion.button>
                <motion.button 
                  onClick={() => { setActiveModal('settings'); }} 
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2" 
                  whileHover={{ scale: 1.02 }}
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </CommandModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMAND MODAL - Reusable Modal Component for Quick Actions
// ═══════════════════════════════════════════════════════════════════════════════
function CommandModal({ 
  title, 
  subtitle, 
  icon, 
  iconBg, 
  onClose, 
  children,
  size = 'md'
}: { 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  iconBg: string; 
  onClose: () => void; 
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = ''; };
  }, [onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`relative w-full ${sizeClasses[size]} bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${iconBg}`}>
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-sm text-zinc-400">{subtitle}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
