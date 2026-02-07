import { motion } from 'framer-motion';
import { useState } from 'react';

interface HeatmapCell {
  topic: string;
  lecture: string;
  understanding: number; // 0-100
}

interface TopicsHeatmapProps {
  data?: HeatmapCell[];
}

const getHeatColor = (value: number): string => {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 60) return 'bg-yellow-500';
  if (value >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

export default function TopicsHeatmap({
  data = [
    { topic: 'Arrays', lecture: 'L1', understanding: 85 },
    { topic: 'Arrays', lecture: 'L2', understanding: 78 },
    { topic: 'Arrays', lecture: 'L3', understanding: 82 },
    { topic: 'Linked Lists', lecture: 'L1', understanding: 65 },
    { topic: 'Linked Lists', lecture: 'L2', understanding: 55 },
    { topic: 'Linked Lists', lecture: 'L3', understanding: 62 },
    { topic: 'Trees', lecture: 'L1', understanding: 45 },
    { topic: 'Trees', lecture: 'L2', understanding: 35 },
    { topic: 'Trees', lecture: 'L3', understanding: 42 },
    { topic: 'Graphs', lecture: 'L1', understanding: 30 },
    { topic: 'Graphs', lecture: 'L2', understanding: 25 },
    { topic: 'Graphs', lecture: 'L3', understanding: 28 },
  ],
}: TopicsHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const topics = [...new Set(data.map((d) => d.topic))];
  const lectures = [...new Set(data.map((d) => d.lecture))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Concept Understanding Heatmap</h3>
        <p className="text-sm text-slate-400">Click cells to drill into subtopics</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header row */}
          <div className="flex gap-1 mb-1">
            <div className="w-32" />
            {lectures.map((lecture) => (
              <div key={lecture} className="w-20 text-center text-xs font-bold text-slate-300">
                {lecture}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {topics.map((topic) => (
            <div key={topic} className="flex gap-1 mb-1">
              <div className="w-32 text-sm font-medium text-slate-300 flex items-center">{topic}</div>
              {lectures.map((lecture) => {
                const cellKey = `${topic}-${lecture}`;
                const cellData = data.find((d) => d.topic === topic && d.lecture === lecture);
                const understanding = cellData?.understanding || 0;

                return (
                  <motion.div
                    key={cellKey}
                    onHoverStart={() => setHoveredCell(cellKey)}
                    onHoverEnd={() => setHoveredCell(null)}
                    whileHover={{ scale: 1.1 }}
                    className={`w-20 h-20 rounded cursor-pointer flex items-center justify-center font-bold text-white transition ${getHeatColor(
                      understanding
                    )} ${hoveredCell === cellKey ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <div className="text-center">
                      <div className="text-lg">{understanding}%</div>
                      <div className="text-xs opacity-70">
                        {understanding >= 80
                          ? '✓ Clear'
                          : understanding >= 60
                            ? '~ Partial'
                            : '✗ Needs help'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded" />
          <span className="text-slate-300">&gt;80% Clear</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span className="text-slate-300">60-80% Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded" />
          <span className="text-slate-300">40-60% Confused</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-slate-300">&lt;40% Critical</span>
        </div>
      </div>
    </motion.div>
  );
}
