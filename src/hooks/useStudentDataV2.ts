/**
 * LIS v2.0 - Student Data Hooks
 * React Query hooks for student portal data fetching
 */

// @ts-nocheck - TODO: Install @tanstack/react-query
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../api/student';

// Stub implementations until react-query is installed
const useQuery = (options: any) => ({ data: null, isLoading: false, error: null });
const useMutation = (options: any) => ({ mutate: () => {}, isLoading: false });
const useQueryClient = () => ({ invalidateQueries: () => {} });
import type { 
  UnderstandingLevel, 
  FeedbackReason,
  StudentOverviewData,
  StudentCourseData,
  StudentPerformanceData,
} from '../types/lis-v2';

// ================== Query Keys ==================

export const studentKeys = {
  all: ['student'] as const,
  overview: () => [...studentKeys.all, 'overview'] as const,
  courses: () => [...studentKeys.all, 'courses'] as const,
  course: (id: string) => [...studentKeys.courses(), id] as const,
  feedback: () => [...studentKeys.all, 'feedback'] as const,
  feedbackPending: () => [...studentKeys.feedback(), 'pending'] as const,
  feedbackHistory: (filters?: object) => [...studentKeys.feedback(), 'history', filters] as const,
  performance: () => [...studentKeys.all, 'performance'] as const,
  settings: () => [...studentKeys.all, 'settings'] as const,
  schedule: () => [...studentKeys.all, 'schedule'] as const,
};

// ================== Overview Hook ==================

export function useStudentOverview() {
  return useQuery({
    queryKey: studentKeys.overview(),
    queryFn: studentApi.getOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ================== Courses Hooks ==================

export function useStudentCourses() {
  return useQuery({
    queryKey: studentKeys.courses(),
    queryFn: studentApi.getCourses,
    staleTime: 1000 * 60 * 5,
  });
}

export function useStudentCourse(courseId: string) {
  return useQuery({
    queryKey: studentKeys.course(courseId),
    queryFn: () => studentApi.getCourse(courseId),
    staleTime: 1000 * 60 * 2,
    enabled: !!courseId,
  });
}

// ================== Feedback Hooks ==================

export function usePendingFeedback() {
  return useQuery({
    queryKey: studentKeys.feedbackPending(),
    queryFn: studentApi.getPendingFeedback,
    staleTime: 1000 * 60, // 1 minute - feedback is time-sensitive
  });
}

export function useFeedbackHistory(filters?: {
  course_id?: string;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: studentKeys.feedbackHistory(filters),
    queryFn: () => studentApi.getFeedbackHistory(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      lecture_id: string;
      understanding_level: UnderstandingLevel;
      question?: string;
      reason?: FeedbackReason;
      is_anonymous?: boolean;
    }) => studentApi.submitFeedback(data),
    onSuccess: () => {
      // Invalidate all feedback-related queries
      queryClient.invalidateQueries({ queryKey: studentKeys.feedback() });
      queryClient.invalidateQueries({ queryKey: studentKeys.overview() });
      queryClient.invalidateQueries({ queryKey: studentKeys.courses() });
    },
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      feedbackId, 
      data 
    }: {
      feedbackId: string;
      data: {
        understanding_level?: UnderstandingLevel;
        question?: string;
        reason?: FeedbackReason;
      };
    }) => studentApi.updateFeedback(feedbackId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.feedback() });
    },
  });
}

// ================== Performance Hook ==================

export function useStudentPerformance() {
  return useQuery({
    queryKey: studentKeys.performance(),
    queryFn: studentApi.getPerformance,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// ================== Settings Hooks ==================

export function useStudentSettings() {
  return useQuery({
    queryKey: studentKeys.settings(),
    queryFn: studentApi.getSettings,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: {
      feedback_reminders?: boolean;
      lecture_alerts?: boolean;
      weekly_summary?: boolean;
      email_enabled?: boolean;
      push_enabled?: boolean;
    }) => studentApi.updateNotifications(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.settings() });
    },
  });
}

export function useUpdatePrivacy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: {
      show_in_leaderboards?: boolean;
      allow_professor_contact?: boolean;
      anonymous_by_default?: boolean;
    }) => studentApi.updatePrivacy(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.settings() });
    },
  });
}

// ================== Schedule Hook ==================

export function useTodaySchedule() {
  return useQuery({
    queryKey: studentKeys.schedule(),
    queryFn: studentApi.getTodaySchedule,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// ================== Combined Data Hook ==================

/**
 * Hook to get all data needed for the student dashboard
 */
export function useStudentDashboardData() {
  const overview = useStudentOverview();
  const pending = usePendingFeedback();
  const schedule = useTodaySchedule();

  return {
    overview: overview.data,
    pendingFeedback: pending.data,
    todaySchedule: schedule.data,
    isLoading: overview.isLoading || pending.isLoading || schedule.isLoading,
    isError: overview.isError || pending.isError || schedule.isError,
    refetch: () => {
      overview.refetch();
      pending.refetch();
      schedule.refetch();
    },
  };
}

export default {
  useStudentOverview,
  useStudentCourses,
  useStudentCourse,
  usePendingFeedback,
  useFeedbackHistory,
  useSubmitFeedback,
  useUpdateFeedback,
  useStudentPerformance,
  useStudentSettings,
  useUpdateNotifications,
  useUpdatePrivacy,
  useTodaySchedule,
  useStudentDashboardData,
};
