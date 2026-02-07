import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';

interface ChartEngagementProps {
  engagement: number;
  studentBreakdown?: { fully: number; partial: number; unclear: number };
}

export default function ChartEngagement({ engagement = 82, studentBreakdown = { fully: 65, partial: 25, unclear: 10 } }: ChartEngagementProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const data = [
    { name: 'Fully Understood', value: studentBreakdown.fully, color: '#10b981' },
    { name: 'Partially Understood', value: studentBreakdown.partial, color: '#f59e0b' },
    { name: 'Need Clarity', value: studentBreakdown.unclear, color: '#ef4444' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 h-80"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Class Engagement</h3>
          <p className="text-sm text-slate-400">Student understanding distribution</p>
        </div>
        <motion.div
          animate={{ scale: hoveredSegment !== null ? 1.1 : 1 }}
          className="text-center"
        >
          <div className="text-4xl font-bold text-emerald-400">{engagement}%</div>
          <div className="text-xs text-slate-400">Overall Engagement</div>
        </motion.div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={(_, index) => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={hoveredSegment === null || hoveredSegment === index ? 1 : 0.3}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#f1f5f9' }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-4 justify-center">
        {data.map((item) => (
          <motion.div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-300">{item.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
