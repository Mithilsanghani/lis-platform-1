/**
 * LIS v2.0 - Revision Planning
 * Generate revision plans based on lecture feedback analysis
 */

import type { RiskLevel } from '../../types/lis-v2';
import type { 
  CourseFeedbackHistory, 
  RevisionCandidate, 
  RevisionPlan,
  LectureFeedbackSummary 
} from './types';

// ================== Constants ==================

const REVISION_THRESHOLDS = {
  HIGH_PRIORITY: 50,   // understanding < 50%
  MEDIUM_PRIORITY: 65, // understanding 50-65%
  LOW_PRIORITY: 75,    // understanding 65-75%
};

const MAX_REVISION_SESSIONS = 5; // Don't recommend more than 5 at once

// ================== Revision Candidate Detection ==================

export function identifyRevisionCandidates(
  history: CourseFeedbackHistory
): RevisionCandidate[] {
  const candidates: RevisionCandidate[] = [];

  for (const lecture of history.lectures) {
    if (lecture.understanding_pct < REVISION_THRESHOLDS.LOW_PRIORITY) {
      let priority: 'high' | 'medium' | 'low';
      let reason: string;

      if (lecture.understanding_pct < REVISION_THRESHOLDS.HIGH_PRIORITY) {
        priority = 'high';
        reason = `Only ${lecture.understanding_pct}% understanding - critical revision needed`;
      } else if (lecture.understanding_pct < REVISION_THRESHOLDS.MEDIUM_PRIORITY) {
        priority = 'medium';
        reason = `${lecture.understanding_pct}% understanding - revision recommended`;
      } else {
        priority = 'low';
        reason = `${lecture.understanding_pct}% understanding - optional revision`;
      }

      candidates.push({
        lecture_id: lecture.lecture_id,
        lecture_number: lecture.lecture_number,
        title: lecture.title,
        date: lecture.date,
        topics: lecture.topics,
        understanding_pct: lecture.understanding_pct,
        priority,
        reason,
      });
    }
  }

  // Sort by priority (high first) then by understanding (lowest first)
  return candidates.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.understanding_pct - b.understanding_pct;
  });
}

// ================== Revision Plan Generation ==================

export function buildRevisionPlan(
  courseId: string,
  courseName: string,
  history: CourseFeedbackHistory,
  lectureSummaries?: LectureFeedbackSummary[]
): RevisionPlan {
  const candidates = identifyRevisionCandidates(history);
  
  // Limit to top priority items
  const topCandidates = candidates.slice(0, MAX_REVISION_SESSIONS);
  
  // Determine recommended order
  // Strategy: Start with prerequisites (earlier lectures) that are high priority
  const recommendedOrder = determineRevisionOrder(topCandidates, history);

  // Generate summary
  const summary = generatePlanSummary(topCandidates, courseName);

  return {
    course_id: courseId,
    course_name: courseName,
    generated_at: new Date().toISOString(),
    candidates: topCandidates,
    recommended_order: recommendedOrder,
    estimated_sessions: Math.min(topCandidates.length, MAX_REVISION_SESSIONS),
    summary,
  };
}

function determineRevisionOrder(
  candidates: RevisionCandidate[],
  history: CourseFeedbackHistory
): string[] {
  if (candidates.length === 0) return [];

  // Create a dependency map - earlier lectures should be revised first
  // if they are prerequisites for later lectures
  const lectureIndex = new Map<string, number>();
  history.lectures.forEach((l, i) => lectureIndex.set(l.lecture_id, i));

  // Sort by: 1) High priority first, 2) Earlier lectures first (prerequisites)
  const sorted = [...candidates].sort((a, b) => {
    // High priority always first
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (b.priority === 'high' && a.priority !== 'high') return 1;

    // For same priority, earlier lecture first
    const indexA = lectureIndex.get(a.lecture_id) ?? 0;
    const indexB = lectureIndex.get(b.lecture_id) ?? 0;
    return indexA - indexB;
  });

  return sorted.map(c => c.lecture_id);
}

function generatePlanSummary(
  candidates: RevisionCandidate[],
  courseName: string
): string {
  if (candidates.length === 0) {
    return `Great news! ${courseName} doesn't require any revision sessions at this time. Student understanding is above threshold for all lectures.`;
  }

  const highCount = candidates.filter(c => c.priority === 'high').length;
  const mediumCount = candidates.filter(c => c.priority === 'medium').length;

  let summary = `Revision plan for ${courseName}: `;

  if (highCount > 0) {
    summary += `${highCount} lecture${highCount > 1 ? 's' : ''} need${highCount === 1 ? 's' : ''} urgent revision. `;
  }

  if (mediumCount > 0) {
    summary += `${mediumCount} lecture${mediumCount > 1 ? 's' : ''} recommended for review. `;
  }

  // Add topic summary
  const allTopics = [...new Set(candidates.flatMap(c => c.topics))];
  if (allTopics.length > 0) {
    const topTopics = allTopics.slice(0, 3);
    summary += `Key topics to cover: ${topTopics.join(', ')}. `;
  }

  // Add recommendation
  if (highCount > 0) {
    summary += 'Consider scheduling revision sessions as soon as possible.';
  } else {
    summary += 'Consider reviewing these topics in upcoming classes or dedicated sessions.';
  }

  return summary;
}

// ================== Session Scheduling Suggestions ==================

export interface SessionSuggestion {
  lecture_id: string;
  suggested_duration_minutes: number;
  suggested_format: 'in_class' | 'extra_session' | 'office_hours' | 'online_review';
  topics_to_cover: string[];
  approach_recommendation: string;
}

export function generateSessionSuggestions(
  candidates: RevisionCandidate[],
  lectureSummaries?: LectureFeedbackSummary[]
): SessionSuggestion[] {
  return candidates.map(candidate => {
    const summary = lectureSummaries?.find(s => s.lecture_id === candidate.lecture_id);
    const topReasons = summary?.reason_breakdown;

    let format: SessionSuggestion['suggested_format'];
    let duration: number;
    let approach: string;

    // Determine format based on priority
    if (candidate.priority === 'high') {
      format = 'extra_session';
      duration = 60;
      approach = 'Full re-teaching with additional examples and Q&A';
    } else if (candidate.priority === 'medium') {
      format = 'in_class';
      duration = 30;
      approach = 'Quick recap with focus on confused areas';
    } else {
      format = 'online_review';
      duration = 20;
      approach = 'Share additional resources and practice problems';
    }

    // Customize based on feedback reasons
    if (topReasons) {
      if (topReasons.needs_more_examples > 2) {
        approach += '. Include more worked examples.';
      }
      if (topReasons.pace_too_fast > 2) {
        approach += '. Slow down the pace.';
        duration += 10;
      }
      if (topReasons.prerequisite_gap > 2) {
        approach += '. Review prerequisite concepts first.';
        duration += 15;
      }
    }

    return {
      lecture_id: candidate.lecture_id,
      suggested_duration_minutes: duration,
      suggested_format: format,
      topics_to_cover: candidate.topics,
      approach_recommendation: approach,
    };
  });
}

// ================== Topic-Based Revision ==================

export interface TopicRevisionPlan {
  topic_name: string;
  lectures_affected: string[];
  average_understanding: number;
  priority: 'high' | 'medium' | 'low';
  suggested_approach: string;
}

export function buildTopicRevisionPlan(
  history: CourseFeedbackHistory
): TopicRevisionPlan[] {
  const topicStats = new Map<string, {
    lectures: string[];
    understandingScores: number[];
  }>();

  // Aggregate by topic
  for (const lecture of history.lectures) {
    for (const topic of lecture.topics) {
      if (!topicStats.has(topic)) {
        topicStats.set(topic, { lectures: [], understandingScores: [] });
      }
      const stats = topicStats.get(topic)!;
      stats.lectures.push(lecture.lecture_id);
      stats.understandingScores.push(lecture.understanding_pct);
    }
  }

  // Create topic plans
  const plans: TopicRevisionPlan[] = [];

  for (const [topic, stats] of topicStats) {
    const avgUnderstanding = Math.round(
      stats.understandingScores.reduce((a, b) => a + b, 0) / stats.understandingScores.length
    );

    // Only include topics that need revision
    if (avgUnderstanding < REVISION_THRESHOLDS.LOW_PRIORITY) {
      let priority: 'high' | 'medium' | 'low';
      let approach: string;

      if (avgUnderstanding < REVISION_THRESHOLDS.HIGH_PRIORITY) {
        priority = 'high';
        approach = 'Dedicate full session to re-explaining this topic from fundamentals';
      } else if (avgUnderstanding < REVISION_THRESHOLDS.MEDIUM_PRIORITY) {
        priority = 'medium';
        approach = 'Provide additional examples and practice problems';
      } else {
        priority = 'low';
        approach = 'Quick recap and share supplementary resources';
      }

      plans.push({
        topic_name: topic,
        lectures_affected: stats.lectures,
        average_understanding: avgUnderstanding,
        priority,
        suggested_approach: approach,
      });
    }
  }

  // Sort by priority then understanding
  return plans.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.average_understanding - b.average_understanding;
  });
}

export default {
  identifyRevisionCandidates,
  buildRevisionPlan,
  generateSessionSuggestions,
  buildTopicRevisionPlan,
};
