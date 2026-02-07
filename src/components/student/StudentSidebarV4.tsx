/**
 * LIS v4.0 - Student Navigation Sidebar (Fixed & Complete)
 * Proper navigation, always visible active states, all routes working
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
  Bell,
  Search,
  Plus,
  Sparkles,
  Calendar,
  Target,
  CheckCircle,
  X,
  Send,
  Zap,
  HelpCircle,
  FileText,
  Clock,
  GraduationCap,
  Flame,
  TrendingUp,
  LogOut,
  User,
} from 'lucide-react';

// ================== Types ==================

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  badgeType?: 'alert' | 'info' | 'success' | 'warning';
  subItems?: { id: string; label: string; href: string; badge?: string | number }[];
}

// ================== Badge Component ==================

function Badge({ 
  children, 
  type = 'info' 
}: { 
  children: React.ReactNode; 
  type?: 'alert' | 'info' | 'success' | 'warning';
}) {
  const styles = {
    alert: 'bg-red-500 text-white',
    info: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  };

  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${styles[type]}`}>
      {children}
    </span>
  );
}

// ================== Main Sidebar ==================

interface StudentSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onSignOut?: () => void;
  studentName?: string;
  weeklyProgress?: number;
  feedbackStreak?: number;
  pendingFeedback?: number;
  totalFeedback?: number;
  activeCourses?: number;
  isOnline?: boolean;
}

export function StudentSidebarV4({ 
  isCollapsed = false, 
  onToggle,
  onSignOut,
  studentName = 'Alex Johnson',
  weeklyProgress = 78,
  feedbackStreak = 12,
  pendingFeedback = 2,
  totalFeedback = 12,
  activeCourses = 3,
  isOnline = true,
}: StudentSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);

  // Use props for student data
  const studentData = {
    name: studentName,
    email: 'alex.johnson@university.edu',
    weeklyProgress,
    feedbackStreak,
    pendingFeedback,
    activeCourses,
  };

  // Check if a path is active
  const isActivePath = (href: string) => {
    const currentPath = location.pathname;
    if (href === '/dev/student' || href === '/dev/student/overview') {
      return currentPath === '/dev/student' || currentPath === '/dev/student/overview';
    }
    return currentPath.startsWith(href);
  };

  // Navigation items with correct paths
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      href: '/dev/student/overview',
    },
    {
      id: 'feedback',
      label: 'Lecture Feedback',
      icon: <MessageSquare size={20} />,
      href: '/dev/student/feedback',
      badge: studentData.pendingFeedback > 0 ? studentData.pendingFeedback : undefined,
      badgeType: 'alert',
    },
    {
      id: 'courses',
      label: 'My Courses',
      icon: <BookOpen size={20} />,
      href: '/dev/student/courses',
      badge: studentData.activeCourses,
      badgeType: 'info',
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <BarChart3 size={20} />,
      href: '/dev/student/performance',
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar size={20} />,
      href: '/dev/student/schedule',
    },
    {
      id: 'grades',
      label: 'Grades',
      icon: <GraduationCap size={20} />,
      href: '/dev/student/grades',
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      href: '/dev/student/settings',
    },
  ];

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${isCollapsed ? 'w-20 min-w-[80px] max-w-[80px]' : 'w-[260px] min-w-[260px] max-w-[260px]'}`}>
        {/* Background */}
        <div className="absolute inset-0 bg-zinc-900 border-r border-zinc-700/60" />

        <div className="relative h-full flex flex-col">
          {/* ========== Header ========== */}
          <div className="p-4 border-b border-zinc-800/60">
            {/* Logo & User */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h1 className="text-white font-semibold text-base">LIS Portal</h1>
                  <p className="text-zinc-500 text-xs truncate">{studentData.name}</p>
                </div>
              )}
            </div>

            {/* Progress Card */}
            {!isCollapsed && (
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400">Weekly Progress</span>
                  <span className="text-sm font-bold text-purple-400">{studentData.weeklyProgress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${studentData.weeklyProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame size={14} />
                    <span className="text-xs font-medium">{studentData.feedbackStreak} day streak</span>
                  </div>
                  {studentData.pendingFeedback > 0 && (
                    <span className="text-xs text-red-400">{studentData.pendingFeedback} pending</span>
                  )}
                </div>
              </div>
            )}

            {/* Search & Actions */}
            {!isCollapsed && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-500 text-sm hover:border-zinc-700 hover:text-zinc-400 transition-all"
                >
                  <Search size={16} />
                  <span className="flex-1 text-left">Search...</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-500 rounded font-mono">⌘K</kbd>
                </button>
                
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <motion.button
                    onClick={() => setShowNotifications(!showNotifications)}
                    whileHover={{ scale: 1.05, rotate: 8 }}
                    whileTap={{ scale: 0.95, rotate: -5 }}
                    className={`relative p-2.5 rounded-xl border transition-all ${
                      showNotifications 
                        ? 'bg-purple-600 border-purple-500 text-white' 
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                      3
                    </span>
                  </motion.button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">Notifications</span>
                          <button className="text-xs text-purple-400 hover:text-purple-300">Mark all read</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          <NotificationItem 
                            type="urgent"
                            title="Feedback Due Soon"
                            message="CS301 - Graph Algorithms feedback due in 2 hours"
                            time="2h left"
                            onClick={() => { navigate('/dev/student/feedback'); setShowNotifications(false); }}
                          />
                          <NotificationItem 
                            type="info"
                            title="Revision Session"
                            message="Prof. Kumar scheduled revision for Graphs tomorrow"
                            time="Tomorrow 10 AM"
                          />
                          <NotificationItem 
                            type="success"
                            title="Streak Milestone! 🎉"
                            message="You hit a 10-day feedback streak!"
                            time="Just now"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* ========== Navigation ========== */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 min-h-0">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = isActivePath(item.href);
                const isExpanded = expandedItems.includes(item.id);
                const hasSubItems = item.subItems && item.subItems.length > 0;

                return (
                  <div key={item.id}>
                    <Link
                      to={hasSubItems ? '#' : item.href}
                      onClick={(e) => {
                        if (hasSubItems) {
                          e.preventDefault();
                          toggleExpand(item.id);
                        }
                      }}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                        ${isActive 
                          ? 'bg-purple-600/20 text-white border border-purple-500/30' 
                          : 'text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                        }
                      `}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-zinc-300'}`}>
                        {item.icon}
                      </span>
                      
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                          
                          {item.badge && (
                            <Badge type={item.badgeType}>{item.badge}</Badge>
                          )}
                          
                          {hasSubItems && (
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          )}
                        </>
                      )}
                    </Link>

                    {/* Sub Items */}
                    {!isCollapsed && hasSubItems && (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-5 pl-4 mt-1 border-l-2 border-zinc-800 space-y-1">
                              {item.subItems!.map((sub) => (
                                <Link
                                  key={sub.id}
                                  to={sub.href}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-200 hover:text-white hover:bg-zinc-800/50 transition-all"
                                >
                                  <span className="flex-1">{sub.label}</span>
                                  {sub.badge && <Badge type="info">{sub.badge}</Badge>}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* ========== Bottom Section ========== */}
          <div className="p-3 border-t border-zinc-800/60">
            {/* AI Assistant Button */}
            {!isCollapsed && (
              <motion.button 
                whileHover={{ scale: 1.02, rotate: 1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mb-3 p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 transition-all flex items-center gap-3"
              >
                <Sparkles size={18} className="text-purple-400" />
                <span className="text-sm font-medium">Ask AI Assistant</span>
                <Zap size={14} className="text-yellow-400 ml-auto" />
              </motion.button>
            )}

            {/* Bottom Nav Items */}
            {bottomNavItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-zinc-800/80 text-white' 
                      : 'text-zinc-200 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  <span className={isActive ? 'text-purple-400' : 'text-zinc-300'}>{item.icon}</span>
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}

            {/* User Profile */}
            {!isCollapsed && (
              <div className="mt-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {studentData.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{studentData.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{studentData.email}</p>
                </div>
                <motion.button 
                  onClick={onSignOut}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95, rotate: -5 }}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </motion.button>
              </div>
            )}
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                <Search size={20} className="text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses, lectures, topics..."
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-base"
                  autoFocus
                />
                <motion.button 
                  onClick={() => setShowSearch(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
                >
                  <X size={18} />
                </motion.button>
              </div>
              
              <div className="p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Quick Actions</p>
                <div className="space-y-1">
                  {[
                    { icon: <MessageSquare size={16} />, label: 'Fill Pending Feedback', href: '/dev/student/feedback', color: 'text-red-400' },
                    { icon: <BookOpen size={16} />, label: 'View My Courses', href: '/dev/student/courses', color: 'text-purple-400' },
                    { icon: <BarChart3 size={16} />, label: 'Check Performance', href: '/dev/student/performance', color: 'text-green-400' },
                    { icon: <Settings size={16} />, label: 'Open Settings', href: '/dev/student/settings', color: 'text-zinc-400' },
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => { navigate(action.href); setShowSearch(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      <span className={action.color}>{action.icon}</span>
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ================== Notification Item ==================

function NotificationItem({
  type,
  title,
  message,
  time,
  onClick,
}: {
  type: 'urgent' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  onClick?: () => void;
}) {
  const dotColor = {
    urgent: 'bg-red-500',
    info: 'bg-blue-500',
    success: 'bg-green-500',
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-3 flex items-start gap-3 hover:bg-zinc-800/50 transition-colors text-left"
    >
      <span className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${dotColor[type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{message}</p>
        <p className="text-[10px] text-zinc-600 mt-1">{time}</p>
      </div>
    </button>
  );
}

export default StudentSidebarV4;
