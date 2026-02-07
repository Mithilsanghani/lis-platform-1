/**
 * LIS v2.0 - Professor API Client
 * All professor-facing API endpoints
 */

import type {
  ProfessorOverviewData,
  ProfessorCourseData,
  ProfessorLectureData,
  Course,
  Lecture,
  LectureInsights,
  StudentMetrics,
  SilentFlag,
  RevisionPlan,
  RevisionSession,
  TopicAnalytics,
  CourseFilters,
  LectureFilters,
  StudentFilters,
  PaginatedResponse,
} from '../types/lis-v2';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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

function buildQuery(params: Record<string, any> | any): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

// ============================================
// PROFESSOR API
// ============================================

export const professorApi = {
  // ==========================================
  // OVERVIEW / DASHBOARD
  // ==========================================
  
  /**
   * Get professor dashboard overview
   */
  getOverview: () =>
    apiFetch<ProfessorOverviewData>('/professor/overview'),

  // ==========================================
  // COURSES
  // ==========================================

  /**
   * Get all courses for professor
   */
  getCourses: (filters?: CourseFilters) =>
    apiFetch<PaginatedResponse<Course>>(
      `/professor/courses${buildQuery(filters || {})}`
    ),

  /**
   * Get single course with full details
   */
  getCourse: (courseId: string) =>
    apiFetch<ProfessorCourseData>(`/professor/courses/${courseId}`),

  /**
   * Create new course
   */
  createCourse: (data: {
    code: string;
    title: string;
    description?: string;
    department: string;
    semester: string;
    academic_year?: string;
    credits?: number;
  }) =>
    apiFetch<Course>('/professor/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update course
   */
  updateCourse: (courseId: string, data: Partial<Course>) =>
    apiFetch<Course>(`/professor/courses/${courseId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Archive course
   */
  archiveCourse: (courseId: string) =>
    apiFetch<{ success: boolean }>(`/professor/courses/${courseId}/archive`, {
      method: 'POST',
    }),

  /**
   * Get topic heatmap for course
   */
  getCourseTopics: (courseId: string) =>
    apiFetch<TopicAnalytics[]>(`/professor/courses/${courseId}/topics`),

  // ==========================================
  // LECTURES
  // ==========================================

  /**
   * Get lectures for a course
   */
  getLectures: (courseId: string, filters?: LectureFilters) =>
    apiFetch<PaginatedResponse<Lecture & { insights?: LectureInsights }>>(
      `/professor/courses/${courseId}/lectures${buildQuery(filters || {})}`
    ),

  /**
   * Get single lecture with full insights
   */
  getLecture: (lectureId: string) =>
    apiFetch<ProfessorLectureData>(`/professor/lectures/${lectureId}`),

  /**
   * Create new lecture
   */
  createLecture: (courseId: string, data: {
    title: string;
    description?: string;
    date_time: string;
    duration_mins?: number;
    mode?: 'online' | 'offline' | 'hybrid';
    location?: string;
    topics: string[];
    feedback_deadline?: string;
  }) =>
    apiFetch<Lecture>(`/professor/courses/${courseId}/lectures`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update lecture
   */
  updateLecture: (lectureId: string, data: Partial<Lecture>) =>
    apiFetch<Lecture>(`/professor/lectures/${lectureId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Cancel lecture
   */
  cancelLecture: (lectureId: string) =>
    apiFetch<{ success: boolean }>(`/professor/lectures/${lectureId}/cancel`, {
      method: 'POST',
    }),

  /**
   * Get lecture insights/feedback summary
   */
  getLectureInsights: (lectureId: string) =>
    apiFetch<LectureInsights>(`/professor/lectures/${lectureId}/insights`),

  /**
   * Mark confusion addressed for lecture
   */
  markConfusionAddressed: (lectureId: string, notes?: string) =>
    apiFetch<{ success: boolean }>(`/professor/lectures/${lectureId}/confusion-addressed`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  // ==========================================
  // STUDENTS
  // ==========================================

  /**
   * Get students for a course
   */
  getStudents: (courseId: string, filters?: StudentFilters) =>
    apiFetch<PaginatedResponse<StudentMetrics & { student: { id: string; full_name: string; email: string; roll_number?: string } }>>(
      `/professor/courses/${courseId}/students${buildQuery(filters || {})}`
    ),

  /**
   * Get student detail within course context
   */
  getStudent: (courseId: string, studentId: string) =>
    apiFetch<{
      student: { id: string; full_name: string; email: string; roll_number?: string };
      metrics: StudentMetrics;
      feedback_history: { lecture: Lecture; feedback: import('../types/lis-v2').Feedback }[];
      trend: { week: string; understanding: number }[];
    }>(`/professor/courses/${courseId}/students/${studentId}`),

  // ==========================================
  // SILENT STUDENTS
  // ==========================================

  /**
   * Get silent/at-risk students
   */
  getSilentStudents: (courseId?: string) => {
    const query = courseId ? `?course_id=${courseId}` : '';
    return apiFetch<{
      flags: SilentFlag[];
      total: number;
      by_level: { warning: number; critical: number };
    }>(`/professor/silent-students${query}`);
  },

  /**
   * Acknowledge silent flag
   */
  acknowledgeSilentFlag: (flagId: string, notes?: string) =>
    apiFetch<SilentFlag>(`/professor/silent-students/${flagId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  /**
   * Resolve silent flag
   */
  resolveSilentFlag: (flagId: string, notes?: string) =>
    apiFetch<SilentFlag>(`/professor/silent-students/${flagId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  /**
   * Send nudge to silent students
   */
  nudgeSilentStudents: (data: {
    course_id: string;
    student_ids: string[];
    message?: string;
    channel?: 'email' | 'push' | 'whatsapp';
  }) =>
    apiFetch<{ sent_count: number; failed_count: number }>('/professor/nudge-silent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ==========================================
  // REVISION & ACTIONS
  // ==========================================

  /**
   * Get AI-generated revision plan
   */
  getRevisionPlan: (courseId: string) =>
    apiFetch<RevisionPlan>(`/professor/courses/${courseId}/revision-plan`),

  /**
   * Generate new revision plan
   */
  generateRevisionPlan: (courseId: string) =>
    apiFetch<RevisionPlan>(`/professor/courses/${courseId}/revision-plan/generate`, {
      method: 'POST',
    }),

  /**
   * Schedule revision session
   */
  scheduleRevision: (data: {
    course_id: string;
    lecture_id?: string;
    title: string;
    description?: string;
    topics: string[];
    scheduled_at: string;
    duration_mins?: number;
  }) =>
    apiFetch<RevisionSession>('/professor/revision-sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Get scheduled revision sessions
   */
  getRevisionSessions: (courseId?: string) => {
    const query = courseId ? `?course_id=${courseId}` : '';
    return apiFetch<RevisionSession[]>(`/professor/revision-sessions${query}`);
  },

  /**
   * Update revision session status
   */
  updateRevisionSession: (sessionId: string, data: Partial<RevisionSession>) =>
    apiFetch<RevisionSession>(`/professor/revision-sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // ==========================================
  // ANALYTICS
  // ==========================================

  /**
   * Get analytics for all courses
   */
  getAnalytics: (params?: {
    department?: string;
    semester?: string;
    from_date?: string;
    to_date?: string;
  }) =>
    apiFetch<{
      overall: {
        avg_understanding: number;
        avg_response_rate: number;
        total_feedback: number;
        total_lectures: number;
      };
      by_course: {
        course: Course;
        understanding_pct: number;
        response_rate: number;
        health_score: number;
      }[];
      weekly_trend: {
        week: string;
        understanding: number;
        response_rate: number;
      }[];
      top_issues: import('../types/lis-v2').TrendingIssue[];
    }>(`/professor/analytics${buildQuery(params || {})}`),

  /**
   * Export report
   */
  exportReport: (params: {
    course_id?: string;
    format: 'csv' | 'pdf';
    from_date?: string;
    to_date?: string;
  }) =>
    apiFetch<{ download_url: string }>(`/professor/export${buildQuery(params)}`),
};

export default professorApi;
