/**
 * LIS v2.0 - Professor Analytics Page
 * Detailed analytics, trends, and department comparisons
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useProfessorCourses, useTopicPerformance, useCourseAnalytics, useRevisionPlan } from '../../hooks/useProfessorData';
import { StatCard, RiskBadge } from '../../components/shared';
import {
  WeeklyTrendChart,
  TopicPerformanceChart,
  ReasonsChart,
  UNDERSTANDING_COLORS,
} from '../../components/shared/Charts';

export default function ProfessorAnalytics() {
  const [selectedCourseId, setSelectedCourseId] = useState('course_1');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'semester'>('month');

  const { courses } = useProfessorCourses();
  const { topics, problematicTopics, wellUnderstoodTopics } = useTopicPerformance(selectedCourseId);
  const { course, weeklyTrends, engagementRate } = useCourseAnalytics(selectedCourseId);
  const { plan, isGenerating, generatePlan } = useRevisionPlan(selectedCourseId);

  // Derive reasons from feedback data in the store
  const reasonsData = (() => {
    // When real feedback exists, aggregate reasons here.
    // For now, return empty so the UI shows "no data" instead of fake numbers.
    return [] as { reason: string; count: number; percentage: number }[];
  })();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Deep insights into course performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {/* Export logic */}}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Course Selector */}
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 min-w-[250px]"
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title}
            </option>
          ))}
        </select>

        {/* Date Range */}
        <div className="flex rounded-xl overflow-hidden border border-slate-700/50">
          {(['week', 'month', 'semester'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Course Health"
          value={`${course?.health_pct || 0}%`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          trend={(course?.health_pct || 0) >= 80 ? 'up' : 'down'}
          trendValue={`${(course?.health_pct || 0) >= 80 ? '+' : ''}5% vs last month`}
          color="emerald"
        />
        <StatCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          icon={<BarChart3 className="w-5 h-5 text-indigo-400" />}
          trend="up"
          trendValue="+8% this week"
          color="indigo"
        />
        <StatCard
          title="Topics Struggling"
          value={problematicTopics.length}
          subtitle="Below 60% clarity"
          icon={<TrendingDown className="w-5 h-5 text-red-400" />}
          color="red"
        />
        <StatCard
          title="Well Understood"
          value={wellUnderstoodTopics.length}
          subtitle="Above 80% clarity"
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
          color="cyan"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Understanding Trends</h2>
              <p className="text-sm text-slate-400">Weekly clarity & response rates</p>
            </div>
          </div>
          <WeeklyTrendChart data={weeklyTrends} showResponseRate height={280} />
        </div>

        {/* Reasons Breakdown */}
        <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Common Reasons</h2>
              <p className="text-sm text-slate-400">Why students need clarification</p>
            </div>
          </div>
          <ReasonsChart data={reasonsData} height={280} />
        </div>
      </div>

      {/* Topic Performance */}
      <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Topic Performance</h2>
            <p className="text-sm text-slate-400">Clarity ratings by topic (sorted lowest first)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <TopicPerformanceChart data={topics.map(t => ({ ...t, topic_name: t.topic }))} height={300} />

          {/* Topic List */}
          <div className="space-y-3">
            {topics.slice(0, 8).map((topic, index) => (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    topic.clarity_pct >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                    topic.clarity_pct >= 60 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{topic.topic}</p>
                    <p className="text-xs text-slate-500">{topic.total_count} mentions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${topic.clarity_pct}%`,
                          backgroundColor: topic.clarity_pct >= 80
                            ? UNDERSTANDING_COLORS.full
                            : topic.clarity_pct >= 60
                              ? UNDERSTANDING_COLORS.partial
                              : UNDERSTANDING_COLORS.unclear,
                        }}
                      />
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    topic.clarity_pct >= 80 ? 'text-emerald-400' :
                    topic.clarity_pct >= 60 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {topic.clarity_pct}%
                  </span>
                  <span className="text-xs text-slate-500">
                    {topic.trend === 'improving' ? '↑' : topic.trend === 'declining' ? '↓' : '→'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Revision Plan */}
      <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Revision Plan</h2>
            <p className="text-sm text-slate-400">Suggested topics to revisit based on feedback</p>
          </div>
          <button
            onClick={generatePlan}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Generate Plan
              </>
            )}
          </button>
        </div>

        {plan ? (
          <div className="space-y-4">
            {/* Plan Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 bg-slate-900/50">
                <p className="text-sm text-slate-400 mb-1">Topics to Revise</p>
                <p className="text-2xl font-bold text-white">{plan.recommended_topics.length}</p>
              </div>
              <div className="rounded-xl p-4 bg-slate-900/50">
                <p className="text-sm text-slate-400 mb-1">Students Affected</p>
                <p className="text-2xl font-bold text-white">{plan.affected_students_count}</p>
              </div>
              <div className="rounded-xl p-4 bg-slate-900/50">
                <p className="text-sm text-slate-400 mb-1">Priority</p>
                <RiskBadge level={plan.recommended_topics[0]?.priority || 'low'} />
              </div>
            </div>

            {/* Topic List */}
            <div className="space-y-3">
              {plan.recommended_topics.map((topic: { topic: string; confusion_score: number; priority: string; reasoning: string }, index: number) => (
                <div
                  key={topic.topic}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{topic.topic}</p>
                      <p className="text-sm text-slate-400">{topic.reasoning}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Confusion Score</p>
                      <p className={`text-lg font-bold ${
                        topic.confusion_score >= 50 ? 'text-red-400' :
                        topic.confusion_score >= 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {topic.confusion_score}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Schedule */}
            {plan.suggested_date && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-medium text-white">Suggested Revision Session</p>
                  <p className="text-sm text-slate-400">{plan.suggested_date}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Click "Generate Plan" to create an AI-powered revision schedule</p>
          </div>
        )}
      </div>
    </div>
  );
}
