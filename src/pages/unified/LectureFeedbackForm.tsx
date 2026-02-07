/**
 * LIS Lecture Feedback Form - QUALITY ENFORCED
 * Students MUST explain unclear topics. No lazy feedback allowed.
 * This turns survey → intelligence system
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen,
  MessageSquare,
  Send,
  Sparkles,
  ThumbsUp,
  Minus,
  AlertCircle,
  Gauge,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { DataService } from '../../lib/dataService';
import type { Lecture, UnderstandingLevel, TopicFeedback } from '../../lib/types';

// Minimum character requirements
const MIN_TOPIC_EXPLANATION = 10;
const MIN_OVERALL_SUMMARY = 30;

interface TopicFeedbackState {
  understanding: UnderstandingLevel | null;
  comment: string;
  error?: string;
}

interface ValidationErrors {
  topics: Map<string, string>;
  overallSummary: string;
  pace: string;
  engagement: string;
}

export function LectureFeedbackForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lectureId = searchParams.get('lecture');

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [topicFeedbacks, setTopicFeedbacks] = useState<Map<string, TopicFeedbackState>>(new Map());
  const [pace, setPace] = useState<'too-slow' | 'good' | 'too-fast' | null>(null);
  const [engagement, setEngagement] = useState<number | null>(null);
  const [overallSummary, setOverallSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showErrors, setShowErrors] = useState(false);

  // Load lecture data
  useEffect(() => {
    const loadLecture = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const lectures = DataService.getLectures();
      const found = lectureId 
        ? lectures.find(l => l.id === lectureId)
        : lectures.find(l => l.status === 'completed');
      
      if (found) {
        setLecture(found);
        // Initialize with NO selection - user must actively choose
        const initial = new Map<string, TopicFeedbackState>();
        found.topics.forEach(t => {
          initial.set(t.id, { understanding: null, comment: '' });
        });
        setTopicFeedbacks(initial);
      }
      setLoading(false);
    };
    
    loadLecture();
  }, [lectureId]);

  // Update topic understanding
  const updateTopicUnderstanding = (topicId: string, understanding: UnderstandingLevel) => {
    setTopicFeedbacks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(topicId) || { understanding: null, comment: '' };
      newMap.set(topicId, { ...existing, understanding, error: undefined });
      return newMap;
    });
  };

  // Update topic comment/explanation
  const updateTopicComment = (topicId: string, comment: string) => {
    setTopicFeedbacks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(topicId) || { understanding: null, comment: '' };
      newMap.set(topicId, { ...existing, comment, error: undefined });
      return newMap;
    });
  };

  // Calculate completion stats
  const completionStats = useMemo(() => {
    if (!lecture) return { completed: 0, total: 0, percentage: 0 };
    
    let completed = 0;
    lecture.topics.forEach(topic => {
      const fb = topicFeedbacks.get(topic.id);
      if (fb?.understanding) {
        if (fb.understanding === 'understood') {
          completed++;
        } else if (fb.comment.trim().length >= MIN_TOPIC_EXPLANATION) {
          completed++;
        }
      }
    });
    
    return {
      completed,
      total: lecture.topics.length,
      percentage: lecture.topics.length > 0 ? Math.round((completed / lecture.topics.length) * 100) : 0,
    };
  }, [lecture, topicFeedbacks]);

  // Validate all fields and return errors
  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {
      topics: new Map(),
      overallSummary: '',
      pace: '',
      engagement: '',
    };

    if (!lecture) return errors;

    // Validate each topic
    lecture.topics.forEach(topic => {
      const fb = topicFeedbacks.get(topic.id);
      
      if (!fb?.understanding) {
        errors.topics.set(topic.id, 'Please select your understanding level');
      } else if (fb.understanding !== 'understood' && fb.comment.trim().length < MIN_TOPIC_EXPLANATION) {
        errors.topics.set(topic.id, `Explanation required (min ${MIN_TOPIC_EXPLANATION} characters)`);
      }
    });

    // Validate overall summary
    if (overallSummary.trim().length < MIN_OVERALL_SUMMARY) {
      errors.overallSummary = `Please provide a summary (min ${MIN_OVERALL_SUMMARY} characters, currently ${overallSummary.trim().length})`;
    }

    // Validate pace
    if (!pace) {
      errors.pace = 'Please select the lecture pace';
    }

    // Validate engagement
    if (!engagement) {
      errors.engagement = 'Please select your engagement level';
    }

    return errors;
  };

  // Check if form is valid
  const formErrors = useMemo(() => validateForm(), [lecture, topicFeedbacks, overallSummary, pace, engagement]);
  
  const isFormValid = useMemo(() => {
    return (
      formErrors.topics.size === 0 &&
      !formErrors.overallSummary &&
      !formErrors.pace &&
      !formErrors.engagement
    );
  }, [formErrors]);

  // Get missing items for tooltip
  const getMissingItems = (): string[] => {
    const missing: string[] = [];
    
    if (formErrors.topics.size > 0) {
      missing.push(`${formErrors.topics.size} topic(s) need attention`);
    }
    if (formErrors.overallSummary) {
      missing.push('Overall feedback summary required');
    }
    if (formErrors.pace) {
      missing.push('Lecture pace not selected');
    }
    if (formErrors.engagement) {
      missing.push('Engagement level not selected');
    }
    
    return missing;
  };

  // Submit feedback
  const handleSubmit = async () => {
    setShowErrors(true);
    
    if (!isFormValid || !lecture) {
      // Scroll to first error
      const firstErrorTopic = lecture?.topics.find(t => formErrors.topics.has(t.id));
      if (firstErrorTopic) {
        document.getElementById(`topic-${firstErrorTopic.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSubmitting(true);
    
    // Convert map to array
    const feedbackArray: TopicFeedback[] = lecture.topics.map(t => {
      const fb = topicFeedbacks.get(t.id);
      return {
        topicId: t.id,
        topicName: t.name,
        understanding: fb?.understanding || 'understood',
        comment: fb?.comment,
      };
    });

    const user = DataService.getCurrentUser('student');
    
    const result = await DataService.submitFeedback(
      lecture.id,
      user.id,
      feedbackArray,
      pace!,
      engagement!,
      overallSummary
    );

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        navigate('/dev/student/overview');
      }, 2000);
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
        <p className="text-white font-medium">No lecture found</p>
        <button 
          onClick={() => navigate('/dev/student/overview')}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-64 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
        >
          <CheckCircle className="w-10 h-10 text-green-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-white">Feedback Submitted!</h2>
        <p className="text-zinc-400 mt-2">Thank you for your detailed feedback.</p>
        <p className="text-sm text-zinc-500 mt-1">Your insights will help improve future lectures.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Lecture Feedback</h1>
          <p className="text-sm text-zinc-400">Help us understand what worked and what didn't</p>
        </div>
      </div>

      {/* Progress Indicator - CRITICAL */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-r from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-400" />
            Feedback Completion
          </span>
          <span className={`text-sm font-bold ${completionStats.percentage === 100 ? 'text-green-400' : 'text-purple-400'}`}>
            {completionStats.completed} / {completionStats.total} topics
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${completionStats.percentage === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${completionStats.percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {completionStats.percentage < 100 && (
          <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Explanations are required for topics marked as Partial or Not Clear
          </p>
        )}
      </motion.div>

      {/* Lecture Info Card */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-purple-400">{lecture.courseCode}</span>
            <h2 className="text-lg font-semibold text-white mt-1">{lecture.title}</h2>
            <p className="text-sm text-zinc-400 mt-1">{lecture.courseName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lecture.date}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{lecture.startTime} - {lecture.endTime}</p>
          </div>
        </div>
      </div>

      {/* Topic-by-Topic Feedback */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Rate Your Understanding
        </h3>
        <p className="text-sm text-zinc-400 mb-5">
          For each topic, select your understanding level. <strong className="text-yellow-400">Explanations are mandatory</strong> for Partial/Not Clear.
        </p>

        <div className="space-y-4">
          {lecture.topics.map((topic, idx) => {
            const fb = topicFeedbacks.get(topic.id);
            const error = showErrors ? formErrors.topics.get(topic.id) : undefined;
            const needsExplanation = fb?.understanding && fb.understanding !== 'understood';
            const hasValidExplanation = fb?.comment && fb.comment.trim().length >= MIN_TOPIC_EXPLANATION;

            return (
              <motion.div
                key={topic.id}
                id={`topic-${topic.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border transition-all ${
                  error 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : fb?.understanding && (!needsExplanation || hasValidExplanation)
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-white/[0.03] border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white">{topic.name}</p>
                  {fb?.understanding && (!needsExplanation || hasValidExplanation) && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                
                {/* Understanding Options */}
                <div className="flex gap-2 mb-3">
                  <UnderstandingButton
                    level="understood"
                    selected={fb?.understanding === 'understood'}
                    onClick={() => updateTopicUnderstanding(topic.id, 'understood')}
                  />
                  <UnderstandingButton
                    level="partial"
                    selected={fb?.understanding === 'partial'}
                    onClick={() => updateTopicUnderstanding(topic.id, 'partial')}
                  />
                  <UnderstandingButton
                    level="not-clear"
                    selected={fb?.understanding === 'not-clear'}
                    onClick={() => updateTopicUnderstanding(topic.id, 'not-clear')}
                  />
                </div>

                {/* REQUIRED explanation for Partial/Not Clear */}
                <AnimatePresence>
                  {needsExplanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2">
                        <label className="block text-xs font-medium text-yellow-400 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          What was unclear or confusing in this topic? <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          placeholder="e.g., The notation was confusing, needed more examples of edge cases..."
                          value={fb?.comment || ''}
                          onChange={(e) => updateTopicComment(topic.id, e.target.value)}
                          className={`w-full h-20 px-3 py-2 rounded-lg bg-white/5 border text-white text-sm placeholder-zinc-500 focus:outline-none resize-none ${
                            error && needsExplanation ? 'border-red-500/50' : 'border-white/10 focus:border-purple-500/50'
                          }`}
                        />
                        <div className="flex justify-between mt-1">
                          <span className={`text-xs ${
                            (fb?.comment?.trim().length || 0) >= MIN_TOPIC_EXPLANATION 
                              ? 'text-green-400' 
                              : 'text-zinc-500'
                          }`}>
                            {fb?.comment?.trim().length || 0}/{MIN_TOPIC_EXPLANATION} min characters
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Inline Error */}
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-400 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pace & Engagement */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
          <Gauge className="w-5 h-5 text-purple-400" />
          Overall Experience
        </h3>

        {/* Pace */}
        <div className="mb-5">
          <p className="text-sm text-zinc-300 mb-3">How was the lecture pace? <span className="text-red-400">*</span></p>
          <div className="flex gap-2">
            {(['too-slow', 'good', 'too-fast'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPace(p)}
                className={`
                  flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all
                  ${pace === p 
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                    : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
                  }
                `}
              >
                {p === 'too-slow' ? '🐢 Too Slow' : p === 'good' ? '👍 Good' : '🚀 Too Fast'}
              </button>
            ))}
          </div>
          {showErrors && formErrors.pace && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.pace}
            </p>
          )}
        </div>

        {/* Engagement Score */}
        <div>
          <p className="text-sm text-zinc-300 mb-3">Engagement level (1-5) <span className="text-red-400">*</span></p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(score => (
              <button
                key={score}
                onClick={() => setEngagement(score)}
                className={`
                  w-12 h-12 rounded-xl border text-sm font-medium transition-all
                  ${engagement === score 
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                    : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]'
                  }
                `}
              >
                {score}
              </button>
            ))}
          </div>
          {showErrors && formErrors.engagement && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.engagement}
            </p>
          )}
        </div>
      </div>

      {/* Overall Feedback Summary - REQUIRED */}
      <div className={`p-6 rounded-2xl border ${
        showErrors && formErrors.overallSummary 
          ? 'bg-red-500/10 border-red-500/30' 
          : 'bg-white/[0.02] border-white/[0.06]'
      }`}>
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Overall Feedback Summary
          <span className="text-red-400 text-sm">*</span>
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Briefly summarize your understanding and key difficulties from this lecture.
        </p>
        <textarea
          value={overallSummary}
          onChange={(e) => setOverallSummary(e.target.value)}
          placeholder="e.g., I understood the basic tree structure but struggled with the recursive traversal logic. More visual examples would help..."
          className={`w-full h-28 px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-zinc-500 focus:outline-none resize-none ${
            showErrors && formErrors.overallSummary ? 'border-red-500/50' : 'border-white/10 focus:border-purple-500/50'
          }`}
        />
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${
            overallSummary.trim().length >= MIN_OVERALL_SUMMARY ? 'text-green-400' : 'text-zinc-500'
          }`}>
            {overallSummary.trim().length}/{MIN_OVERALL_SUMMARY} min characters
          </span>
          {overallSummary.trim().length >= MIN_OVERALL_SUMMARY && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Good!
            </span>
          )}
        </div>
        {showErrors && formErrors.overallSummary && (
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {formErrors.overallSummary}
          </p>
        )}
      </div>

      {/* Submit Button - HARD BLOCKED until valid */}
      <div className="relative group">
        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full py-4 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-purple-500 hover:bg-purple-400 text-white'
              : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
          whileHover={isFormValid ? { scale: 1.01 } : {}}
          whileTap={isFormValid ? { scale: 0.99 } : {}}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Feedback
            </>
          )}
        </motion.button>

        {/* Tooltip when invalid */}
        {!isFormValid && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl text-sm max-w-xs">
              <p className="text-yellow-400 font-medium mb-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Please complete feedback:
              </p>
              <ul className="text-zinc-300 space-y-1">
                {getMissingItems().map((item, i) => (
                  <li key={i} className="text-xs flex items-center gap-1">
                    <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-3 h-3 bg-zinc-800 border-r border-b border-zinc-700 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
          </div>
        )}
      </div>

      {/* Quality Assurance Note */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Why detailed feedback matters:</strong> Your explanations help professors understand 
            exactly what needs revision. Generic responses don't improve teaching - your specific 
            insights do. All feedback remains anonymous.
          </span>
        </p>
      </div>
    </div>
  );
}

// ==================== UNDERSTANDING BUTTON ====================

function UnderstandingButton({
  level,
  selected,
  onClick,
}: {
  level: UnderstandingLevel;
  selected: boolean;
  onClick: () => void;
}) {
  const config = {
    'understood': { icon: ThumbsUp, label: 'Understood', color: 'green' },
    'partial': { icon: Minus, label: 'Partial', color: 'yellow' },
    'not-clear': { icon: AlertCircle, label: 'Not Clear', color: 'red' },
  };

  const { icon: Icon, label, color } = config[level];

  const colors: Record<string, string> = {
    green: selected 
      ? 'bg-green-500/20 border-green-500/40 text-green-400' 
      : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400',
    yellow: selected 
      ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' 
      : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:bg-yellow-500/10 hover:border-yellow-500/20 hover:text-yellow-400',
    red: selected 
      ? 'bg-red-500/20 border-red-500/40 text-red-400' 
      : 'bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400',
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${colors[color]}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export default LectureFeedbackForm;
