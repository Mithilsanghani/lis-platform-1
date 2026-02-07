/**
 * BulkActionsBarV13 - LIS v13.0
 * Bulk actions toolbar with AI-powered options
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  X,
  Send,
  FileText,
  CheckCircle,
  ChevronDown,
  Sparkles,
  Download,
  Users,
  AlertTriangle,
} from 'lucide-react';

interface BulkActionsBarV13Props {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkNudge: () => void;
  onBulkExport: () => void;
  onBulkMarkReviewed: () => void;
  affectedStudents: number;
}

export function BulkActionsBarV13({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkNudge,
  onBulkExport,
  onBulkMarkReviewed,
  affectedStudents,
}: BulkActionsBarV13Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setShowConfirmModal(action);
    setShowDropdown(false);
  };

  const executeAction = () => {
    switch (showConfirmModal) {
      case 'nudge':
        onBulkNudge();
        break;
      case 'export':
        onBulkExport();
        break;
      case 'review':
        onBulkMarkReviewed();
        break;
    }
    setShowConfirmModal(null);
  };

  return (
    <>
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 shadow-2xl">
              {/* Selection count */}
              <div className="flex items-center gap-2 pr-3 border-r border-zinc-700">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">
                  {selectedCount} of {totalCount} selected
                </span>
              </div>

              {/* Select all / Clear */}
              <div className="flex items-center gap-2">
                {selectedCount < totalCount && (
                  <motion.button
                    onClick={onSelectAll}
                    className="px-3 py-1.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Select all
                  </motion.button>
                )}
                <motion.button
                  onClick={onClearSelection}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-zinc-700" />

              {/* Quick actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => handleAction('nudge')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Nudge
                </motion.button>

                <motion.button
                  onClick={() => handleAction('export')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </motion.button>

                {/* More actions dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    More
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-2 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden"
                      >
                        <button
                          onClick={() => handleAction('review')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white text-left"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Mark feedback reviewed
                        </button>
                        <button
                          onClick={() => handleAction('export')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white text-left"
                        >
                          <FileText className="w-4 h-4 text-blue-400" />
                          Generate summary report
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center
                  ${showConfirmModal === 'nudge' 
                    ? 'bg-purple-500/20' 
                    : showConfirmModal === 'export'
                    ? 'bg-blue-500/20'
                    : 'bg-emerald-500/20'
                  }
                `}>
                  {showConfirmModal === 'nudge' && <Sparkles className="w-7 h-7 text-purple-400" />}
                  {showConfirmModal === 'export' && <FileText className="w-7 h-7 text-blue-400" />}
                  {showConfirmModal === 'review' && <CheckCircle className="w-7 h-7 text-emerald-400" />}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white text-center mb-2">
                  {showConfirmModal === 'nudge' && 'Send AI-Powered Nudge?'}
                  {showConfirmModal === 'export' && 'Export Course Summary?'}
                  {showConfirmModal === 'review' && 'Mark Feedback Reviewed?'}
                </h3>

                <p className="text-zinc-400 text-center mb-6">
                  {showConfirmModal === 'nudge' && (
                    <>This will send personalized nudge messages to silent students across <span className="text-white font-medium">{selectedCount} courses</span>, affecting approximately <span className="text-white font-medium">{affectedStudents.toLocaleString()} students</span>.</>
                  )}
                  {showConfirmModal === 'export' && (
                    <>This will generate a PDF summary report for <span className="text-white font-medium">{selectedCount} courses</span> including health metrics, student engagement, and AI insights.</>
                  )}
                  {showConfirmModal === 'review' && (
                    <>This will mark all unread feedback as reviewed for <span className="text-white font-medium">{selectedCount} courses</span>. Students won't be notified.</>
                  )}
                </p>

                {/* Stats preview */}
                <div className="flex items-center justify-center gap-6 mb-6 py-3 px-4 rounded-xl bg-white/5">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedCount}</div>
                    <div className="text-xs text-zinc-400">Courses</div>
                  </div>
                  <div className="w-px h-10 bg-zinc-700" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{affectedStudents.toLocaleString()}</div>
                    <div className="text-xs text-zinc-400">Students</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowConfirmModal(null)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 font-medium transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={executeAction}
                    className={`
                      flex-1 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2
                      ${showConfirmModal === 'nudge'
                        ? 'bg-purple-500 hover:bg-purple-400 text-white'
                        : showConfirmModal === 'export'
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                      }
                    `}
                    whileTap={{ scale: 0.98 }}
                  >
                    {showConfirmModal === 'nudge' && <><Send className="w-4 h-4" />Send Nudge</>}
                    {showConfirmModal === 'export' && <><Download className="w-4 h-4" />Export</>}
                    {showConfirmModal === 'review' && <><CheckCircle className="w-4 h-4" />Confirm</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
