/**
 * NavItem - Spacious, interactive navigation item
 * Min-height 56px for comfortable mobile tapping
 * Hover effects with glow, ripple feedback
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NavItemProps {
  children: ReactNode;
  isActive?: boolean;
  expanded?: boolean;
  onClick: () => void;
  title?: string;
  className?: string;
}

export default function NavItem({
  children,
  isActive = false,
  expanded = true,
  onClick,
  title,
  className = '',
}: NavItemProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={title}
      className={`relative w-full flex items-center ${
        expanded ? 'p-3' : 'p-2 flex-col gap-1'
      } rounded-lg transition min-h-[56px] group overflow-hidden ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50'
          : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
      } ${className}`}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-active:opacity-100"
        animate={{ scale: [0.5, 2] }}
        transition={{ duration: 0.4 }}
      />

      {/* Glow on hover */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.button>
  );
}
