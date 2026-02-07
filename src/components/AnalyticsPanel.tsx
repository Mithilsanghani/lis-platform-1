import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, TrendingUp, Download, Share2 } from 'lucide-react';
import { AIInsights } from '../lib/aiAnalysis';

interface AnalyticsPanelProps {
  insights: AIInsights;
  courseName: string;
  onExport?: (format: string) => void;
  isLoading?: boolean;
}

export default function AnalyticsPanel({ insights, courseName, onExport, isLoading = false }: AnalyticsPanelProps) {
  // const [autoRefresh, setAutoRefresh] = useState(true);

  // Prepare chart data
  const confusionData = insights.top_confusing_topics.slice(0, 5).map((topic: any) => ({
    name: topic.topic,
    confusion: topic.confusion,
    priority: topic.priority,
  }));

  const sentimentData = [
    { name: 'Fully Understood', value: insights.sentiment_breakdown.positive, fill: '#10b981' },
    { name: 'Partially', value: insights.sentiment_breakdown.neutral, fill: '#f59e0b' },
    { name: 'Need Clarity', value: insights.sentiment_breakdown.negative, fill: '#ef4444' },
  ].filter((item) => item.value > 0);

  const clarityTrendData = [
    { week: 'Week 1', clarity: Math.max(50, insights.course_overview.avg_clarity_score - 15) },
    { week: 'Week 2', clarity: Math.max(55, insights.course_overview.avg_clarity_score - 10) },
    { week: 'Week 3', clarity: Math.max(60, insights.course_overview.avg_clarity_score - 5) },
    { week: 'Week 4', clarity: insights.course_overview.avg_clarity_score },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🧠 AI Analysis Dashboard</h1>
            <p className="text-blue-100">{courseName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{insights.course_overview.avg_clarity_score}%</p>
            <p className="text-sm text-blue-100">Avg Clarity</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Lectures', value: insights.course_overview.total_lectures, icon: '📚' },
          { label: 'Feedback Count', value: insights.course_overview.total_feedback, icon: '💬' },
          { label: 'Improvement', value: insights.course_overview.improvement_trend, icon: '📈' },
          { label: 'Status', value: insights.course_overview.avg_clarity_score > 80 ? 'Excellent' : insights.course_overview.avg_clarity_score > 60 ? 'Good' : 'Needs Work', icon: '⭐' },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
          >
            <p className="text-2xl mb-1">{metric.icon}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confusion Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">🔴 Topic Confusion Matrix</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confusionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="confusion" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sentiment Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Sentiment</h2>
          {sentimentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-12">No data yet</p>
          )}
        </motion.div>
      </div>

      {/* Clarity Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">📈 Clarity Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={clarityTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="clarity" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Revision Plan */}
      {insights.revision_plan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-50 rounded-lg border border-amber-200 p-6"
        >
          <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            📋 Recommended Revision Plan
          </h2>
          <div className="space-y-3">
            {insights.revision_plan.map((plan: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white rounded-lg p-4 border border-amber-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{plan.action}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      ⏱️ {plan.duration} • 📅 {plan.when}
                    </p>
                    {plan.method && (
                      <p className="text-sm text-gray-700 mt-2">📝 {plan.method}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                    High Priority
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Silent Students Alert */}
      {insights.silent_students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-rose-50 rounded-lg border border-rose-200 p-6"
        >
          <h2 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            🤐 Students Needing Attention
          </h2>
          <div className="space-y-2">
            {insights.silent_students.map((student: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="bg-white rounded-lg p-3 border border-rose-300 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
                <span className="text-sm font-bold text-rose-600">{student.feedback_count} feedbacks</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Teaching Insights */}
      {insights.teaching_insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-indigo-50 rounded-lg border border-indigo-200 p-6"
        >
          <h2 className="text-lg font-bold text-indigo-900 mb-4">💡 Teaching Insights</h2>
          <ul className="space-y-2">
            {insights.teaching_insights.map((insight: string, idx: number) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="flex items-start gap-3 text-indigo-900"
              >
                <span className="text-lg">✨</span>
                <span>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Export Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onExport?.('pdf')}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? <span className="inline-block animate-spin">⏳</span> : <Download className="w-4 h-4" />}
          Download PDF
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onExport?.('png')}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50"
        >
          {isLoading ? <span className="inline-block animate-spin">⏳</span> : <Download className="w-4 h-4" />}
          Export Charts
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onExport?.('share')}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
        >
          <Share2 className="w-4 h-4" />
          Share Analytics
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
