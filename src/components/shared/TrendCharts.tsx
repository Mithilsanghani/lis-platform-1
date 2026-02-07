/**
 * LIS v2.0 - Trend Charts
 * Line and area charts for understanding trends
 */

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TrendDataPoint {
  label: string;
  value: number;
  date?: string;
}

interface TrendLineChartProps {
  data: TrendDataPoint[];
  height?: number;
  showGrid?: boolean;
  showDots?: boolean;
  color?: string;
  threshold?: number;
  className?: string;
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  height = 200,
  showGrid = true,
  showDots = true,
  color = '#6366f1', // indigo-500
  threshold,
  className = '',
}) => {
  if (data.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center text-gray-400 ${className}`}
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          )}
          <XAxis 
            dataKey="label" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ payload, label }) => {
              if (!payload || payload.length === 0) return null;
              return (
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-indigo-600">
                    Understanding: {payload[0].value}%
                  </p>
                </div>
              );
            }}
          />
          {threshold && (
            <ReferenceLine 
              y={threshold} 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              label={{ value: `${threshold}% threshold`, position: 'right', fill: '#ef4444', fontSize: 10 }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={showDots ? { fill: color, strokeWidth: 2, r: 4 } : false}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ================== Area Chart ==================

interface TrendAreaChartProps {
  data: TrendDataPoint[];
  height?: number;
  color?: string;
  gradient?: boolean;
  className?: string;
}

export const TrendAreaChart: React.FC<TrendAreaChartProps> = ({
  data,
  height = 200,
  color = '#6366f1',
  gradient = true,
  className = '',
}) => {
  if (data.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center text-gray-400 ${className}`}
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="label" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ payload, label }) => {
              if (!payload || payload.length === 0) return null;
              return (
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm text-indigo-600">{payload[0].value}%</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={gradient ? `url(#${gradientId})` : color}
            fillOpacity={gradient ? 1 : 0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ================== Sparkline ==================

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showChange?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 30,
  color,
  showChange = false,
}) => {
  if (data.length === 0) return null;

  // Determine color based on trend
  const trend = data.length > 1 ? data[data.length - 1] - data[0] : 0;
  const lineColor = color || (trend >= 0 ? '#22c55e' : '#ef4444');

  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div className="flex items-center gap-2">
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {showChange && data.length > 1 && (
        <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{Math.round(trend)}%
        </span>
      )}
    </div>
  );
};

// ================== Multi-Line Comparison ==================

interface ComparisonDataPoint {
  label: string;
  [key: string]: string | number;
}

interface ComparisonChartProps {
  data: ComparisonDataPoint[];
  lines: Array<{ key: string; name: string; color: string }>;
  height?: number;
  className?: string;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  lines,
  height = 250,
  className = '',
}) => {
  if (data.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center text-gray-400 ${className}`}
        style={{ height }}
      >
        No comparison data
      </div>
    );
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="label" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ payload, label }) => {
              if (!payload || payload.length === 0) return null;
              return (
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium mb-1">{label}</p>
                  {payload.map((item, index) => (
                    <p key={index} className="text-sm" style={{ color: item.color }}>
                      {item.name}: {item.value}%
                    </p>
                  ))}
                </div>
              );
            }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, strokeWidth: 2, r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-4">
        {lines.map((line) => (
          <div key={line.key} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  TrendLineChart,
  TrendAreaChart,
  Sparkline,
  ComparisonChart,
};
