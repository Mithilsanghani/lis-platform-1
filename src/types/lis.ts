/**
 * LIS Core Types - Lecture Intelligence System
 * Type definitions for all entities
 */

// ============================================
// ENUMS
// ============================================

export type UserRole = 'professor' | 'student' | 'admin';
export type UnderstandingLevel = 'full' | 'partial' | 'unclear' | 'fully_understood' | 'partially_understood' | 'not_understood';
export type FeedbackReason = 
  | 'pace_fast' 
  | 'pace_slow'
  | 'pace_too_fast'
  | 'examples_few' 
  | 'needs_more_examples'
  | 'concept_unclear' 
  | 'prerequisite_gap'
  | 'missed_part' 
  | 'good_explanation' 
  | 'helpful_examples'
  | 'engaging_delivery'
  | 'other';
export type SilentLevel = 'warning' | 'critical' | 'high' | 'moderate' | 'low' | 'none';
export type SilentReason = 'low_understanding' | 'low_participation' | 'no_comments' | 'declining_trend' | 'never_asks_questions' | 'declining_performance';
export type InsightPriority = 'high' | 'medium' | 'low';
export type InsightOwnerType = 'course' | 'lecture' | 'student';
export type CourseRoleType = 'student' | 'ta';

// ============================================
// CORE ENTITIES
// ============================================

export interface User {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  department: string;
  roll_number?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  semester: string;
  department: string;
  created_by: string;
  created_at: string;
  archived_at?: string | null;
  // Computed fields
  student_count?: number;
  lecture_count?: number;
  health_pct?: number;
  silent_students_count?: number;
  pending_feedback_count?: number;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  role_in_course: CourseRoleType;
  created_at: string;
  // Joined fields
  user?: User;
  course?: Course;
}

export interface Lecture {
  id: string;
  course_id: string;
  title: string;
  date_time: string;
  topics: string[];
  feedback_deadline?: string | null;
  created_at: string;
  // Computed fields
  feedback_count?: number;
  understanding_summary?: UnderstandingSummary;
  course?: Course;
}

export interface Feedback {
  id: string;
  lecture_id: string;
  student_id: string;
  understanding: UnderstandingLevel;
  reasons: FeedbackReason[];
  subtopics: string[];
  comment: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  student?: User;
  lecture?: Lecture;
}

// ============================================
// ANALYTICS & INSIGHTS
// ============================================

export interface UnderstandingSummary {
  full_pct: number;
  partial_pct: number;
  unclear_pct: number;
  response_count: number;
  full_count: number;
  partial_count: number;
  unclear_count: number;
}

export interface LectureInsight {
  lecture_id: string;
  full_pct: number;
  partial_pct: number;
  unclear_pct: number;
  response_count: number;
  silent_students_count: number;
  top_reasons: { reason: FeedbackReason; count: number }[];
  struggling_topics: { topic: string; unclear_count: number }[];
}

export interface StudentMetrics {
  student_id: string;
  course_id: string;
  understanding_pct: number;
  feedback_submitted_count: number;
  streak_days: number;
  last_feedback_at: string;
  is_silent: boolean;
  risk_level: 'low' | 'medium' | 'high';
}

export interface AIInsight {
  id: string;
  owner_type: InsightOwnerType;
  owner_id: string;
  priority: InsightPriority;
  title: string;
  description: string;
  action?: string;
  action_route?: string;
  created_at: string;
}

export interface TopicPerformance {
  topic: string;
  course_id: string;
  full_count: number;
  partial_count: number;
  unclear_count: number;
  total_count: number;
  clarity_pct: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface SilentStudent {
  student: User;
  course_id: string;
  metrics: StudentMetrics;
  pattern: {
    partial_count: number;
    unclear_count: number;
    comment_rate: number;
    lectures_attended: number;
  };
}

// ============================================
// DASHBOARD SUMMARIES
// ============================================

export interface ProfessorDashboardSummary {
  total_students: number;
  total_courses: number;
  active_lectures: number;
  new_feedback_count: number;
  avg_engagement_pct: number;
  silent_students_count: number;
  topics_needing_revision: { topic: string; course_code: string; confusion_score: number }[];
  recent_insights: AIInsight[];
}

export interface StudentDashboardSummary {
  enrolled_courses: number;
  feedback_submitted: number;
  avg_clarity_score: number;
  engagement_streak: number;
  pending_feedback_count: number;
  today_lectures: Lecture[];
  ai_tip: AIInsight | null;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateCourseRequest {
  code: string;
  title: string;
  semester: string;
  department: string;
}

export interface CreateLectureRequest {
  course_id: string;
  title: string;
  date_time: string;
  topics: string[];
  feedback_deadline?: string;
}

export interface SubmitFeedbackRequest {
  lecture_id: string;
  understanding: UnderstandingLevel;
  reasons: FeedbackReason[];
  subtopics: string[];
  comment: string;
}

export interface RevisionPlan {
  course_id: string;
  recommended_topics: {
    topic: string;
    priority: InsightPriority;
    confusion_score: number;
    suggested_duration_mins: number;
    reasoning: string;
  }[];
  suggested_date: string;
  affected_students_count: number;
}

// ============================================
// PAGINATION
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ============================================
// FILTERS
// ============================================

export interface CourseFilters extends PaginationParams {
  semester?: string;
  department?: string;
  search?: string;
  archived?: boolean;
  risk_level?: 'low' | 'medium' | 'high';
}

export interface LectureFilters extends PaginationParams {
  course_id?: string;
  from_date?: string;
  to_date?: string;
  has_feedback?: boolean;
}

export interface FeedbackFilters extends PaginationParams {
  lecture_id?: string;
  student_id?: string;
  understanding?: UnderstandingLevel;
}

export interface StudentFilters extends PaginationParams {
  course_id?: string;
  search?: string;
  is_silent?: boolean;
  risk_level?: 'low' | 'medium' | 'high';
}
