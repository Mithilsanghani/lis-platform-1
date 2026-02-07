/**
 * LIS API Client
 * Typed API functions for all endpoints
 */

import type {
  User,
  Course,
  Lecture,
  Feedback,
  AIInsight,
  ProfessorDashboardSummary,
  StudentDashboardSummary,
  LectureInsight,
  StudentMetrics,
  SilentStudent,
  RevisionPlan,
  TopicPerformance,
  CreateCourseRequest,
  CreateLectureRequest,
  SubmitFeedbackRequest,
  PaginatedResponse,
  CourseFilters,
  LectureFilters,
  FeedbackFilters,
  StudentFilters,
} from '../types/lis';

// Base API URL (would come from env in real app)
const API_BASE = '/api';

// ============================================
// GENERIC FETCH HELPER
// ============================================

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// AUTH API
// ============================================

export const authApi = {
  login: async (email: string, password: string) => {
    return apiFetch<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiFetch<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return apiFetch<User>('/auth/me');
  },

  updateProfile: async (data: Partial<User>) => {
    return apiFetch<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// PROFESSOR API
// ============================================

export const professorApi = {
  // Dashboard
  getDashboard: async () => {
    return apiFetch<ProfessorDashboardSummary>('/professor/dashboard');
  },

  // Courses
  getCourses: async (filters?: CourseFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<PaginatedResponse<Course>>(`/professor/courses?${params}`);
  },

  getCourse: async (courseId: string) => {
    return apiFetch<Course>(`/professor/courses/${courseId}`);
  },

  createCourse: async (data: CreateCourseRequest) => {
    return apiFetch<Course>('/professor/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCourse: async (courseId: string, data: Partial<CreateCourseRequest>) => {
    return apiFetch<Course>(`/professor/courses/${courseId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  archiveCourse: async (courseId: string) => {
    return apiFetch<Course>(`/professor/courses/${courseId}/archive`, {
      method: 'POST',
    });
  },

  // Lectures
  getLectures: async (filters?: LectureFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<PaginatedResponse<Lecture>>(`/professor/lectures?${params}`);
  },

  getCourseLectures: async (courseId: string, filters?: LectureFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<PaginatedResponse<Lecture>>(`/professor/courses/${courseId}/lectures?${params}`);
  },

  getLecture: async (lectureId: string) => {
    return apiFetch<Lecture>(`/professor/lectures/${lectureId}`);
  },

  createLecture: async (data: CreateLectureRequest) => {
    return apiFetch<Lecture>('/professor/lectures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateLecture: async (lectureId: string, data: Partial<CreateLectureRequest>) => {
    return apiFetch<Lecture>(`/professor/lectures/${lectureId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteLecture: async (lectureId: string) => {
    return apiFetch<{ success: boolean }>(`/professor/lectures/${lectureId}`, {
      method: 'DELETE',
    });
  },

  // Feedback
  getLectureFeedbackSummary: async (lectureId: string) => {
    return apiFetch<LectureInsight>(`/professor/lectures/${lectureId}/feedback-summary`);
  },

  getLectureFeedback: async (lectureId: string, filters?: FeedbackFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<PaginatedResponse<Feedback>>(`/professor/lectures/${lectureId}/feedback?${params}`);
  },

  // Students
  getCourseStudents: async (courseId: string, filters?: StudentFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<PaginatedResponse<StudentMetrics>>(`/professor/courses/${courseId}/students?${params}`);
  },

  getSilentStudents: async (courseId?: string) => {
    const params = courseId ? `?courseId=${courseId}` : '';
    return apiFetch<SilentStudent[]>(`/professor/silent-students${params}`);
  },

  // Analytics
  getCourseAnalytics: async (courseId: string) => {
    return apiFetch<{
      weeklyTrends: { week: string; understanding: number }[];
      topicPerformance: TopicPerformance[];
      engagementRate: number;
    }>(`/professor/courses/${courseId}/analytics`);
  },

  getTopicPerformance: async (courseId: string) => {
    return apiFetch<TopicPerformance[]>(`/professor/courses/${courseId}/topics`);
  },

  // AI & Revision
  getRevisionPlan: async (courseId: string) => {
    return apiFetch<RevisionPlan>(`/professor/courses/${courseId}/revision-plan`);
  },

  generateRevisionPlan: async (courseId: string) => {
    return apiFetch<RevisionPlan>(`/professor/courses/${courseId}/revision-plan`, {
      method: 'POST',
    });
  },

  getInsights: async (filters?: { priority?: string; limit?: number }) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<AIInsight[]>(`/professor/insights?${params}`);
  },

  dismissInsight: async (insightId: string) => {
    return apiFetch<{ success: boolean }>(`/professor/insights/${insightId}/dismiss`, {
      method: 'POST',
    });
  },

  // Enrollment
  enrollStudents: async (courseId: string, studentEmails: string[]) => {
    return apiFetch<{ enrolled: number; failed: string[] }>(`/professor/courses/${courseId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ emails: studentEmails }),
    });
  },

  enrollStudentsFromCSV: async (courseId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/professor/courses/${courseId}/enroll-csv`, {
      method: 'POST',
      body: formData,
    }).then(r => r.json());
  },

  // Export
  exportCoursePDF: async (courseId: string) => {
    const response = await fetch(`${API_BASE}/professor/courses/${courseId}/export-pdf`);
    return response.blob();
  },
};

// ============================================
// STUDENT API
// ============================================

export const studentApi = {
  // Dashboard
  getOverview: async () => {
    return apiFetch<StudentDashboardSummary>('/student/overview');
  },

  // Courses
  getCourses: async (filters?: CourseFilters) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<PaginatedResponse<Course>>(`/student/courses?${params}`);
  },

  getCourse: async (courseId: string) => {
    return apiFetch<Course & { lectures: Lecture[] }>(`/student/courses/${courseId}`);
  },

  // Feedback
  getPendingFeedback: async () => {
    return apiFetch<Lecture[]>('/student/pending-feedback');
  },

  getMyFeedback: async (filters?: { status?: 'pending' | 'submitted' | 'all' }) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<{
      pending: Lecture[];
      submitted: Feedback[];
    }>(`/student/feedback?${params}`);
  },

  submitFeedback: async (data: SubmitFeedbackRequest) => {
    return apiFetch<Feedback>('/student/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFeedback: async (feedbackId: string, data: Partial<SubmitFeedbackRequest>) => {
    return apiFetch<Feedback>(`/student/feedback/${feedbackId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Performance
  getPerformance: async (courseId?: string) => {
    const params = courseId ? `?courseId=${courseId}` : '';
    return apiFetch<{
      overall: StudentMetrics;
      byCourse: StudentMetrics[];
      weeklyTrend: { week: string; understanding: number }[];
      topicPerformance: TopicPerformance[];
      insights: AIInsight[];
    }>(`/student/performance${params}`);
  },

  // Insights
  getInsights: async () => {
    return apiFetch<AIInsight[]>('/student/insights');
  },

  // Settings
  getSettings: async () => {
    return apiFetch<{
      notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        feedbackReminder: boolean;
        weeklyDigest: boolean;
      };
      privacy: {
        sharePerformance: boolean;
        anonymousFeedback: boolean;
      };
    }>('/student/settings');
  },

  updateSettings: async (settings: {
    notifications?: Partial<{
      email: boolean;
      push: boolean;
      sms: boolean;
      feedbackReminder: boolean;
      weeklyDigest: boolean;
    }>;
    privacy?: Partial<{
      sharePerformance: boolean;
      anonymousFeedback: boolean;
    }>;
  }) => {
    return apiFetch<{ success: boolean }>('/student/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },
};

// ============================================
// ADMIN API
// ============================================

export const adminApi = {
  getOverview: async () => {
    return apiFetch<{
      totalStudents: number;
      totalProfessors: number;
      totalCourses: number;
      totalFeedback: number;
      avgEngagement: number;
    }>('/admin/analytics/overview');
  },

  getCourseAnalytics: async (filters?: { semester?: string; department?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<{
      courses: (Course & { health: number; feedbackCount: number })[];
      problemCourses: Course[];
    }>(`/admin/analytics/courses?${params}`);
  },

  getTopicAnalytics: async (filters?: { semester?: string; department?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch<{
      problematicTopics: TopicPerformance[];
      wellUnderstoodTopics: TopicPerformance[];
    }>(`/admin/analytics/topics?${params}`);
  },

  getDepartmentStats: async () => {
    return apiFetch<{
      department: string;
      avgHealth: number;
      courseCount: number;
      studentCount: number;
    }[]>('/admin/analytics/departments');
  },
};

// ============================================
// EXPORT ALL
// ============================================

export const api = {
  auth: authApi,
  professor: professorApi,
  student: studentApi,
  admin: adminApi,
};

export default api;
