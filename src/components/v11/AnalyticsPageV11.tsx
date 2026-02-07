/**
 * AnalyticsPageV11 - LIS v11.0
 * Production Analytics page with charts and insights
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  ChevronDown,
  Brain,
  Users,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  Activity,
  Target,
  Zap,
  X,
  Clock,
  MapPin,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { useAnalytics, type DateRange } from '../../hooks/useAnalytics';

interface AnalyticsPageV11Props {
  professorId?: string;
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}{entry.name.includes('%') || entry.name === 'Understanding' || entry.name === 'Engagement' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsPageV11({ professorId }: AnalyticsPageV11Props) {
  const {
    dateRange,
    setDateRange,
    selectedCourse,
    setSelectedCourse,
    courseHealth,
    dailyMetrics,
    feedbackCategories,
    topicDifficulty,
    hourlyActivity,
    summaryStats,
    radarData,
    courses,
  } = useAnalytics({ professorId });

  const [dateOpen, setDateOpen] = React.useState(false);
  const [courseOpen, setCourseOpen] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '10:00',
    location: 'Room 301',
    notes: ''
  });
  const [isScheduled, setIsScheduled] = useState(false);

  const dateRanges: { value: DateRange; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '14d', label: 'Last 14 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Learning Analytics</h1>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium flex items-center gap-1">
              <Brain className="w-4 h-4" />
              AI-Powered
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Priority: {summaryStats.priorityCourse} • Action: {summaryStats.priorityAction}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range */}
          <div className="relative">
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700"
              onClick={() => { setDateOpen(!dateOpen); setCourseOpen(false); }}
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{dateRanges.find(d => d.value === dateRange)?.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dateOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            {dateOpen && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {dateRanges.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => { setDateRange(d.value); setDateOpen(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-800 ${
                      dateRange === d.value ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Course Filter */}
          <div className="relative">
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700"
              onClick={() => { setCourseOpen(!courseOpen); setDateOpen(false); }}
              whileHover={{ scale: 1.02 }}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{selectedCourse === 'all' ? 'All Courses' : selectedCourse}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${courseOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            {courseOpen && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-56 py-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-20 max-h-64 overflow-y-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={() => { setSelectedCourse('all'); setCourseOpen(false); }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-800 ${
                    selectedCourse === 'all' ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
                  }`}
                >
                  All Courses
                </button>
                {courses.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setSelectedCourse(c.code); setCourseOpen(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-800 ${
                      selectedCourse === c.code ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-300'
                    }`}
                  >
                    {c.code} - {c.name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
            whileHover={{ scale: 1.02 }}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export PDF</span>
          </motion.button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: 'Avg Understanding', value: summaryStats.avgUnderstanding, suffix: '%', change: summaryStats.avgUnderstandingChange, color: 'blue' },
          { icon: MessageSquare, label: 'Total Feedback', value: summaryStats.totalFeedback, change: summaryStats.feedbackChange, color: 'purple' },
          { icon: AlertTriangle, label: 'Silent Students', value: summaryStats.silentStudents, change: summaryStats.silentChange, color: 'rose', invertTrend: true },
          { icon: Users, label: 'Active Students', value: summaryStats.activeStudents, change: summaryStats.activeChange, color: 'emerald' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className={`p-5 rounded-2xl border border-zinc-800 bg-${stat.color}-500/5`}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                (stat.invertTrend ? stat.change > 0 : stat.change < 0) ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {stat.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(stat.change)}{stat.suffix || ''}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}{stat.suffix || ''}</p>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Understanding & Engagement Trend */}
        <motion.div
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Understanding & Engagement Trend
              </h3>
              <p className="text-sm text-zinc-500">Daily metrics over time</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyMetrics}>
                <defs>
                  <linearGradient id="colorUnderstanding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="understanding" name="Understanding" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUnderstanding)" strokeWidth={2} />
                <Area type="monotone" dataKey="engagement" name="Engagement" stroke="#10b981" fillOpacity={1} fill="url(#colorEngagement)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Course Health Comparison */}
        <motion.div
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Course Health Comparison
              </h3>
              <p className="text-sm text-zinc-500">Understanding scores by course</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseHealth} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" stroke="#71717a" fontSize={12} domain={[0, 100]} />
                <YAxis dataKey="course_code" type="category" stroke="#71717a" fontSize={12} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="health_pct" name="Health %" radius={[0, 4, 4, 0]}>
                  {courseHealth.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.health_pct >= 85 ? '#10b981' : entry.health_pct >= 70 ? '#3b82f6' : entry.health_pct >= 60 ? '#f59e0b' : '#f43f5e'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Categories Pie */}
        <motion.div
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Feedback Categories
            </h3>
            <p className="text-sm text-zinc-500">Distribution of feedback types</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feedbackCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="count"
                  nameKey="category"
                  label={({ percentage }) => `${percentage}%`}
                  labelLine={false}
                >
                  {feedbackCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {feedbackCategories.slice(0, 4).map((cat) => (
              <div key={cat.category} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-zinc-400">{cat.category}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Topic Difficulty */}
        <motion.div
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Topic Difficulty Ranking
            </h3>
            <p className="text-sm text-zinc-500">Topics needing revision (by confusion rate)</p>
          </div>
          <div className="space-y-3">
            {topicDifficulty.slice(0, 6).map((topic, index) => (
              <div key={topic.topic} className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < 2 ? 'bg-rose-500/20 text-rose-400' : index < 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-700 text-zinc-400'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{topic.topic}</span>
                    <span className="text-xs text-zinc-500">{topic.course}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        topic.confusion_rate > 30 ? 'bg-rose-500' : topic.confusion_rate > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - topic.confusion_rate}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    topic.confusion_rate > 30 ? 'text-rose-400' : topic.confusion_rate > 20 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {topic.understanding}%
                  </p>
                  <p className="text-xs text-zinc-500">{topic.feedback_count} feedback</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <motion.div
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Hourly Activity Pattern
            </h3>
            <p className="text-sm text-zinc-500">Best times for engagement</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="hour" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="feedback" name="Feedback" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Course Radar */}
        <motion.div
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Course Comparison Radar
            </h3>
            <p className="text-sm text-zinc-500">Multi-dimensional analysis</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="metric" stroke="#71717a" fontSize={12} />
                <PolarRadiusAxis stroke="#71717a" fontSize={10} />
                <Radar name="CS201" dataKey="CS201" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="CS301" dataKey="CS301" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                <Radar name="CS101" dataKey="CS101" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* AI Recommendation Banner */}
      <motion.div
        className="p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">AI Recommendation</h3>
            <p className="text-zinc-400 mb-4">
              Based on the analytics, <span className="text-purple-400 font-medium">Graph Algorithms</span> in CS301 
              has a 42% confusion rate. Consider scheduling a revision session with more visual examples. 
              The best time for maximum engagement is <span className="text-blue-400 font-medium">10-11 AM</span>.
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                className={`px-4 py-2 rounded-xl text-sm font-medium ${isScheduled ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowScheduleModal(true)}
              >
                {isScheduled ? '✓ Revision Scheduled' : 'Schedule Revision'}
              </motion.button>
              <motion.button
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowDetailsModal(true)}
              >
                View Details
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Schedule Revision Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Schedule Revision Session</h3>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="p-1 hover:bg-zinc-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm text-purple-300">
                    <span className="font-medium">Topic:</span> Graph Algorithms (CS301)
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">Confusion Rate: 42% • 28 students affected</p>
                </div>
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400 block mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <select
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM ★</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                      </select>
                    </div>
                    <p className="text-xs text-green-400 mt-1">★ AI recommended time</p>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 block mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={scheduleForm.location}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-zinc-400 block mb-1">Notes (optional)</label>
                  <textarea
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    rows={2}
                    placeholder="Add session notes or focus areas..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-4 border-t border-zinc-700 bg-zinc-800/50">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={() => {
                    setIsScheduled(true);
                    setShowScheduleModal(false);
                  }}
                  disabled={!scheduleForm.date}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Schedule Session
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Insight Details</h3>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-zinc-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Topic Overview */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                  <h4 className="font-semibold text-white mb-2">Graph Algorithms - CS301</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-red-400">42%</p>
                      <p className="text-xs text-zinc-400">Confusion Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-400">28</p>
                      <p className="text-xs text-zinc-400">Students Affected</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">3</p>
                      <p className="text-xs text-zinc-400">Sessions Needed</p>
                    </div>
                  </div>
                </div>
                
                {/* Key Insights */}
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Key Insights
                  </h4>
                  <div className="space-y-2">
                    {[
                      { text: 'Dijkstra\'s algorithm has the highest confusion (58%)', type: 'warning' },
                      { text: 'Students struggle with time complexity analysis', type: 'info' },
                      { text: 'Visual examples improved understanding by 34%', type: 'success' },
                      { text: 'Best engagement time: 10-11 AM (based on 2 weeks data)', type: 'info' },
                    ].map((insight, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                          insight.type === 'warning' ? 'bg-amber-500/10 text-amber-300' :
                          insight.type === 'success' ? 'bg-green-500/10 text-green-300' :
                          'bg-blue-500/10 text-blue-300'
                        }`}
                      >
                        <span className="mt-0.5">•</span>
                        {insight.text}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Suggested Actions */}
                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    Suggested Actions
                  </h4>
                  <div className="space-y-2">
                    {[
                      'Schedule a revision session with visual examples',
                      'Create practice problems for Dijkstra\'s algorithm',
                      'Share supplementary video resources',
                      'Consider smaller group discussions',
                    ].map((action, i) => (
                      <div key={i} className="p-3 rounded-lg bg-zinc-800 text-sm text-zinc-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-4 border-t border-zinc-700 bg-zinc-800/50">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <motion.button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowScheduleModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Revision
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
