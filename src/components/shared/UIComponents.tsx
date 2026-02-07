/**
 * LIS Shared UI Components
 * Reusable cards, badges, and modals
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Lightbulb,
  Info,
  ChevronRight,
} from 'lucide-react';
import { UNDERSTANDING_COLORS, RISK_COLORS } from './Charts';

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'red' | 'purple' | 'cyan';
  onClick?: () => void;
}

const colorClasses = {
  indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  red: 'from-red-500/20 to-red-600/10 border-red-500/30',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'indigo',
  onClick,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : undefined}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${colorClasses[color]}
        border backdrop-blur-xl
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-white/5">
            {icon}
          </div>
        )}
      </div>

      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-3 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm">{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// RISK BADGE
// ============================================

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, showLabel = true, size = 'md' }: RiskBadgeProps) {
  const colors = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border font-medium
      ${colors[level]} ${sizes[size]}
    `}>
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: RISK_COLORS[level] }}
      />
      {showLabel && labels[level]}
    </span>
  );
}

// ============================================
// UNDERSTANDING BADGE
// ============================================

interface UnderstandingBadgeProps {
  level: 'full' | 'partial' | 'unclear';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function UnderstandingBadge({ level, showLabel = true, size = 'md' }: UnderstandingBadgeProps) {
  const config = {
    full: {
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle,
      label: 'Full Understanding',
    },
    partial: {
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: Clock,
      label: 'Partial',
    },
    unclear: {
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: AlertTriangle,
      label: 'Need Clarity',
    },
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const { color, icon: Icon, label } = config[level];

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border font-medium
      ${color} ${sizes[size]}
    `}>
      <Icon className="w-3.5 h-3.5" />
      {showLabel && label}
    </span>
  );
}

// ============================================
// INSIGHT CARD
// ============================================

interface InsightCardProps {
  id: string;
  type: 'action' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: (id: string) => void;
}

export function InsightCard({
  id,
  type,
  title,
  description,
  priority,
  actionLabel,
  onAction,
  onDismiss,
}: InsightCardProps) {
  const config = {
    action: {
      icon: Lightbulb,
      color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
    warning: {
      icon: AlertTriangle,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    info: {
      icon: Info,
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    success: {
      icon: CheckCircle,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
  };

  const { icon: Icon, color, iconColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`
        relative rounded-xl p-4 border
        bg-gradient-to-br ${color}
      `}
    >
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg bg-white/5 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-white">{title}</h4>
            {priority && (
              <RiskBadge level={priority} size="sm" showLabel={false} />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">{description}</p>

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {actionLabel}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={() => onDismiss(id)}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// COURSE CARD
// ============================================

interface CourseCardProps {
  code: string;
  title: string;
  instructor?: string;
  studentCount?: number;
  lectureCount?: number;
  healthPct?: number;
  understandingPct?: number;
  semester?: string;
  onClick?: () => void;
}

export function CourseCard({
  code,
  title,
  instructor,
  studentCount,
  lectureCount,
  healthPct,
  understandingPct,
  semester,
  onClick,
}: CourseCardProps) {
  const health = healthPct ?? 100;
  const healthColor = health >= 80 ? 'emerald' : health >= 60 ? 'amber' : 'red';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`
        rounded-2xl p-5 cursor-pointer
        bg-gradient-to-br from-slate-800/80 to-slate-900/80
        border border-slate-700/50 hover:border-indigo-500/50
        transition-colors duration-200
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
            {code}
          </span>
          <h3 className="text-lg font-semibold text-white mt-1">{title}</h3>
        </div>
        {healthPct !== undefined && (
          <div className={`
            px-2.5 py-1 rounded-full text-xs font-medium
            ${healthColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
            ${healthColor === 'amber' ? 'bg-amber-500/20 text-amber-400' : ''}
            ${healthColor === 'red' ? 'bg-red-500/20 text-red-400' : ''}
          `}>
            {health}% health
          </div>
        )}
      </div>

      {instructor && (
        <p className="text-sm text-slate-400 mb-3">{instructor}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500">
        {studentCount !== undefined && (
          <span>{studentCount} students</span>
        )}
        {lectureCount !== undefined && (
          <span>{lectureCount} lectures</span>
        )}
        {semester && (
          <span>{semester}</span>
        )}
      </div>

      {understandingPct !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Understanding</span>
            <span className="text-white font-medium">{understandingPct}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${understandingPct}%`,
                backgroundColor: understandingPct >= 80 ? UNDERSTANDING_COLORS.full : understandingPct >= 60 ? UNDERSTANDING_COLORS.partial : UNDERSTANDING_COLORS.unclear,
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// LECTURE CARD
// ============================================

interface LectureCardProps {
  title: string;
  topics: string[];
  dateTime: string;
  feedbackCount?: number;
  responseRate?: number;
  understandingPct?: number;
  onClick?: () => void;
}

export function LectureCard({
  title,
  topics,
  dateTime,
  feedbackCount,
  responseRate,
  understandingPct,
  onClick,
}: LectureCardProps) {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`
        rounded-xl p-4 cursor-pointer
        bg-slate-800/50 hover:bg-slate-800/80
        border border-slate-700/50 hover:border-slate-600
        transition-colors duration-200
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-base font-medium text-white">{title}</h4>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-full bg-slate-700/50 text-slate-300"
              >
                {topic}
              </span>
            ))}
            {topics.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700/50 text-slate-400">
                +{topics.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">{formattedDate}</p>
          <p className="text-xs text-slate-500">{formattedTime}</p>
        </div>
      </div>

      {(feedbackCount !== undefined || understandingPct !== undefined) && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/50">
          {feedbackCount !== undefined && (
            <span className="text-xs text-slate-400">
              <span className="text-white font-medium">{feedbackCount}</span> responses
            </span>
          )}
          {responseRate !== undefined && (
            <span className="text-xs text-slate-400">
              <span className="text-white font-medium">{responseRate}%</span> rate
            </span>
          )}
          {understandingPct !== undefined && (
            <span className={`text-xs ${
              understandingPct >= 80 ? 'text-emerald-400' :
              understandingPct >= 60 ? 'text-amber-400' : 'text-red-400'
            }`}>
              <span className="font-medium">{understandingPct}%</span> clarity
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// STUDENT ROW
// ============================================

interface StudentRowProps {
  name: string;
  email: string;
  avatar?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  isSilent?: boolean;
  feedbackCount?: number;
  understandingPct?: number;
  onClick?: () => void;
}

export function StudentRow({
  name,
  email,
  avatar,
  riskLevel,
  isSilent,
  feedbackCount,
  understandingPct,
  onClick,
}: StudentRowProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-4 p-3 rounded-xl
        bg-slate-800/30 hover:bg-slate-800/60
        border border-transparent hover:border-slate-700/50
        transition-colors duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
        {avatar || name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-white truncate">{name}</h4>
          {isSilent && (
            <span className="px-1.5 py-0.5 text-xs rounded bg-orange-500/20 text-orange-400">
              Silent
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate">{email}</p>
      </div>

      <div className="flex items-center gap-3">
        {feedbackCount !== undefined && (
          <span className="text-xs text-slate-400">
            {feedbackCount} feedback
          </span>
        )}
        {understandingPct !== undefined && (
          <span className={`text-xs font-medium ${
            understandingPct >= 80 ? 'text-emerald-400' :
            understandingPct >= 60 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {understandingPct}%
          </span>
        )}
        {riskLevel && (
          <RiskBadge level={riskLevel} size="sm" />
        )}
      </div>
    </div>
  );
}

// ============================================
// MODAL
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              w-full ${sizes[size]} max-h-[90vh] overflow-auto
              bg-slate-900 border border-slate-700 rounded-2xl
              shadow-2xl z-50
            `}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 mt-2 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================
// LOADING SKELETON
// ============================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl p-5 bg-slate-800/50 border border-slate-700/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}
