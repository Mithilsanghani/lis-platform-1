/**
 * BulkActions v9.0 - Bulk Operations Dropdown
 * Features: Select all, archive, delete, nudge, export
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  CheckSquare,
  Square,
  Archive,
  Trash2,
  Send,
  Download,
  X,
  AlertCircle,
} from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onNudge: () => void;
  onExport: () => void;
  onDeselectAll: () => void;
}

export function BulkActions({
  selectedCount,
  totalCount,
  isAllSelected,
  onToggleSelectAll,
  onArchive,
  onDelete,
  onNudge,
  onExport,
  onDeselectAll,
}: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const handleAction = (action: string, handler: () => void) => {
    if (action === 'delete' || action === 'archive') {
      setConfirmAction(action);
    } else {
      handler();
      setIsOpen(false);
    }
  };

  const confirmAndExecute = (handler: () => void) => {
    handler();
    setConfirmAction(null);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            border transition-all duration-200
            ${selectedCount > 0
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
              : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {selectedCount > 0 ? (
            <>
              <CheckSquare className="w-4 h-4" />
              {selectedCount} Selected
            </>
          ) : (
            <>
              <Square className="w-4 h-4" />
              Bulk Actions
            </>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 w-56 py-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl z-50"
              >
                {/* Select All Option */}
                <button
                  onClick={() => { onToggleSelectAll(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {isAllSelected ? 'Deselect All' : `Select All (${totalCount})`}
                </button>

                {selectedCount > 0 && (
                  <>
                    <div className="my-2 border-t border-zinc-800" />
                    
                    {/* Nudge Silent Students */}
                    <button
                      onClick={() => handleAction('nudge', onNudge)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10"
                    >
                      <Send className="w-4 h-4" />
                      Nudge Silent Students
                    </button>

                    {/* Export Selected */}
                    <button
                      onClick={() => handleAction('export', onExport)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <Download className="w-4 h-4" />
                      Export Selected
                    </button>

                    <div className="my-2 border-t border-zinc-800" />

                    {/* Archive */}
                    <button
                      onClick={() => handleAction('archive', onArchive)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      <Archive className="w-4 h-4" />
                      Archive Selected
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleAction('delete', onDelete)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected
                    </button>

                    <div className="my-2 border-t border-zinc-800" />

                    {/* Clear Selection */}
                    <button
                      onClick={() => { onDeselectAll(); setIsOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                    >
                      <X className="w-4 h-4" />
                      Clear Selection
                    </button>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmAction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  confirmAction === 'delete' ? 'bg-rose-500/20' : 'bg-amber-500/20'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    confirmAction === 'delete' ? 'text-rose-400' : 'text-amber-400'
                  }`} />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {confirmAction === 'delete' ? 'Delete Courses?' : 'Archive Courses?'}
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  {confirmAction === 'delete' 
                    ? `Are you sure you want to delete ${selectedCount} course${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
                    : `Are you sure you want to archive ${selectedCount} course${selectedCount > 1 ? 's' : ''}? Archived courses can be restored later.`
                  }
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmAndExecute(confirmAction === 'delete' ? onDelete : onArchive)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium ${
                      confirmAction === 'delete'
                        ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    }`}
                  >
                    {confirmAction === 'delete' ? 'Delete' : 'Archive'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
