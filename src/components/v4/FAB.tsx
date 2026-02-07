/**
 * FAB - Floating Action Button
 * Footer action menu (New Lecture, New Course, Enroll)
 * 56px, sticky bottom
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Users } from 'lucide-react';
import { useState } from 'react';

interface FABProps {
  onAction?: (action: string) => void;
}

export default function FAB({ onAction }: FABProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { id: 'new-lecture', icon: BookOpen, label: 'New Lecture', color: 'blue' },
    { id: 'new-course', icon: BookOpen, label: 'New Course', color: 'purple' },
    { id: 'enroll', icon: Users, label: 'Enroll', color: 'green' },
  ];

  const colorStyles = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-[#7C3AED] hover:bg-[#6D28D9]',
    green: 'bg-emerald-600 hover:bg-emerald-700',
  };

  return (
    <motion.div
      className="fixed bottom-8 left-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* EXPANDED MENU */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-0 space-y-2"
          >
            {actions.map((action, idx) => (
              <motion.button
                key={action.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  onAction?.(action.id);
                  setIsExpanded(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${colorStyles[action.color as keyof typeof colorStyles]} transition shadow-lg hover:shadow-xl`}
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN FAB BUTTON */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
