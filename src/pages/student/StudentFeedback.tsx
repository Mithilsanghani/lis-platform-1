/**
 * LIS v2.0 - Student Feedback Page
 * Feedback submission and history with tabs
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  CheckCircle,
  X,
  Send,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useStudentFeedback, type StudentFeedback as FeedbackType } from '../../hooks/useStudentData';

type TabType = 'pending' | 'submitted' | 'all';

// Tab button component
function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-xl text-sm font-medium transition-all
        ${active
          ? 'text-white'
          : 'text-zinc-400 hover:text-white'
        }
      `}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-purple-500/20 border border-purple-500/40 rounded-xl"
          transition={{ type: 'spring', duration: 0.4 }}
        />
      )}
      <span className="relative flex items-center gap-2">
        {label}
        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
          active ? 'bg-purple-500/40' : 'bg-white/10'
        }`}>
          {count}
        </span>
      </span>
    </button>
  );
}

// Feedback card component
function FeedbackCard({
  feedback,
  onGiveFeedback,
  onViewDetail,
}: {
  feedback: FeedbackType;
  onGiveFeedback: (id: string) => void;
  onViewDetail: (id: string) => void;
}) {
  const isPending = feedback.status === 'pending';

  const getUnderstandingIcon = () => {
    switch (feedback.understanding) {
      case 'full':
        return <ThumbsUp className="w-4 h-4 text-emerald-400" />;
      case 'partial':
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case 'need-clarity':
        return <ThumbsDown className="w-4 h-4 text-rose-400" />;
      default:
        return null;
    }
  };

  const getUnderstandingLabel = () => {
    switch (feedback.understanding) {
      case 'full':
        return 'Fully understood';
      case 'partial':
        return 'Partially understood';
      case 'need-clarity':
        return 'Need more clarity';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-xl border transition-all
        ${isPending
          ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
          : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]'
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Course & topic */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-purple-400">{feedback.course_code}</span>
            {isPending && feedback.due_soon && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-medium">
                Due soon
              </span>
            )}
          </div>
          <h3 className="text-sm font-medium text-white mb-1">{feedback.topic}</h3>
          <p className="text-xs text-zinc-500">
            {feedback.date} • {feedback.time}
          </p>

          {/* Submitted feedback info */}
          {!isPending && feedback.understanding && (
            <div className="mt-3 flex items-center gap-2">
              {getUnderstandingIcon()}
              <span className="text-xs text-zinc-400">{getUnderstandingLabel()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          {isPending ? (
            <motion.button
              onClick={() => onGiveFeedback(feedback.id)}
              className="px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Give Feedback
            </motion.button>
          ) : (
            <button
              onClick={() => onViewDetail(feedback.id)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium transition-colors"
            >
              View
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Feedback form modal
function FeedbackFormModal({
  feedback,
  onClose,
  onSubmit,
}: {
  feedback: FeedbackType;
  onClose: () => void;
  onSubmit: (data: { understanding: 'full' | 'partial' | 'need-clarity'; reasons: string[]; comment: string }) => void;
}) {
  const [understanding, setUnderstanding] = useState<'full' | 'partial' | 'need-clarity' | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const reasonOptions = [
    { id: 'pace-fast', label: 'Pace too fast' },
    { id: 'concept-unclear', label: 'Concept not clear' },
    { id: 'need-examples', label: 'Need more examples' },
    { id: 'missed-lecture', label: 'Missed part of lecture' },
  ];

  const handleReasonToggle = (id: string) => {
    setReasons((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!understanding) return;
    onSubmit({ understanding, reasons, comment });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Give Feedback</h2>
              <p className="text-sm text-zinc-400 mt-1">
                {feedback.course_code} • {feedback.topic}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-5">
          {/* Understanding level */}
          <div>
            <label className="text-sm font-medium text-white mb-3 block">
              How well did you understand this lecture?
            </label>
            <div className="space-y-2">
              {[
                { id: 'full', label: 'Fully understood', icon: ThumbsUp, color: 'emerald' },
                { id: 'partial', label: 'Partially understood', icon: HelpCircle, color: 'amber' },
                { id: 'need-clarity', label: 'Need more clarity', icon: ThumbsDown, color: 'rose' },
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = understanding === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setUnderstanding(option.id as any)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                      ${isSelected
                        ? `bg-${option.color}-500/20 border-${option.color}-500/40 text-white`
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-300 hover:border-white/[0.1]'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? `text-${option.color}-400` : 'text-zinc-500'}`} />
                    <span className="text-sm font-medium">{option.label}</span>
                    {isSelected && (
                      <CheckCircle className={`w-4 h-4 ml-auto text-${option.color}-400`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reasons (only show if not fully understood) */}
          {understanding && understanding !== 'full' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="text-sm font-medium text-white mb-3 block">
                What made it difficult? (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {reasonOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleReasonToggle(option.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${reasons.includes(option.id)
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Anything specific you struggled with?
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g., 'The rotation operations in AVL trees were confusing'"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm resize-none focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-zinc-300 font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSubmit}
              disabled={!understanding || !comment.trim()}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors
                ${understanding && comment.trim()
                  ? 'bg-purple-500 hover:bg-purple-400 text-white'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }
              `}
              whileHover={understanding && comment.trim() ? { scale: 1.02 } : {}}
              whileTap={understanding && comment.trim() ? { scale: 0.98 } : {}}
            >
              <Send className="w-4 h-4" />
              Submit Feedback
            </motion.button>
          </div>
          <p className="text-xs text-zinc-500 mt-3 text-center">
            Your feedback helps professors improve their teaching
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Toast notification
function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-xl"
    >
      <Sparkles className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function StudentFeedback() {
  const [tab, setTab] = useState<TabType>('pending');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { feedback, pendingCount, submittedCount, submitFeedback } = useStudentFeedback(tab);

  const handleSubmitFeedback = (data: { understanding: 'full' | 'partial' | 'need-clarity'; reasons: string[]; comment: string }) => {
    if (selectedFeedback) {
      submitFeedback(selectedFeedback.id, data);
      setSelectedFeedback(null);
      setToast('Feedback submitted! Thanks for helping improve the course.');
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          My Feedback
        </h1>
        <p className="text-zinc-400 mt-1">Give feedback on lectures to help professors improve</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
        <TabButton
          label="Pending"
          count={pendingCount}
          active={tab === 'pending'}
          onClick={() => setTab('pending')}
        />
        <TabButton
          label="Submitted"
          count={submittedCount}
          active={tab === 'submitted'}
          onClick={() => setTab('submitted')}
        />
        <TabButton
          label="All"
          count={pendingCount + submittedCount}
          active={tab === 'all'}
          onClick={() => setTab('all')}
        />
      </div>

      {/* Feedback list */}
      {feedback.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
            {tab === 'pending' ? (
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            ) : (
              <MessageSquare className="w-8 h-8 text-zinc-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {tab === 'pending' ? 'All caught up!' : 'No feedback yet'}
          </h3>
          <p className="text-zinc-500 text-sm text-center max-w-sm">
            {tab === 'pending'
              ? "You've submitted all your pending feedback. Great job!"
              : 'Your submitted feedback will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => (
            <FeedbackCard
              key={item.id}
              feedback={item}
              onGiveFeedback={(id) => {
                const f = feedback.find((x) => x.id === id);
                if (f) setSelectedFeedback(f);
              }}
              onViewDetail={(id) => console.log('View detail:', id)}
            />
          ))}
        </div>
      )}

      {/* Feedback form modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <FeedbackFormModal
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
            onSubmit={handleSubmitFeedback}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
