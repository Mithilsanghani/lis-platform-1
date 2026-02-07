import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SilentStudentTrendProps {
  data?: Array<{ day: string; count: number }>;
}

export default function SilentStudentTrend({
  data = [
    { day: 'Mon', count: 8 },
    { day: 'Tue', count: 10 },
    { day: 'Wed', count: 12 },
    { day: 'Thu', count: 11 },
    { day: 'Fri', count: 12 },
    { day: 'Sat', count: 14 },
    { day: 'Sun', count: 12 },
  ],
}: SilentStudentTrendProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Silent Students Trend</h3>
        <p className="text-sm text-slate-400">7-day monitoring (Last updated: Today)</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', r: 5 }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded">
        <p className="text-xs text-slate-300">
          <span className="font-bold text-purple-300">Trend:</span> 12 students consistently show partial understanding. Consider intervention.
        </p>
      </div>
    </motion.div>
  );
}
