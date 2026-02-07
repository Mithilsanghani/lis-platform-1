/**
 * FilterChipsV13 - LIS v13.0
 * Toggleable filter chips for quick filtering
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Users,
  TrendingDown,
  X,
} from 'lucide-react';

interface FilterChipsV13Props {
  chips: {
    lowHealth: boolean;
    highSilent: boolean;
    largeClasses: boolean;
  };
  onToggle: (chip: 'lowHealth' | 'highSilent' | 'largeClasses') => void;
  counts: {
    lowHealth: number;
    highSilent: number;
    largeClasses: number;
  };
}

export function FilterChipsV13({ chips, onToggle, counts }: FilterChipsV13Props) {
  const chipConfigs = [
    {
      key: 'lowHealth' as const,
      label: 'Low Health',
      sublabel: '<80%',
      icon: TrendingDown,
      count: counts.lowHealth,
      activeColor: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
      iconColor: 'text-rose-400',
    },
    {
      key: 'highSilent' as const,
      label: 'High Silent',
      sublabel: '>10',
      icon: AlertTriangle,
      count: counts.highSilent,
      activeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
      iconColor: 'text-amber-400',
    },
    {
      key: 'largeClasses' as const,
      label: 'Large Classes',
      sublabel: '>100',
      icon: Users,
      count: counts.largeClasses,
      activeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
      iconColor: 'text-blue-400',
    },
  ];

  const hasActiveChips = chips.lowHealth || chips.highSilent || chips.largeClasses;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chipConfigs.map((config) => {
        const isActive = chips[config.key];
        const Icon = config.icon;

        return (
          <motion.button
            key={config.key}
            onClick={() => onToggle(config.key)}
            className={`
              flex items-center gap-2
              px-3 py-1.5 rounded-xl
              border transition-all duration-200
              text-sm font-medium
              ${isActive 
                ? config.activeColor
                : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? config.iconColor : ''}`} />
            <span>{config.label}</span>
            <span className={`text-xs ${isActive ? 'opacity-70' : 'opacity-50'}`}>
              {config.sublabel}
            </span>
            <span className={`
              px-1.5 py-0.5 rounded-full text-xs
              ${isActive ? 'bg-white/20' : 'bg-white/10'}
            `}>
              {config.count}
            </span>
            {isActive && (
              <X className="w-3 h-3 ml-1 opacity-60 hover:opacity-100" />
            )}
          </motion.button>
        );
      })}

      {hasActiveChips && (
        <motion.button
          onClick={() => {
            onToggle('lowHealth');
            onToggle('highSilent');
            onToggle('largeClasses');
          }}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Clear all
        </motion.button>
      )}
    </div>
  );
}
