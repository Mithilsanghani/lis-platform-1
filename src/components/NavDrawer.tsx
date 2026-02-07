/**
 * NavDrawer - Spacious, responsive mobile-first navigation drawer
 * PHASE 1: Layout fix with 56px min-height items, 16px typography, 12px gaps
 * 
 * Features:
 * - Full-height drawer (320px mobile, 256px desktop when collapsed)
 * - Spacious items with 56px min-height
 * - Proper text hierarchy (16px labels, 12px descriptions)
 * - Interactive elements (clickable badges, expandable sections)
 * - Smooth animations (200ms transitions, ripple effects)
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
import NavItem from './NavItem';
import Badge from './Badge';
import QuickCoursesAccordion from './QuickCoursesAccordion';

interface NavTab {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  isIntelligence: boolean;
  badgeKey?: 'lectures' | 'silent' | 'newFeedback' | 'pendingEnrollments';
  color?: 'green' | 'red' | 'blue' | 'yellow';
}

interface NavDrawerProps {
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

export default function NavDrawer({
  activeTab,
  onTabChange,
  onSidebarClose,
  isMobile = false,
  expanded: controlledExpanded = true,
  onExpandChange,
}: NavDrawerProps) {
  const { badges, courses, refreshBadges, searchCourses, getAlertSummary } =
    useNavData();

  const [localExpanded, setLocalExpanded] = useState(controlledExpanded);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);

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

  const getBadgeVariant = (tab: NavTab): 'critical' | 'warning' | 'default' => {
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
      {/* === HEADER (SPACIOUS) === */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/30 flex-shrink-0 min-h-[56px] gap-3">
        {expanded && (
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white truncate">
              Navigation
            </h3>
            <p className="text-xs text-slate-400">v3.0 Mobile-First</p>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleExpandToggle}
          className="p-2.5 hover:bg-purple-600/30 rounded-lg transition text-slate-300 hover:text-purple-300 flex-shrink-0"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              expanded ? '' : 'rotate-90'
            }`}
          />
        </motion.button>
      </div>

      {/* === ALERT BANNER (INTERACTIVE) === */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition group ${
              isCritical
                ? 'bg-red-950/40 border-b border-red-500/30 hover:bg-red-950/60'
                : 'bg-green-950/40 border-b border-green-500/30 hover:bg-green-950/60'
            }`}
            onClick={() => {
              // Navigate to relevant section
              if (isCritical) {
                handleTabClick('analytics');
              }
            }}
          >
            <motion.div
              animate={{ scale: isCritical ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 2, repeat: isCritical ? Infinity : 0 }}
              className="flex-shrink-0 mt-0.5"
            >
              {isCritical ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Bell className="w-5 h-5 text-emerald-500" />
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-yellow-300 transition">
                {alertSummary}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isCritical
                  ? 'Tap to review silent students'
                  : 'All courses monitored'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === SEARCH BAR (WITH MIC & CLEAR) === */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 border-b border-slate-700/30 flex-shrink-0 min-h-[56px] flex items-center"
          >
            <div className="relative w-full flex items-center gap-2">
              <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 pl-10 pr-10 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-base text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
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

      {/* === MAIN NAVIGATION (SPACIOUS ITEMS) === */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <AnimatePresence>
          {NAV_TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const badgeCount = getBadgeCount(tab);
            const showBadge = badgeCount && badgeCount > 0;
            const badgeVariant = getBadgeVariant(tab);

            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <NavItem
                  isActive={isActive}
                  expanded={expanded}
                  onClick={() => handleTabClick(tab.id)}
                  title={expanded ? undefined : tab.label}
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    {/* Icon + Label */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Intelligence accent */}
                      {tab.isIntelligence && !isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500/60 rounded-r-lg"
                          layoutId="activeIndicator"
                        />
                      )}

                      {/* Icon with pulse */}
                      <div className="relative flex-shrink-0">
                        <Icon className="w-6 h-6" />
                        {showBadge && isActive && (
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-yellow-400"
                          />
                        )}
                      </div>

                      {/* Label & Description */}
                      {expanded && (
                        <div className="min-w-0 flex-1">
                          <div className="text-base font-semibold leading-tight">
                            {tab.label}
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {tab.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Badge */}
                    {expanded && showBadge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        <Badge
                          count={badgeCount}
                          variant={badgeVariant}
                          clickable
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleTabClick(tab.id);
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                </NavItem>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </nav>

      {/* === QUICK COURSES ACCORDION === */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-700/30 flex-shrink-0"
          >
            <QuickCoursesAccordion courses={filteredCourses} />
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
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold text-white">Quick Actions</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    showQuickActions ? 'rotate-90' : ''
                  }`}
                />
              </motion.button>
            </div>

            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <NavItem
                    expanded={true}
                    onClick={() => handleTabClick('lectures')}
                    className="gap-2"
                  >
                    <Plus className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">New Lecture</span>
                  </NavItem>
                  <NavItem
                    expanded={true}
                    onClick={() => handleTabClick('courses')}
                    className="gap-2"
                  >
                    <Plus className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">New Course</span>
                  </NavItem>
                  <NavItem
                    expanded={true}
                    onClick={() => handleTabClick('students')}
                    className="gap-2"
                  >
                    <Zap className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Bulk Enroll</span>
                  </NavItem>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === REFRESH BUTTON === */}
      <motion.div className="p-4 border-t border-slate-700/30 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={refreshBadges}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-sm font-medium text-purple-200 transition"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2 }}>
            <Zap className="w-4 h-4" />
          </motion.div>
          {expanded ? 'Refresh Data' : ''}
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
