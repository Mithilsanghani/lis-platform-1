/**
 * Badge - Interactive, animated badge component
 * Shows unread counts with severity colors
 * Variants: critical (red), warning (yellow), default (gray)
 * Clickable for navigation, pulsing animations
 */

import { motion } from 'framer-motion';

interface BadgeProps {
  count: number;
  variant?: 'critical' | 'warning' | 'default';
  clickable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const variantStyles = {
  critical: 'bg-red-600 text-white shadow-lg shadow-red-500/50',
  warning: 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50',
  default: 'bg-slate-700 text-slate-100',
};

const pulseAnimation = {
  critical: {
    animate: { scale: [1, 1.1, 1], boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 8px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)'] },
    transition: { duration: 2, repeat: Infinity }
  },
  warning: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity }
  },
  default: {
    animate: {},
    transition: {}
  }
};

export default function Badge({
  count,
  variant = 'default',
  clickable = false,
  onClick,
}: BadgeProps) {
  const pulseConfig = pulseAnimation[variant];
  const baseProps = {
    initial: { scale: 0 },
    className: `inline-flex items-center justify-center min-w-[28px] h-7 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
      variantStyles[variant]
    } ${clickable ? 'cursor-pointer hover:shadow-xl transition' : ''}`,
    onClick,
  };

  return (
    <motion.span
      {...baseProps}
      animate={pulseConfig.animate}
      transition={pulseConfig.transition}
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
}
