/**
 * LIS v3.5 - Student Navigation Sidebar (Production Ready)
 * Professional navigation with real-world student features
 * Uses React Router for proper navigation
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  Bell,
  Search,
  Plus,
  Sparkles,
  Calendar,
  Target,
  CheckCircle,
  Wifi,
  WifiOff,
  X,
  Send,
  Zap,
  HelpCircle,
  FileText,
  Clock,
  GraduationCap,
  ClipboardList,
  BookMarked,
  Video,
  History,
  Star,
  TrendingUp,
  Eye,
  PenTool,
} from 'lucide-react';

// ================== Types ==================

interface NavItemData {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  badgeColor?: 'purple' | 'red' | 'orange' | 'green' | 'blue';
  subItems?: SubNavItem[];
  description?: string;
}

interface SubNavItem {
  id: string;
  label: string;
  href: string;
  badge?: string | number;
  badgeColor?: 'purple' | 'red' | 'orange' | 'green' | 'blue';
  icon?: React.ReactNode;
}

interface Notification {
  id: string;
  type: 'urgent' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

// ================== Mock Data ==================

const mockNotifications: Notification[] = [
  { 
    id: '1', 
    type: 'urgent', 
    title: 'Feedback Due Soon', 
    message: 'CS301 - Graph Algorithms feedback due in 2 hours',
    time: '2h left',
    read: false,
    actionUrl: '/v3/student/feedback'
  },
  { 
    id: '2', 
    type: 'warning', 
    title: 'Revision Session', 
    message: 'Prof. Kumar scheduled revision for Graphs tomorrow',
    time: 'Tomorrow 10 AM',
    read: false,
    actionUrl: '/v3/student/schedule'
  },
  { 
    id: '3', 
    type: 'success', 
    title: 'Streak Milestone! 🎉', 
    message: 'You hit a 10-day feedback streak!',
    time: 'Just now',
    read: true
  },
  { 
    id: '4', 
    type: 'info', 
    title: 'New Material', 
    message: 'Lecture notes uploaded for Dynamic Programming',
    time: '1h ago',
    read: true,
    actionUrl: '/v3/student/courses'
  },
  { 
    id: '5', 
    type: 'info', 
    title: 'Grade Published', 
    message: 'Your quiz 2 grade is now available',
    time: '3h ago',
    read: true,
    actionUrl: '/v3/student/performance'
  },
];

// ================== Helper Components ==================

// Badge Component
const Badge: React.FC<{ 
  children: React.ReactNode; 
  color?: 'purple' | 'red' | 'orange' | 'green' | 'blue';
  size?: 'sm' | 'md';
  pulse?: boolean;
}> = ({ children, color = 'purple', size = 'sm', pulse = false }) => {
  const colorClasses = {
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };

  return (
    <span className={`
      ${colorClasses[color]} ${sizeClasses[size]}
      font-medium rounded-full border backdrop-blur-sm inline-flex items-center gap-1
      ${pulse ? 'animate-pulse' : ''}
    `}>
      {children}
    </span>
  );
};

// Notification Item
const NotificationItem: React.FC<{ 
  notification: Notification; 
  onClick: () => void;
}> = ({ notification, onClick }) => {
  const typeStyles = {
    urgent: { dot: 'bg-red-500', bg: 'hover:bg-red-500/10' },
    warning: { dot: 'bg-orange-500', bg: 'hover:bg-orange-500/10' },
    success: { dot: 'bg-green-500', bg: 'hover:bg-green-500/10' },
    info: { dot: 'bg-blue-500', bg: 'hover:bg-blue-500/10' },
  };

  return (
    <div
      onClick={onClick}
      className={`
        px-4 py-3 cursor-pointer transition-colors
        ${typeStyles[notification.type].bg}
        ${!notification.read ? 'bg-white/5' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <span className={`
          w-2 h-2 mt-2 rounded-full flex-shrink-0
          ${typeStyles[notification.type].dot}
          ${!notification.read ? 'animate-pulse' : ''}
        `} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${!notification.read ? 'text-white font-medium' : 'text-zinc-300'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{notification.message}</p>
          <p className="text-[10px] text-zinc-600 mt-1">{notification.time}</p>
        </div>
      </div>
    </div>
  );
};

// Progress Ring
const ProgressRing: React.FC<{ progress: number; size?: number }> = ({ 
  progress, 
  size = 40 
}) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(139, 92, 246, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#sidebarProgressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="sidebarProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-purple-400">
        {progress}%
      </span>
    </div>
  );
};

// ================== Main Component ==================

interface StudentSidebarV3Props {
  isCollapsed?: boolean;
  onToggle?: () => void;
  studentName?: string;
  weeklyProgress?: number;
  feedbackStreak?: number;
  pendingFeedback?: number;
  totalFeedback?: number;
  activeCourses?: number;
  isOnline?: boolean;
}

export const StudentSidebarV3: React.FC<StudentSidebarV3Props> = ({
  isCollapsed = false,
  onToggle,
  studentName = 'Student',
  weeklyProgress = 78,
  feedbackStreak = 12,
  pendingFeedback = 2,
  totalFeedback = 12,
  activeCourses = 3,
  isOnline = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get active page from current route
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/feedback')) return 'feedback';
    if (path.includes('/courses')) return 'courses';
    if (path.includes('/performance')) return 'performance';
    if (path.includes('/schedule')) return 'schedule';
    if (path.includes('/resources')) return 'resources';
    if (path.includes('/doubts')) return 'doubts';
    if (path.includes('/grades')) return 'grades';
    if (path.includes('/attendance')) return 'attendance';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/help')) return 'help';
    return 'overview';
  };

  const activePage = getActivePage();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowAIChat(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setShowQuickActions(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setShowNotifications(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ================== Navigation Items (Real Student Features) ==================
  const navItems: NavItemData[] = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: <Home size={18} />,
      href: '/v3/student',
      description: 'Overview & quick stats',
    },
    {
      id: 'feedback',
      label: 'Lecture Feedback',
      icon: <MessageSquare size={18} />,
      href: '/v3/student/feedback',
      badge: pendingFeedback > 0 ? pendingFeedback : undefined,
      badgeColor: pendingFeedback > 0 ? 'red' : undefined,
      description: 'Submit & view feedback',
      subItems: [
        { id: 'feedback-pending', label: 'Pending', href: '/v3/student/feedback?tab=pending', badge: pendingFeedback, badgeColor: 'red', icon: <Clock size={14} /> },
        { id: 'feedback-submitted', label: 'Submitted', href: '/v3/student/feedback?tab=submitted', badge: totalFeedback, badgeColor: 'green', icon: <CheckCircle size={14} /> },
        { id: 'feedback-history', label: 'History', href: '/v3/student/feedback?tab=history', icon: <History size={14} /> },
      ],
    },
    {
      id: 'courses',
      label: 'My Courses',
      icon: <BookOpen size={18} />,
      href: '/v3/student/courses',
      badge: activeCourses,
      badgeColor: 'purple',
      description: 'Enrolled courses',
      subItems: [
        { id: 'courses-enrolled', label: 'Enrolled', href: '/v3/student/courses', badge: activeCourses, badgeColor: 'green', icon: <BookMarked size={14} /> },
        { id: 'courses-lectures', label: 'Lecture Videos', href: '/v3/student/courses/videos', icon: <Video size={14} /> },
        { id: 'courses-materials', label: 'Study Materials', href: '/v3/student/courses/materials', icon: <FileText size={14} /> },
      ],
    },
    {
      id: 'performance',
      label: 'My Performance',
      icon: <BarChart3 size={18} />,
      href: '/v3/student/performance',
      badge: feedbackStreak > 5 ? `🔥${feedbackStreak}` : undefined,
      badgeColor: 'orange',
      description: 'Analytics & insights',
      subItems: [
        { id: 'performance-overview', label: 'Overview', href: '/v3/student/performance', icon: <TrendingUp size={14} /> },
        { id: 'performance-weak', label: 'Weak Topics', href: '/v3/student/performance/weak', badge: 3, badgeColor: 'orange', icon: <Target size={14} /> },
        { id: 'performance-tips', label: 'Study Tips', href: '/v3/student/performance/tips', icon: <Sparkles size={14} /> },
      ],
    },
    {
      id: 'grades',
      label: 'Grades & Results',
      icon: <GraduationCap size={18} />,
      href: '/v3/student/grades',
      description: 'View your grades',
      subItems: [
        { id: 'grades-current', label: 'Current Semester', href: '/v3/student/grades', icon: <Star size={14} /> },
        { id: 'grades-history', label: 'Past Results', href: '/v3/student/grades/history', icon: <History size={14} /> },
      ],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <ClipboardList size={18} />,
      href: '/v3/student/attendance',
      badge: '85%',
      badgeColor: 'green',
      description: 'Track attendance',
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar size={18} />,
      href: '/v3/student/schedule',
      badge: '2 today',
      badgeColor: 'blue',
      description: 'Classes & events',
    },
    {
      id: 'doubts',
      label: 'Ask Doubts',
      icon: <HelpCircle size={18} />,
      href: '/v3/student/doubts',
      badge: '3 replies',
      badgeColor: 'green',
      description: 'Q&A with professors',
      subItems: [
        { id: 'doubts-ask', label: 'Ask Question', href: '/v3/student/doubts/ask', icon: <PenTool size={14} /> },
        { id: 'doubts-my', label: 'My Questions', href: '/v3/student/doubts/my', icon: <MessageSquare size={14} /> },
        { id: 'doubts-browse', label: 'Browse All', href: '/v3/student/doubts', icon: <Eye size={14} /> },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <FileText size={18} />,
      href: '/v3/student/resources',
      description: 'Notes & materials',
    },
  ];

  const bottomNavItems: NavItemData[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={18} />,
      href: '/v3/student/settings',
      description: 'Account settings',
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle size={18} />,
      href: '/v3/student/help',
      description: 'Get help',
    },
  ];

  // ================== Render Functions ==================
  
  const renderNavItem = (item: NavItemData) => {
    const isActive = activePage === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div key={item.id}>
        {/* Main Nav Item */}
        <div
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all
            ${isActive 
              ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/10 text-white' 
              : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
            }
          `}
          onClick={() => {
            if (hasSubItems) {
              toggleExpand(item.id);
            } else {
              navigate(item.href);
            }
          }}
          title={isCollapsed ? item.label : undefined}
        >
          <span className={`flex-shrink-0 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'}`}>
            {item.icon}
          </span>
          
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
              
              {/* Badge */}
              {item.badge && (
                <Badge color={item.badgeColor} pulse={item.badgeColor === 'red'}>
                  {item.badge}
                </Badge>
              )}
              
              {/* Expand Icon */}
              {hasSubItems && (
                <ChevronDown 
                  size={14} 
                  className={`flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              )}
            </>
          )}
        </div>

        {/* Sub Items */}
        {!isCollapsed && hasSubItems && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-4 pl-3 mt-1 border-l border-zinc-800 space-y-0.5">
                  {item.subItems!.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                    >
                      {subItem.icon && <span className="text-zinc-600">{subItem.icon}</span>}
                      <span className="flex-1 truncate">{subItem.label}</span>
                      {subItem.badge !== undefined && (
                        <Badge color={subItem.badgeColor} size="sm">
                          {subItem.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Main Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full z-40 transition-all duration-300 flex flex-col
          ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
        `}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-zinc-950 border-r border-zinc-800/50" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col">
          
          {/* ========== Header ========== */}
          <div className="p-4 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h1 className="text-white font-semibold text-sm">LIS Portal</h1>
                  <p className="text-zinc-500 text-xs truncate">{studentName}</p>
                </div>
              )}

              {!isCollapsed && (
                <ProgressRing progress={weeklyProgress} size={36} />
              )}
            </div>

            {/* Search & Quick Actions */}
            {!isCollapsed && (
              <div className="mt-4 flex items-center gap-2">
                {/* Search */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm hover:border-zinc-700 transition-colors"
                >
                  <Search size={14} />
                  <span className="flex-1 text-left">Search...</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-500 rounded">⌘K</kbd>
                </button>
                
                {/* Quick Actions */}
                <div className="relative" ref={quickActionsRef}>
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className={`p-2 rounded-lg transition-colors ${
                      showQuickActions 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-purple-400 hover:border-purple-500/50'
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                  
                  {/* Quick Actions Dropdown */}
                  <AnimatePresence>
                    {showQuickActions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-64 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-50"
                      >
                        <div className="px-3 py-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                          Quick Actions
                        </div>
                        <button 
                          onClick={() => { navigate('/v3/student/feedback'); setShowQuickActions(false); }}
                          className="w-full px-3 py-2 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <MessageSquare size={14} className="text-red-400" />
                          <span className="flex-1 text-left">Fill Pending Feedback</span>
                          {pendingFeedback > 0 && <Badge color="red">{pendingFeedback}</Badge>}
                        </button>
                        <button 
                          onClick={() => { navigate('/v3/student/schedule'); setShowQuickActions(false); }}
                          className="w-full px-3 py-2 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <Calendar size={14} className="text-blue-400" />
                          <span className="flex-1 text-left">Today's Schedule</span>
                        </button>
                        <button 
                          onClick={() => { navigate('/v3/student/performance/weak'); setShowQuickActions(false); }}
                          className="w-full px-3 py-2 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <Target size={14} className="text-orange-400" />
                          <span className="flex-1 text-left">Review Weak Topics</span>
                        </button>
                        <button 
                          onClick={() => { navigate('/v3/student/doubts/ask'); setShowQuickActions(false); }}
                          className="w-full px-3 py-2 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <HelpCircle size={14} className="text-green-400" />
                          <span className="flex-1 text-left">Ask a Doubt</span>
                        </button>
                        <div className="my-2 border-t border-zinc-800" />
                        <button 
                          onClick={() => { setShowAIChat(true); setShowQuickActions(false); }}
                          className="w-full px-3 py-2 flex items-center gap-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                          <Sparkles size={14} className="text-purple-400" />
                          <span className="flex-1 text-left">Ask AI Assistant</span>
                          <Zap size={12} className="text-yellow-400" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 rounded-lg transition-colors ${
                      showNotifications 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                          <h3 className="text-sm font-medium text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-xs text-purple-400 hover:text-purple-300"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                              No notifications
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <NotificationItem 
                                key={notif.id} 
                                notification={notif}
                                onClick={() => handleNotificationClick(notif)}
                              />
                            ))
                          )}
                        </div>
                        <div className="px-4 py-2 border-t border-zinc-800">
                          <button 
                            onClick={() => { navigate('/v3/student/notifications'); setShowNotifications(false); }}
                            className="text-xs text-purple-400 hover:text-purple-300"
                          >
                            View all notifications →
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* ========== Main Navigation ========== */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
            {/* Section Label */}
            {!isCollapsed && (
              <div className="px-3 py-2 text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                Main Menu
              </div>
            )}
            
            {navItems.map(item => renderNavItem(item))}
          </nav>

          {/* ========== Bottom Section ========== */}
          <div className="border-t border-zinc-800/50 p-3 space-y-1">
            {/* AI Assistant Button */}
            {!isCollapsed && (
              <button
                onClick={() => setShowAIChat(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/10 border border-purple-500/20 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/20 transition-all group"
              >
                <Sparkles size={16} className="text-purple-400 group-hover:animate-pulse" />
                <span className="flex-1 text-left text-sm font-medium">AI Study Help</span>
                <Zap size={12} className="text-pink-400" />
              </button>
            )}

            {/* Bottom Nav Items */}
            {bottomNavItems.map(item => renderNavItem(item))}

            {/* Status Bar */}
            <div className="flex items-center justify-between px-3 py-2 mt-2">
              {!isCollapsed && (
                <div className="flex items-center gap-2 text-xs">
                  {isOnline ? (
                    <>
                      <Wifi size={12} className="text-green-500" />
                      <span className="text-zinc-500">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={12} className="text-orange-500" />
                      <span className="text-orange-400">Offline</span>
                    </>
                  )}
                </div>
              )}
              
              {onToggle && (
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                  title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <ChevronLeft 
                    size={16} 
                    className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ========== Search Modal ========== */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800">
                  <Search size={20} className="text-zinc-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search courses, lectures, materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white text-lg placeholder:text-zinc-500 focus:outline-none"
                  />
                  <kbd className="px-2 py-1 text-xs bg-zinc-800 text-zinc-500 rounded border border-zinc-700">ESC</kbd>
                </div>
                
                {/* Search Results */}
                <div className="p-3 max-h-80 overflow-y-auto">
                  <div className="px-2 py-1.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  {['Graph Algorithms lecture', 'CS301 feedback', 'Dynamic Programming notes'].map((item, i) => (
                    <button
                      key={i}
                      className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                      onClick={() => { setShowSearch(false); }}
                    >
                      <History size={14} className="text-zinc-500" />
                      <span className="flex-1 text-left">{item}</span>
                    </button>
                  ))}
                  
                  <div className="px-2 py-1.5 mt-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    Quick Actions
                  </div>
                  {[
                    { icon: <MessageSquare size={14} />, label: 'Fill pending feedback', color: 'text-red-400' },
                    { icon: <Calendar size={14} />, label: "View today's schedule", color: 'text-blue-400' },
                    { icon: <Target size={14} />, label: 'Study weak topics', color: 'text-orange-400' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="w-full px-3 py-2.5 flex items-center gap-3 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                      onClick={() => { setShowSearch(false); }}
                    >
                      <span className={item.color}>{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== AI Chat Modal ========== */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAIChat(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                      <Sparkles size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <span className="font-medium text-white text-sm">AI Study Assistant</span>
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">Online</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAIChat(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Chat Area */}
                <div className="p-4 h-72 overflow-y-auto bg-zinc-950/50">
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={14} className="text-purple-400" />
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-zinc-800/50 text-sm text-zinc-200 border border-zinc-700/50">
                      <p className="mb-2">Hi {studentName.split(' ')[0]}! 👋 I can help you with:</p>
                      <ul className="space-y-1.5 text-zinc-400">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          Explaining difficult topics from your courses
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          Study tips based on your weak areas
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          Summarizing lecture content
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                          Preparing for upcoming exams
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ask about your weak topics, study tips..."
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiMessage.trim()) {
                          setAiMessage('');
                        }
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 text-sm"
                    />
                    <button 
                      className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!aiMessage.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-zinc-600 text-center">
                    AI responses are generated and may not be 100% accurate
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentSidebarV3;
