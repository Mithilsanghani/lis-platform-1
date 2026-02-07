/**
 * LIS v2.0 - Understanding Donut Chart
 * Reusable donut chart for feedback distribution
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FeedbackDistribution {
  fully_understood: number;
  partially_understood: number;
  not_understood: number;
  total: number;
}

interface UnderstandingDonutProps {
  distribution: FeedbackDistribution;
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
  showPercentages?: boolean;
  className?: string;
}

const COLORS = {
  fully_understood: '#22c55e', // green-500
  partially_understood: '#eab308', // yellow-500
  not_understood: '#ef4444', // red-500
};

const LABELS = {
  fully_understood: 'Fully Understood',
  partially_understood: 'Partially Understood',
  not_understood: 'Not Understood',
};

export const UnderstandingDonut: React.FC<UnderstandingDonutProps> = ({
  distribution,
  size = 'md',
  showLegend = true,
  showPercentages = true,
  className = '',
}) => {
  const data = [
    { name: 'Fully Understood', value: distribution.fully_understood, key: 'fully_understood' },
    { name: 'Partially Understood', value: distribution.partially_understood, key: 'partially_understood' },
    { name: 'Not Understood', value: distribution.not_understood, key: 'not_understood' },
  ].filter(d => d.value > 0);

  const sizeConfig = {
    sm: { width: 150, height: 150, innerRadius: 35, outerRadius: 55 },
    md: { width: 200, height: 200, innerRadius: 45, outerRadius: 75 },
    lg: { width: 280, height: 280, innerRadius: 65, outerRadius: 100 },
  };

  const { width, height, innerRadius, outerRadius } = sizeConfig[size];

  // Calculate center percentage
  const understandingPct = distribution.total > 0
    ? Math.round(
        (distribution.fully_understood * 100 + distribution.partially_understood * 50) / 
        distribution.total
      )
    : 0;

  if (distribution.total === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="text-gray-400 text-sm">No feedback yet</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.key as keyof typeof COLORS]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const item = payload[0];
              const pct = Math.round((item.value as number / distribution.total) * 100);
              return (
                <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.value} students ({pct}%)
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        style={{ width: innerRadius * 1.5 }}
      >
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{understandingPct}%</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Understanding</p>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.map((entry) => (
            <div key={entry.key} className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[entry.key as keyof typeof COLORS] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {LABELS[entry.key as keyof typeof LABELS]}
                {showPercentages && (
                  <span className="ml-1 text-gray-400">
                    ({Math.round((entry.value / distribution.total) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================== Mini Version ==================

interface MiniUnderstandingBarProps {
  distribution: FeedbackDistribution;
  className?: string;
}

export const MiniUnderstandingBar: React.FC<MiniUnderstandingBarProps> = ({
  distribution,
  className = '',
}) => {
  if (distribution.total === 0) {
    return (
      <div className={`h-2 bg-gray-200 dark:bg-gray-700 rounded-full ${className}`} />
    );
  }

  const greenPct = (distribution.fully_understood / distribution.total) * 100;
  const yellowPct = (distribution.partially_understood / distribution.total) * 100;
  const redPct = (distribution.not_understood / distribution.total) * 100;

  return (
    <div className={`h-2 flex rounded-full overflow-hidden ${className}`}>
      {greenPct > 0 && (
        <div 
          className="bg-green-500" 
          style={{ width: `${greenPct}%` }}
          title={`Fully Understood: ${distribution.fully_understood}`}
        />
      )}
      {yellowPct > 0 && (
        <div 
          className="bg-yellow-500" 
          style={{ width: `${yellowPct}%` }}
          title={`Partially Understood: ${distribution.partially_understood}`}
        />
      )}
      {redPct > 0 && (
        <div 
          className="bg-red-500" 
          style={{ width: `${redPct}%` }}
          title={`Not Understood: ${distribution.not_understood}`}
        />
      )}
    </div>
  );
};

export default UnderstandingDonut;
