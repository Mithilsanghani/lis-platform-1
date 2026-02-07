/**
 * LIS v2.0 - Student Performance Page
 * Performance analytics and insights
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Brain,
  Sparkles,
  ChevronDown,
  BookOpen,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  Share2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { 
  useStudentPerformance, 
  useStudentCourses,
  type PerformanceSnapshot,
  type TopicPerformance as TopicPerformanceType,
  type AIInsight,
} from '../../hooks/useStudentData';

// Overall understanding gauge
function UnderstandingGauge({ percentage }: { percentage: number }) {
  const data = [{ value: percentage, fill: '#a855f7' }];

  const getColor = () => {
    if (percentage >= 80) return 'text-emerald-400';
    if (percentage >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getMessage = () => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good progress';
    return 'Needs attention';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
    >
      <h3 className="text-sm font-medium text-zinc-400 mb-4">Overall Understanding</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <RadialBarChart
            width={160}
            height={160}
            innerRadius={60}
            outerRadius={75}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background={{ fill: '#27272a' }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getColor()}`}>{percentage}%</span>
            <span className="text-xs text-zinc-500">{getMessage()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Weekly trend chart
function WeeklyTrendChart({ data }: { data: PerformanceSnapshot[] }) {
  // Transform data for the chart
  const chartData = data.map((d, i) => ({
    week: `Week ${i + 1}`,
    understanding: d.understanding_pct,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] col-span-2"
    >
      <h3 className="text-sm font-medium text-zinc-400 mb-4">Weekly Progress</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="week"
              tick={{ fill: '#71717a', fontSize: 12 }}
              axisLine={{ stroke: '#27272a' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#71717a', fontSize: 12 }}
              axisLine={{ stroke: '#27272a' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#fff', fontWeight: 600 }}
              itemStyle={{ color: '#a855f7' }}
              formatter={(value: number) => [`${value}%`, 'Understanding']}
            />
            <Line
              type="monotone"
              dataKey="understanding"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: '#a855f7', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#a855f7', strokeWidth: 2, stroke: '#fff', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Topic performance list
function TopicPerformanceList({
  topics,
}: {
  topics: TopicPerformanceType[];
}) {
  const getUnderstandingValue = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 90;
      case 'medium': return 65;
      case 'low': return 35;
    }
  };

  const getBarColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-rose-500';
    }
  };

  const getTrendIcon = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return <ArrowUp className="w-4 h-4 text-emerald-400" />;
      case 'low':
        return <ArrowDown className="w-4 h-4 text-rose-400" />;
      default:
        return <Minus className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400">Topic Performance</h3>
        <Target className="w-4 h-4 text-purple-400" />
      </div>
      <div className="space-y-3">
        {topics.slice(0, 5).map((topic, index) => {
          const value = getUnderstandingValue(topic.understanding);
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">{topic.topic}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{value}%</span>
                  {getTrendIcon(topic.understanding)}
                </div>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`h-full rounded-full ${getBarColor(topic.understanding)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// AI Insight card
function AIInsightCard({
  insight,
  index,
}: {
  insight: AIInsight;
  index: number;
}) {
  const typeMap = {
    warning: { type: 'weakness' as const },
    tip: { type: 'suggestion' as const },
    success: { type: 'strength' as const },
  };

  const mappedType = typeMap[insight.type].type;

  const config = {
    strength: {
      icon: TrendingUp,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    weakness: {
      icon: Target,
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      iconColor: 'text-rose-400',
    },
    suggestion: {
      icon: Lightbulb,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
  }[mappedType];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className={`p-4 rounded-xl ${config.bg} border ${config.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-black/20 ${config.iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">{insight.title}</h4>
          <p className="text-xs text-zinc-400 mt-1">{insight.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function StudentPerformance() {
  const { courses } = useStudentCourses('all');
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const { overallUnderstanding, weeklyTrend, topicPerformance, aiInsights } =
    useStudentPerformance(selectedCourse);

  const selectedCourseName = selectedCourse
    ? courses.find((c) => c.id === selectedCourse)?.title
    : 'All Courses';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Performance
          </h1>
          <p className="text-zinc-400 mt-1">Track your learning progress and get AI insights</p>
        </div>

        {/* Course selector */}
        <div className="relative">
          <button
            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-white">{selectedCourseName}</span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${courseDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {courseDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-64 py-2 rounded-xl bg-zinc-900 border border-zinc-700 shadow-xl z-20"
            >
              <button
                onClick={() => {
                  setSelectedCourse(undefined);
                  setCourseDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-zinc-300"
              >
                All Courses
              </button>
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course.id);
                    setCourseDropdownOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2 text-left text-sm hover:bg-white/5
                    ${selectedCourse === course.id ? 'text-purple-400' : 'text-zinc-300'}
                  `}
                >
                  {course.code} - {course.title}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UnderstandingGauge percentage={overallUnderstanding} />
        <WeeklyTrendChart data={weeklyTrend} />
      </div>

      {/* Topic performance + AI insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopicPerformanceList topics={topicPerformance} />

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-transparent border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-medium text-white">AI Insights</h3>
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <AIInsightCard key={index} insight={insight} index={index} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 transition-colors text-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white transition-colors text-sm font-medium">
          <Share2 className="w-4 h-4" />
          Share with Professor
        </button>
      </div>
    </div>
  );
}
