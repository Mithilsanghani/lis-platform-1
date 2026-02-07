/**
 * SmartSidebar v7.0 - Navigation with Realtime Counts + Badges
 * Features: Live badge counts, red dots, animated notifications
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Presentation,
  MessageSquare,
  Zap,
} from 'lucide-react';

interface NavItemData {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  isNew?: boolean;
  isActive?: boolean;
}

interface SmartSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
  silentCount?: number;
  feedbackCount?: number;
}

export const SmartSidebar: React.FC<SmartSidebarProps> = ({
  isCollapsed,
  onToggle,
  activeTab,
  onTabChange,
  unreadCount = 0,
  silentCount = 0,
  feedbackCount = 0,
}) => {
  const mainNavItems: NavItemData[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'courses', icon: BookOpen, label: 'Courses' },
    { id: 'lectures', icon: Presentation, label: 'Lectures', badge: 3 },
    { id: 'students', icon: Users, label: 'Students', badge: silentCount > 0 ? silentCount : undefined },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback', badge: feedbackCount },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', isNew: true },
    { id: 'ai-insights', icon: Zap, label: 'AI Insights', isNew: true },
  ];

  const bottomNavItems: NavItemData[] = [
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
  ];

  return (
    <motion.nav
      className={`
        fixed left-0 top-0 h-screen z-40
        bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/50
        flex flex-col
        transition-all duration-300 ease-out
      `}
      animate={{ width: isCollapsed ? 72 : 260 }}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/50">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 
                flex items-center justify-center font-bold text-white">
                L
              </div>
              <span className="font-semibold text-white">LIS Platform</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 
            flex items-center justify-center font-bold text-white mx-auto">
            L
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700
          flex items-center justify-center hover:bg-zinc-700 transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {/* Main Navigation */}
      <div className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="px-3 space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              isCollapsed={isCollapsed}
              onClick={() => onTabChange(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="py-4 border-t border-zinc-800/50">
        <div className="px-3 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              isCollapsed={isCollapsed}
              onClick={() => onTabChange(item.id)}
            />
          ))}
          
          {/* Logout */}
          <button
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10
              transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

interface NavItemProps {
  item: NavItemData;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, isCollapsed, onClick }) => {
  const Icon = item.icon;

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white border border-blue-500/30' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
      whileHover={{ x: isCollapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-500"
        />
      )}

      <div className="relative">
        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
        
        {/* Badge/Count */}
        {item.badge !== undefined && item.badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`
              absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
              flex items-center justify-center
              text-[10px] font-bold rounded-full
              ${item.id === 'students' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}
            `}
          >
            {item.badge > 99 ? '99+' : item.badge}
          </motion.span>
        )}

        {/* New Badge */}
        {item.isNew && !item.badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"
          />
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-sm font-medium flex-1 text-left"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* New Label */}
      {!isCollapsed && item.isNew && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400">
          NEW
        </span>
      )}
    </motion.button>
  );
};

export default SmartSidebar;
