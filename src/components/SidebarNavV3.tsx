/**
 * SidebarNav v3.0 - Spacious, Mobile-First Navigation
 * PHASE 1: Layout fix - 56px items, 16px typography, proper spacing
 * 
 * Features:
 * - Full-height drawer (320px mobile, 256px desktop)
 * - Spacious items (56px min-height, 16px labels, 12px descriptions)
 * - Interactive badges with pulse animations
 * - Expandable accordion for Quick Courses
 * - Search with clear button, alert banner
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Settings,
  ChevronDown,
  Search,
  Plus,
  AlertCircle,
  Bell,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react';
import { useNavData } from '../hooks/useNavData';

interface NavTab {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  isIntelligence: boolean;
  badgeKey?: 'lectures' | 'silent' | 'newFeedback' | 'pendingEnrollments';
  color?: 'green' | 'red' | 'blue' | 'yellow';
}

interface SidebarNavV3Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSidebarClose?: () => void;
  isMobile?: boolean;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

const NAV_TABS: NavTab[] = [
  {
    id: 'overview',
    icon: BarChart3,
    label: 'Overview',
    description: 'Learning health snapshot',
    isIntelligence: false,
    color: 'blue',
  },
  {
    id: 'courses',
    icon: BookOpen,
    label: 'Courses',
    description: 'Manage course content',
    isIntelligence: false,
    badgeKey: 'pendingEnrollments',
    color: 'blue',
  },
  {
    id: 'lectures',
    icon: Clock,
    label: 'Lecture Feedback',
    description: 'Real-time student understanding',
    isIntelligence: true,
    badgeKey: 'newFeedback',
    color: 'green',
  },
  {
    id: 'students',
    icon: Users,
    label: 'Students',
    description: 'Enrollment & performance',
    isIntelligence: false,
    color: 'blue',
  },
  {
    id: 'analytics',
    icon: TrendingUp,
    label: 'Learning Insights',
    description: 'AI-driven concept analysis',
    isIntelligence: true,
    badgeKey: 'silent',
    color: 'red',
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    description: 'Preferences & config',
    isIntelligence: false,
    color: 'blue',
  },
];

export default function SidebarNavV3({
  activeTab,
  onTabChange,
  onSidebarClose,
  isMobile = false,
  expanded: controlledExpanded = true,
  onExpandChange,
}: SidebarNavV3Props) {
  const { badges, courses, refreshBadges, searchCourses, getAlertSummary } =
    useNavData();

  const [localExpanded, setLocalExpanded] = useState(controlledExpanded);
  const [searchQuery, setSearchQuery] = useState('');
  const [coursesExpanded, setCoursesExpanded] = useState(true);
  const [actionsExpanded, setActionsExpanded] = useState(false);

  const expanded =
    controlledExpanded !== undefined ? controlledExpanded : localExpanded;

  const handleExpandToggle = () => {
    const newState = !expanded;
    setLocalExpanded(newState);
    onExpandChange?.(newState);
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (isMobile) {
      onSidebarClose?.();
    }
  };

  const filteredCourses = useMemo(() => {
    return searchCourses(searchQuery);
  }, [searchQuery, courses]);

  const getBadgeCount = (tab: NavTab): number | null => {
    if (!tab.badgeKey) return null;
    return badges[tab.badgeKey] || 0;
  };

  const getBadgeVariant = (
    tab: NavTab
  ): 'critical' | 'warning' | 'default' => {
    if (tab.badgeKey === 'silent' && badges.silent > 10) {
      return 'critical';
    }
    if (tab.badgeKey === 'newFeedback' && badges.newFeedback > 5) {
      return 'warning';
    }
    return 'default';
  };

  const alertSummary = getAlertSummary();
  const isCritical = badges.silent > 10;
  const totalUnread = filteredCourses.reduce((sum, c) => sum + c.unread, 0);

  const getProgressColor = (unread: number): string => {
    if (unread > 10) return 'bg-red-500';
    if (unread > 5) return 'bg-yellow-500';
    if (unread > 0) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getProgress = (unread: number): number => {
    return Math.max(20, Math.min(100, 100 - unread * 3));
  };

  return (
    <motion.aside
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`flex flex-col h-full bg-gradient-to-b from-gray-900 to-black backdrop-blur border-r border-slate-700/50 shadow-2xl shadow-black/50 ${
        isMobile ? 'w-80' : expanded ? 'w-64' : 'w-20'
      } transition-all duration-300 overflow-hidden`}
    >
      {/* === HEADER === */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/20 flex-shrink-0 min-h-[64px] gap-3 bg-gradient-to-r from-slate-800/50 to-slate-900/30 backdrop-blur-sm">
        {expanded && (
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent truncate">
              Navigation
            </h3>
            <p className="text-xs text-slate-500 font-medium tracking-wide">IIT PROFESSOR DASHBOARD</p>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleExpandToggle}
          className="p-2.5 hover:bg-purple-500/40 bg-slate-700/30 rounded-lg transition text-slate-300 hover:text-purple-200 flex-shrink-0"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              expanded ? '' : 'rotate-90'
            }`}
          />
        </motion.button>
      </div>

      {/* === ALERT BANNER === */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`px-5 py-4 flex items-start gap-3 cursor-pointer transition-all group ${
              isCritical
                ? 'bg-gradient-to-r from-red-950/60 via-red-900/40 to-red-950/60 border-b border-red-500/50 hover:from-red-950/80 hover:via-red-900/60'
                : 'bg-gradient-to-r from-emerald-950/50 via-emerald-900/30 to-emerald-950/50 border-b border-emerald-500/40 hover:from-emerald-950/70 hover:via-emerald-900/50'
            }`}
            onClick={() => {
              if (isCritical) {
                handleTabClick('analytics');
              }
            }}
          >
            <motion.div
              animate={{ scale: isCritical ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 2, repeat: isCritical ? Infinity : 0 }}
              className="flex-shrink-0 mt-1"
            >
              {isCritical ? (
                <div className="relative">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-red-400"
                  />
                </div>
              ) : (
                <Bell className="w-6 h-6 text-emerald-400" />
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-base font-bold truncate group-hover:scale-105 transition-transform ${
                isCritical
                  ? 'text-red-200 group-hover:text-red-100'
                  : 'text-emerald-200 group-hover:text-emerald-100'
              }`}>
                {alertSummary}
              </p>
              <p className={`text-xs mt-1 font-medium ${
                isCritical ? 'text-red-400/80' : 'text-emerald-400/80'
              }`}>
                {isCritical
                  ? '↓ Tap to send nudge SMS'
                  : '✓ All courses monitored'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SEARCH BAR === */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 py-4 border-b border-purple-500/20 flex-shrink-0 min-h-[64px] flex items-center bg-slate-900/40"
          >
            <div className="relative w-full flex items-center gap-2">
              <Search className="absolute left-3 w-5 h-5 text-purple-400 pointer-events-none" />
              <input
                type="text"
                placeholder="🔍 Find courses (CS, DS...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 pl-10 pr-10 py-3 bg-gradient-to-r from-slate-800/80 to-slate-700/50 border border-purple-500/30 rounded-lg text-base text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all font-medium"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 hover:bg-slate-600/50 rounded transition"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MAIN NAVIGATION === */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/30 scrollbar-track-transparent">
        {NAV_TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badgeCount = getBadgeCount(tab);
          const showBadge = badgeCount && badgeCount > 0;
          const badgeVariant = getBadgeVariant(tab);

          const badgeVariantStyles = {
            critical: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-xl shadow-red-500/60 animate-pulse',
            warning: 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-xl shadow-yellow-500/60',
            default: 'bg-slate-700/60 text-slate-200',
          };

          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <motion.button
                whileHover={{ scale: 1.03, x: 3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleTabClick(tab.id)}
                className={`relative w-full flex items-center ${expanded ? 'p-3.5' : 'p-2.5 flex-col gap-1'} rounded-xl transition-all min-h-[60px] group overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-white shadow-xl shadow-purple-600/40 ring-2 ring-purple-400/30'
                    : 'text-slate-400 hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-700/30 hover:text-slate-100 hover:shadow-md hover:shadow-purple-500/10'
                }`}
                title={!expanded ? tab.label : undefined}
              >
                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-active:opacity-100"
                  animate={{ scale: [0.5, 2] }}
                  transition={{ duration: 0.4 }}
                />

                {/* Glow on hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition" />
                )}

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with pulse */}
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {tab.isIntelligence && !isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500/60 rounded-r-lg"
                          layoutId="activeIndicator"
                        />
                      )}

                      <div className="relative flex-shrink-0">
                        <Icon className="w-7 h-7" />
                        {showBadge && isActive && (
                          <motion.div
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                              badgeVariant === 'critical'
                                ? 'bg-red-400 shadow-lg shadow-red-500/80'
                                : badgeVariant === 'warning'
                                  ? 'bg-yellow-400 shadow-lg shadow-yellow-500/60'
                                  : 'bg-emerald-400'
                            }`}
                          />
                        )}
                      </div>

                      {expanded && (
                        <div className="min-w-0 flex-1">
                          <div className="text-lg font-bold leading-tight text-white">
                            {tab.label}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                            {tab.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {expanded && showBadge && (
                      <motion.span
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.15 }}
                        className={`flex-shrink-0 inline-flex items-center justify-center min-w-[32px] h-8 px-2.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap cursor-pointer transition-all ${badgeVariantStyles[badgeVariant]}`}
                      >
                        {badgeCount}
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </nav>

      {/* === QUICK COURSES ACCORDION === */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-purple-500/20 flex-shrink-0 bg-gradient-to-r from-slate-800/30 to-slate-900/20"
          >
            <motion.button
              onClick={() => setCoursesExpanded(!coursesExpanded)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-slate-300 hover:bg-slate-700/30 transition-all min-h-[60px] group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-purple-400"
                >
                  <TrendingUp className="w-6 h-6 flex-shrink-0" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                    Quick Courses
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {filteredCourses.length} courses • <span className="text-orange-400 font-bold">{totalUnread} unread</span>
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: coursesExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 text-purple-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {coursesExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 px-3 py-2 bg-slate-700/20 border-t border-slate-700/30"
                >
                  {filteredCourses.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-sm">
                      No courses found
                    </div>
                  ) : (
                    filteredCourses.map((course, idx) => {
                      const progress = getProgress(course.unread);
                      const progressColor = getProgressColor(course.unread);

                      return (
                        <motion.button
                          key={course.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition group text-left min-h-[56px] active:bg-slate-700/70"
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${
                              course.unread > 10
                                ? 'bg-red-600/30 text-red-400'
                                : course.unread > 5
                                  ? 'bg-yellow-600/30 text-yellow-400'
                                  : 'bg-blue-600/30 text-blue-400'
                            }`}
                          >
                            {course.code.substring(0, 2)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-white truncate">
                                  {course.code}
                                </div>
                                <p className="text-xs text-slate-400 truncate">
                                  {course.name}
                                </p>
                              </div>

                              {course.unread > 0 && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                    course.unread > 10
                                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                                      : course.unread > 5
                                        ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30'
                                        : 'bg-slate-700 text-slate-200'
                                  }`}
                                >
                                  {course.unread}
                                </motion.span>
                              )}
                            </div>

                            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${progressColor}`}
                              />
                            </div>

                            <p className="text-xs text-slate-500 mt-1">
                              Updated {course.lastUpdated}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === QUICK ACTIONS === */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-700/30 p-4 space-y-2 flex-shrink-0"
          >
            <motion.button
              onClick={() => setActionsExpanded(!actionsExpanded)}
              className="w-full flex items-center justify-between gap-2"
            >
              <h4 className="text-sm font-semibold text-white">Quick Actions</h4>
              <motion.div
                animate={{ rotate: actionsExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {actionsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {[
                    {
                      icon: Clock,
                      label: 'New Lecture',
                      onClick: () => handleTabClick('lectures'),
                    },
                    {
                      icon: Plus,
                      label: 'New Course',
                      onClick: () => handleTabClick('courses'),
                    },
                    {
                      icon: Zap,
                      label: 'Bulk Enroll',
                      onClick: () => handleTabClick('students'),
                    },
                  ].map((action, idx) => {
                    const ActionIcon = action.icon;
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.onClick}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition min-h-[48px] group text-left"
                      >
                        <ActionIcon className="w-5 h-5 flex-shrink-0 text-purple-400 group-hover:text-purple-300" />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100">
                          {action.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === REFRESH BUTTON === */}
      <motion.div className="p-4 border-t border-purple-500/20 flex-shrink-0 bg-gradient-to-t from-slate-900/40 to-transparent">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshBadges}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 rounded-xl text-base font-bold text-white transition-all shadow-lg shadow-purple-600/40 hover:shadow-xl hover:shadow-purple-500/50"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-5 h-5" />
          </motion.div>
          {expanded ? 'Refresh Data' : ''}
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
