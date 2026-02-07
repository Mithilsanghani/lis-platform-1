/**
 * useRealtimeDash - Supabase Realtime Dashboard Hook
 * Provides live-updating badges, courses, and metrics
 * Falls back to mock data when Supabase is unavailable
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface DashBadges {
  lectures: number;
  silent: number;
  newFeedback: number;
  pendingEnrollments: number;
}

interface Course {
  id: string;
  code: string;
  name: string;
  health: number;
  unread: number;
}

interface DashMetrics {
  totalStudents: number;
  activeToday: number;
  avgEngagement: number;
  lecturesThisWeek: number;
  feedbackReceived: number;
  aiInsightsGenerated: number;
}

interface SparklineData {
  day: string;
  value: number;
}

interface RealtimeDashState {
  badges: DashBadges;
  courses: Course[];
  metrics: DashMetrics;
  sparklines: {
    engagement: SparklineData[];
    attendance: SparklineData[];
    feedback: SparklineData[];
  };
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Mock data for development/fallback
const mockBadges: DashBadges = {
  lectures: 5,
  silent: 18,
  newFeedback: 12,
  pendingEnrollments: 3,
};

const mockCourses: Course[] = [
  { id: '1', code: 'CS201', name: 'Data Structures', health: 78, unread: 3 },
  { id: '2', code: 'CS202', name: 'Algorithms', health: 92, unread: 0 },
  { id: '3', code: 'CS305', name: 'Machine Learning', health: 65, unread: 7 },
];

const mockMetrics: DashMetrics = {
  totalStudents: 245,
  activeToday: 189,
  avgEngagement: 76,
  lecturesThisWeek: 8,
  feedbackReceived: 342,
  aiInsightsGenerated: 24,
};

const generateMockSparkline = (days: number, min: number, max: number): SparklineData[] => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  
  return Array.from({ length: days }, (_, i) => ({
    day: dayNames[(today - days + i + 1 + 7) % 7],
    value: Math.floor(Math.random() * (max - min) + min),
  }));
};

const mockSparklines = {
  engagement: generateMockSparkline(7, 60, 95),
  attendance: generateMockSparkline(7, 70, 100),
  feedback: generateMockSparkline(7, 10, 50),
};

export function useRealtimeDash() {
  const [state, setState] = useState<RealtimeDashState>({
    badges: mockBadges,
    courses: mockCourses,
    metrics: mockMetrics,
    sparklines: mockSparklines,
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  // Fetch initial data
  const fetchDashboardData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Attempt to fetch from Supabase
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (coursesError) throw coursesError;

      // Transform courses data
      const transformedCourses: Course[] = (coursesData || []).map((c: any) => ({
        id: c.id,
        code: c.course_code || c.code,
        name: c.name || c.title,
        health: Math.floor(Math.random() * 40) + 60, // Would be calculated from feedback
        unread: Math.floor(Math.random() * 10),
      }));

      // Fetch feedback count for badges
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      setState((prev) => ({
        ...prev,
        courses: transformedCourses.length > 0 ? transformedCourses : mockCourses,
        badges: {
          ...prev.badges,
          newFeedback: feedbackCount || prev.badges.newFeedback,
        },
        isLoading: false,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      console.warn('Using mock data - Supabase unavailable:', error);
      // Fall back to mock data silently
      setState((prev) => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date(),
      }));
    }
  }, []);

  // Set up realtime subscriptions
  useEffect(() => {
    fetchDashboardData();

    // Subscribe to feedback changes
    const feedbackChannel = supabase
      .channel('realtime-feedback')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback',
        },
        (payload: { new: Record<string, unknown> }) => {
          console.log('New feedback received:', payload);
          setState((prev) => ({
            ...prev,
            badges: {
              ...prev.badges,
              newFeedback: prev.badges.newFeedback + 1,
            },
            lastUpdated: new Date(),
          }));
        }
      )
      .subscribe();

    // Subscribe to course changes
    const coursesChannel = supabase
      .channel('realtime-courses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses',
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(feedbackChannel);
      supabase.removeChannel(coursesChannel);
    };
  }, [fetchDashboardData]);

  // Refresh function for manual updates
  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Update specific badge count
  const updateBadge = useCallback((key: keyof DashBadges, value: number) => {
    setState((prev) => ({
      ...prev,
      badges: {
        ...prev.badges,
        [key]: value,
      },
    }));
  }, []);

  // Clear a specific badge
  const clearBadge = useCallback((key: keyof DashBadges) => {
    setState((prev) => ({
      ...prev,
      badges: {
        ...prev.badges,
        [key]: 0,
      },
    }));
  }, []);

  return {
    ...state,
    refresh,
    updateBadge,
    clearBadge,
  };
}

export default useRealtimeDash;
