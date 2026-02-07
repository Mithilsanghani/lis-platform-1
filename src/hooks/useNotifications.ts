/**
 * useNotifications Hook v8.0
 * Real-time notification system with Supabase
 * Categories: feedback, alerts, system, ai
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  type: 'feedback' | 'alert' | 'system' | 'ai' | 'enrollment';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'ai',
    title: 'AI Insight Ready',
    message: '18 silent students detected across 3 courses. Nudge recommended.',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    actionUrl: '/dashboard?tab=ai',
  },
  {
    id: '2',
    type: 'feedback',
    title: 'New Feedback',
    message: 'CS201: "Great explanation of binary trees!" - Rahul S.',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    actionUrl: '/dashboard?tab=feedback',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Lecture Starting Soon',
    message: 'CS301 Dynamic Programming starts in 30 minutes',
    read: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: '4',
    type: 'enrollment',
    title: 'New Enrollment',
    message: '5 students enrolled in CS101 - Intro to Programming',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '5',
    type: 'system',
    title: 'Weekly Report Ready',
    message: 'Your engagement report for this week is available',
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '6',
    type: 'ai',
    title: 'Revision Plan Suggested',
    message: 'Based on feedback, CS201 students need Graph revision',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '7',
    type: 'feedback',
    title: 'Feedback Trend',
    message: 'Positive sentiment increased 12% this week 🎉',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      if (userId) {
        // Real Supabase fetch
        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          setNotifications(data.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            read: n.read,
            createdAt: new Date(n.created_at),
            actionUrl: n.action_url,
            metadata: n.metadata,
          })));
        } else {
          // Use mock if no real data
          setNotifications(mockNotifications);
        }
      } else {
        // Demo mode - use mock
        setNotifications(mockNotifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );

    if (userId) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
    }
  }, [userId]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    if (userId) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
    }
  }, [userId]);

  // Clear notification
  const clearNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));

    if (userId) {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
    }
  }, [userId]);

  // Subscribe to realtime
  useEffect(() => {
    fetchNotifications();

    if (userId) {
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const newNotif: Notification = {
              id: payload.new.id,
              type: payload.new.type,
              title: payload.new.title,
              message: payload.new.message,
              read: false,
              createdAt: new Date(payload.new.created_at),
              actionUrl: payload.new.action_url,
            };
            setNotifications(prev => [newNotif, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    clearNotification,
    refresh: fetchNotifications,
  };
}

// Notification type icons and colors
export const notificationStyles = {
  feedback: { icon: 'MessageSquare', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  alert: { icon: 'AlertTriangle', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  system: { icon: 'Settings', color: 'text-zinc-400', bg: 'bg-zinc-500/20' },
  ai: { icon: 'Sparkles', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  enrollment: { icon: 'UserPlus', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
};

export default useNotifications;
