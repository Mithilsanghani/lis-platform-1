/**
 * MetricCard v7.0 - Premium Metric Card with Sparkline + AI Insights
 * Features: Sparkline, % change, AI tooltip, modal drill-down
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus, Sparkles, X } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface TrendData {
  day: string;
  value: number;
}

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  change: string;
  trend: TrendData[];
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';
  aiInsight: string;
  onDrillDown?: () => void;
}

const colorMap = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    icon: 'text-blue-400 bg-blue-500/15',
    chart: '#3b82f6',
    glow: 'shadow-blue-500/20',
  },
  emerald: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    icon: 'text-emerald-400 bg-emerald-500/15',
    chart: '#10b981',
    glow: 'shadow-emerald-500/20',
  },
  amber: {
    bg: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    icon: 'text-amber-400 bg-amber-500/15',
    chart: '#f59e0b',
    glow: 'shadow-amber-500/20',
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    icon: 'text-purple-400 bg-purple-500/15',
    chart: '#a855f7',
    glow: 'shadow-purple-500/20',
  },
  rose: {
    bg: 'from-rose-500/10 to-rose-600/5',
    border: 'border-rose-500/20 hover:border-rose-500/40',
    icon: 'text-rose-400 bg-rose-500/15',
    chart: '#f43f5e',
    glow: 'shadow-rose-500/20',
  },
  cyan: {
    bg: 'from-cyan-500/10 to-cyan-600/5',
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    icon: 'text-cyan-400 bg-cyan-500/15',
    chart: '#06b6d4',
    glow: 'shadow-cyan-500/20',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  title,
  value,
  change,
  trend,
  color,
  aiInsight,
  onDrillDown,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const colors = colorMap[color];

  const isPositive = change.startsWith('+');
  const isNegative = change.startsWith('-');

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const trendColor = isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-zinc-400';

  return (
    <>
      <motion.div
        className={`
          relative p-5 rounded-2xl border backdrop-blur-xl
          bg-gradient-to-br ${colors.bg} ${colors.border}
          cursor-pointer overflow-hidden group
          transition-all duration-300 hover:shadow-lg ${colors.glow}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onDrillDown}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${colors.icon.split(' ')[1]}`} />
        </div>

        {/* Header Row */}
        <div className="relative flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
          
          {/* AI Insight Button */}
          <motion.button
            className={`p-2 rounded-lg ${colors.icon} opacity-0 group-hover:opacity-100 transition-opacity`}
            onClick={(e) => {
              e.stopPropagation();
              setShowAI(true);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="AI Insights"
          >
            <Sparkles className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Value + Label */}
        <div className="relative mb-3">
          <h3 className="text-sm text-zinc-400 mb-1">{title}</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              {change}
            </span>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className={`h-12 transition-all duration-300 ${isHovered ? 'h-20' : 'h-12'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.chart} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={colors.chart} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-xs">
                        <span className="text-zinc-300">{payload[0].payload.day}: </span>
                        <span className="text-white font-bold">{payload[0].value}</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.chart}
                strokeWidth={2}
                fill={`url(#gradient-${color})`}
                dot={false}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hover Insight Preview */}
        <AnimatePresence>
          {isHovered && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-xs text-zinc-400 mt-2 line-clamp-2"
            >
              {aiInsight}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Insight Modal */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAI(false)}
          >
            <motion.div
              className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-zinc-900/95 border border-zinc-700 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                onClick={() => setShowAI(false)}
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${colors.icon}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Insight</h3>
                  <p className="text-sm text-zinc-400">{title}</p>
                </div>
              </div>

              {/* Insight Content */}
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <p className="text-sm text-zinc-300 leading-relaxed">{aiInsight}</p>
              </div>

              {/* Recommendations */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-zinc-300">Recommendations</h4>
                <div className="space-y-2">
                  {[
                    'Review underperforming sections',
                    'Schedule follow-up sessions',
                    'Enable adaptive feedback',
                  ].map((rec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.icon.split(' ')[0].replace('text', 'bg')}`} />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MetricCard;
