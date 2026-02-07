/**
 * DashboardHome v7.0 - Ultimate IIT Prof Command Center
 * Features: Live metrics, AI banners, sparklines, realtime updates
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  Presentation,
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';

// V7 Components
import { MetricCard } from './MetricCard';
import { AIBanner } from './AIBanner';
import { SmartSidebar } from './SmartSidebar';
import { ProTopbar } from './ProTopbar';
import { DashboardSkeleton } from './SkeletonLoader';

// Hooks
import { useLiveMetrics } from '../../hooks/useLiveMetrics';

interface DashboardHomeProps {
  professorName?: string;
  onLogout?: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  professorName = 'Dr. Sharma',
  onLogout,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(true);

  const { metrics, isLoading, lastUpdated, refresh } = useLiveMetrics();

  // Hide welcome after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Smart Sidebar */}
      <SmartSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={5}
        silentCount={metrics.silent}
        feedbackCount={metrics.feedback > 99 ? 99 : metrics.feedback}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
        }`}
      >
        {/* Pro Topbar */}
        <ProTopbar
          professorName={professorName}
          coursesCount={metrics.courses > 99 ? Math.floor(metrics.courses / 10) : metrics.courses}
          lecturesCount={metrics.lectures}
          studentsCount={metrics.students}
          onLogout={onLogout}
        />

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Banner */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="relative overflow-hidden rounded-2xl border border-blue-500/30 
                  bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-transparent p-6"
              >
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">AI-Powered Dashboard</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">
                      Welcome to LIS Dashboard <span className="text-blue-400">v7.0</span>
                    </h2>
                    <p className="text-zinc-400">
                      Your command center for intelligent lecture analytics and student engagement.
                    </p>
                  </div>
                  <motion.button
                    className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 font-medium
                      hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowWelcome(false)}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Metrics Grid */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Live Metrics
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Updated {lastUpdated.toLocaleTimeString()}
                    <button
                      onClick={refresh}
                      className="ml-2 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <MetricCard
                    icon={BookOpen}
                    title="Active Courses"
                    value={metrics.courses}
                    change={metrics.changes.courses}
                    trend={metrics.trends.courses}
                    color="blue"
                    aiInsight={metrics.aiInsights.courses}
                  />
                  <MetricCard
                    icon={TrendingUp}
                    title="Engagement Rate"
                    value={`${metrics.engagement}%`}
                    change={metrics.changes.engagement}
                    trend={metrics.trends.engagement}
                    color="emerald"
                    aiInsight={metrics.aiInsights.engagement}
                  />
                  <MetricCard
                    icon={Presentation}
                    title="Today's Lectures"
                    value={metrics.lectures}
                    change={metrics.changes.lectures}
                    trend={metrics.trends.lectures}
                    color="amber"
                    aiInsight={metrics.aiInsights.lectures}
                  />
                  <MetricCard
                    icon={Users}
                    title="Student Feedback"
                    value={metrics.students}
                    change={metrics.changes.students}
                    trend={metrics.trends.students}
                    color="purple"
                    aiInsight={metrics.aiInsights.students}
                  />
                </div>
              </section>

              {/* AI Banners Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Insights
                  </h3>
                </div>
                <div className="space-y-4">
                  <AIBanner
                    type="silent"
                    silentCount={metrics.silent}
                    silentStudents={metrics.silentStudents}
                    onNudgeAll={() => console.log('Nudging all silent students')}
                    onNudgeOne={(id) => console.log('Nudging student:', id)}
                  />
                  <AIBanner
                    type="tempo"
                    idealTempo={metrics.optimalTempo.ideal}
                    currentTempo={metrics.optimalTempo.current}
                    tempoSuggestion={metrics.optimalTempo.suggestion}
                  />
                  <AIBanner
                    type="revision"
                    revisionTopics={metrics.revisionTopics}
                  />
                </div>
              </section>

              {/* Quick Actions + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <section className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {[
                      { icon: Plus, label: 'Create New Course', color: 'blue' },
                      { icon: Presentation, label: 'Start Live Lecture', color: 'emerald' },
                      { icon: Users, label: 'View All Students', color: 'purple' },
                      { icon: TrendingUp, label: 'Generate Report', color: 'amber' },
                    ].map((action) => (
                      <motion.button
                        key={action.label}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl
                          bg-zinc-900/50 border border-zinc-800 hover:border-${action.color}-500/30
                          hover:bg-${action.color}-500/5 transition-all text-left`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`p-2 rounded-lg bg-${action.color}-500/20 text-${action.color}-400`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-white">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </section>

                {/* Recent Activity */}
                <section className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Recent Activity
                  </h3>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                    {[
                      { action: 'New feedback', course: 'CS201 - Data Structures', time: '2 min ago', type: 'feedback' },
                      { action: 'Lecture completed', course: 'CS101 - Intro to Programming', time: '1 hour ago', type: 'lecture' },
                      { action: 'Student enrolled', course: 'CS301 - Algorithms', time: '2 hours ago', type: 'enrollment' },
                      { action: 'AI alert', course: '5 silent students detected', time: '3 hours ago', type: 'alert' },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0
                          hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.type === 'feedback' ? 'bg-blue-500' :
                            item.type === 'lecture' ? 'bg-emerald-500' :
                            item.type === 'enrollment' ? 'bg-purple-500' :
                            'bg-rose-500'
                          }`} />
                          <div>
                            <p className="font-medium text-white">{item.action}</p>
                            <p className="text-sm text-zinc-500">{item.course}</p>
                          </div>
                        </div>
                        <span className="text-xs text-zinc-500">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Upcoming Lectures */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Upcoming Lectures
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { course: 'CS201', topic: 'Binary Trees', time: '10:00 AM', students: 45, status: 'ready' },
                    { course: 'CS301', topic: 'Dynamic Programming', time: '12:00 PM', students: 38, status: 'preparing' },
                    { course: 'CS101', topic: 'Variables & Types', time: '2:00 PM', students: 52, status: 'scheduled' },
                    { course: 'CS401', topic: 'System Design', time: '4:00 PM', students: 28, status: 'scheduled' },
                  ].map((lecture, index) => (
                    <motion.div
                      key={index}
                      className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50
                        hover:border-zinc-700 transition-all cursor-pointer group"
                      whileHover={{ y: -2, scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <Presentation className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          lecture.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
                          lecture.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-zinc-500/20 text-zinc-400'
                        }`}>
                          {lecture.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{lecture.course}</h4>
                      <p className="text-sm text-zinc-400 mb-3">{lecture.topic}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lecture.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {lecture.students} students
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;
