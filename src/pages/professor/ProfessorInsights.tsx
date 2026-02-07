/**
 * LIS v2.0 - Professor AI Insights Page
 * AI-powered insights, silent student alerts, and revision recommendations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Users,
  BookOpen,
  RefreshCw,
  X,
} from 'lucide-react';
import { useProfessorInsights, useProfessorCourses } from '../../hooks/useProfessorData';
import { RiskBadge, EmptyState } from '../../components/shared';

type InsightCategory = 'all' | 'action' | 'warning' | 'success' | 'info';

export default function ProfessorInsights() {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const { insights, dismissInsight } = useProfessorInsights();
  const { courses } = useProfessorCourses();

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    if (selectedPriority !== 'all' && insight.priority !== selectedPriority) return false;
    // Map insight priority to categories
    if (selectedCategory !== 'all') {
      const priorityMapping: Record<string, InsightCategory> = {
        'high': 'action',
        'medium': 'warning',
        'low': 'info',
      };
      if (priorityMapping[insight.priority] !== selectedCategory) return false;
    }
    return true;
  });

  // Stats
  const highPriorityCount = insights.filter(i => i.priority === 'high').length;
  const actionableCount = insights.filter(i => i.action).length;

  const getInsightIcon = (priority: string) => {
    switch (priority) {
      case 'high': return Lightbulb;
      case 'medium': return AlertTriangle;
      case 'low': return TrendingUp;
      default: return Sparkles;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30';
      case 'medium': return 'from-amber-500/20 to-amber-600/10 border-amber-500/30';
      case 'low': return 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30';
      default: return 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30';
    }
  };

  const getIconColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-indigo-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-emerald-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">AI Insights</h1>
          </div>
          <p className="text-slate-400 mt-1">Intelligent recommendations based on feedback patterns</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh Insights
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Total Insights</span>
          </div>
          <p className="text-2xl font-bold text-white">{insights.length}</p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-white">{highPriorityCount}</p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm">Actionable</span>
          </div>
          <p className="text-2xl font-bold text-white">{actionableCount}</p>
        </div>
        <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Low Priority</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {insights.filter(i => i.priority === 'low').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <div className="flex rounded-xl overflow-hidden border border-slate-700/50">
          {(['all', 'action', 'warning', 'success', 'info'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Insights List */}
      {filteredInsights.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8" />}
          title="No insights to show"
          description="We'll generate new insights as more feedback comes in"
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredInsights.map((insight, index) => {
              const Icon = getInsightIcon(insight.priority);
              const course = courses.find(c => c.id === insight.owner_id);

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative rounded-2xl p-5 border
                    bg-gradient-to-br ${getInsightColor(insight.priority)}
                  `}
                >
                  {/* Dismiss button */}
                  <button
                    onClick={() => dismissInsight(insight.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl bg-white/5 ${getIconColor(insight.priority)}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                        <RiskBadge level={insight.priority} size="sm" />
                      </div>

                      <p className="text-slate-300 mb-4">{insight.description}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        {course && (
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            {course.code}
                          </span>
                        )}
                        {insight.owner_type === 'course' && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            Course insight
                          </span>
                        )}
                        <span className="text-slate-500">
                          Generated {new Date(insight.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action Button */}
                      {insight.action_route && (
                        <button
                          onClick={() => window.location.href = insight.action_route!}
                          className="mt-4 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                        >
                          {insight.action || 'Take Action'} →
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* How It Works */}
      <div className="rounded-2xl p-6 bg-slate-800/30 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">How AI Insights Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              1
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Data Collection</h4>
              <p className="text-sm text-slate-400">
                We analyze feedback from all your lectures, identifying patterns in understanding levels and comments.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              2
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Pattern Recognition</h4>
              <p className="text-sm text-slate-400">
                Our system identifies silent students, struggling topics, and positive trends across your courses.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              3
            </div>
            <div>
              <h4 className="font-medium text-white mb-1">Actionable Insights</h4>
              <p className="text-sm text-slate-400">
                Insights are prioritized and presented with specific recommendations you can act on immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
