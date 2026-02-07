/**
 * TopbarV8 - AI Personal Co-Pilot Topbar
 * Dynamic greeting, daily digest, smart notifications, AI chat
 * LIS Dashboard v8.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Command, Bell, Sparkles, ChevronDown, X,
  MessageSquare, Settings, User, LogOut,
  AlertTriangle, UserPlus, Mic, MicOff, Check, RefreshCw,
  ExternalLink, TrendingUp, BookOpen, Users, Zap,
} from 'lucide-react';
import { useDailyDigest } from '../../hooks/useDailyDigest';
import { useNotifications, notificationStyles, type Notification } from '../../hooks/useNotifications';

interface TopbarV8Props {
  professorName: string;
  professorEmail?: string;
  photoUrl?: string;
  userId?: string;
  onLogout: () => void;
  onSearch?: () => void;
  onAIChat?: () => void;
  onViewProfile?: () => void;
  onSettings?: () => void;
  onMyAnalytics?: () => void;
  onQuickActions?: () => void;
  sidebarCollapsed?: boolean;
}

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Notification icon component
const NotifIcon = ({ type }: { type: Notification['type'] }) => {
  const icons = {
    feedback: MessageSquare,
    alert: AlertTriangle,
    system: Settings,
    ai: Sparkles,
    enrollment: UserPlus,
  };
  const Icon = icons[type];
  const style = notificationStyles[type];
  return (
    <div className={`p-2 rounded-lg ${style.bg}`}>
      <Icon className={`w-4 h-4 ${style.color}`} />
    </div>
  );
};

export function TopbarV8({
  professorName,
  professorEmail,
  photoUrl,
  userId,
  onLogout,
  onSearch,
  onAIChat,
  onViewProfile,
  onSettings,
  onMyAnalytics,
  onQuickActions,
  sidebarCollapsed = false,
}: TopbarV8Props) {
  // Hooks
  const { digest, loading: digestLoading, refresh: refreshDigest } = useDailyDigest(userId);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId);

  // State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDigestModal, setShowDigestModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessage, setAIMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Refs for click outside
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearch?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearch]);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = professorName.split(' ').pop() || 'Professor';
  const initials = firstName.charAt(0).toUpperCase();

  // Priority badge color
  const priorityColors = {
    normal: 'bg-emerald-500/10 text-emerald-400',
    attention: 'bg-amber-500/10 text-amber-400',
    urgent: 'bg-rose-500/10 text-rose-400 animate-pulse',
  };

  return (
    <>
      <header className={`h-16 bg-gradient-to-r from-zinc-950/95 via-purple-950/10 to-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between px-6 sticky top-0 z-30 transition-all ${sidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
        {/* Left: Greeting + Digest */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="min-w-0">
            {/* Dynamic Greeting */}
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold text-white truncate">
                {getGreeting()}, <span className="text-blue-400">{firstName}</span>
              </h1>
            </div>

            {/* AI Digest Subtitle */}
            <motion.button
              onClick={() => setShowDigestModal(true)}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors group"
              whileHover={{ x: 2 }}
            >
              {digestLoading ? (
                <span className="animate-pulse">Loading your daily summary...</span>
              ) : (
                <>
                  <span className="truncate max-w-[300px] sm:max-w-[400px]">
                    {digest?.shortSummary || '24 courses • 45 students • Ready to go!'}
                  </span>
                  {digest?.priority && digest.priority !== 'normal' && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${priorityColors[digest.priority]}`}>
                      {digest.priority === 'urgent' ? '⚡ Urgent' : '👀 Attention'}
                    </span>
                  )}
                  <span className="text-zinc-600 group-hover:text-blue-400 transition-colors">→</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <motion.button
            onClick={onSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Search...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-500">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
              whileHover={{ scale: 1.05, rotate: 8 }}
              whileTap={{ scale: 0.95, rotate: -5 }}
            >
              <Bell className="w-5 h-5 text-zinc-400" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-rose-500 text-white ring-2 ring-zinc-950"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 6).map((notif) => (
                      <motion.div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`flex items-start gap-3 p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 cursor-pointer transition-colors ${!notif.read ? 'bg-zinc-800/30' : ''}`}
                        whileHover={{ x: 2 }}
                      >
                        <NotifIcon type={notif.type} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-white truncate">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-zinc-600 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
                    <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 py-1">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Chat Button */}
          <motion.button
            onClick={() => setShowAIChat(!showAIChat)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 hover:border-purple-500/50 relative group"
            whileHover={{ scale: 1.08, rotate: 12 }}
            whileTap={{ scale: 0.95, rotate: -8 }}
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-zinc-800 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              AI Assistant
            </span>
          </motion.button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
              whileHover={{ scale: 1.02 }}
            >
              {photoUrl ? (
                <img src={photoUrl} alt={firstName} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {initials}
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <>
                  {/* Backdrop for click outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {/* Profile Header */}
                    <div className="p-4 border-b border-zinc-800">
                      <div className="flex items-center gap-3">
                        {photoUrl ? (
                          <img src={photoUrl} alt={firstName} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {initials}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">{professorName}</p>
                          <p className="text-xs text-zinc-400 truncate">{professorEmail || 'professor@iit.ac.in'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions Button */}
                    {onQuickActions && (
                      <div className="px-3 py-2 border-b border-zinc-800">
                        <button
                          onClick={() => { onQuickActions(); setShowProfile(false); }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                        >
                          <Command className="w-4 h-4" />
                          <span className="text-sm font-medium">Quick Actions</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => { onViewProfile?.(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">View Profile</span>
                      </button>
                      <button
                        onClick={() => { onSettings?.(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={() => { onMyAnalytics?.(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">My Analytics</span>
                      </button>
                    </div>
                    
                    {/* Logout */}
                    <div className="py-2 border-t border-zinc-800">
                      <button
                        onClick={() => { onLogout(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Daily Digest Modal */}
      <AnimatePresence>
        {showDigestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDigestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Your Daily Digest</h2>
                      <p className="text-xs text-zinc-400">
                        Generated {digest?.generatedAt ? formatRelativeTime(digest.generatedAt) : 'now'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={refreshDigest} className="p-2 rounded-lg hover:bg-zinc-800">
                      <RefreshCw className="w-4 h-4 text-zinc-400" />
                    </button>
                    <button onClick={() => setShowDigestModal(false)} className="p-2 rounded-lg hover:bg-zinc-800">
                      <X className="w-5 h-5 text-zinc-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: BookOpen, label: 'Courses', value: digest?.metrics.totalCourses || 24, color: 'blue' },
                    { icon: Users, label: 'Active', value: digest?.metrics.activeStudents || 45, color: 'emerald' },
                    { icon: AlertTriangle, label: 'Alerts', value: digest?.metrics.silentAlerts || 3, color: 'rose' },
                  ].map((m) => (
                    <div key={m.label} className={`p-4 rounded-xl bg-${m.color}-500/10 border border-${m.color}-500/20 text-center`}>
                      <m.icon className={`w-5 h-5 mx-auto mb-2 text-${m.color}-400`} />
                      <p className="text-2xl font-bold text-white">{m.value}</p>
                      <p className="text-xs text-zinc-400">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}
                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {digest?.summary || 'Welcome back! Your dashboard is ready for another productive day.'}
                  </p>
                </div>

                {/* AI Suggestion */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">AI Suggestion</p>
                      <p className="text-sm text-zinc-400">
                        {digest?.aiSuggestion || 'Check AI Insights for personalized recommendations.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" /> View Full Report
                  </button>
                  <button onClick={() => { setShowDigestModal(false); onAIChat?.(); }} className="flex-1 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Ask AI
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Quick Chat */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed top-20 right-6 w-80 sm:w-96 bg-zinc-900 border border-purple-500/30 rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-white">AI Assistant</span>
              </div>
              <button onClick={() => setShowAIChat(false)} className="p-1 rounded hover:bg-zinc-800">
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 p-3 rounded-xl bg-zinc-800/50 text-sm text-zinc-300">
                Hi {firstName}! How can I help you today? Try:
                <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                  <li>• "Summarize today's feedback"</li>
                  <li>• "Suggest revision for CS201"</li>
                  <li>• "Draft nudge for silent students"</li>
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAIMessage(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm outline-none focus:border-purple-500/50"
                />
                <motion.button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2.5 rounded-xl ${isListening ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TopbarV8;
