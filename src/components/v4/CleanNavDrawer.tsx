/**
 * CLEAN NAV DRAWER v4.0 - MINIMAL, SPACIOUS, PROFESSIONAL
 * 
 * Core Design Principles:
 * - SPACIOUS: Luxury breathing room (64px items, 16px gaps)
 * - HIERARCHY: 3 levels max (header > sections > items)
 * - MINIMAL: Only critical info, zero clutter
 * - PREMIUM: Subtle gradients, perfect alignment, 60fps
 * 
 * Mobile-first (340px drawer), expands to 320px on mobile
 * No crammed text, no redundant labels, scan at glance
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  BookOpen,
  Clock,
  Users,
  Zap,
  ChevronDown,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { useNavData } from '../../hooks/useNavData';
import NavHeader from './NavHeader';
import CritAlert from './CritAlert';
import NavSection from './NavSection';
import QuickCoursesMini from './QuickCoursesMini';
import FAB from './FAB';

interface CleanNavDrawerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSidebarClose?: () => void;
  isMobile?: boolean;
  onCriticalAction?: (action: string) => void;
}

export default function CleanNavDrawer({
  activeTab,
  onTabChange,
  onSidebarClose,
  isMobile = false,
  onCriticalAction,
}: CleanNavDrawerProps) {
  const { badges, courses } = useNavData();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourses, setExpandedCourses] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const handleCriticalTap = () => {
    if (onCriticalAction) {
      onCriticalAction('send-nudge-sms');
    }
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      onSidebarClose?.();
    }
  };

  const drawerContent = (
    <motion.div
      initial={{ x: isMobile ? -340 : 0 }}
      animate={{ x: 0 }}
      exit={{ x: -340 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full h-full flex flex-col bg-gradient-to-b from-[#0F0F23] to-[#1A1A2E]"
    >
      {/* HEADER: Fixed 80px */}
      <NavHeader onMenuClick={() => setDrawerOpen(!drawerOpen)} isMobile={isMobile} />

      {/* CRITICAL ALERT: Conditional 64px */}
      <AnimatePresence>
        {badges.silent > 10 && (
          <CritAlert
            count={badges.silent}
            onTap={handleCriticalTap}
            isLoading={false}
          />
        )}
      </AnimatePresence>

      {/* SEARCH BAR: Always visible 56px */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3 space-y-2"
      >
        <div className="relative flex items-center bg-[#1A1A2E] rounded-lg px-3 py-3 border border-[#2A2A40]">
          <Search className="w-5 h-5 text-[#7C3AED] mr-2" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#6B7280] outline-none"
          />
        </div>
      </motion.div>

      {/* MAIN CONTENT: Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 mt-4 pb-20">
        {/* OVERVIEW SECTION */}
        <NavSection
          icon={LayoutGrid}
          label="Overview"
          isActive={activeTab === 'overview'}
          onClick={() => handleTabChange('overview')}
        />

        {/* QUICK COURSES SECTION */}
        <motion.div
          layout
          className="space-y-2"
        >
          <button
            onClick={() => setExpandedCourses(!expandedCourses)}
            className={`w-full px-4 py-4 rounded-lg flex items-center justify-between transition-all ${
              activeTab === 'courses'
                ? 'bg-[#7C3AED] text-white'
                : 'hover:bg-[#2A2A40] text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-semibold truncate">Courses</span>
              {courses.length > 0 && (
                <span className="text-xs bg-[#5B21B6]/50 px-2 py-1 rounded-full">
                  {courses.length}
                </span>
              )}
            </div>
            <motion.div
              animate={{ rotate: expandedCourses ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          {/* EXPANDED COURSES LIST */}
          <AnimatePresence>
            {expandedCourses && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 pl-2"
              >
                <QuickCoursesMini courses={courses} onCourseClick={handleTabChange} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* LECTURES SECTION */}
        <NavSection
          icon={Clock}
          label="Lectures"
          badge={badges.lectures}
          badgeColor="blue"
          isActive={activeTab === 'lectures'}
          onClick={() => handleTabChange('lectures')}
        />

        {/* STUDENTS SECTION */}
        <NavSection
          icon={Users}
          label="Enrollment"
          badge={badges.pendingEnrollments}
          badgeColor={badges.pendingEnrollments > 0 ? 'orange' : 'gray'}
          isActive={activeTab === 'students'}
          onClick={() => handleTabChange('students')}
        />

        {/* INSIGHTS SECTION */}
        <NavSection
          icon={Zap}
          label="AI Insights"
          badge={badges.newFeedback}
          badgeColor={badges.newFeedback > 5 ? 'red' : 'purple'}
          isActive={activeTab === 'insights'}
          onClick={() => handleTabChange('insights')}
        />
      </div>

      {/* FOOTER FAB: Floating Action Button 56px */}
      <FAB onAction={handleTabChange} />
    </motion.div>
  );

  // Mobile drawer with overlay
  if (isMobile) {
    return (
      <>
        {/* Menu toggle button (mobile) */}
        <motion.button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#7C3AED] rounded-lg text-white"
        >
          {drawerOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </motion.button>

        {/* Overlay */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              initial={{ x: -340 }}
              animate={{ x: 0 }}
              exit={{ x: -340 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-full w-[340px] z-40 shadow-2xl"
            >
              {drawerContent}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden lg:flex w-[280px] h-screen sticky top-0 border-r border-[#2A2A40]">
      {drawerContent}
    </div>
  );
}
