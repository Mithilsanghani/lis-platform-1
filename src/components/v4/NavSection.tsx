/**
 * NavSection - Reusable navigation section item
 * Icon + Label + Badge + Spacious
 */

import { motion } from 'framer-motion';
import React from 'react';

interface NavSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  badgeColor?: 'red' | 'orange' | 'blue' | 'purple' | 'gray';
  isActive?: boolean;
  onClick?: () => void;
  description?: string;
}

export default function NavSection({
  icon: Icon,
  label,
  badge,
  badgeColor = 'purple',
  isActive = false,
  onClick,
  description,
}: NavSectionProps) {
  const badgeStyles = {
    red: 'bg-red-500/90 text-red-50',
    orange: 'bg-orange-500/90 text-orange-50',
    blue: 'bg-blue-500/90 text-blue-50',
    purple: 'bg-[#7C3AED]/90 text-purple-50',
    gray: 'bg-[#4B5563]/90 text-[#9CA3AF]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full px-4 py-4 rounded-lg flex items-center justify-between transition-all group ${
        isActive
          ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white'
          : 'hover:bg-[#2A2A40] text-[#D1D5DB]'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Icon
          className={`w-5 h-5 flex-shrink-0 transition ${
            isActive ? 'text-white' : 'text-[#7C3AED] group-hover:text-white'
          }`}
        />
        <div className="text-left min-w-0">
          <p className="text-sm font-semibold truncate">{label}</p>
          {description && (
            <p className="text-xs text-[#6B7280] truncate">{description}</p>
          )}
        </div>
      </div>

      {/* BADGE - Only show if > 0 */}
      {badge !== undefined && badge > 0 && (
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className={`flex-shrink-0 ml-2 min-w-[28px] h-6 rounded-full flex items-center justify-center text-xs font-bold ${badgeStyles[badgeColor]}`}
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
}
