/**
 * StudentLayout - LIS Student Portal v1.0
 * Main layout with sidebar and topbar
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Home, path: '/student/overview' },
  { id: 'courses', label: 'Courses', icon: BookOpen, path: '/student/courses' },
  { id: 'feedback', label: 'My Feedback', icon: MessageSquare, path: '/student/feedback', badge: 2 },
  { id: 'performance', label: 'Performance', icon: BarChart3, path: '/student/performance' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/student/settings' },
];

export function StudentLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem('demo_role');
    await signOut();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Desktop Sidebar */}
      <motion.nav
        className="fixed left-0 top-0 h-screen z-40 bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-800/50 flex-col hidden md:flex"
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.2 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-zinc-800/50">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                L
              </div>
              <span className="font-semibold text-white">LIS Student</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white">
              L
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 z-50"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {/* Nav items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${sidebarCollapsed ? 'justify-center' : ''}
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }
                `}
              >
                {/* Active glow effect */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border border-purple-500/30"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-purple-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div className="py-4 border-t border-zinc-800/50 px-3">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.nav>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                  ${isActive ? 'text-purple-400' : 'text-zinc-500'}
                `}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-purple-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-zinc-500"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-zinc-900 border-l border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <main className={`transition-all duration-200 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-[260px]'} pb-20 md:pb-0`}>
        {/* Topbar */}
        <header className="h-[70px] bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-base md:text-lg font-semibold text-white">
                {getGreeting()}, <span className="text-purple-400">Sharma</span>
              </h1>
              <p className="text-xs md:text-sm text-zinc-500">
                3 lectures today • 2 pending feedbacks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Search - hidden on mobile */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-64 max-w-[600px] pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <Bell className="w-5 h-5 text-zinc-400" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                  R
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-400 hidden md:block" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-zinc-800">
                      <p className="font-medium text-white text-sm">Rahul Sharma</p>
                      <p className="text-xs text-zinc-500">21CS10045</p>
                    </div>
                    <NavLink
                      to="/student/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-zinc-800"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 w-full">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
