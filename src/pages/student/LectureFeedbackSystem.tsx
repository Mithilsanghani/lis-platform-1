/**
 * LIS Lecture Feedback System - Production-Grade
 * ZERO DUMMY DATA - All from store
 * 
 * Features:
 * - Multiple lecture support with queue
 * - 3-column layout: Lecture Queue | Feedback Form | Progress/Rules
 * - Draft state persistence
 * - Auto-navigation to next pending lecture
 * - Topic-wise feedback with mandatory explanations
 * - Real-time progress tracking
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Clock, BookOpen, MessageSquare, Send,
  ChevronRight, AlertCircle, ThumbsUp, Minus, AlertTriangle, Info,
  Sparkles, Calendar, User, Lock, Unlock, RotateCcw,
  CheckCircle2, ChevronDown, Shield,
} from 'lucide-react';
import { useLISStore } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';

// ==================== Types ====================

interface Topic {
  id: string;
  name: string;
  description?: string;
}

interface LectureItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  professor: string;
  date: string;
  time: string;
  duration: string;
  topics: Topic[];
  status: 'pending' | 'submitted' | 'expired';
}

type UnderstandingLevel = 'understood' | 'partial' | 'not-clear' | null;

interface TopicFeedback {
  understanding: UnderstandingLevel;
  explanation: string;
}

interface LectureFeedbackDraft {
  lectureId: string;
  topicFeedbacks: Record<string, TopicFeedback>;
  pace: 'too-slow' | 'good' | 'too-fast' | null;
  engagement: number | null;
  additionalComments: string;
  lastSaved: string;
}

// ==================== Constants ====================

const MIN_EXPLANATION_LENGTH = 15;
const DRAFT_STORAGE_KEY = 'lis_feedback_drafts';

// ==================== Helper Functions ====================

const loadDrafts = (): Record<string, LectureFeedbackDraft> => {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveDraft = (draft: LectureFeedbackDraft) => {
  const drafts = loadDrafts();
  drafts[draft.lectureId] = { ...draft, lastSaved: new Date().toISOString() };
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
};

const deleteDraft = (lectureId: string) => {
  const drafts = loadDrafts();
  delete drafts[lectureId];
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
};

const getDraft = (lectureId: string): LectureFeedbackDraft | null => {
  const drafts = loadDrafts();
  return drafts[lectureId] || null;
};

// ==================== Components ====================

// Understanding Level Selector
function UnderstandingSelector({ 
  value, 
  onChange,
  disabled = false,
}: { 
  value: UnderstandingLevel; 
  onChange: (level: UnderstandingLevel) => void;
  disabled?: boolean;
}) {
  const options: { level: UnderstandingLevel; label: string; icon: React.ElementType; color: 'emerald' | 'amber' | 'rose' }[] = [
    { level: 'understood', label: 'Understood', icon: ThumbsUp, color: 'emerald' },
    { level: 'partial', label: 'Partial', icon: Minus, color: 'amber' },
    { level: 'not-clear', label: 'Not Clear', icon: AlertTriangle, color: 'rose' },
  ];

  return (
    <div className="flex gap-2">
      {options.map(({ level, label, icon: Icon, color }) => {
        const isSelected = value === level;
        const colorClasses: Record<'emerald' | 'amber' | 'rose', string> = {
          emerald: isSelected ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400',
          amber: isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:border-amber-500/50 hover:text-amber-400',
          rose: isSelected ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'border-zinc-700 text-zinc-400 hover:border-rose-500/50 hover:text-rose-400',
        };

        return (
          <motion.button
            key={level}
            onClick={() => !disabled && onChange(level)}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${colorClasses[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Topic Feedback Card
function TopicFeedbackCard({
  topic,
  feedback,
  index,
  onUnderstandingChange,
  onExplanationChange,
  showValidation,
}: {
  topic: Topic;
  feedback: TopicFeedback;
  index: number;
  onUnderstandingChange: (level: UnderstandingLevel) => void;
  onExplanationChange: (text: string) => void;
  showValidation: boolean;
}) {
  const needsExplanation = feedback.understanding === 'partial' || feedback.understanding === 'not-clear';
  const hasValidExplanation = feedback.explanation.trim().length >= MIN_EXPLANATION_LENGTH;
  const isComplete = feedback.understanding === 'understood' || (needsExplanation && hasValidExplanation);
  const showError = showValidation && !isComplete && feedback.understanding !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-2xl border transition-all ${
        isComplete 
          ? 'bg-emerald-500/5 border-emerald-500/30' 
          : showError 
            ? 'bg-rose-500/5 border-rose-500/30'
            : 'bg-zinc-900/50 border-zinc-800'
      }`}
    >
      {/* Topic Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
            isComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
          }`}>
            {isComplete ? <CheckCircle className="w-4 h-4" /> : index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-white">{topic.name}</h4>
            {topic.description && (
              <p className="text-sm text-zinc-500 mt-0.5">{topic.description}</p>
            )}
          </div>
        </div>
        {isComplete && (
          <span className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400">
            ✓ DONE
          </span>
        )}
      </div>

      {/* Understanding Selector */}
      <UnderstandingSelector
        value={feedback.understanding}
        onChange={onUnderstandingChange}
      />

      {/* Explanation Box (shows when Partial or Not Clear) */}
      <AnimatePresence>
        {needsExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                What was unclear? <span className="text-rose-400">*</span>
              </label>
              <span className={`text-xs ${
                hasValidExplanation ? 'text-emerald-400' : 'text-zinc-500'
              }`}>
                {feedback.explanation.length} / {MIN_EXPLANATION_LENGTH} min
              </span>
            </div>
            <textarea
              value={feedback.explanation}
              onChange={(e) => onExplanationChange(e.target.value)}
              placeholder="Please explain what part was confusing and why..."
              className={`w-full px-4 py-3 rounded-xl bg-zinc-800/50 border text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                showError && !hasValidExplanation ? 'border-rose-500' : 'border-zinc-700'
              }`}
              rows={3}
            />
            {showError && !hasValidExplanation && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Minimum {MIN_EXPLANATION_LENGTH} characters required
              </p>
            )}
            <p className="text-xs text-zinc-500 mt-2">
              💡 Your explanation helps the professor address this in the next class
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No selection warning */}
      {showValidation && feedback.understanding === null && (
        <p className="text-xs text-rose-400 mt-3 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Please select your understanding level
        </p>
      )}
    </motion.div>
  );
}

// Lecture Queue Item
function LectureQueueItem({
  lecture,
  isSelected,
  completionStatus,
  onClick,
}: {
  lecture: LectureItem;
  isSelected: boolean;
  completionStatus: { completed: number; total: number };
  onClick: () => void;
}) {
  const isSubmitted = lecture.status === 'submitted';
  const progress = completionStatus.total > 0 
    ? Math.round((completionStatus.completed / completionStatus.total) * 100) 
    : 0;

  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border text-left transition-all ${
        isSelected
          ? 'bg-purple-500/10 border-purple-500/50'
          : isSubmitted
            ? 'bg-emerald-500/5 border-emerald-500/30 hover:bg-emerald-500/10'
            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
          isSubmitted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
        }`}>
          {lecture.courseCode}
        </span>
        {isSubmitted ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-700 flex items-center justify-center">
              <span className="text-[9px] font-bold text-zinc-400">{progress}%</span>
            </div>
          </div>
        )}
      </div>
      
      <h4 className={`font-medium mb-1 ${isSubmitted ? 'text-zinc-400' : 'text-white'}`}>
        {lecture.title}
      </h4>
      
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Calendar className="w-3 h-3" />
        <span>{lecture.date}</span>
        <span>•</span>
        <Clock className="w-3 h-3" />
        <span>{lecture.time}</span>
      </div>

      {!isSubmitted && progress > 0 && (
        <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.button>
  );
}

// Progress Rules Panel
function ProgressRulesPanel({
  lecture,
  topicFeedbacks,
  pace,
  canSubmit,
  onSubmit,
  isSubmitting,
}: {
  lecture: LectureItem;
  topicFeedbacks: Record<string, TopicFeedback>;
  pace: 'too-slow' | 'good' | 'too-fast' | null;
  canSubmit: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const completedTopics = lecture.topics.filter(t => {
    const fb = topicFeedbacks[t.id];
    if (!fb?.understanding) return false;
    if (fb.understanding === 'understood') return true;
    return fb.explanation.trim().length >= MIN_EXPLANATION_LENGTH;
  }).length;

  const requiresExplanation = lecture.topics.filter(t => {
    const fb = topicFeedbacks[t.id];
    return fb?.understanding === 'partial' || fb?.understanding === 'not-clear';
  });

  const missingExplanations = requiresExplanation.filter(t => {
    const fb = topicFeedbacks[t.id];
    return fb.explanation.trim().length < MIN_EXPLANATION_LENGTH;
  });

  return (
    <div className="space-y-4">
      {/* Completion Status */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          Completion Status
        </h3>
        
        <div className="space-y-3">
          {/* Topics Progress */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Topics Rated</span>
            <span className={`text-sm font-medium ${
              completedTopics === lecture.topics.length ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {completedTopics} / {lecture.topics.length}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                completedTopics === lecture.topics.length ? 'bg-emerald-500' : 'bg-purple-500'
              }`}
              animate={{ width: `${(completedTopics / lecture.topics.length) * 100}%` }}
            />
          </div>

          {/* Explanations Status */}
          {requiresExplanation.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <span className="text-sm text-zinc-400">Required Explanations</span>
              <span className={`text-sm font-medium ${
                missingExplanations.length === 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {missingExplanations.length === 0 ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> All Done
                  </span>
                ) : (
                  `${missingExplanations.length} missing`
                )}
              </span>
            </div>
          )}

          {/* Pace Status */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <span className="text-sm text-zinc-400">Lecture Pace</span>
            <span className={`text-sm font-medium ${pace ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {pace ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Rated
                </span>
              ) : (
                'Not rated'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Submission Lock Status */}
      <div className={`p-4 rounded-xl border ${
        canSubmit 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-zinc-900/50 border-zinc-800'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          {canSubmit ? (
            <Unlock className="w-5 h-5 text-emerald-400" />
          ) : (
            <Lock className="w-5 h-5 text-zinc-500" />
          )}
          <span className={`font-medium ${canSubmit ? 'text-emerald-400' : 'text-zinc-400'}`}>
            {canSubmit ? 'Ready to Submit' : 'Submission Locked'}
          </span>
        </div>
        {!canSubmit && (
          <p className="text-xs text-zinc-500">
            Complete all required fields to unlock submission
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          canSubmit
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.div>
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Feedback
          </>
        )}
      </motion.button>

      {/* Privacy Notice */}
      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-purple-400 mt-0.5" />
          <div>
            <p className="text-xs text-purple-300 font-medium">Anonymous Feedback</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Your identity is protected. Only aggregated insights are shared with the professor.
            </p>
          </div>
        </div>
      </div>

      {/* How This Helps */}
      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 mt-0.5" />
          <div>
            <p className="text-xs text-white font-medium">How This Helps</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Your feedback directly influences the next lecture. Topics marked "Not Clear" get revised.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success Screen
function SuccessScreen({ 
  lecture, 
  nextLecture, 
  onContinue, 
  onGoToDashboard 
}: {
  lecture: LectureItem;
  nextLecture: LectureItem | null;
  onContinue: () => void;
  onGoToDashboard: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="max-w-md text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Feedback Submitted!</h2>
        <p className="text-zinc-400 mb-6">
          Thank you for your feedback on <span className="text-white">{lecture.title}</span>
        </p>

        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-6">
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Feedback Submitted</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Thank you for helping improve this course</p>
        </div>

        {nextLecture ? (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">Up next:</p>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <p className="text-sm text-purple-400 font-medium">{nextLecture.courseCode}</p>
              <p className="text-white font-semibold">{nextLecture.title}</p>
            </div>
            <motion.button
              onClick={onContinue}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Next <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-emerald-400 font-medium">All caught up!</p>
            <p className="text-xs text-zinc-500">No more pending feedback</p>
          </div>
        )}

        <button
          onClick={onGoToDashboard}
          className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 mt-3"
        >
          Go to Dashboard
        </button>
      </div>
    </motion.div>
  );
}

// ==================== Main Component ====================

export function LectureFeedbackSystem() {
  const navigate = useNavigate();
  
  // Get real data from store
  const { user } = useAuthStore();
  const { 
    getStudentPendingFeedback, 
    getStudentLectures, 
    courses, 
    professors, 
    feedback,
    submitFeedback 
  } = useLISStore();
  
  const studentId = user?.id || '';
  
  // Convert store lectures to UI format
  const lectures = useMemo((): LectureItem[] => {
    const studentLectures = getStudentLectures(studentId);
    const pendingFeedbackLectures = getStudentPendingFeedback(studentId);
    const pendingIds = new Set(pendingFeedbackLectures.map(l => l.id));
    
    // Get lectures that are completed
    const completedLectures = studentLectures.filter(l => l.status === 'completed');
    
    return completedLectures.map(lecture => {
      const course = courses.find(c => c.id === lecture.courseId);
      const professor = professors.find(p => p.id === course?.professorId);
      
      // Check if feedback was already submitted for this lecture
      const hasSubmittedFeedback = feedback.some(
        f => f.lectureId === lecture.id && f.studentId === studentId
      );
      
      const lectureDate = new Date(lecture.date);
      const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const endDate = new Date(lectureDate.getTime() + lecture.duration * 60000);
      
      // Convert topics array (strings) to Topic objects
      const topics: Topic[] = lecture.topics.map((topicName, idx) => ({
        id: `${lecture.id}-topic-${idx}`,
        name: topicName,
        description: undefined,
      }));
      
      return {
        id: lecture.id,
        courseId: lecture.courseId,
        courseCode: course?.code || 'N/A',
        courseName: course?.name || lecture.title,
        title: lecture.title,
        professor: professor?.name || 'Unknown',
        date: lectureDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        time: `${formatTime(lectureDate)} - ${formatTime(endDate)}`,
        duration: `${lecture.duration} min`,
        topics,
        status: hasSubmittedFeedback ? 'submitted' : (pendingIds.has(lecture.id) ? 'pending' : 'pending'),
      };
    });
  }, [studentId, getStudentLectures, getStudentPendingFeedback, courses, professors, feedback]);
  
  // Local state for UI - track submitted lectures
  const [localSubmitted, setLocalSubmitted] = useState<Set<string>>(new Set());
  
  // Merge store status with local UI status
  const effectiveLectures = useMemo(() => {
    return lectures.map(l => ({
      ...l,
      status: localSubmitted.has(l.id) ? 'submitted' as const : l.status,
    }));
  }, [lectures, localSubmitted]);
  
  // State
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [topicFeedbacks, setTopicFeedbacks] = useState<Record<string, TopicFeedback>>({});
  const [pace, setPace] = useState<'too-slow' | 'good' | 'too-fast' | null>(null);
  const [additionalComments, setAdditionalComments] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedLecture, setSubmittedLecture] = useState<LectureItem | null>(null);
  const [queueCollapsed, setQueueCollapsed] = useState(false);

  // Derived state
  const selectedLecture = useMemo(
    () => effectiveLectures.find(l => l.id === selectedLectureId),
    [effectiveLectures, selectedLectureId]
  );

  const pendingLectures = useMemo(
    () => effectiveLectures.filter(l => l.status === 'pending'),
    [effectiveLectures]
  );

  const submittedLectures = useMemo(
    () => effectiveLectures.filter(l => l.status === 'submitted'),
    [effectiveLectures]
  );

  const nextPendingLecture = useMemo(
    () => pendingLectures.find(l => l.id !== selectedLectureId),
    [pendingLectures, selectedLectureId]
  );

  // Group lectures by course
  const lecturesByCourse = useMemo(() => {
    const grouped: Record<string, LectureItem[]> = {};
    effectiveLectures.forEach(l => {
      if (!grouped[l.courseCode]) {
        grouped[l.courseCode] = [];
      }
      grouped[l.courseCode].push(l);
    });
    return grouped;
  }, [effectiveLectures]);

  // Calculate completion status for a lecture
  const getCompletionStatus = useCallback((lecture: LectureItem) => {
    const draft = getDraft(lecture.id);
    if (!draft) return { completed: 0, total: lecture.topics.length };
    
    const completed = lecture.topics.filter(t => {
      const fb = draft.topicFeedbacks[t.id];
      if (!fb?.understanding) return false;
      if (fb.understanding === 'understood') return true;
      return fb.explanation.trim().length >= MIN_EXPLANATION_LENGTH;
    }).length;
    
    return { completed, total: lecture.topics.length };
  }, []);

  // Check if can submit
  const canSubmit = useMemo(() => {
    if (!selectedLecture) return false;
    
    const allTopicsComplete = selectedLecture.topics.every(t => {
      const fb = topicFeedbacks[t.id];
      if (!fb?.understanding) return false;
      if (fb.understanding === 'understood') return true;
      return fb.explanation.trim().length >= MIN_EXPLANATION_LENGTH;
    });
    
    return allTopicsComplete && pace !== null;
  }, [selectedLecture, topicFeedbacks, pace]);

  // Load initial lecture and draft
  useEffect(() => {
    if (pendingLectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(pendingLectures[0].id);
    }
  }, [pendingLectures, selectedLectureId]);

  // Load draft when lecture changes
  useEffect(() => {
    if (selectedLectureId) {
      const draft = getDraft(selectedLectureId);
      if (draft) {
        setTopicFeedbacks(draft.topicFeedbacks);
        setPace(draft.pace);
        setAdditionalComments(draft.additionalComments);
      } else if (selectedLecture) {
        // Initialize empty feedbacks
        const initial: Record<string, TopicFeedback> = {};
        selectedLecture.topics.forEach(t => {
          initial[t.id] = { understanding: null, explanation: '' };
        });
        setTopicFeedbacks(initial);
        setPace(null);
        setAdditionalComments('');
      }
      setShowValidation(false);
      setShowSuccess(false);
    }
  }, [selectedLectureId, selectedLecture]);

  // Auto-save draft
  useEffect(() => {
    if (selectedLectureId && Object.keys(topicFeedbacks).length > 0) {
      const draft: LectureFeedbackDraft = {
        lectureId: selectedLectureId,
        topicFeedbacks,
        pace,
        engagement: null,
        additionalComments,
        lastSaved: new Date().toISOString(),
      };
      saveDraft(draft);
    }
  }, [selectedLectureId, topicFeedbacks, pace, additionalComments]);

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.values(topicFeedbacks).some(fb => fb.understanding !== null)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [topicFeedbacks]);

  // Handlers
  const handleTopicUnderstanding = (topicId: string, level: UnderstandingLevel) => {
    setTopicFeedbacks(prev => ({
      ...prev,
      [topicId]: { ...prev[topicId], understanding: level },
    }));
  };

  const handleTopicExplanation = (topicId: string, text: string) => {
    setTopicFeedbacks(prev => ({
      ...prev,
      [topicId]: { ...prev[topicId], explanation: text },
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit || !selectedLecture) {
      setShowValidation(true);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Submit to store - convert topic feedbacks to ratings
    const topicRatings = selectedLecture.topics.map(t => {
      const fb = topicFeedbacks[t.id];
      const rating = fb?.understanding === 'understood' ? 5 : 
                     fb?.understanding === 'partial' ? 3 : 1;
      return { topicId: t.id, rating: rating as 1 | 2 | 3 | 4 | 5 };
    });
    
    const understandingLevel = topicRatings.every(r => r.rating >= 4) ? 'fully' :
                               topicRatings.some(r => r.rating <= 2) ? 'confused' : 'partial';
    
    // Submit to store
    submitFeedback(selectedLectureId!, studentId, {
      understandingLevel,
      topicRatings,
      comments: additionalComments || undefined,
    });
    
    // Update local UI state
    setLocalSubmitted(prev => new Set([...prev, selectedLectureId!]));
    
    // Clear draft
    deleteDraft(selectedLectureId!);
    
    // Show success
    setSubmittedLecture(selectedLecture);
    setShowSuccess(true);
    setIsSubmitting(false);
  };

  const handleContinueToNext = () => {
    if (nextPendingLecture) {
      setSelectedLectureId(nextPendingLecture.id);
      setShowSuccess(false);
    }
  };

  const handleSelectLecture = (lectureId: string) => {
    const lecture = lectures.find(l => l.id === lectureId);
    if (lecture?.status === 'submitted') return; // Don't allow editing submitted feedback
    setSelectedLectureId(lectureId);
  };

  // Render - No navigation sidebar, uses parent layout
  return (
    <div className="h-full bg-zinc-950 text-white flex overflow-hidden">
      {/* Left Panel - Lecture Queue */}
      <motion.aside
        initial={false}
        animate={{ width: queueCollapsed ? 0 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative border-r border-zinc-800 bg-zinc-900/30 flex-shrink-0 overflow-hidden"
      >
        <div className="h-full flex flex-col" style={{ width: 280 }}>
          {/* Header */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-white">Lecture Queue</h2>
              <span className="px-2 py-1 text-[10px] font-bold rounded bg-purple-500/20 text-purple-400">
                {pendingLectures.length} PENDING
              </span>
            </div>
            <p className="text-xs text-zinc-500">Select a lecture to give feedback</p>
          </div>

          {/* Lecture List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(lecturesByCourse).map(([courseCode, courseLectures]) => {
              const pending = courseLectures.filter(l => l.status === 'pending');
              
              return (
                <div key={courseCode}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-zinc-400">{courseCode}</h3>
                    <span className="text-xs text-zinc-600">
                      {pending.length} pending
                    </span>
                  </div>
                  <div className="space-y-2">
                    {courseLectures.map(lecture => (
                      <LectureQueueItem
                        key={lecture.id}
                        lecture={lecture}
                        isSelected={lecture.id === selectedLectureId}
                        completionStatus={getCompletionStatus(lecture)}
                        onClick={() => handleSelectLecture(lecture.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total Submitted</span>
              <span className="text-emerald-400 font-medium">{submittedLectures.length}</span>
            </div>
          </div>
        </div>
        
        {/* Collapse Toggle - Inside aside for proper positioning */}
        <button
          onClick={() => setQueueCollapsed(!queueCollapsed)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 w-6 h-12 bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-lg flex items-center justify-center hover:bg-zinc-700 transition-all"
        >
          {queueCollapsed ? <ChevronRight className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400 rotate-90" />}
        </button>
      </motion.aside>

      {/* Center Panel - Feedback Form */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {showSuccess && submittedLecture ? (
          <SuccessScreen
            lecture={submittedLecture}
            nextLecture={nextPendingLecture || null}
            onContinue={handleContinueToNext}
            onGoToDashboard={() => navigate('/dev/student/overview')}
          />
        ) : selectedLecture ? (
          <>
            {/* Lecture Header */}
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-bold rounded bg-purple-500/20 text-purple-400">
                      {selectedLecture.courseCode}
                    </span>
                    <span className="text-xs text-zinc-500">{selectedLecture.courseName}</span>
                  </div>
                  <h1 className="text-xl font-bold text-white mb-1">{selectedLecture.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedLecture.professor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedLecture.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedLecture.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Topics</p>
                  <p className="text-2xl font-bold text-white">{selectedLecture.topics.length}</p>
                </div>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto p-6 space-y-6">
                {/* Instructions */}
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium">Rate Your Understanding</p>
                      <p className="text-xs text-zinc-400 mt-1">
                        For each topic, select your understanding level. <span className="text-amber-400">Explanations are mandatory</span> for Partial/Not Clear selections.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topic Feedbacks */}
                <div className="space-y-4">
                  {selectedLecture.topics.map((topic, index) => (
                    <TopicFeedbackCard
                      key={topic.id}
                      topic={topic}
                      feedback={topicFeedbacks[topic.id] || { understanding: null, explanation: '' }}
                      index={index}
                      onUnderstandingChange={(level) => handleTopicUnderstanding(topic.id, level)}
                      onExplanationChange={(text) => handleTopicExplanation(topic.id, text)}
                      showValidation={showValidation}
                    />
                  ))}
                </div>

                {/* Lecture Pace */}
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Lecture Pace
                  </h3>
                  <div className="flex gap-3">
                    {[
                      { value: 'too-slow', label: 'Too Slow', color: 'amber' },
                      { value: 'good', label: 'Just Right', color: 'emerald' },
                      { value: 'too-fast', label: 'Too Fast', color: 'rose' },
                    ].map(({ value, label, color }) => (
                      <motion.button
                        key={value}
                        onClick={() => setPace(value as typeof pace)}
                        className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                          pace === value
                            ? color === 'emerald' 
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : color === 'amber'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                : 'bg-rose-500/20 border-rose-500 text-rose-400'
                            : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  {showValidation && pace === null && (
                    <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Please rate the lecture pace
                    </p>
                  )}
                </div>

                {/* Additional Comments */}
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    Additional Comments <span className="text-xs text-zinc-500">(optional)</span>
                  </h3>
                  <textarea
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    placeholder="Any other feedback for the professor..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">Select a lecture from the queue</p>
            </div>
          </div>
        )}
      </main>

      {/* Right Panel - Progress & Rules (Desktop only) */}
      {selectedLecture && !showSuccess && (
        <aside className="hidden xl:flex xl:flex-col w-80 flex-shrink-0 border-l border-zinc-800 bg-zinc-950/95 p-4 overflow-y-auto">
          <ProgressRulesPanel
            lecture={selectedLecture}
            topicFeedbacks={topicFeedbacks}
            pace={pace}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </aside>
      )}

      {/* Mobile Submit Button */}
      {selectedLecture && !showSuccess && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-zinc-950/95 border-t border-zinc-800 z-20">
          <motion.button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
              canSubmit
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-zinc-800 text-zinc-500'
            }`}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
          >
            <Send className="w-5 h-5" />
            {canSubmit ? 'Submit Feedback' : `Complete all ${selectedLecture.topics.length} topics`}
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default LectureFeedbackSystem;
