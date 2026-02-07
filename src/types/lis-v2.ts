/**
 * LIS v2.0 - Complete TypeScript Types
 * Feedback-centric design for colleges
 */

// ============================================
// ENUMS
// ============================================

export type UserRole = 'student' | 'professor' | 'dept_admin' | 'institute_admin';
export type CourseRole = 'student' | 'ta' | 'co_instructor';
export type UnderstandingLevel = 'full' | 'partial' | 'unclear' | 'fully_understood' | 'partially_understood' | 'not_understood';
export type LectureMode = 'online' | 'offline' | 'hybrid';
export type RiskLevel = 'low' | 'medium' | 'high';
export type SilentReason = 'low_understanding' | 'low_participation' | 'no_comments' | 'declining_trend' | 'never_asks_questions' | 'declining_performance';
export type SilentLevel = 'warning' | 'critical' | 'high' | 'moderate' | 'low' | 'none';
export type ReminderTiming = 'before' | 'after' | 'daily_summary';
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
export type TrendDirection = 'improving' | 'stable' | 'declining';

// ============================================
// CORE ENTITIES
// ============================================

export interface User {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  department?: string;
  roll_number?: string;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole_DB {
  id: string;
  user_id: string;
  role: UserRole;
  scope_type?: 'global' | 'department' | 'course';
  scope_id?: string;
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  department: string;
  semester: string;
  academic_year?: string;
  credits?: number;
  created_by: string;
  archived_at?: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  student_count?: number;
  lecture_count?: number;
  professor_name?: string;
  avg_understanding_pct?: number;
  health_score?: number;
  silent_students_count?: number;
  trend?: TrendDirection;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  role_in_course: CourseRole;
  enrolled_at: string;
  dropped_at?: string;
  created_at: string;
  // Joined
  user?: User;
  course?: Course;
}

export interface Lecture {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  date_time: string;
  duration_mins: number;
  mode: LectureMode;
  location?: string;
  topics: string[];
  feedback_deadline?: string;
  is_cancelled: boolean;
  created_at: string;
  updated_at: string;
  // Computed/Joined
  course?: Course;
  feedback_count?: number;
  response_rate?: number;
  insights?: LectureInsights;
}

// ============================================
// FEEDBACK SYSTEM
// ============================================

export interface FeedbackFormSchema {
  understanding: {
    required: boolean;
    options: UnderstandingLevel[];
  };
  reasons: {
    required: boolean;
    multiple: boolean;
    options: FeedbackReason[];
  };
  subtopics: {
    required: boolean;
    freeform: boolean;
  };
  comment: {
    required: boolean;
    maxLength: number;
  };
}

export interface FeedbackForm {
  id: string;
  name: string;
  course_id?: string;
  department?: string;
  schema: FeedbackFormSchema;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  lecture_id: string;
  student_id: string;
  understanding: UnderstandingLevel;
  reasons: FeedbackReason[];
  subtopics: string[];
  comment?: string;
  is_anonymous: boolean;
  form_id?: string;
  submitted_at: string;
  updated_at: string;
  // Joined
  student?: User;
  lecture?: Lecture;
}

export interface FeedbackSubmission {
  understanding: UnderstandingLevel;
  reasons: FeedbackReason[];
  subtopics: string[];
  comment?: string;
  is_anonymous?: boolean;
}

// ============================================
// ANALYTICS & INSIGHTS
// ============================================

export interface StudentMetrics {
  id: string;
  student_id: string;
  course_id: string;
  understanding_pct: number;
  full_count: number;
  partial_count: number;
  unclear_count: number;
  feedback_submitted: number;
  feedback_pending: number;
  total_lectures: number;
  streak_days: number;
  longest_streak: number;
  last_feedback_at?: string;
  avg_response_time_mins?: number;
  computed_at: string;
  // Joined
  student?: User;
  course?: Course;
}

export interface LectureInsights {
  id: string;
  lecture_id: string;
  response_count: number;
  enrolled_count: number;
  response_rate: number;
  full_count: number;
  partial_count: number;
  unclear_count: number;
  full_pct: number;
  partial_pct: number;
  unclear_pct: number;
  pace_fast_count: number;
  pace_slow_count: number;
  examples_few_count: number;
  concept_unclear_count: number;
  missed_part_count: number;
  good_explanation_count: number;
  helpful_examples_count: number;
  top_subtopics: { topic: string; count: number }[];
  risk_level: RiskLevel;
  confusion_addressed: boolean;
  confusion_addressed_at?: string;
  computed_at: string;
}

export interface CourseInsights {
  id: string;
  course_id: string;
  avg_understanding_pct: number;
  avg_response_rate: number;
  total_lectures: number;
  total_feedback: number;
  high_risk_lectures: number;
  high_risk_topics: TopicRisk[];
  trending_issues: TrendingIssue[];
  silent_students_count: number;
  health_score: number;
  trend: TrendDirection;
  last_lecture_at?: string;
  computed_at: string;
}

export interface TopicAnalytics {
  id: string;
  course_id: string;
  topic: string;
  total_mentions: number;
  full_count: number;
  partial_count: number;
  unclear_count: number;
  clarity_pct: number;
  confusion_score: number;
  trend: TrendDirection;
  last_mentioned_at?: string;
  computed_at: string;
}

export interface TopicRisk {
  topic: string;
  confusion_score: number;
  mention_count: number;
  priority: RiskLevel;
}

export interface TrendingIssue {
  type: 'pace' | 'examples' | 'clarity' | 'participation';
  severity: RiskLevel;
  description: string;
  affected_lectures: number;
}

// ============================================
// SILENT STUDENT DETECTION
// ============================================

export interface SilentFlag {
  id: string;
  student_id: string;
  course_id: string;
  reason: SilentReason;
  level: SilentLevel;
  understanding_pct?: number;
  participation_pct?: number;
  comment_rate?: number;
  detected_at: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
  notes?: string;
  // Joined
  student?: User;
  course?: Course;
}

export interface NudgeHistory {
  id: string;
  student_id: string;
  course_id: string;
  sent_by: string;
  message?: string;
  channel: 'email' | 'push' | 'whatsapp';
  sent_at: string;
  opened_at?: string;
  responded_at?: string;
  // Joined
  student?: User;
  sender?: User;
}

// ============================================
// USER PREFERENCES
// ============================================

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  whatsapp_enabled: boolean;
  sms_enabled: boolean;
  reminder_timing: ReminderTiming;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  weekly_digest: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrivacySettings {
  id: string;
  user_id: string;
  share_performance_with_professor: boolean;
  share_trends_with_professor: boolean;
  allow_anonymous_feedback: boolean;
  show_in_leaderboards: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

// ============================================
// REVISION & ACTIONS
// ============================================

export interface RevisionSession {
  id: string;
  course_id: string;
  lecture_id?: string;
  title: string;
  description?: string;
  topics: string[];
  scheduled_at: string;
  duration_mins: number;
  created_by: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback_collected: boolean;
  created_at: string;
  // Joined
  course?: Course;
  lecture?: Lecture;
}

export interface RevisionPlanItem {
  topic: string;
  priority: RiskLevel;
  confusion_score: number;
  suggested_format: 'examples' | 'recap' | 'tutorial' | 'discussion';
  suggested_duration_mins: number;
  reasoning: string;
  affected_students: number;
}

export interface RevisionPlan {
  course_id: string;
  generated_at: string;
  items: RevisionPlanItem[];
  total_duration_mins: number;
  suggested_date?: string;
}

// ============================================
// STUDY TIPS (AI/Rule-based)
// ============================================

export interface StudyTip {
  id: string;
  type: 'strength' | 'weakness' | 'pattern' | 'suggestion';
  title: string;
  description: string;
  course_code?: string;
  topic?: string;
  action?: string;
  action_route?: string;
  priority: RiskLevel;
}

// ============================================
// DASHBOARD SUMMARIES
// ============================================

export interface StudentOverviewData {
  user: User;
  stats: {
    enrolled_courses: number;
    lectures_today: number;
    pending_feedback: number;
    avg_understanding: number;
    streak_days: number;
  };
  today_lectures: (Lecture & { 
    course_code: string;
    feedback_status: 'pending' | 'submitted' | 'upcoming';
  })[];
  study_tip: StudyTip | null;
  weak_topics: TopicAnalytics[];
}

export interface StudentCourseData {
  course: Course;
  enrollment: CourseEnrollment;
  metrics: StudentMetrics;
  recent_lectures: Lecture[];
  pending_feedback_count: number;
  next_lecture?: Lecture;
}

export interface StudentPerformanceData {
  overall_understanding: number;
  weekly_trend: { week: string; understanding: number; feedback_count: number }[];
  course_breakdown: { course: Course; understanding_pct: number; feedback_count: number }[];
  topic_performance: TopicAnalytics[];
  insights: StudyTip[];
}

export interface ProfessorOverviewData {
  user: User;
  stats: {
    active_courses: number;
    lectures_this_week: number;
    new_feedback_24h: number;
    silent_students_flagged: number;
    avg_response_rate: number;
  };
  attention_topics: TopicRisk[];
  silent_students_preview: SilentFlag[];
  recent_lectures: (Lecture & { insights: LectureInsights })[];
}

export interface ProfessorCourseData {
  course: Course;
  insights: CourseInsights;
  lectures: (Lecture & { insights?: LectureInsights })[];
  students: (StudentMetrics & { student: User })[];
  topic_heatmap: TopicAnalytics[];
  silent_students: SilentFlag[];
}

export interface ProfessorLectureData {
  lecture: Lecture;
  insights: LectureInsights;
  feedback_list: Feedback[];
  suggested_actions: RevisionPlanItem[];
  reasons_distribution: { reason: FeedbackReason; count: number; percentage: number }[];
  subtopic_mentions: { topic: string; count: number; understanding_breakdown: { full: number; partial: number; unclear: number } }[];
}

// ============================================
// API REQUEST/RESPONSE TYPES
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

export interface CourseFilters extends PaginationParams {
  department?: string;
  semester?: string;
  search?: string;
  health_min?: number;
  health_max?: number;
  risk_level?: RiskLevel;
}

export interface LectureFilters extends PaginationParams {
  course_id?: string;
  from_date?: string;
  to_date?: string;
  has_feedback?: boolean;
  risk_level?: RiskLevel;
}

export interface FeedbackFilters extends PaginationParams {
  lecture_id?: string;
  student_id?: string;
  understanding?: UnderstandingLevel;
  has_comment?: boolean;
}

export interface StudentFilters extends PaginationParams {
  course_id?: string;
  search?: string;
  is_silent?: boolean;
  risk_level?: RiskLevel;
  understanding_min?: number;
  understanding_max?: number;
}

// ============================================
// AUDIT LOG
// ============================================

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_role?: UserRole;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================
// DEPARTMENT ANALYTICS (Admin)
// ============================================

export interface DeptAnalytics {
  department: string;
  total_courses: number;
  total_students: number;
  total_professors: number;
  avg_understanding: number;
  avg_response_rate: number;
  high_risk_courses: number;
  silent_students: number;
  top_issues: TrendingIssue[];
  course_comparison: {
    course: Course;
    understanding_pct: number;
    response_rate: number;
    health_score: number;
  }[];
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  department?: string;
  avatar_url?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  expires_at: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
