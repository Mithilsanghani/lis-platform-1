/**
 * LIS v3.0 - Student Overview Dashboard
 * Glassmorphism dark theme with comprehensive widgets
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  MessageSquare,
  TrendingUp,
  Clock,
  Flame,
  AlertCircle,
  ChevronRight,
  Calendar,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';

// ================== Card Components ==================

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'none';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  gradient = 'none',
}) => {
  const gradientClasses = {
    purple: 'bg-gradient-to-br from-purple-600/10 to-purple-900/5',
    blue: 'bg-gradient-to-br from-blue-600/10 to-blue-900/5',
    green: 'bg-gradient-to-br from-green-600/10 to-green-900/5',
    orange: 'bg-gradient-to-br from-orange-600/10 to-orange-900/5',
    pink: 'bg-gradient-to-br from-pink-600/10 to-pink-900/5',
    none: 'bg-white/5',
  };

  return (
    <div
      className={`
        rounded-2xl border border-white/10 backdrop-blur-xl
        ${gradientClasses[gradient]} ${className}
      `}
    >
      {children}
    </div>
  );
};

// ================== Stat Card ==================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'none';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient = 'none',
}) => (
  <GlassCard gradient={gradient} className="p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-zinc-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend.isUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{trend.value}% from last week</span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-xl bg-white/5">
        {icon}
      </div>
    </div>
  </GlassCard>
);

// ================== Progress Ring ==================

const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({
  progress,
  size = 100,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(139, 92, 246, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#overviewGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="overviewGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{progress}%</span>
        <span className="text-xs text-zinc-500">Complete</span>
      </div>
    </div>
  );
};

// ================== Mock Data ==================

const mockPendingFeedback = [
  {
    id: '1',
    lecture: 'Graph Algorithms',
    course: 'CS301',
    dueIn: '2 hours',
    isUrgent: true,
  },
  {
    id: '2',
    lecture: 'Sorting Techniques',
    course: 'CS301',
    dueIn: '1 day',
    isUrgent: false,
  },
];

const mockWeakTopics = [
  { id: '1', topic: 'Dynamic Programming', score: 42, course: 'CS301' },
  { id: '2', topic: 'Tree Traversals', score: 55, course: 'CS301' },
  { id: '3', topic: 'Hash Tables', score: 61, course: 'CS201' },
];

const mockUpcomingLectures = [
  { id: '1', title: 'Network Flow', course: 'CS301', time: 'Today, 2:00 PM' },
  { id: '2', title: 'Dijkstra\'s Algorithm', course: 'CS301', time: 'Tomorrow, 10:00 AM' },
  { id: '3', title: 'B-Trees', course: 'CS201', time: 'Tomorrow, 2:00 PM' },
];

const mockAIInsights = [
  'You learn better in afternoon sessions - schedule study time accordingly',
  'Your understanding of trees improved 23% this week',
  'Focus on Dynamic Programming before next exam',
];

// ================== Main Component ==================

export const StudentOverviewV3: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <GlassCard gradient="purple" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, Alex! 👋</h2>
              <p className="text-zinc-400 mt-1">
                You have <span className="text-purple-400 font-medium">2 pending feedbacks</span> to complete
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-zinc-400">Weekly Progress</p>
                <p className="text-lg font-bold text-white">78%</p>
              </div>
              <ProgressRing progress={78} size={80} strokeWidth={6} />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value={3}
          subtitle="2 with pending work"
          icon={<BookOpen size={20} className="text-purple-400" />}
          gradient="purple"
        />
        <StatCard
          title="Feedback Submitted"
          value={12}
          subtitle="This semester"
          icon={<MessageSquare size={20} className="text-blue-400" />}
          trend={{ value: 15, isUp: true }}
          gradient="blue"
        />
        <StatCard
          title="Streak"
          value="🔥 12 days"
          subtitle="Keep it going!"
          icon={<Flame size={20} className="text-orange-400" />}
          gradient="orange"
        />
        <StatCard
          title="Average Score"
          value="82%"
          subtitle="Understanding level"
          icon={<TrendingUp size={20} className="text-green-400" />}
          trend={{ value: 8, isUp: true }}
          gradient="green"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Feedback */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertCircle size={18} className="text-red-400" />
                Pending Feedback
              </h3>
              <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {mockPendingFeedback.map((item) => (
                <div
                  key={item.id}
                  className={`
                    p-4 rounded-xl border transition-colors cursor-pointer
                    ${item.isUrgent 
                      ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{item.lecture}</h4>
                      <p className="text-sm text-zinc-500">{item.course}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex items-center gap-1 text-sm
                        ${item.isUrgent ? 'text-red-400' : 'text-zinc-400'}
                      `}>
                        <Clock size={14} />
                        {item.dueIn}
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                        Fill Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={itemVariants}>
          <GlassCard gradient="pink" className="p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-pink-400" />
              <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {mockAIInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <p className="text-sm text-zinc-300">{insight}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400 text-sm hover:bg-pink-500/30 transition-colors flex items-center justify-center gap-2">
              <Zap size={14} />
              Get More Tips
            </button>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target size={18} className="text-orange-400" />
                Focus Areas
              </h3>
              <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Study Tips <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {mockWeakTopics.map((topic) => (
                <div key={topic.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{topic.topic}</span>
                      <span className="text-xs text-zinc-500">{topic.course}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          topic.score < 50 ? 'bg-red-500' : topic.score < 70 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${topic.score}%` }}
                      />
                    </div>
                  </div>
                  <span className={`
                    text-sm font-medium min-w-[40px] text-right
                    ${topic.score < 50 ? 'text-red-400' : topic.score < 70 ? 'text-orange-400' : 'text-green-400'}
                  `}>
                    {topic.score}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Upcoming Lectures */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar size={18} className="text-blue-400" />
                Upcoming Lectures
              </h3>
              <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Full Schedule <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {mockUpcomingLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div>
                    <h4 className="text-sm font-medium text-white">{lecture.title}</h4>
                    <p className="text-xs text-zinc-500">{lecture.course}</p>
                  </div>
                  <span className="text-xs text-zinc-400">{lecture.time}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentOverviewV3;
