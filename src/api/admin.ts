/**
 * LIS v2.0 - Admin API Client
 * Department and Institute admin endpoints
 */

import type {
  DeptAnalytics,
  FeedbackForm,
  FeedbackFormSchema,
  AuditLog,
  Course,
  User,
  PaginatedResponse,
  PaginationParams,
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
// ADMIN API
// ============================================

export const adminApi = {
  // ==========================================
  // DEPARTMENT ANALYTICS
  // ==========================================

  /**
   * Get department-wide analytics
   */
  getDeptAnalytics: (department: string, params?: {
    semester?: string;
    from_date?: string;
    to_date?: string;
  }) =>
    apiFetch<DeptAnalytics>(
      `/admin/dept-analytics${buildQuery({ department, ...params })}`
    ),

  /**
   * Get all departments summary
   */
  getAllDeptsSummary: () =>
    apiFetch<{
      departments: {
        name: string;
        courses: number;
        students: number;
        professors: number;
        avg_understanding: number;
        health_score: number;
      }[];
    }>('/admin/departments'),

  /**
   * Compare departments
   */
  compareDepartments: (departments: string[], metric: 'understanding' | 'response_rate' | 'health') =>
    apiFetch<{
      comparison: {
        department: string;
        value: number;
        trend: 'improving' | 'stable' | 'declining';
      }[];
    }>(`/admin/compare-departments${buildQuery({ departments: departments.join(','), metric })}`),

  // ==========================================
  // FEEDBACK FORM MANAGEMENT
  // ==========================================

  /**
   * Get all feedback forms
   */
  getFeedbackForms: (params?: { department?: string; is_active?: boolean }) =>
    apiFetch<FeedbackForm[]>(`/admin/feedback-forms${buildQuery(params || {})}`),

  /**
   * Get single feedback form
   */
  getFeedbackForm: (formId: string) =>
    apiFetch<FeedbackForm>(`/admin/feedback-forms/${formId}`),

  /**
   * Create feedback form
   */
  createFeedbackForm: (data: {
    name: string;
    course_id?: string;
    department?: string;
    schema: FeedbackFormSchema;
  }) =>
    apiFetch<FeedbackForm>('/admin/feedback-forms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update feedback form
   */
  updateFeedbackForm: (formId: string, data: Partial<{
    name: string;
    schema: FeedbackFormSchema;
    is_active: boolean;
  }>) =>
    apiFetch<FeedbackForm>(`/admin/feedback-forms/${formId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Delete feedback form
   */
  deleteFeedbackForm: (formId: string) =>
    apiFetch<{ success: boolean }>(`/admin/feedback-forms/${formId}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // COURSE-PROFESSOR MANAGEMENT
  // ==========================================

  /**
   * Get course-professor mappings
   */
  getCourseMappings: (params?: { department?: string; semester?: string }) =>
    apiFetch<{
      course: Course;
      professor: User;
      enrolled_students: number;
    }[]>(`/admin/course-mappings${buildQuery(params || {})}`),

  /**
   * Assign professor to course
   */
  assignProfessor: (courseId: string, professorId: string) =>
    apiFetch<{ success: boolean }>('/admin/course-mappings', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId, professor_id: professorId }),
    }),

  /**
   * Remove professor from course
   */
  removeProfessor: (courseId: string) =>
    apiFetch<{ success: boolean }>(`/admin/course-mappings/${courseId}`, {
      method: 'DELETE',
    }),

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  /**
   * Get users by department
   */
  getUsers: (params?: {
    department?: string;
    role?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) =>
    apiFetch<PaginatedResponse<User>>(`/admin/users${buildQuery(params || {})}`),

  /**
   * Get user details
   */
  getUser: (userId: string) =>
    apiFetch<User & {
      roles: { role: string; scope: string }[];
      courses: Course[];
    }>(`/admin/users/${userId}`),

  /**
   * Update user role
   */
  updateUserRole: (userId: string, role: string, scope?: { type: string; id: string }) =>
    apiFetch<{ success: boolean }>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role, scope }),
    }),

  /**
   * Deactivate user
   */
  deactivateUser: (userId: string) =>
    apiFetch<{ success: boolean }>(`/admin/users/${userId}/deactivate`, {
      method: 'POST',
    }),

  // ==========================================
  // AUDIT LOGS
  // ==========================================

  /**
   * Get audit logs
   */
  getAuditLogs: (params?: PaginationParams & {
    actor_id?: string;
    action?: string;
    entity_type?: string;
    from_date?: string;
    to_date?: string;
  }) =>
    apiFetch<PaginatedResponse<AuditLog>>(`/admin/audit-logs${buildQuery(params || {})}`),

  // ==========================================
  // INSTITUTE SETTINGS (Super Admin)
  // ==========================================

  /**
   * Get institute settings
   */
  getInstituteSettings: () =>
    apiFetch<{
      name: string;
      logo_url?: string;
      departments: string[];
      semesters: string[];
      academic_years: string[];
      data_retention_days: number;
      anonymization_enabled: boolean;
      auth_providers: string[];
    }>('/admin/settings'),

  /**
   * Update institute settings
   */
  updateInstituteSettings: (data: Partial<{
    name: string;
    logo_url: string;
    departments: string[];
    semesters: string[];
    academic_years: string[];
    data_retention_days: number;
    anonymization_enabled: boolean;
  }>) =>
    apiFetch<{ success: boolean }>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * Export all data (for compliance)
   */
  exportAllData: (params: {
    format: 'csv' | 'json';
    include_feedback?: boolean;
    include_analytics?: boolean;
  }) =>
    apiFetch<{ download_url: string; expires_at: string }>(
      `/admin/export${buildQuery(params)}`
    ),

  /**
   * Purge old data
   */
  purgeOldData: (before_date: string) =>
    apiFetch<{ deleted_count: number }>('/admin/purge', {
      method: 'POST',
      body: JSON.stringify({ before_date }),
    }),
};

export default adminApi;
