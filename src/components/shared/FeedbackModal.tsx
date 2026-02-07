/**
 * LIS v2.0 - Feedback Form Modal
 * Three-option feedback submission component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UnderstandingLevel, FeedbackReason } from '../../types/lis-v2';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    understanding_level: UnderstandingLevel;
    question?: string;
    reason?: FeedbackReason;
    is_anonymous: boolean;
  }) => void;
  lectureTitle: string;
  lectureTopic?: string;
  isLoading?: boolean;
}

const UNDERSTANDING_OPTIONS = [
  {
    level: 'fully_understood' as const,
    emoji: '✅',
    label: 'Fully Understood',
    description: 'I got everything!',
    color: 'bg-green-50 border-green-200 hover:border-green-400 text-green-700',
    selectedColor: 'bg-green-100 border-green-500 ring-2 ring-green-500/20',
  },
  {
    level: 'partially_understood' as const,
    emoji: '🤔',
    label: 'Partially Understood',
    description: 'Some parts were unclear',
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 text-yellow-700',
    selectedColor: 'bg-yellow-100 border-yellow-500 ring-2 ring-yellow-500/20',
  },
  {
    level: 'not_understood' as const,
    emoji: '❌',
    label: 'Not Understood',
    description: 'I need help with this',
    color: 'bg-red-50 border-red-200 hover:border-red-400 text-red-700',
    selectedColor: 'bg-red-100 border-red-500 ring-2 ring-red-500/20',
  },
];

const REASON_OPTIONS: Array<{ value: FeedbackReason; label: string }> = [
  { value: 'pace_too_fast', label: '⏩ Pace was too fast' },
  { value: 'needs_more_examples', label: '📝 Needed more examples' },
  { value: 'concept_unclear', label: '❓ Concept was unclear' },
  { value: 'prerequisite_gap', label: '📚 Missing prerequisite knowledge' },
  { value: 'other', label: '💭 Other reason' },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lectureTitle,
  lectureTopic,
  isLoading = false,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLevel, setSelectedLevel] = useState<UnderstandingLevel | null>(null);
  const [selectedReason, setSelectedReason] = useState<FeedbackReason | null>(null);
  const [question, setQuestion] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleLevelSelect = (level: UnderstandingLevel) => {
    setSelectedLevel(level);
    if (level === 'fully_understood') {
      // Skip to submit for fully understood
      setStep(2);
    } else {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (!selectedLevel) return;

    onSubmit({
      understanding_level: selectedLevel,
      question: question.trim() || undefined,
      reason: selectedReason || undefined,
      is_anonymous: isAnonymous,
    });

    // Reset state
    setStep(1);
    setSelectedLevel(null);
    setSelectedReason(null);
    setQuestion('');
    setIsAnonymous(false);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedLevel(null);
    setSelectedReason(null);
    setQuestion('');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    How did this lecture go?
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {lectureTitle}
                  </p>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mt-4">
                <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Select your understanding level:
                    </p>
                    
                    {UNDERSTANDING_OPTIONS.map((option) => (
                      <button
                        key={option.level}
                        onClick={() => handleLevelSelect(option.level)}
                        className={`
                          w-full p-4 rounded-xl border-2 text-left transition-all
                          ${selectedLevel === option.level ? option.selectedColor : option.color}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.emoji}</span>
                          <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm opacity-75">{option.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Show selected level */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-xl">
                        {UNDERSTANDING_OPTIONS.find(o => o.level === selectedLevel)?.emoji}
                      </span>
                      <span className="font-medium">
                        {UNDERSTANDING_OPTIONS.find(o => o.level === selectedLevel)?.label}
                      </span>
                      <button 
                        onClick={() => setStep(1)}
                        className="ml-auto text-sm text-indigo-600 hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    {/* Reason selection (for non-fully understood) */}
                    {selectedLevel !== 'fully_understood' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          What made it difficult? (optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {REASON_OPTIONS.map((reason) => (
                            <button
                              key={reason.value}
                              onClick={() => setSelectedReason(
                                selectedReason === reason.value ? null : reason.value
                              )}
                              className={`
                                px-3 py-1.5 rounded-full text-sm transition-all
                                ${selectedReason === reason.value
                                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500/20'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                              `}
                            >
                              {reason.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Question input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Any questions? (optional)
                      </label>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={
                          selectedLevel === 'fully_understood'
                            ? "Any thoughts or suggestions?"
                            : "What would help you understand better?"
                        }
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Anonymous toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-gray-200 peer-checked:bg-indigo-600 rounded-full transition-colors" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Submit anonymously
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {step === 2 && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedLevel}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ================== Quick Feedback Button ==================

interface QuickFeedbackButtonProps {
  lectureId: string;
  lectureTitle: string;
  onSubmit: (data: {
    understanding_level: UnderstandingLevel;
    question?: string;
    reason?: FeedbackReason;
    is_anonymous: boolean;
  }) => void;
  isLoading?: boolean;
}

export const QuickFeedbackButton: React.FC<QuickFeedbackButtonProps> = ({
  lectureId,
  lectureTitle,
  onSubmit,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Give Feedback
      </button>

      <FeedbackModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => {
          onSubmit(data);
          setIsOpen(false);
        }}
        lectureTitle={lectureTitle}
        isLoading={isLoading}
      />
    </>
  );
};

export default FeedbackModal;
