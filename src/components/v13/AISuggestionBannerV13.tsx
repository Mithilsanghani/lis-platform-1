/**
 * AISuggestionBannerV13 - LIS v13.0
 * Premium AI suggestion banner with pulsing glow effect
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  Users,
  Send,
  ChevronRight,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface AISuggestionBannerV13Props {
  silentCount: number;
  criticalCourses: number;
  onNudgeAll: () => void;
  onViewDetails: () => void;
}

export function AISuggestionBannerV13({
  silentCount,
  criticalCourses,
  onNudgeAll,
  onViewDetails,
}: AISuggestionBannerV13Props) {
  const hasCritical = criticalCourses > 0 || silentCount > 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Pulsing glow effect for critical state */}
      {hasCritical && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(168, 85, 247, 0)',
              '0 0 30px 5px rgba(168, 85, 247, 0.15)',
              '0 0 0 0 rgba(168, 85, 247, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <div className={`
        relative
        rounded-2xl border
        bg-gradient-to-r from-purple-700/30 via-purple-900/30 to-indigo-800/30
        ${hasCritical ? 'border-purple-500/40' : 'border-purple-500/20'}
        backdrop-blur-xl
        overflow-hidden
      `}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left content */}
            <div className="flex items-start gap-4">
              {/* AI Icon with pulse */}
              <div className="relative">
                <motion.div
                  className={`
                    w-12 h-12 rounded-xl
                    bg-gradient-to-br from-purple-500 to-indigo-600
                    flex items-center justify-center
                    shadow-lg shadow-purple-500/30
                  `}
                  animate={hasCritical ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                {hasCritical && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </div>

              {/* Text content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-lg">AI Insights</h3>
                  {hasCritical && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Action Required
                    </span>
                  )}
                </div>
                <p className="text-purple-200/80 text-sm leading-relaxed max-w-xl">
                  <span className="text-white font-medium">{silentCount.toLocaleString()} silent students</span> detected across your courses. 
                  {criticalCourses > 0 && (
                    <span className="text-rose-300"> {criticalCourses} courses need immediate attention.</span>
                  )} Consider sending a bulk nudge to re-engage them.
                </p>

                {/* Quick stats */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-purple-300">
                    <Users className="w-4 h-4" />
                    <span>{silentCount} silent</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{criticalCourses} critical</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-emerald-300">
                    <TrendingUp className="w-4 h-4" />
                    <span>73% nudge success rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 sm:flex-shrink-0">
              <motion.button
                onClick={onViewDetails}
                className={`
                  px-4 py-2.5 rounded-xl
                  bg-white/5 hover:bg-white/10
                  border border-white/10 hover:border-white/20
                  text-white text-sm font-medium
                  flex items-center gap-2
                  transition-all duration-200
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={onNudgeAll}
                className={`
                  px-4 py-2.5 rounded-xl
                  bg-gradient-to-r from-purple-500 to-indigo-500
                  hover:from-purple-400 hover:to-indigo-400
                  text-white text-sm font-medium
                  flex items-center gap-2
                  shadow-lg shadow-purple-500/30
                  transition-all duration-200
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-4 h-4" />
                Nudge All Silent
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
