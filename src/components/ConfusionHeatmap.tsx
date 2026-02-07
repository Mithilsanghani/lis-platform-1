import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { X, TrendingDown } from 'lucide-react';

interface TopicData {
  topic: string;
  lecture: number;
  understanding: number;
  feedbackReasons?: {
    reason: string;
    count: number;
    percentage: number;
  }[];
}

interface ConfusionHeatmapProps {
  data?: TopicData[];
}

const getHeatColor = (value: number): string => {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 60) return 'bg-yellow-500';
  if (value >= 40) return 'bg-orange-500';
  return 'bg-red-600';
};

export default function ConfusionHeatmap({
  data = [
    { topic: 'Graphs', lecture: 1, understanding: 25, feedbackReasons: [{ reason: 'Pace too fast', count: 14, percentage: 65 }, { reason: 'Lacks examples', count: 5, percentage: 23 }, { reason: 'Unclear terminology', count: 3, percentage: 12 }] },
    { topic: 'Graphs', lecture: 2, understanding: 30, feedbackReasons: [{ reason: 'Complex examples', count: 12, percentage: 60 }, { reason: 'Need more practice', count: 6, percentage: 30 }, { reason: 'Missing context', count: 2, percentage: 10 }] },
    { topic: 'Trees', lecture: 1, understanding: 45, feedbackReasons: [{ reason: 'Basic understanding', count: 20, percentage: 100 }] },
    { topic: 'Trees', lecture: 2, understanding: 35, feedbackReasons: [{ reason: 'Rotations confusing', count: 15, percentage: 70 }, { reason: 'Too many rules', count: 5, percentage: 30 }] },
    { topic: 'Sorting', lecture: 1, understanding: 75, feedbackReasons: [{ reason: 'Clear', count: 35, percentage: 100 }] },
    { topic: 'DP', lecture: 1, understanding: 55, feedbackReasons: [{ reason: 'Abstractness high', count: 18, percentage: 75 }, { reason: 'Need real problems', count: 6, percentage: 25 }] },
  ],
}: ConfusionHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<TopicData | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const topics = [...new Set(data.map((d) => d.topic))];
  const lectures = Math.max(...data.map((d) => d.lecture));

  const getCellKey = (topic: string, lecture: number) => `${topic}-L${lecture}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-400" />
          Concept Understanding Heatmap
        </h3>
        <p className="text-sm text-slate-400 mt-1">Click cells to drill into feedback reasons</p>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto mb-6">
        <div className="min-w-max">
          {/* Header */}
          <div className="flex gap-1 mb-1">
            <div className="w-28" />
            {Array.from({ length: lectures }).map((_, i) => (
              <div key={i} className="w-16 text-center text-xs font-bold text-slate-300">
                L{i + 1}
              </div>
            ))}
          </div>

          {/* Topic Rows */}
          {topics.map((topic) => (
            <div key={topic} className="flex gap-1 mb-1">
              <div className="w-28 text-sm font-bold text-slate-200 flex items-center pr-2">{topic}</div>
              {Array.from({ length: lectures }).map((_, lectureIdx) => {
                const lectureNum = lectureIdx + 1;
                const cellKey = getCellKey(topic, lectureNum);
                const cellData = data.find((d) => d.topic === topic && d.lecture === lectureNum);
                const value = cellData?.understanding || 0;

                return (
                  <motion.button
                    key={cellKey}
                    onHoverStart={() => setHoveredCell(cellKey)}
                    onHoverEnd={() => setHoveredCell(null)}
                    onClick={() => cellData && setSelectedCell(cellData)}
                    whileHover={{ scale: 1.15 }}
                    className={`w-16 h-16 rounded-lg cursor-pointer flex items-center justify-center font-bold text-white transition ${getHeatColor(
                      value
                    )} ${hoveredCell === cellKey ? 'ring-2 ring-blue-400 shadow-lg' : ''}`}
                  >
                    <div className="text-center">
                      <div className="text-sm">{value}%</div>
                      <div className="text-xs opacity-70">
                        {value >= 80 ? '✓' : value >= 60 ? '~' : '✗'}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs flex-wrap">
        {[
          { label: '≥80% Clear', color: 'bg-emerald-500' },
          { label: '60-80% Partial', color: 'bg-yellow-500' },
          { label: '40-60% Confused', color: 'bg-orange-500' },
          { label: '<40% Critical', color: 'bg-red-600' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${item.color}`} />
            <span className="text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {selectedCell && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCell(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900 sticky top-0">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedCell.topic} - Lecture {selectedCell.lecture}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Current Understanding: <span className="font-bold text-red-400">{selectedCell.understanding}%</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Feedback Pie Chart */}
                {selectedCell.feedbackReasons && selectedCell.feedbackReasons.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Why Students Are Confused</h3>
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={selectedCell.feedbackReasons}
                              dataKey="count"
                              nameKey="reason"
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                            >
                              {selectedCell.feedbackReasons.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6'][index % 4]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 space-y-3">
                        {selectedCell.feedbackReasons.map((reason, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-3 bg-slate-800 rounded border border-slate-700"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium text-slate-200">{reason.reason}</p>
                              <span className="text-xs font-bold text-red-400">{reason.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${reason.percentage}%` }}
                                transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                              />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{reason.count} students</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Recommendation */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-slate-200">
                    <span className="font-bold text-blue-400">🧠 AI Recommendation:</span> {' '}
                    {selectedCell.understanding < 40
                      ? `${selectedCell.topic} needs immediate revision. Schedule extra session with 3+ worked examples and interactive problems.`
                      : `${selectedCell.topic} understanding improving. Continue with practical exercises and peer learning.`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                  >
                    Schedule Revision
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
                  >
                    Export Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
