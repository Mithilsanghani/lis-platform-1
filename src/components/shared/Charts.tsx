/**
 * LIS Shared Chart Components
 * Reusable chart components for both Professor and Student portals
 */

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import type { UnderstandingSummary } from '../../types/lis';

// ============================================
// COLOR PALETTE
// ============================================

export const UNDERSTANDING_COLORS = {
  full: '#22c55e',      // Green
  partial: '#f59e0b',   // Amber
  unclear: '#ef4444',   // Red
};

export const RISK_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

export const CHART_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
];

// ============================================
// UNDERSTANDING DONUT CHART
// ============================================

interface UnderstandingDonutProps {
  summary: UnderstandingSummary;
  size?: number;
  showLabels?: boolean;
}

export function UnderstandingDonut({
  summary,
  size = 200,
  showLabels = true,
}: UnderstandingDonutProps) {
  const data = [
    { name: 'Full Understanding', value: summary.full_pct, color: UNDERSTANDING_COLORS.full },
    { name: 'Partial', value: summary.partial_pct, color: UNDERSTANDING_COLORS.partial },
    { name: 'Need Clarity', value: summary.unclear_pct, color: UNDERSTANDING_COLORS.unclear },
  ].filter(d => d.value > 0);

  const total = summary.response_count;

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.3}
            outerRadius={size * 0.42}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute flex flex-col items-center justify-center" style={{ marginTop: -size/2 - 20 }}>
        <span className="text-2xl font-bold text-white">{summary.full_pct.toFixed(0)}%</span>
        <span className="text-xs text-slate-400">clarity</span>
      </div>

      {showLabels && (
        <div className="flex gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-400">
                {item.name} ({item.value.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-2">{total} responses</p>
    </div>
  );
}

// ============================================
// UNDERSTANDING BAR CHART
// ============================================

interface UnderstandingBarProps {
  summary: UnderstandingSummary;
  height?: number;
  showCounts?: boolean;
}

export function UnderstandingBar({
  summary,
  height = 40,
  showCounts = false,
}: UnderstandingBarProps) {
  const total = summary.full_pct + summary.partial_pct + summary.unclear_pct;

  return (
    <div className="w-full">
      <div
        className="w-full rounded-full overflow-hidden flex"
        style={{ height }}
      >
        {summary.full_pct > 0 && (
          <div
            className="h-full flex items-center justify-center text-xs font-medium text-white transition-all"
            style={{
              width: `${(summary.full_pct / total) * 100}%`,
              backgroundColor: UNDERSTANDING_COLORS.full,
            }}
          >
            {summary.full_pct >= 15 && `${summary.full_pct.toFixed(0)}%`}
          </div>
        )}
        {summary.partial_pct > 0 && (
          <div
            className="h-full flex items-center justify-center text-xs font-medium text-white transition-all"
            style={{
              width: `${(summary.partial_pct / total) * 100}%`,
              backgroundColor: UNDERSTANDING_COLORS.partial,
            }}
          >
            {summary.partial_pct >= 15 && `${summary.partial_pct.toFixed(0)}%`}
          </div>
        )}
        {summary.unclear_pct > 0 && (
          <div
            className="h-full flex items-center justify-center text-xs font-medium text-white transition-all"
            style={{
              width: `${(summary.unclear_pct / total) * 100}%`,
              backgroundColor: UNDERSTANDING_COLORS.unclear,
            }}
          >
            {summary.unclear_pct >= 15 && `${summary.unclear_pct.toFixed(0)}%`}
          </div>
        )}
      </div>

      {showCounts && (
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: UNDERSTANDING_COLORS.full }} />
            {summary.full_count} clear
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: UNDERSTANDING_COLORS.partial }} />
            {summary.partial_count} partial
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: UNDERSTANDING_COLORS.unclear }} />
            {summary.unclear_count} unclear
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// WEEKLY TREND LINE CHART
// ============================================

interface TrendDataPoint {
  week: string;
  understanding: number;
  responseRate?: number;
}

interface WeeklyTrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  showResponseRate?: boolean;
}

export function WeeklyTrendChart({
  data,
  height = 250,
  showResponseRate = false,
}: WeeklyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="week"
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Line
          type="monotone"
          dataKey="understanding"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4, fill: '#22c55e' }}
          name="Understanding %"
        />
        {showResponseRate && (
          <Line
            type="monotone"
            dataKey="responseRate"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4, fill: '#6366f1' }}
            name="Response Rate %"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// TOPIC PERFORMANCE BAR CHART
// ============================================

interface TopicData {
  topic?: string;
  topic_name?: string;
  clarity_pct: number;
  mention_count?: number;
  total_count?: number;
}

interface TopicPerformanceChartProps {
  data: TopicData[];
  height?: number;
  maxBars?: number;
}

export function TopicPerformanceChart({
  data,
  height = 300,
  maxBars = 8,
}: TopicPerformanceChartProps) {
  const sortedData = [...data]
    .sort((a, b) => a.clarity_pct - b.clarity_pct)
    .slice(0, maxBars)
    .map(d => {
      const topicName = d.topic || d.topic_name || 'Unknown';
      return {
        ...d,
        name: topicName.length > 15 ? topicName.slice(0, 15) + '...' : topicName,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sortedData} layout="vertical" margin={{ left: 80, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          width={75}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`${value.toFixed(0)}%`, 'Clarity']}
        />
        <Bar
          dataKey="clarity_pct"
          radius={[0, 4, 4, 0]}
          fill="#6366f1"
        >
          {sortedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.clarity_pct >= 80
                  ? UNDERSTANDING_COLORS.full
                  : entry.clarity_pct >= 60
                    ? UNDERSTANDING_COLORS.partial
                    : UNDERSTANDING_COLORS.unclear
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================
// REASONS BREAKDOWN CHART
// ============================================

interface ReasonData {
  reason: string;
  count: number;
  percentage: number;
}

interface ReasonsChartProps {
  data: ReasonData[];
  height?: number;
}

export function ReasonsChart({ data, height = 250 }: ReasonsChartProps) {
  const reasonsData = data;
  const chartData = data.map((d, i) => ({
    ...d,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="reason"
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="#64748b"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [
            `${value} (${Math.round((value / reasonsData.reduce((acc, d) => acc + d.count, 0)) * 100)}%)`,
            'Count',
          ]}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================
// HEALTH GAUGE CHART
// ============================================

interface HealthGaugeProps {
  value: number;
  size?: number;
  label?: string;
}

export function HealthGauge({ value, size = 120, label }: HealthGaugeProps) {
  const data = [{ name: 'Health', value, fill: value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444' }];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={size} height={size}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background={{ fill: '#1e293b' }}
            dataKey="value"
            cornerRadius={5}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center -mt-8">
        <span className="text-2xl font-bold text-white">{value}%</span>
        {label && <p className="text-xs text-slate-400 mt-1">{label}</p>}
      </div>
    </div>
  );
}

// ============================================
// MINI SPARKLINE
// ============================================

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({
  data,
  color = '#6366f1',
  width = 100,
  height = 30,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// COMPARISON BAR
// ============================================

interface ComparisonBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export function ComparisonBar({
  label,
  value,
  maxValue = 100,
  color = '#6366f1',
}: ComparisonBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm font-medium text-white">{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
