import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Send } from 'lucide-react';

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: string[];
  isLoading?: boolean;
}

export default function InsightsModal({ isOpen, onClose, insights, isLoading = false }: InsightsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI-Generated Insights</h2>
                  <p className="text-xs text-slate-400">Based on latest feedback analysis</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-400"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full" />
                </div>
              ) : insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-slate-800/50 border border-blue-500/20 rounded-lg hover:border-blue-500/50 transition"
                  >
                    <p className="text-slate-200 text-sm leading-relaxed">{insight}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400">No insights generated yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700 sticky bottom-0 bg-slate-900 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send to Students
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
