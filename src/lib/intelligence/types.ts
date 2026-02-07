/**
 * LIS v2.0 - Intelligence Layer Types
 */

import type { 
  UnderstandingLevel, 
  FeedbackReason, 
  SilentLevel, 
  SilentReason,
  RiskLevel 
} from '../../types/lis-v2';

// ================== Feedback Analysis ==================

export interface FeedbackItem {
  id: string;
  student_id: string;
  understanding_level: UnderstandingLevel;
  question?: string;
  reason?: FeedbackReason;
  is_anonymous: boolean;
  created_at: string;
}

export interface FeedbackDistribution {
  fully_understood: number;
  partially_understood: number;
  not_understood: number;
  total: number;
}

export interface ReasonBreakdown {
  pace_too_fast: number;
  needs_more_examples: number;
  concept_unclear: number;
  prerequisite_gap: number;
  other: number;
}

export interface LectureFeedbackSummary {
  lecture_id: string;
  response_count: number;
  response_rate: number;
  understanding_pct: number;
  distribution: FeedbackDistribution;
  reason_breakdown: ReasonBreakdown;
  top_questions: string[];
  confusion_topics: string[];
  needs_revision: boolean;
  risk_level: RiskLevel;
  ai_summary?: string;
  recommendations: string[];
}

// ================== Course Analysis ==================

export interface CourseFeedbackHistory {
  course_id: string;
  lectures: Array<{
    lecture_id: string;
    lecture_number: number;
    title: string;
    date: string;
    understanding_pct: number;
    response_rate: number;
    topics: string[];
  }>;
}

export interface CourseInsightsSummary {
  course_id: string;
  average_understanding: number;
  understanding_trend: 'improving' | 'declining' | 'stable';
  trend_delta: number;
  participation_rate: number;
  at_risk_topics: string[];
  strong_topics: string[];
  lectures_needing_revision: number;
  silent_student_count: number;
  overall_health: 'excellent' | 'good' | 'needs_attention' | 'critical';
  recommendations: string[];
}

export interface TopicAnalytics {
  topic_name: string;
  understanding_pct: number;
  confusion_count: number;
  question_count: number;
  trend: 'improving' | 'declining' | 'stable';
  needs_revision: boolean;
}

// ================== Silent Student Detection ==================

export interface StudentFeedbackHistory {
  student_id: string;
  student_name: string;
  course_id: string;
  feedbacks: Array<{
    lecture_id: string;
    understanding_level: UnderstandingLevel;
    has_question: boolean;
    created_at: string;
  }>;
  participation_rate: number;
  average_understanding: number;
}

export interface SilentStudentFlag {
  student_id: string;
  student_name: string;
  course_id: string;
  level: SilentLevel;
  reasons: SilentReason[];
  understanding_pct: number;
  participation_rate: number;
  last_question_date?: string;
  consecutive_low_count: number;
  suggested_action: string;
  confidence: number; // 0-1
}

// ================== Revision Planning ==================

export interface RevisionCandidate {
  lecture_id: string;
  lecture_number: number;
  title: string;
  date: string;
  topics: string[];
  understanding_pct: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface RevisionPlan {
  course_id: string;
  course_name: string;
  generated_at: string;
  candidates: RevisionCandidate[];
  recommended_order: string[];
  estimated_sessions: number;
  summary: string;
}

// ================== Student Study Tips ==================

export interface StudyTip {
  type: 'topic_focus' | 'review_lecture' | 'ask_question' | 'practice' | 'general';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  related_lecture_id?: string;
  related_topics?: string[];
}

export interface StudentStudyPlan {
  student_id: string;
  generated_at: string;
  overall_status: 'on_track' | 'needs_attention' | 'at_risk';
  tips: StudyTip[];
  weak_topics: string[];
  strong_topics: string[];
  suggested_questions: string[];
}

// ================== AI Adapter Interface ==================

export interface AIAdapterConfig {
  provider: 'openai' | 'anthropic' | 'local' | 'none';
  api_key?: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface AIAdapterRequest {
  type: 'summarize' | 'analyze' | 'recommend' | 'generate';
  context: Record<string, unknown>;
  prompt?: string;
}

export interface AIAdapterResponse {
  success: boolean;
  result?: string | string[] | Record<string, unknown>;
  error?: string;
  tokens_used?: number;
}

export interface AIAdapter {
  config: AIAdapterConfig;
  isAvailable(): boolean;
  summarizeFeedback(feedbacks: FeedbackItem[]): Promise<string>;
  generateRecommendations(context: Record<string, unknown>): Promise<string[]>;
  analyzeTopics(feedbackHistory: CourseFeedbackHistory): Promise<TopicAnalytics[]>;
  generateStudyTips(studentHistory: StudentFeedbackHistory): Promise<StudyTip[]>;
}
