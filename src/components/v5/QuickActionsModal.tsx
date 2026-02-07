/**
 * QUICK ACTIONS MODAL v5.0 - Glassmorphism command palette
 * Features: Blur backdrop, haptic feedback, keyboard shortcuts
 * Actions: New Lecture, New Course, Bulk Enroll, AI Analysis
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  BookOpen,
  Users,
  QrCode,
  Upload,
  Sparkles,
  Command,
} from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

interface QuickAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  shortcut: string;
  color: string;
  gradient: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new-lecture',
    icon: Plus,
    label: 'New Lecture',
    description: 'Start a live lecture session with QR',
    shortcut: 'L',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'new-course',
    icon: BookOpen,
    label: 'New Course',
    description: 'Create a new course for this semester',
    shortcut: 'C',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'bulk-enroll',
    icon: Users,
    label: 'Bulk Enroll',
    description: 'Upload CSV to enroll students',
    shortcut: 'E',
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'ai-analysis',
    icon: Sparkles,
    label: 'AI Analysis',
    description: 'Get AI insights on course performance',
    shortcut: 'A',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'generate-qr',
    icon: QrCode,
    label: 'Generate QR',
    description: 'Create attendance QR for active lecture',
    shortcut: 'Q',
    color: 'text-indigo-400',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'upload-material',
    icon: Upload,
    label: 'Upload Material',
    description: 'Add slides, notes, or resources',
    shortcut: 'U',
    color: 'text-rose-400',
    gradient: 'from-rose-500 to-red-500',
  },
];

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: (actionId: string) => void;
}

export default function QuickActionsModal({
  isOpen,
  onClose,
  onAction,
}: QuickActionsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { vibrate } = useHaptics();

  // Filter actions based on search
  const filteredActions = QUICK_ACTIONS.filter(
    (action) =>
      action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filteredActions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            handleActionClick(filteredActions[selectedIndex].id);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  const handleActionClick = (actionId: string) => {
    vibrate('medium');
    onAction?.(actionId);
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
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-4 top-[15%] z-[70] max-w-lg mx-auto"
          >
            {/* Glass Card */}
            <div className="relative bg-[#1A1A2E]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden">
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

              {/* Header */}
              <div className="relative p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 px-3 py-2.5 bg-white/5 rounded-xl border border-white/10">
                    <Command className="w-4 h-4 text-purple-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedIndex(0);
                      }}
                      placeholder="Type a command or search..."
                      className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      vibrate('light');
                      onClose();
                    }}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                  >
                    <X className="w-5 h-5 text-white/50" />
                  </motion.button>
                </div>
              </div>

              {/* Actions List */}
              <div className="relative p-2 max-h-[400px] overflow-y-auto">
                <div className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3 py-2">
                  Quick Actions
                </div>

                {filteredActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleActionClick(action.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                      selectedIndex === index
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all`}
                    >
                      <action.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-white text-sm">
                        {action.label}
                      </p>
                      <p className="text-xs text-white/50">{action.description}</p>
                    </div>

                    {/* Shortcut */}
                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-white/40 bg-white/5 rounded border border-white/10">
                      <Command className="w-3 h-3" />
                      {action.shortcut}
                    </kbd>
                  </motion.button>
                ))}

                {filteredActions.length === 0 && (
                  <div className="py-8 text-center text-white/40 text-sm">
                    No actions found for "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="relative p-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/30">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
                      ↑↓
                    </kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
                      ↵
                    </kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
                    ESC
                  </kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
