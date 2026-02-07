/**
 * TOPBAR v5.0 - Premium gradient header with avatar menu
 * Linear.app clean + IIT academic professional
 * Features: Gradient bg, logo glow, avatar dropdown, notifications
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

interface TopbarProps {
  onMenuClick?: () => void;
  onLogout?: () => void;
  onQuickActionTrigger?: () => void;
  userName?: string;
  userEmail?: string;
  notificationCount?: number;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export default function Topbar({
  onMenuClick,
  onLogout,
  onQuickActionTrigger,
  userName = 'Prof. Sharma',
  userEmail = 'sharma@iitgn.ac.in',
  notificationCount = 3,
  isDark = true,
  onThemeToggle,
}: TopbarProps) {
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { vibrate } = useHaptics();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    vibrate('light');
    setAvatarMenuOpen(!avatarMenuOpen);
  };

  const handleMenuAction = (action: string) => {
    vibrate('medium');
    setAvatarMenuOpen(false);
    if (action === 'logout' && onLogout) {
      onLogout();
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 h-16 px-4 lg:px-6"
    >
      {/* Gradient Background with Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#0F0F23] backdrop-blur-xl border-b border-white/5" />
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 pointer-events-none" />

      <div className="relative h-full flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              vibrate('light');
              onMenuClick?.();
            }}
            className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <Menu className="w-5 h-5 text-white" />
          </motion.button>

          {/* Logo with Glow */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/50 blur-xl rounded-full" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                LIS
              </h1>
              <p className="text-[10px] text-purple-300/70 font-medium -mt-1">
                IIT Gandhinagar
              </p>
            </div>
          </motion.div>
        </div>

        {/* Center: Search (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              vibrate('light');
              onQuickActionTrigger?.();
            }}
            className="w-full relative"
          >
            <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/40 text-left hover:bg-white/[0.07] hover:border-white/20 transition">
              Search courses, students...
            </div>
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-medium text-white/40 bg-white/5 rounded border border-white/10">
              ⌘K
            </kbd>
          </motion.button>
        </div>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              vibrate('light');
              onThemeToggle?.();
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-400" />
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => vibrate('light')}
            className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <Bell className="w-4 h-4 text-white/70" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/50"
              >
                {notificationCount}
              </motion.span>
            )}
          </motion.button>

          {/* Avatar Menu */}
          <div ref={menuRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAvatarClick}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-white/90">
                {userName.split(' ')[0]}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/50 transition-transform ${
                  avatarMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {avatarMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-[#1A1A2E]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-white/10">
                    <p className="font-semibold text-white">{userName}</p>
                    <p className="text-sm text-white/50">{userEmail}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => handleMenuAction('profile')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-left"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white/80">Profile</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction('settings')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-left"
                    >
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white/80">Settings</span>
                    </button>
                    <div className="my-2 border-t border-white/10" />
                    <button
                      onClick={() => handleMenuAction('logout')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition text-left group"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-400">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
