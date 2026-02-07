/**
 * LIS v2.0 - Student API Client
 * All student-facing API endpoints
 */

import type {
  StudentOverviewData,
  StudentCourseData,
  StudentPerformanceData,
  Lecture,
  Feedback,
  FeedbackSubmission,
  UserSettings,
  NotificationPreferences,
  PrivacySettings,
  PaginatedResponse,
  PaginationParams,
} from '../types/lis-v2';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper for fetch with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('lis_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// STUDENT API
// ============================================

export const studentApi = {
  /**
   * Get student overview/dashboard data
   */
  getOverview: () => 
    apiFetch<StudentOverviewData>('/student/overview'),

  /**
   * Get enrolled courses with metrics
   */
  getCourses: (params?: PaginationParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    const qs = query.toString();
    return apiFetch<PaginatedResponse<StudentCourseData>>(`/student/courses${qs ? `?${qs}` : ''}`);
  },

  /**
   * Get single course details
   */
  getCourse: (courseId: string) =>
    apiFetch<StudentCourseData>(`/student/courses/${courseId}`),

  /**
   * Get pending feedback items
   */
  getPendingFeedback: () =>
    apiFetch<{
      items: {
        lecture: Lecture;
        course_code: string;
        course_title: string;
        due_soon: boolean;
      }[];
      total: number;
    }>('/student/pending-feedback'),

  /**
   * Get submitted feedback history
   */
  getFeedbackHistory: (params?: PaginationParams & { course_id?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.page_size) query.set('page_size', String(params.page_size));
    if (params?.course_id) query.set('course_id', params.course_id);
    const qs = query.toString();
    return apiFetch<PaginatedResponse<Feedback>>(`/student/feedback${qs ? `?${qs}` : ''}`);
  },

  /**
   * Submit feedback for a lecture
   */
  submitFeedback: (lectureId: string, data: FeedbackSubmission) =>
    apiFetch<Feedback>(`/student/lectures/${lectureId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update existing feedback
   */
  updateFeedback: (feedbackId: string, data: Partial<FeedbackSubmission>) =>
    apiFetch<Feedback>(`/student/feedback/${feedbackId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Get performance analytics
   */
  getPerformance: (courseId?: string) => {
    const query = courseId ? `?course_id=${courseId}` : '';
    return apiFetch<StudentPerformanceData>(`/student/performance${query}`);
  },

  /**
   * Get user settings
   */
  getSettings: () =>
    apiFetch<UserSettings>('/student/settings'),

  /**
   * Update notification preferences
   */
  updateNotifications: (data: Partial<NotificationPreferences>) =>
    apiFetch<NotificationPreferences>('/student/settings/notifications', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Update privacy settings
   */
  updatePrivacy: (data: Partial<PrivacySettings>) =>
    apiFetch<PrivacySettings>('/student/settings/privacy', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Get today's schedule
   */
  getTodaySchedule: () =>
    apiFetch<{
      lectures: (Lecture & {
        course_code: string;
        course_title: string;
        feedback_status: 'pending' | 'submitted' | 'upcoming';
      })[];
    }>('/student/today'),
};

export default studentApi;
