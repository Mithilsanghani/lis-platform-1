/**
 * LIS Unified Dashboard Components
 * Same UI components - different data based on role
 * "One system, two roles, same components"
 */

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  MessageSquare,
  Flame,
  Target,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Brain,
  Lightbulb,
  Sparkles,
  Users,
  BarChart3,
} from 'lucide-react';
import type { UserRole, DashboardMetrics, PendingFeedbackItem, AIInsight } from '../lib/types';

// ==================== METRIC CARD ====================
// Used for: Weekly Progress, Active Courses, Feedback Submitted, Streak, Average Score

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { direction: 'up' | 'down' | 'stable'; value: number };
  color: 'purple' | 'blue' | 'green' | 'orange' | 'pink';
  onClick?: () => void;
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend, color, onClick }: MetricCardProps) {
  const colors = {
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
  };

  const iconBg = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-orange-500/20 text-orange-400',
    pink: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full p-5 rounded-2xl bg-gradient-to-br ${colors[color]} border
        text-left transition-all hover:scale-[1.02] active:scale-[0.98]
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${iconBg[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.direction === 'up' ? 'text-green-400' : 
            trend.direction === 'down' ? 'text-red-400' : 'text-zinc-400'
          }`}>
            {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : 
             trend.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
            {trend.value > 0 && `${trend.direction === 'up' ? '+' : '-'}${trend.value}%`}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-zinc-400 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
    </motion.button>
  );
}

// ==================== WELCOME CARD ====================
// Shows personalized greeting + pending actions

interface WelcomeCardProps {
  userName: string;
  role: UserRole;
  pendingCount: number;
  streak: number;
  onActionClick: () => void;
}

export function WelcomeCard({ userName, role, pendingCount, streak, onActionClick }: WelcomeCardProps) {
  const greeting = getTimeGreeting();
  const firstName = userName.split(' ')[0];
  
  const message = role === 'student'
    ? pendingCount > 0 
      ? `You have ${pendingCount} pending feedback${pendingCount > 1 ? 's' : ''}`
      : 'All caught up! Great job keeping your feedback current.'
    : pendingCount > 0
      ? `${pendingCount} topic${pendingCount > 1 ? 's' : ''} need${pendingCount === 1 ? 's' : ''} attention`
      : 'Class engagement is on track this week.';

  const actionText = role === 'student' 
    ? pendingCount > 0 ? 'Fill Now' : 'View History'
    : pendingCount > 0 ? 'Review Topics' : 'View Analytics';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/30"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{greeting}</p>
          <h2 className="text-2xl font-bold text-white mt-1">
            {role === 'professor' ? 'Dr. ' : ''}{firstName}
          </h2>
          <p className="text-zinc-300 mt-2 flex items-center gap-2">
            {pendingCount > 0 ? (
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
            {message}
          </p>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">{streak} day streak</span>
          </div>
        )}
      </div>

      {pendingCount > 0 && (
        <motion.button
          onClick={onActionClick}
          className="mt-4 px-5 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {actionText}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}

// ==================== PENDING FEEDBACK LIST ====================
// Student: Lectures to submit feedback | Professor: Topics needing revision

interface PendingFeedbackListProps {
  items: PendingFeedbackItem[];
  role: UserRole;
  onItemClick: (lectureId: string) => void;
}

export function PendingFeedbackList({ items, role, onItemClick }: PendingFeedbackListProps) {
  if (items.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="text-white font-medium">
          {role === 'student' ? 'All feedback submitted!' : 'No topics need attention'}
        </p>
        <p className="text-sm text-zinc-500 mt-1">
          {role === 'student' ? 'Great job staying on top of your feedback.' : 'Class understanding is on track.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          {role === 'student' ? 'Pending Feedback' : 'Needs Attention'}
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium">
          {items.length} pending
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.button
            key={item.lectureId}
            onClick={() => onItemClick(item.lectureId)}
            className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all text-left group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-purple-400">{item.courseCode}</span>
                  {item.isUrgent && (
                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-xs">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-white font-medium mt-1 truncate">{item.lectureTitle}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {item.topics.length} topic{item.topics.length > 1 ? 's' : ''} • {item.remainingTime} remaining
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-purple-400">
                  {role === 'student' ? 'Fill Now' : 'Review'}
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ==================== AI INSIGHTS PANEL ====================
// Same component, different insights based on role

interface AIInsightsPanelProps {
  insights: AIInsight[];
  role: UserRole;
}

export function AIInsightsPanel({ insights, role }: AIInsightsPanelProps) {
  const iconMap = {
    'learning-pattern': Lightbulb,
    'improvement': TrendingUp,
    'suggestion': Brain,
    'warning': AlertTriangle,
  };

  const colorMap = {
    'learning-pattern': 'text-blue-400 bg-blue-500/20',
    'improvement': 'text-green-400 bg-green-500/20',
    'suggestion': 'text-purple-400 bg-purple-500/20',
    'warning': 'text-orange-400 bg-orange-500/20',
  };

  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          {role === 'student' ? 'Learning Insights' : 'Class Insights'}
        </h3>
        <span className="text-xs text-zinc-500">Powered by analytics</span>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = iconMap[insight.type];
          const colors = colorMap[insight.type];
          
          return (
            <motion.div
              key={insight.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{insight.title}</p>
                    {insight.metric && (
                      <span className={`text-sm font-semibold ${
                        insight.metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {insight.metric.trend === 'up' ? '+' : '-'}{insight.metric.value}{insight.metric.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Transparency: Show how insights are derived */}
      <p className="text-xs text-zinc-600 mt-4 flex items-center gap-1">
        <Brain className="w-3 h-3" />
        Insights derived from your feedback patterns, no external AI
      </p>
    </div>
  );
}

// ==================== UNDERSTANDING BREAKDOWN ====================
// Donut chart showing understood/partial/not-clear distribution

interface UnderstandingBreakdownProps {
  data: { understood: number; partial: number; notClear: number };
  role: UserRole;
}

export function UnderstandingBreakdown({ data, role }: UnderstandingBreakdownProps) {
  // Total is available if needed: data.understood + data.partial + data.notClear
  
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        {role === 'student' ? 'My Understanding' : 'Class Understanding'}
      </h3>

      <div className="flex items-center gap-6">
        {/* Simple bar visualization */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-zinc-400">Understood</span>
              <span className="text-green-400 font-medium">{data.understood}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${data.understood}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-zinc-400">Partial</span>
              <span className="text-yellow-400 font-medium">{data.partial}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${data.partial}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-zinc-400">Not Clear</span>
              <span className="text-red-400 font-medium">{data.notClear}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${data.notClear}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== QUICK STATS ROW ====================
// Shows key metrics in a compact row

interface QuickStatsProps {
  metrics: DashboardMetrics;
  role: UserRole;
}

export function QuickStats({ metrics, role }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Weekly Progress"
        value={`${metrics.weeklyProgress.percentage}%`}
        subtitle={role === 'student' ? 'Your learning rate' : 'Class learning rate'}
        icon={Target}
        trend={{ direction: metrics.weeklyProgress.trend, value: metrics.weeklyProgress.trendValue }}
        color="purple"
      />
      <MetricCard
        title="Active Courses"
        value={metrics.activeCourses.count}
        subtitle={role === 'student' ? 'Enrolled this semester' : 'Teaching this semester'}
        icon={BookOpen}
        color="blue"
      />
      <MetricCard
        title={role === 'student' ? 'Feedback Given' : 'Feedback Received'}
        value={metrics.feedbackStats.thisSemester}
        subtitle={`${metrics.feedbackStats.thisWeek} this week`}
        icon={MessageSquare}
        trend={{ direction: 'up', value: 8 }}
        color="green"
      />
      <MetricCard
        title="Understanding"
        value={`${metrics.averageScore.percentage}%`}
        subtitle={role === 'student' ? 'Avg self-reported' : 'Class average'}
        icon={Brain}
        trend={{ direction: metrics.averageScore.trend, value: metrics.averageScore.trendValue }}
        color="orange"
      />
    </div>
  );
}

// ==================== HELPERS ====================

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}
