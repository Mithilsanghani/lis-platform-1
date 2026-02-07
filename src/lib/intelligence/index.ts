/**
 * LIS v2.0 - Intelligence Layer
 * Central export for all intelligence functions
 */

// Types
export type {
  FeedbackItem,
  FeedbackDistribution,
  ReasonBreakdown,
  LectureFeedbackSummary,
  CourseFeedbackHistory,
  CourseInsightsSummary,
  TopicAnalytics,
  StudentFeedbackHistory,
  SilentStudentFlag,
  RevisionCandidate,
  RevisionPlan,
  StudyTip,
  StudentStudyPlan,
  AIAdapter,
  AIAdapterConfig,
  AIAdapterRequest,
  AIAdapterResponse,
} from './types';

// Feedback Analysis
export {
  computeFeedbackDistribution,
  computeUnderstandingPct,
  computeReasonBreakdown,
  getTopReasons,
  extractQuestions,
  assessRiskLevel,
  summarizeLectureFeedback,
  computeCourseInsights,
  analyzeTopics,
} from './feedback-analysis';

// Silent Student Detection
export {
  detectSilentStudent,
  detectSilentStudents,
  generateNudgeTemplate,
} from './silent-detection';
export type { NudgeTemplate } from './silent-detection';

// Revision Planning
export {
  identifyRevisionCandidates,
  buildRevisionPlan,
  generateSessionSuggestions,
  buildTopicRevisionPlan,
} from './revision-planning';
export type { SessionSuggestion, TopicRevisionPlan } from './revision-planning';

// Study Tips
export {
  generateStudentStudyPlan,
  getDailyTip,
  getPersonalizedTip,
  generateCourseRecommendations,
} from './study-tips';
export type { DailyTip, CourseRecommendation } from './study-tips';

// AI Adapter
export {
  configureAI,
  getAIAdapter,
  isAIAvailable,
  aiSummarizeFeedback,
  aiGenerateRecommendations,
  aiAnalyzeTopics,
  aiGenerateStudyTips,
} from './ai-adapter';

// ================== Quick Analysis Functions ==================

import { summarizeLectureFeedback, computeCourseInsights } from './feedback-analysis';
import { detectSilentStudents } from './silent-detection';
import { buildRevisionPlan } from './revision-planning';
import { generateStudentStudyPlan, getPersonalizedTip } from './study-tips';
import type { 
  FeedbackItem, 
  CourseFeedbackHistory, 
  StudentFeedbackHistory,
  LectureFeedbackSummary,
  CourseInsightsSummary,
  SilentStudentFlag,
  RevisionPlan,
  StudentStudyPlan,
  DailyTip,
} from './types';

/**
 * Quick analysis of a single lecture
 */
export function quickLectureAnalysis(
  lectureId: string,
  feedbacks: FeedbackItem[],
  enrolledCount: number,
  topics?: string[]
): LectureFeedbackSummary {
  return summarizeLectureFeedback(lectureId, feedbacks, enrolledCount, topics);
}

/**
 * Quick analysis of a course
 */
export function quickCourseAnalysis(
  courseId: string,
  courseName: string,
  history: CourseFeedbackHistory,
  silentCount?: number
): CourseInsightsSummary {
  return computeCourseInsights(courseId, courseName, history, silentCount);
}

/**
 * Quick detection of silent students in a course
 */
export function quickSilentDetection(
  studentHistories: StudentFeedbackHistory[]
): SilentStudentFlag[] {
  return detectSilentStudents(studentHistories);
}

/**
 * Quick revision plan generation
 */
export function quickRevisionPlan(
  courseId: string,
  courseName: string,
  history: CourseFeedbackHistory
): RevisionPlan {
  return buildRevisionPlan(courseId, courseName, history);
}

/**
 * Quick student study plan
 */
export function quickStudyPlan(
  history: StudentFeedbackHistory,
  courseName?: string
): StudentStudyPlan {
  return generateStudentStudyPlan(history, courseName);
}

/**
 * Quick personalized tip for student
 */
export function quickTip(history: StudentFeedbackHistory | null): DailyTip {
  return getPersonalizedTip(history);
}

// ================== Batch Analysis ==================

export interface BatchAnalysisResult {
  lectures: Map<string, LectureFeedbackSummary>;
  course: CourseInsightsSummary;
  silentStudents: SilentStudentFlag[];
  revisionPlan: RevisionPlan;
}

/**
 * Run complete analysis for a course
 */
export function analyzeCourse(
  courseId: string,
  courseName: string,
  feedbackHistory: CourseFeedbackHistory,
  lectureFeeBacks: Map<string, { feedbacks: FeedbackItem[]; enrolled: number; topics?: string[] }>,
  studentHistories: StudentFeedbackHistory[]
): BatchAnalysisResult {
  // Analyze each lecture
  const lectureResults = new Map<string, LectureFeedbackSummary>();
  for (const [lectureId, data] of lectureFeeBacks) {
    lectureResults.set(
      lectureId,
      summarizeLectureFeedback(lectureId, data.feedbacks, data.enrolled, data.topics)
    );
  }

  // Detect silent students
  const silentStudents = detectSilentStudents(studentHistories);

  // Compute course insights
  const courseInsights = computeCourseInsights(
    courseId,
    courseName,
    feedbackHistory,
    silentStudents.length
  );

  // Build revision plan
  const revisionPlan = buildRevisionPlan(courseId, courseName, feedbackHistory);

  return {
    lectures: lectureResults,
    course: courseInsights,
    silentStudents,
    revisionPlan,
  };
}
