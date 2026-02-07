/**
 * useLiveMetrics v7.0 - Supabase Realtime + Recharts Data Hook
 * Provides live-updating metrics with sparkline trend data
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface MetricTrend {
  day: string;
  value: number;
}

export interface LiveMetrics {
  courses: number;
  engagement: number;
  lectures: number;
  students: number;
  silent: number;
  feedback: number;
  trends: {
    courses: MetricTrend[];
    engagement: MetricTrend[];
    lectures: MetricTrend[];
    students: MetricTrend[];
  };
  changes: {
    courses: string;
    engagement: string;
    lectures: string;
    students: string;
  };
  aiInsights: {
    courses: string;
    engagement: string;
    lectures: string;
    students: string;
  };
  silentStudents: Array<{
    id: string;
    name: string;
    lastActive: string;
    risk: 'high' | 'medium' | 'low';
  }>;
  revisionTopics: Array<{
    topic: string;
    severity: number;
    students: number;
  }>;
  optimalTempo: {
    ideal: number;
    current: number;
    suggestion: string;
  };
}

// Generate realistic sparkline data
const generateTrend = (base: number, variance: number, days = 7): MetricTrend[] => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return dayNames.map((day, i) => ({
    day,
    value: Math.max(0, base + Math.floor((Math.random() - 0.3) * variance * (i / 3 + 1))),
  }));
};

const initialMetrics: LiveMetrics = {
  courses: 245,
  engagement: 76,
  lectures: 8,
  students: 42,
  silent: 18,
  feedback: 342,
  trends: {
    courses: generateTrend(240, 10),
    engagement: generateTrend(72, 8),
    lectures: generateTrend(6, 4),
    students: generateTrend(38, 8),
  },
  changes: {
    courses: '+5',
    engagement: '-2%',
    lectures: '+3',
    students: '+12',
  },
  aiInsights: {
    courses: '245 active courses • 5 new today • Avg 94% health score',
    engagement: '76% engagement • Down 2% from last week • Focus on CS201',
    lectures: '8 lectures today • Peak hours 10AM-12PM • 92% attendance',
    students: '42 new feedback • 18 silent detected • 3 at-risk students',
  },
  silentStudents: [
    { id: '1', name: 'Rahul S.', lastActive: '7 days ago', risk: 'high' },
    { id: '2', name: 'Priya P.', lastActive: '5 days ago', risk: 'high' },
    { id: '3', name: 'Amit K.', lastActive: '4 days ago', risk: 'medium' },
    { id: '4', name: 'Sneha R.', lastActive: '3 days ago', risk: 'medium' },
    { id: '5', name: 'Vikram J.', lastActive: '3 days ago', risk: 'low' },
  ],
  revisionTopics: [
    { topic: 'Graph Traversal', severity: 85, students: 18 },
    { topic: 'Dynamic Programming', severity: 72, students: 15 },
    { topic: 'AVL Tree Rotations', severity: 65, students: 12 },
  ],
  optimalTempo: {
    ideal: 45,
    current: 52,
    suggestion: 'Your lectures average 52min. Consider breaking into 45min + 5min Q&A for better retention.',
  },
};

export function useLiveMetrics() {
  const [metrics, setMetrics] = useState<LiveMetrics>(initialMetrics);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch metrics from Supabase
  const fetchMetrics = useCallback(async () => {
    try {
      // Try to fetch real data
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id', { count: 'exact' });

      const { data: feedbackData } = await supabase
        .from('feedback')
        .select('id', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Update with real data if available, otherwise use mock
      if (coursesData) {
        setMetrics(prev => ({
          ...prev,
          courses: coursesData.length || prev.courses,
        }));
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.log('Using mock metrics data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Setup realtime subscription
  useEffect(() => {
    fetchMetrics();

    // Realtime subscription for feedback
    const channel = supabase
      .channel('metrics-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feedback' }, () => {
        setMetrics(prev => ({
          ...prev,
          feedback: prev.feedback + 1,
          trends: {
            ...prev.trends,
            students: [...prev.trends.students.slice(1), { day: 'Now', value: prev.students + 1 }],
          },
        }));
        setLastUpdated(new Date());
      })
      .subscribe();

    // Simulate live updates every 30 seconds
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        engagement: Math.min(100, Math.max(50, prev.engagement + Math.floor(Math.random() * 3 - 1))),
        trends: {
          ...prev.trends,
          engagement: [...prev.trends.engagement.slice(1), { 
            day: 'Now', 
            value: prev.engagement + Math.floor(Math.random() * 5 - 2) 
          }],
        },
      }));
      setLastUpdated(new Date());
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchMetrics]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    lastUpdated,
    refresh,
  };
}

export default useLiveMetrics;
