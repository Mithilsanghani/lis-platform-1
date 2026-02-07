/**
 * LIS v2.0 - Student Overview Page
 * Dashboard with greeting, today's lectures, AI tip, quick actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  MessageSquare,
  TrendingUp,
  Flame,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Calendar,
  Zap,
} from 'lucide-react';
import { useStudentOverview } from '../../hooks/useStudentData';

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  delay?: number;
}) {
  const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
    blue: { bg: 'bg-blue-500/20', icon: 'text-blue-400', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/20', icon: 'text-purple-400', text: 'text-purple-400' },
    emerald: { bg: 'bg-emerald-500/20', icon: 'text-emerald-400', text: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500/20', icon: 'text-amber-400', text: 'text-amber-400' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-all"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs text-zinc-500 mb-1">{label}</p>
        <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
        {subtext && <p className="text-xs text-zinc-500 mt-1">{subtext}</p>}
      </div>
    </motion.div>
  );
}

// Lecture timeline item
function LectureItem({
  lecture,
  index,
}: {
  lecture: {
    id: string;
    course_code: string;
    course_title: string;
    topic: string;
    time: string;
    status: string;
    feedback_submitted: boolean;
  };
  index: number;
}) {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    if (lecture.status === 'completed' && !lecture.feedback_submitted) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          Feedback pending
        </span>
      );
    }
    if (lecture.status === 'completed' && lecture.feedback_submitted) {
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
        <Clock className="w-3 h-3" />
        Upcoming
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all"
    >
      {/* Time */}
      <div className="w-20 flex-shrink-0">
        <p className="text-sm font-medium text-white">{lecture.time}</p>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-zinc-800" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-purple-400 font-medium mb-1">{lecture.course_code}</p>
        <p className="text-sm font-medium text-white truncate">{lecture.topic}</p>
        <p className="text-xs text-zinc-500 mt-1">{lecture.course_title}</p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        {getStatusBadge()}
        {lecture.status === 'completed' && !lecture.feedback_submitted && (
          <motion.button
            onClick={() => navigate('/student/feedback')}
            className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white text-xs font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Fill now
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export function StudentOverview() {
  const { stats, todayLectures, aiTip } = useStudentOverview();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-transparent p-6"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Good afternoon, {stats.name} 👋
          </h1>
          <p className="text-zinc-400">Here's your learning snapshot for today</p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={BookOpen}
          label="Lectures Today"
          value={stats.lecturesTotal}
          subtext="1 completed"
          color="blue"
          delay={0.1}
        />
        <StatCard
          icon={MessageSquare}
          label="Pending Feedback"
          value={stats.pendingFeedback}
          subtext="Fill to help professors"
          color="purple"
          delay={0.15}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Understanding"
          value={`${stats.avgUnderstanding}%`}
          subtext="This week"
          color="emerald"
          delay={0.2}
        />
        <StatCard
          icon={Flame}
          label="Learning Streak"
          value={`${stats.streakDays} days`}
          subtext="Keep it up! 🔥"
          color="amber"
          delay={0.25}
        />
      </div>

      {/* Today's lectures */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Today's Lectures
          </h2>
          <span className="text-sm text-zinc-500">{todayLectures.length} scheduled</span>
        </div>
        <div className="space-y-3">
          {todayLectures.map((lecture, index) => (
            <LectureItem key={lecture.id} lecture={lecture} index={index} />
          ))}
        </div>
      </section>

      {/* AI Study Tip */}
      {aiTip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-purple-500/20 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                AI Study Tip
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                  Personalized
                </span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {aiTip.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.button
            onClick={() => navigate('/student/feedback')}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Fill pending feedback</p>
                <p className="text-xs text-zinc-500">2 forms waiting</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.button>

          <motion.button
            onClick={() => document.getElementById('lectures-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-left"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">View today's schedule</p>
                <p className="text-xs text-zinc-500">3 lectures remaining</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.button>

          <motion.button
            onClick={() => navigate('/student/performance')}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-left"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Review weak topics</p>
                <p className="text-xs text-zinc-500">2 topics need attention</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
