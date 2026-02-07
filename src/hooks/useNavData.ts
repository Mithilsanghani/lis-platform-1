import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useStore';

export interface NavBadges {
  lectures: number;
  silent: number;
  newFeedback: number;
  pendingEnrollments: number;
}

export interface CourseQuick {
  id: string;
  name: string;
  code: string;
  unread: number;
  lastUpdated: string;
}

/**
 * useNavData Hook
 * Provides real-time navigation badge counts and quick course data
 * Phase 1: Mock data with realistic counts
 * Phase 2: Connect to Supabase realtime subscriptions
 */
export function useNavData() {
  const { user } = useAuthStore();
  const [badges, setBadges] = useState<NavBadges>({
    lectures: 5,
    silent: 18,
    newFeedback: 12,
    pendingEnrollments: 3,
  });

  const [courses, setCourses] = useState<CourseQuick[]>([
    {
      id: '1',
      name: 'Advanced Data Structures',
      code: 'CS201',
      unread: 5,
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      name: 'Algorithms & Complexity',
      code: 'CS202',
      unread: 3,
      lastUpdated: '4 hours ago',
    },
    {
      id: '3',
      name: 'Operating Systems',
      code: 'CS305',
      unread: 2,
      lastUpdated: '1 day ago',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates (Phase 2: Replace with Supabase subscription)
  useEffect(() => {
    if (!user) return;

    // Mock subscription to real-time badge updates
    const mockInterval = setInterval(() => {
      // Random update to simulate real-time changes
      if (Math.random() > 0.7) {
        setBadges((prev) => ({
          ...prev,
          newFeedback: Math.max(0, prev.newFeedback - 1),
        }));
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(mockInterval);
  }, [user]);

  /**
   * Refresh badge counts (call after action)
   * Phase 2: Trigger Supabase refresh
   */
  const refreshBadges = async () => {
    setIsLoading(true);
    try {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In Phase 2, fetch from Supabase:
      // const { data: unread } = await supabase
      //   .from('feedback')
      //   .select('count')
      //   .eq('is_read', false)
      //   .eq('course_id', courseId);

      // For now, just reset
      setBadges({
        lectures: Math.floor(Math.random() * 10),
        silent: 18,
        newFeedback: Math.floor(Math.random() * 15),
        pendingEnrollments: Math.floor(Math.random() * 5),
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mark course feedback as read
   * Phase 2: Update Supabase
   */
  const markCourseAsRead = async (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, unread: 0 } : course
      )
    );

    // Phase 2: Update Supabase
    // await supabase
    //   .from('feedback')
    //   .update({ is_read: true })
    //   .eq('course_id', courseId);
  };

  /**
   * Get courses matching search query
   * Phase 2: Full-text search via Supabase
   */
  const searchCourses = (query: string): CourseQuick[] => {
    if (!query.trim()) return courses;

    const q = query.toLowerCase();
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q)
    );
  };

  /**
   * Get top urgent courses (silent > 10)
   */
  const getUrgentCourses = (): CourseQuick[] => {
    // In real implementation, would come from Supabase
    return courses.filter((c) => c.unread > 3);
  };

  /**
   * Get high-priority alert summary
   */
  const getAlertSummary = (): string => {
    if (badges.silent > 10) {
      return `🔴 CRITICAL: ${badges.silent} silent students`;
    }
    if (badges.newFeedback > 5) {
      return `🟡 HIGH: ${badges.newFeedback} new feedback items`;
    }
    return `🟢 All clear - ${courses.length} courses monitored`;
  };

  return {
    badges,
    courses,
    isLoading,
    refreshBadges,
    markCourseAsRead,
    searchCourses,
    getUrgentCourses,
    getAlertSummary,
  };
}
