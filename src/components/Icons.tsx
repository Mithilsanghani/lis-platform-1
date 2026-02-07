/**
 * Icon Reference Component
 * Centralized icon exports with colors matching IIT dark theme
 * Used across all navigation and alert components
 */

import {
  BarChart3,
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Settings,
  AlertCircle,
  Bell,
  CheckCircle2,
  XCircle,
  Zap,
  Plus,
  Search,
  Menu,
  X,
  LogOut,
  Eye,
  Download,
  Share2,
  Trash2,
  MoreVertical,
  Lightbulb,
  Send,
  Copy,
  TrendingDown,
  MessageSquare,
  Edit,
  Save,
} from 'lucide-react';

/**
 * Icon Color Palette (Matching IIT Dark Theme)
 */
export const ICON_COLORS = {
  // Primary actions
  primary: '#3B82F6', // blue-500
  secondary: '#A855F7', // purple-600
  accent: '#6366F1', // indigo-500

  // Severity/Status
  success: '#10B981', // emerald-500
  warning: '#F59E0B', // amber-500
  danger: '#EF4444', // red-500
  critical: '#DC2626', // red-600

  // Neutral
  muted: '#64748B', // slate-500
  background: '#1E1B4B', // slate-900
  surface: '#334155', // slate-700

  // Intelligence indicators
  ai: '#06B6D4', // cyan-500
  insight: '#8B5CF6', // violet-500
  alert: '#EF4444', // red-500
  healthy: '#10B981', // emerald-500
};

/**
 * Icon Props Interface
 */
export interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: keyof typeof ICON_COLORS;
}

/**
 * Size mappings
 */
const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

/**
 * Navigation Icons
 */
export const NavIcons = {
  Overview: BarChart3,
  Courses: BookOpen,
  Lectures: Clock,
  Students: Users,
  Insights: TrendingUp,
  Settings: Settings,
  Menu: Menu,
  Close: X,
};

/**
 * Alert/Status Icons
 */
export const StatusIcons = {
  Alert: AlertCircle,
  Warning: AlertCircle,
  Success: CheckCircle2,
  Error: XCircle,
  Notification: Bell,
  Critical: AlertCircle,
};

/**
 * Action Icons
 */
export const ActionIcons = {
  Add: Plus,
  Edit: Edit,
  Save: Save,
  Delete: Trash2,
  Download: Download,
  Share: Share2,
  More: MoreVertical,
  Send: Send,
  Copy: Copy,
  Search: Search,
  Logout: LogOut,
  View: Eye,
};

/**
 * AI/Intelligence Icons
 */
export const AIIcons = {
  Insight: Lightbulb,
  Analysis: TrendingUp,
  Alert: AlertCircle,
  Trend: TrendingDown,
  Message: MessageSquare,
  Energy: Zap,
};

/**
 * Helper Components for Common Patterns
 */

/**
 * Badge Icon - Small colored icon with pulse
 */
export function BadgeIcon({
  color = 'danger',
  pulse = false,
}: {
  color?: keyof typeof ICON_COLORS;
  pulse?: boolean;
}) {
  return (
    <div className={`relative ${pulse ? 'animate-pulse' : ''}`}>
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: ICON_COLORS[color] }}
      />
    </div>
  );
}

/**
 * Status Indicator - Icon with label
 */
export function StatusIndicator({
  status,
  count,
  compact = false,
}: {
  status: 'success' | 'warning' | 'danger' | 'info';
  count?: number;
  compact?: boolean;
}) {
  const statusMap = {
    success: { icon: CheckCircle2, color: 'success', label: 'Clear' },
    warning: { icon: AlertCircle, color: 'warning', label: 'Attention' },
    danger: { icon: AlertCircle, color: 'danger', label: 'Critical' },
    info: { icon: Bell, color: 'accent', label: 'Update' },
  };

  const { icon: Icon, color, label } = statusMap[status];
  const colorMap: { [key: string]: string } = {
    success: 'text-emerald-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    accent: 'text-cyan-500',
  };

  return (
    <div className="flex items-center gap-2">
      <Icon
        className={`w-5 h-5 ${colorMap[color] || 'text-slate-400'}`}
      />
      {!compact && (
        <span className="text-sm font-medium">
          {label}
          {count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  );
}

/**
 * Priority Badge - Icon with number
 */
export function PriorityBadge({
  count,
  priority = 'medium',
}: {
  count: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}) {
  const priorityMap = {
    low: { color: ICON_COLORS.success, icon: '🟢' },
    medium: { color: ICON_COLORS.warning, icon: '🟡' },
    high: { color: ICON_COLORS.danger, icon: '🔴' },
    critical: { color: ICON_COLORS.critical, icon: '🔴' },
  };

  const { icon } = priorityMap[priority];

  if (count === 0) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: priorityMap[priority].color }}
    >
      {icon}
      {count}
    </span>
  );
}

/**
 * Colored Icon - Simple icon with color prop
 */
export function ColoredIcon({
  icon: Icon,
  color = 'primary',
  size = 'md',
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color?: keyof typeof ICON_COLORS;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const colorMap: { [key: string]: string } = {
    primary: 'text-blue-500',
    secondary: 'text-purple-600',
    success: 'text-emerald-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    critical: 'text-red-600',
    muted: 'text-slate-500',
    ai: 'text-cyan-500',
    insight: 'text-indigo-500',
    alert: 'text-orange-500',
    healthy: 'text-green-500',
    accent: 'text-violet-500',
  };

  return (
    <Icon
      className={`${SIZE_MAP[size]} ${colorMap[color] || 'text-slate-400'} ${className || ''}`}
    />
  );
}

/**
 * Export all icons
 */
export const ICONS = {
  nav: NavIcons,
  status: StatusIcons,
  action: ActionIcons,
  ai: AIIcons,
  colors: ICON_COLORS,
};
