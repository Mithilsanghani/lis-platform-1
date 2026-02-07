/**
 * AIBanner v7.0 - Dynamic AI Insight Banners
 * Silent Students | Optimal Tempo | Priority Revision
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserX,
  Clock,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Zap,
  Users,
  Send,
  CheckCircle,
} from 'lucide-react';

interface SilentStudent {
  id: string;
  name: string;
  lastActive: string;
  risk: 'high' | 'medium' | 'low';
}

interface RevisionTopic {
  topic: string;
  severity: number;
  students: number;
}

interface AIBannerProps {
  type: 'silent' | 'tempo' | 'revision';
  // Silent props
  silentCount?: number;
  silentStudents?: SilentStudent[];
  // Tempo props
  idealTempo?: number;
  currentTempo?: number;
  tempoSuggestion?: string;
  // Revision props
  revisionTopics?: RevisionTopic[];
  onNudgeAll?: () => void;
  onNudgeOne?: (id: string) => void;
}

const riskColors = {
  high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

export const AIBanner: React.FC<AIBannerProps> = ({
  type,
  silentCount = 0,
  silentStudents = [],
  idealTempo = 45,
  currentTempo = 52,
  tempoSuggestion = '',
  revisionTopics = [],
  onNudgeAll,
  onNudgeOne,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [nudgedIds, setNudgedIds] = useState<Set<string>>(new Set());

  const handleNudgeOne = (id: string) => {
    setNudgedIds(prev => new Set([...prev, id]));
    onNudgeOne?.(id);
  };

  const handleNudgeAll = () => {
    const allIds = new Set(silentStudents.map(s => s.id));
    setNudgedIds(allIds);
    onNudgeAll?.();
  };

  const bannerConfig = {
    silent: {
      icon: UserX,
      color: 'from-rose-500/15 via-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/30',
      iconBg: 'bg-rose-500/20 text-rose-400',
      title: `${silentCount} Silent Students Detected`,
      subtitle: 'No participation in last 7 days',
    },
    tempo: {
      icon: Clock,
      color: 'from-amber-500/15 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400',
      title: 'Lecture Tempo Analysis',
      subtitle: `Optimal: ${idealTempo}min • Current: ${currentTempo}min`,
    },
    revision: {
      icon: BookOpen,
      color: 'from-purple-500/15 via-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
      title: 'Priority Revision Topics',
      subtitle: `${revisionTopics.length} topics need attention`,
    },
  };

  const config = bannerConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      className={`
        relative rounded-2xl border backdrop-blur-sm overflow-hidden
        bg-gradient-to-r ${config.color} ${config.borderColor}
      `}
      layout
    >
      {/* Main Banner */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${config.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{config.title}</h3>
            <p className="text-sm text-zinc-400">{config.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {type === 'silent' && !isExpanded && (
            <motion.button
              className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium
                hover:bg-rose-500/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNudgeAll();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Nudge All
              </span>
            </motion.button>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-zinc-800"
          >
            <div className="p-4 space-y-4">
              {/* Silent Students List */}
              {type === 'silent' && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Top 5 at-risk students</span>
                    <motion.button
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-medium
                        hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
                      onClick={handleNudgeAll}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Nudge All
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {silentStudents.slice(0, 5).map((student) => (
                      <motion.div
                        key={student.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 
                            flex items-center justify-center text-sm font-medium text-white">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{student.name}</p>
                            <p className="text-xs text-zinc-500">Last active: {student.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${riskColors[student.risk]}`}>
                            {student.risk}
                          </span>
                          {nudgedIds.has(student.id) ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                              <CheckCircle className="w-4 h-4" />
                              Sent
                            </span>
                          ) : (
                            <motion.button
                              className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                              onClick={() => handleNudgeOne(student.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Send nudge"
                            >
                              <Send className="w-4 h-4 text-zinc-400" />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Tempo Analysis */}
              {type === 'tempo' && (
                <div className="space-y-4">
                  {/* Tempo Gauge */}
                  <div className="relative h-4 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
                      style={{ width: '100%' }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded-full shadow-lg border-2 border-amber-400"
                      initial={{ left: '0%' }}
                      animate={{ left: `${Math.min((currentTempo / 90) * 100, 100)}%` }}
                      transition={{ type: 'spring', stiffness: 100 }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400"
                      style={{ left: `${(idealTempo / 90) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>0 min</span>
                    <span className="text-emerald-400">Optimal ({idealTempo}min)</span>
                    <span>90 min</span>
                  </div>

                  {/* Suggestion */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-200">{tempoSuggestion}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Revision Topics */}
              {type === 'revision' && (
                <div className="space-y-3">
                  {revisionTopics.map((topic, index) => (
                    <motion.div
                      key={topic.topic}
                      className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{topic.topic}</span>
                        <span className="flex items-center gap-1 text-xs text-zinc-400">
                          <Users className="w-3.5 h-3.5" />
                          {topic.students} students
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            topic.severity > 70 ? 'bg-rose-500' : 
                            topic.severity > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${topic.severity}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-zinc-500">
                        <span>Confidence Gap</span>
                        <span>{topic.severity}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIBanner;
