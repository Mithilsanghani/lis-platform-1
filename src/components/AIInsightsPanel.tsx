import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Lightbulb,
  Send,
  Copy,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';

interface AIInsight {
  id: string;
  title: string;
  problem: string;
  why: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  affectedStudents: number;
  topic?: string;
}

interface AIInsightsPanelProps {
  insights?: AIInsight[];
  isLoading?: boolean;
  onGenerateInsights?: () => void;
  onSendToStudents?: (insightId: string) => void;
}

const priorityColors = {
  high: 'bg-red-500/10 border-red-500/30 text-red-400',
  medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  low: 'bg-green-500/10 border-green-500/30 text-green-400',
};

const priorityBgAccent = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export default function AIInsightsPanel({
  insights = [
    {
      id: '1',
      title: 'Graphs Concept Breakdown',
      problem: '18 students showing critical confusion on Graph Traversal',
      why: 'Pace increased 40% while providing only 2 examples vs 5 in previous topics. Students lack mental model.',
      action: 'Add 3 visual examples (BFS/DFS/Dijkstra walkthrough) + 1 interactive problem in next class. Record video for async learners.',
      priority: 'high',
      affectedStudents: 18,
      topic: 'Graphs',
    },
    {
      id: '2',
      title: 'Dynamic Programming Struggles',
      problem: '12 students partially understanding DP fundamentals',
      why: 'Abstract concept without real-world context. Jumping to recursion tree without building intuition.',
      action: 'Use 2 business scenarios (knapsack in inventory, longest subsequence in DNA). Code along with students.',
      priority: 'high',
      affectedStudents: 12,
      topic: 'DP',
    },
    {
      id: '3',
      title: 'Trees Mastery Track',
      problem: 'AVL rotations causing confusion in 8 students',
      why: 'Visual diagrams flat; students struggle with 3D mental model of left/right rotations.',
      action: 'Use animation tool to show rotation step-by-step. 1:1 session with 4 students showing confusion trend.',
      priority: 'medium',
      affectedStudents: 8,
      topic: 'Trees',
    },
  ],
  isLoading = false,
  onGenerateInsights = () => {},
  onSendToStudents = () => {},
}: AIInsightsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
          >
            <Lightbulb className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Intelligence Panel</h3>
            <p className="text-xs text-slate-400">Real-time learning insights & actions</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGenerateInsights}
          disabled={isLoading}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
        >
          {isLoading ? 'Generating...' : 'Regenerate'}
        </motion.button>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-lg border p-4 overflow-hidden ${priorityColors[insight.priority]}`}
          >
            {/* Compact View */}
            <motion.button
              onClick={() =>
                setExpandedId(expandedId === insight.id ? null : insight.id)
              }
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left Side */}
                <div className="flex-1">
                  {/* Priority Badge & Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={insight.priority === 'high' ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${priorityBgAccent[insight.priority]}`}
                    />
                    <h4 className="font-bold text-slate-100">{insight.title}</h4>
                    {insight.topic && (
                      <span className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-300">
                        {insight.topic}
                      </span>
                    )}
                  </div>

                  {/* Problem Summary */}
                  <p className="text-sm line-clamp-2">{insight.problem}</p>

                  {/* Affected Students */}
                  <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
                    <AlertCircle className="w-3 h-3" />
                    <span>{insight.affectedStudents} students affected</span>
                  </div>
                </div>

                {/* Chevron & Actions */}
                <motion.div
                  animate={{ rotate: expandedId === insight.id ? 180 : 0 }}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.button>

            {/* Expanded View */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: expandedId === insight.id ? 'auto' : 0,
                opacity: expandedId === insight.id ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 mt-4 pt-4 border-t border-current border-opacity-20">
                {/* Why */}
                <div>
                  <p className="text-xs font-bold mb-1 opacity-75">WHY:</p>
                  <p className="text-sm leading-relaxed">{insight.why}</p>
                </div>

                {/* Action */}
                <div>
                  <p className="text-xs font-bold mb-1 opacity-75">ACTION PLAN:</p>
                  <p className="text-sm leading-relaxed">{insight.action}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSendToStudents(insight.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded font-medium text-sm transition"
                  >
                    <Send className="w-4 h-4" />
                    Send to Students
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleCopy(`${insight.problem}\n${insight.why}\n${insight.action}`, insight.id)
                    }
                    className="flex items-center gap-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded font-medium text-sm transition"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedId === insight.id ? 'Copied!' : 'Copy'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-slate-700/50 rounded transition"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
        {[
          {
            label: 'High Priority',
            value: insights.filter((i) => i.priority === 'high').length,
            color: 'text-red-400',
          },
          {
            label: 'Students Affected',
            value: insights.reduce((sum, i) => sum + i.affectedStudents, 0),
            color: 'text-yellow-400',
          },
          {
            label: 'Topics Covered',
            value: new Set(insights.map((i) => i.topic)).size,
            color: 'text-green-400',
          },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
