/**
 * LIS v2.0 - Shared UI Components
 * Layout components, cards, and common UI elements
 */

import React, { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ================== Layout Components ==================

interface SidebarProps {
  children: ReactNode;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  children, 
  isCollapsed = false,
  onToggle 
}) => {
  return (
    <aside 
      className={`
        fixed left-0 top-0 h-full bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 z-40
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <span className={`font-bold text-xl text-indigo-600 ${isCollapsed ? 'hidden' : 'block'}`}>
            LIS
          </span>
          {isCollapsed && (
            <span className="font-bold text-xl text-indigo-600">L</span>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {children}
        </nav>

        {/* Toggle Button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-4 border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg 
              className={`w-5 h-5 mx-auto transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  badge?: number | string;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  isActive = false,
  isCollapsed = false,
  onClick,
  badge,
}) => {
  const content = (
    <>
      <span className="w-6 h-6 flex-shrink-0">{icon}</span>
      {!isCollapsed && (
        <>
          <span className="ml-3 flex-1">{label}</span>
          {badge !== undefined && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </>
  );

  const className = `
    flex items-center px-4 py-3 mx-2 rounded-lg transition-colors
    ${isActive 
      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  `;

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button className={`${className} w-full text-left`} onClick={onClick}>
      {content}
    </button>
  );
};

interface TopBarProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  sidebarWidth?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  subtitle,
  children,
  sidebarWidth = 256 
}) => {
  return (
    <header 
      className="fixed top-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30"
      style={{ left: sidebarWidth }}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </header>
  );
};

interface MainContentProps {
  children: ReactNode;
  sidebarWidth?: number;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  children,
  sidebarWidth = 256 
}) => {
  return (
    <main 
      className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-950"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="p-6">
        {children}
      </div>
    </main>
  );
};

// ================== Card Components ==================

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  onClick,
  hover = false 
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800
        ${hover ? 'hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'indigo' | 'green' | 'yellow' | 'red' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'indigo',
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className={`mt-2 flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="ml-1 text-gray-500">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// ================== Banner Components ==================

interface BannerProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  type,
  title,
  message,
  action,
  onDismiss,
}) => {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  };

  const icons = {
    info: '💡',
    warning: '⚠️',
    error: '❌',
    success: '✅',
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type]}`}>
      <div className="flex items-start">
        <span className="text-xl mr-3">{icons[type]}</span>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
          {action && (
            <button 
              onClick={action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="ml-4 opacity-70 hover:opacity-100">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// ================== Modal Components ==================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  const maxWidths = {
    sm: '384px',
    md: '520px',
    lg: '672px',
    xl: '896px',
  };

  // Disable body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        padding: '24px',
        boxSizing: 'border-box',
        margin: 0,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: maxWidths[size],
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          maxHeight: 'calc(100vh - 48px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column' as const,
          boxSizing: 'border-box' as const,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
          flexShrink: 0,
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', margin: 0 }}>{title}</h3>
          <button 
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '16px 20px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '16px 20px',
            borderTop: '1px solid rgba(51, 65, 85, 0.5)',
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// ================== Button Components ==================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// ================== Progress Components ==================

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'indigo',
  size = 'md',
  showLabel = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorClasses = {
    indigo: 'bg-indigo-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClasses[color]}`}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</p>
      )}
    </div>
  );
};

// ================== Understanding Indicator ==================

interface UnderstandingIndicatorProps {
  level: 'fully_understood' | 'partially_understood' | 'not_understood';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const UnderstandingIndicator: React.FC<UnderstandingIndicatorProps> = ({
  level,
  size = 'md',
  showLabel = true,
}) => {
  const config = {
    fully_understood: { color: 'bg-green-500', label: 'Fully Understood', emoji: '✅' },
    partially_understood: { color: 'bg-yellow-500', label: 'Partially Understood', emoji: '🤔' },
    not_understood: { color: 'bg-red-500', label: 'Not Understood', emoji: '❌' },
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const { color, label, emoji } = config[level];

  return (
    <div className="flex items-center gap-2">
      <span className={`${sizeClasses[size]} rounded-full ${color}`} />
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {emoji} {label}
        </span>
      )}
    </div>
  );
};

// ================== Empty State ==================

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-400 max-w-md">{description}</p>
      )}
      {action && (
        <Button variant="primary" size="sm" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

// ================== Skeleton Loading ==================

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <Card className="p-6">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </Card>
  );
};

// ================== Tabs ==================

interface TabsProps {
  tabs: Array<{ id: string; label: string; badge?: number }>;
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <nav className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              py-3 px-1 border-b-2 text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default {
  Sidebar,
  NavItem,
  TopBar,
  MainContent,
  Card,
  StatCard,
  Banner,
  Modal,
  Button,
  ProgressBar,
  UnderstandingIndicator,
  EmptyState,
  Skeleton,
  CardSkeleton,
  Tabs,
};
