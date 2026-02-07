/**
 * ProTopbar v7.0 - Command Center Topbar
 * Features: Welcome summary, global search, avatar menu, realtime status
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Command,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface ProTopbarProps {
  professorName: string;
  coursesCount: number;
  lecturesCount: number;
  studentsCount: number;
  isOnline?: boolean;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

export const ProTopbar: React.FC<ProTopbarProps> = ({
  professorName,
  coursesCount,
  lecturesCount,
  studentsCount,
  isOnline = true,
  onSearch,
  onLogout,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close avatar menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = () => professorName.split(' ')[0];

  return (
    <>
      <header className="h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 
        flex items-center justify-between px-6 sticky top-0 z-30">
        
        {/* Left: Welcome Summary */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {getGreeting()}, <span className="text-blue-400">{getFirstName()}</span>
            </h1>
            <p className="text-sm text-zinc-500">
              {coursesCount} courses • {lecturesCount} lectures today • {studentsCount} active students
            </p>
          </div>
          
          {/* Realtime Status */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs 
            ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'Live' : 'Offline'}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <motion.button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-zinc-900 border border-zinc-800 hover:border-zinc-700
              text-zinc-400 hover:text-white transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-xs">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 
              hover:border-zinc-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-zinc-400" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 
              ring-2 ring-zinc-950" />
          </motion.button>

          {/* AI Assistant */}
          <motion.button
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 
              border border-blue-500/30 hover:border-blue-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
          </motion.button>

          {/* Avatar Menu */}
          <div className="relative" ref={avatarMenuRef}>
            <motion.button
              onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl
                bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600
                flex items-center justify-center text-white font-semibold text-sm">
                {getFirstName().charAt(0)}
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform 
                ${isAvatarMenuOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {isAvatarMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 p-2
                    bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl"
                >
                  {/* User Info */}
                  <div className="px-3 py-2 mb-2 border-b border-zinc-800">
                    <p className="font-medium text-white">{professorName}</p>
                    <p className="text-sm text-zinc-500">Professor</p>
                  </div>

                  {/* Menu Items */}
                  <MenuItem icon={User} label="Profile" />
                  <MenuItem icon={Settings} label="Settings" />
                  <MenuItem 
                    icon={isDarkMode ? Sun : Moon} 
                    label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                  />
                  <MenuItem icon={HelpCircle} label="Help & Support" />
                  
                  <div className="my-2 border-t border-zinc-800" />
                  
                  <MenuItem 
                    icon={LogOut} 
                    label="Logout" 
                    danger
                    onClick={onLogout}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              className="w-full max-w-xl mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl 
                shadow-2xl overflow-hidden"
              initial={{ y: -20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                <Search className="w-5 h-5 text-zinc-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search courses, students, analytics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <p className="text-xs font-medium text-zinc-500 mb-3">QUICK ACTIONS</p>
                <div className="space-y-1">
                  {['Create new course', 'Start live lecture', 'View analytics', 'AI Insights'].map((action) => (
                    <button
                      key={action}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-zinc-300 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{action}</span>
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
};

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      ${danger 
        ? 'text-rose-400 hover:bg-rose-500/10' 
        : 'text-zinc-300 hover:bg-zinc-800'
      }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm">{label}</span>
  </button>
);

export default ProTopbar;
