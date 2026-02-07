/**
 * CritAlert - Critical alert banner
 * Only shows when silent students > 10
 * Tap to send nudge SMS
 */

import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CritAlertProps {
  count: number;
  onTap: () => void;
  isLoading?: boolean;
}

export default function CritAlert({ count, onTap, isLoading }: CritAlertProps) {
  return (
    <motion.button
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onClick={onTap}
      className="mx-4 mt-3 mb-2 px-4 py-3 bg-gradient-to-r from-red-900/60 to-red-950/40 border border-red-500/30 rounded-lg flex items-center space-x-2 hover:from-red-800/70 hover:to-red-900/50 transition group"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertCircle className="w-5 h-5 text-red-400" />
      </motion.div>
      <div className="text-left flex-1">
        <p className="text-xs font-bold text-red-300">
          {count} Silent Students
        </p>
        <p className="text-[10px] text-red-200/70 group-hover:text-red-200">
          Tap to send nudge →
        </p>
      </div>
      {isLoading && (
        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
      )}
    </motion.button>
  );
}
