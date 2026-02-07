/**
 * DASHBOARD OVERVIEW v5.0 - Production-ready metrics panel
 * Features: Sparklines, live counters, AI insights, glassmorphism
 * Premium: Gradient cards, animated counters, trend indicators
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  MessageSquare,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Clock,
  Target,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useHaptics } from '../../hooks/useHaptics';
import { useRealtimeDash } from '../../hooks/useRealtimeDash';
import { useAINudge } from '../../hooks/useAINudge';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  sparklineData?: { day: string; value: number }[];
  onClick?: () => void;
  badge?: number;
  badgeColor?: string;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  trendValue,
  sparklineData,
  onClick,
  badge,
  badgeColor = 'bg-red-500',
}: MetricCardProps) {
  const { vibrate } = useHaptics();
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;

  // Animated counter
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-emerald-400'
      : trend === 'down'
      ? 'text-red-400'
      : 'text-white/40';

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        vibrate('light');
        onClick?.();
      }}
      className="relative w-full p-5 bg-[#1A1A2E]/60 backdrop-blur-xl border border-white/10 rounded-2xl text-left overflow-hidden group transition-all hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10"
    >
      {/* Gradient glow */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity`}
      />

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute top-3 right-3 w-6 h-6 ${badgeColor} rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse`}
        >
          {badge}
        </motion.div>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              {trendValue && <span className="text-xs font-medium">{trendValue}</span>}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-bold text-white">{displayValue}</span>
          {typeof value === 'string' && value.includes('%') && (
            <span className="text-xl font-bold text-white/60">%</span>
          )}
        </div>

        {/* Title & Subtitle */}
        <p className="text-sm font-medium text-white/80">{title}</p>
        {subtitle && (
          <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
        )}

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-3 h-12 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A2E',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill={`url(#gradient-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Hover arrow */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5 text-white/40" />
      </motion.div>
    </motion.button>
  );
}

interface InsightCardProps {
  insight: {
    id: string;
    type: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  };
  onAction?: () => void;
  onDismiss?: () => void;
}

function InsightCard({ insight, onAction, onDismiss }: InsightCardProps) {
  const { vibrate } = useHaptics();

  const priorityColors = {
    low: 'border-blue-500/30 bg-blue-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    high: 'border-orange-500/30 bg-orange-500/5',
    critical: 'border-red-500/30 bg-red-500/5 animate-pulse',
  };

  const priorityIcons = {
    low: Sparkles,
    medium: AlertCircle,
    high: AlertCircle,
    critical: AlertCircle,
  };

  const PriorityIcon = priorityIcons[insight.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`p-4 rounded-xl border ${priorityColors[insight.priority]} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            insight.priority === 'critical'
              ? 'bg-red-500/20'
              : insight.priority === 'high'
              ? 'bg-orange-500/20'
              : 'bg-purple-500/20'
          }`}
        >
          <PriorityIcon
            className={`w-4 h-4 ${
              insight.priority === 'critical'
                ? 'text-red-400'
                : insight.priority === 'high'
                ? 'text-orange-400'
                : 'text-purple-400'
            }`}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
          <p className="text-xs text-white/60 line-clamp-2">{insight.message}</p>
        </div>
      </div>

      {onAction && (
        <div className="mt-3 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              vibrate('medium');
              onAction();
            }}
            className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-semibold text-white transition"
          >
            Take Action
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              vibrate('light');
              onDismiss?.();
            }}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white/60 transition"
          >
            Dismiss
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

interface DashboardOverviewProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { badges, metrics, sparklines, isLoading, refresh } = useRealtimeDash();
  const { insights, dismissInsight, executeAction } = useAINudge();

  const metricCards: MetricCardProps[] = [
    {
      title: 'Total Students',
      value: metrics.totalStudents,
      subtitle: `${metrics.activeToday} active today`,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      trend: 'up',
      trendValue: '+12%',
      sparklineData: sparklines.attendance,
      onClick: () => onNavigate?.('students'),
    },
    {
      title: 'Avg Engagement',
      value: `${metrics.avgEngagement}`,
      subtitle: 'Across all courses',
      icon: Activity,
      gradient: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: '+5%',
      sparklineData: sparklines.engagement,
      onClick: () => onNavigate?.('insights'),
    },
    {
      title: 'Lectures This Week',
      value: metrics.lecturesThisWeek,
      subtitle: `${badges.lectures} active now`,
      icon: BookOpen,
      gradient: 'from-emerald-500 to-green-500',
      trend: 'stable',
      onClick: () => onNavigate?.('lectures'),
      badge: badges.lectures,
      badgeColor: 'bg-blue-500',
    },
    {
      title: 'Feedback Received',
      value: metrics.feedbackReceived,
      subtitle: `${badges.newFeedback} new today`,
      icon: MessageSquare,
      gradient: 'from-orange-500 to-red-500',
      trend: 'up',
      trendValue: '+23%',
      sparklineData: sparklines.feedback,
      onClick: () => onNavigate?.('insights'),
      badge: badges.newFeedback,
      badgeColor: 'bg-red-500',
    },
  ];

  const criticalInsights = insights.filter((i) => !i.read && i.priority !== 'low');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Professor</h1>
          <p className="text-white/50 text-sm mt-1">
            Here's what's happening with your courses today
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refresh}
          disabled={isLoading}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition"
        >
          <motion.div
            animate={isLoading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
          >
            <Activity className="w-5 h-5 text-white/60" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Silent Students Alert */}
      {badges.silent > 10 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 border border-red-500/30 rounded-2xl flex items-center gap-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center"
          >
            <AlertCircle className="w-6 h-6 text-red-400" />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-300">
              {badges.silent} Silent Students Need Attention
            </p>
            <p className="text-xs text-red-200/60">
              Students haven't participated in 3+ lectures. Send engagement nudges to bring them
              back.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded-xl text-sm font-semibold text-white transition shadow-lg shadow-red-500/30"
          >
            Send Nudge
          </motion.button>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* AI Insights Section */}
      {criticalInsights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">AI Insights</h2>
            <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs font-medium text-purple-300">
              {criticalInsights.length} new
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {criticalInsights.slice(0, 4).map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onAction={() => executeAction(insight)}
                  onDismiss={() => dismissInsight(insight.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-8 pt-4 border-t border-white/5"
      >
        <div className="flex items-center gap-2 text-white/40">
          <Clock className="w-4 h-4" />
          <span className="text-xs">Last updated just now</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <Target className="w-4 h-4" />
          <span className="text-xs">{metrics.aiInsightsGenerated} AI insights generated</span>
        </div>
      </motion.div>
    </div>
  );
}
