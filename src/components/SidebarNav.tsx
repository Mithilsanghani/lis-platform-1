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
  Zap,
  GripVertical,
} from 'lucide-react';
import { useNavData } from '../hooks/useNavData';

interface NavTab {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  purpose: string;
  isIntelligence: boolean;
  badgeKey?: 'lectures' | 'silent' | 'newFeedback' | 'pendingEnrollments';
  color?: 'green' | 'red' | 'blue' | 'yellow';
  role?: 'prof' | 'dean' | 'both';
}

interface SidebarNavProps {
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
    purpose: 'Learning health snapshot',
    isIntelligence: false,
    color: 'blue',
  },
  {
    id: 'courses',
    icon: BookOpen,
    label: 'Courses',
    purpose: 'Manage course content',
    isIntelligence: false,
    badgeKey: 'pendingEnrollments',
    color: 'blue',
  },
  {
    id: 'lectures',
    icon: Clock,
    label: 'Lecture Feedback',
    purpose: 'Real-time student understanding',
    isIntelligence: true,
    badgeKey: 'newFeedback',
    color: 'green',
  },
  {
    id: 'students',
    icon: Users,
    label: 'Students',
    purpose: 'Enrollment & performance',
    isIntelligence: false,
    color: 'blue',
  },
  {
    id: 'analytics',
    icon: TrendingUp,
    label: 'Learning Insights',
    purpose: 'AI-driven concept analysis',
    isIntelligence: true,
    badgeKey: 'silent',
    color: 'red',
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Settings',
    purpose: 'Preferences & config',
    isIntelligence: false,
    color: 'blue',
  },
];

const colorMap = {
  green: '#10B981', // emerald-500
  red: '#EF4444', // red-500
  blue: '#3B82F6', // blue-500
  yellow: '#F59E0B', // amber-500
};

/**
 * SidebarNav Component - Mobile-First Navigation with Badges & Search
 * FEATURES:
 * - Collapsible sidebar (mobile: swipe/tap, desktop: persistent)
 * - Dynamic badges (unread counts, alerts)
 * - Search/filter courses
 * - Quick action buttons (New Lecture, New Course)
 * - Real-time Supabase integration ready
 * - AI insights preview on hover
 * - Accessibility: VoiceOver, 48px tap targets
 */
export default function SidebarNav({
  activeTab,
  onTabChange,
  onSidebarClose,
  isMobile = false,
  expanded: controlledExpanded,
  onExpandChange,
}: SidebarNavProps) {
  const { badges, courses, refreshBadges, searchCourses, getAlertSummary } =
    useNavData();

  const [localExpanded, setLocalExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCoursesList, setShowCoursesList] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Use controlled or local expanded state
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

  // Filter courses by search
  const filteredCourses = useMemo(() => {
    return searchCourses(searchQuery);
  }, [searchQuery, courses]);

  // Get badge value for a tab
  const getBadgeCount = (tab: NavTab): number | null => {
    if (!tab.badgeKey) return null;
    return badges[tab.badgeKey] || 0;
  };

  // Get badge color
  const getBadgeColor = (tab: NavTab): string => {
    if (tab.badgeKey === 'silent' && badges.silent > 10) {
      return 'bg-red-500 text-white'; // Critical
    }
    if (tab.badgeKey === 'newFeedback' && badges.newFeedback > 5) {
      return 'bg-yellow-500 text-white'; // Warning
    }
    return 'bg-slate-700 text-slate-200';
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`flex flex-col h-full bg-slate-800/50 backdrop-blur border-r border-slate-700/50 ${
        expanded ? 'w-64' : 'w-20'
      } transition-all duration-300 overflow-y-auto`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0 ${!expanded && 'flex-col gap-2'}`}>
        {expanded && (
          <div>
            <h3 className="text-sm font-bold text-white">Navigation</h3>
            <p className="text-xs text-slate-400">v2.0 Mobile-First</p>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExpandToggle}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-300"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              expanded ? '' : 'rotate-90'
            }`}
          />
        </motion.button>
      </div>

      {/* Alert Summary */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 py-3 bg-slate-700/30 border-b border-slate-700/50 flex items-start gap-2"
        >
          {badges.silent > 10 ? (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <Bell className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-xs text-slate-300 leading-snug">
            {getAlertSummary()}
          </p>
        </motion.div>
      )}

      {/* Search Bar */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-b border-slate-700/50"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </motion.div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badgeCount = getBadgeCount(tab);
          const showBadge = badgeCount && badgeCount > 0;

          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <motion.button
                whileHover={{ x: expanded ? 4 : 0, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
                title={!expanded ? tab.label : undefined}
              >
                {/* Intelligence accent bar */}
                {tab.isIntelligence && !isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500/50 rounded-r-lg" />
                )}

                {/* Icon with pulse on alert */}
                <div className="relative flex-shrink-0">
                  <Icon className="w-5 h-5" />
                  {showBadge && isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: colorMap[tab.color || 'blue'] }}
                    />
                  )}
                </div>

                {/* Label & Badge */}
                {expanded && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium block truncate">
                        {tab.label}
                      </span>
                      {showBadge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${getBadgeColor(
                            tab
                          )}`}
                        >
                          {badgeCount}
                        </motion.span>
                      )}
                    </div>
                    <span
                      className={`text-xs block truncate transition ${
                        isActive ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {tab.purpose}
                    </span>
                  </div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </nav>

      {/* Courses List Section */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-slate-700/50 p-4 space-y-3"
        >
          <button
            onClick={() => setShowCoursesList(!showCoursesList)}
            className="w-full flex items-center justify-between text-sm font-bold text-slate-300 hover:text-white transition"
          >
            <span>Quick Courses ({filteredCourses.length})</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showCoursesList ? '' : '-rotate-90'
              }`}
            />
          </button>

          <AnimatePresence>
            {showCoursesList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <motion.button
                      key={course.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="w-full text-left p-2 hover:bg-slate-700/30 rounded text-xs transition group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-200 truncate group-hover:text-white">
                            {course.code}
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            {course.name}
                          </p>
                        </div>
                        {course.unread > 0 && (
                          <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">
                            {course.unread}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-2">
                    No courses found
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Quick Actions */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-slate-700/50 p-4 space-y-2 flex-shrink-0"
        >
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="w-full flex items-center justify-between text-sm font-bold text-slate-300 hover:text-white transition"
          >
            <span>Quick Actions</span>
            <Zap className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Lecture
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Course
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition text-sm font-medium"
                >
                  <GripVertical className="w-4 h-4" />
                  Bulk Enroll
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Refresh Button */}
      {expanded && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshBadges}
          className="m-4 w-auto px-3 py-2 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
        >
          Refresh Data
        </motion.button>
      )}
    </motion.aside>
  );
}
