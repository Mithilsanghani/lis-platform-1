/**
 * LIS v2.0 - Feedback Analysis Functions
 * Pure TypeScript functions for analyzing lecture and course feedback
 */

import type { UnderstandingLevel, FeedbackReason, RiskLevel } from '../../types/lis-v2';
import type {
  FeedbackItem,
  FeedbackDistribution,
  ReasonBreakdown,
  LectureFeedbackSummary,
  CourseFeedbackHistory,
  CourseInsightsSummary,
  TopicAnalytics,
} from './types';

// ================== Constants ==================

const UNDERSTANDING_THRESHOLD = {
  EXCELLENT: 85,
  GOOD: 70,
  NEEDS_ATTENTION: 50,
};

const RESPONSE_RATE_THRESHOLD = {
  GOOD: 60,
  LOW: 40,
};

// ================== Feedback Distribution ==================

export function computeFeedbackDistribution(
  feedbacks: FeedbackItem[]
): FeedbackDistribution {
  const distribution: FeedbackDistribution = {
    fully_understood: 0,
    partially_understood: 0,
    not_understood: 0,
    total: feedbacks.length,
  };

  for (const f of feedbacks) {
    switch (f.understanding_level) {
      case 'fully_understood':
        distribution.fully_understood++;
        break;
      case 'partially_understood':
        distribution.partially_understood++;
        break;
      case 'not_understood':
        distribution.not_understood++;
        break;
    }
  }

  return distribution;
}

export function computeUnderstandingPct(distribution: FeedbackDistribution): number {
  if (distribution.total === 0) return 0;
  
  // Weighted: fully=100%, partially=50%, not=0%
  const score =
    distribution.fully_understood * 100 +
    distribution.partially_understood * 50 +
    distribution.not_understood * 0;
  
  return Math.round(score / distribution.total);
}

// ================== Reason Breakdown ==================

export function computeReasonBreakdown(feedbacks: FeedbackItem[]): ReasonBreakdown {
  const breakdown: ReasonBreakdown = {
    pace_too_fast: 0,
    needs_more_examples: 0,
    concept_unclear: 0,
    prerequisite_gap: 0,
    other: 0,
  };

  for (const f of feedbacks) {
    if (f.reason && f.understanding_level !== 'fully_understood') {
      if (f.reason in breakdown) {
        breakdown[f.reason as keyof ReasonBreakdown]++;
      } else {
        breakdown.other++;
      }
    }
  }

  return breakdown;
}

export function getTopReasons(breakdown: ReasonBreakdown, limit = 3): FeedbackReason[] {
  const entries = Object.entries(breakdown) as [FeedbackReason, number][];
  return entries
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([reason]) => reason);
}

// ================== Question Extraction ==================

export function extractQuestions(feedbacks: FeedbackItem[]): string[] {
  return feedbacks
    .filter((f) => f.question && f.question.trim().length > 0)
    .map((f) => f.question!.trim())
    .slice(0, 10); // Limit to top 10
}

// ================== Risk Assessment ==================

export function assessRiskLevel(
  understandingPct: number,
  responseRate: number
): RiskLevel {
  if (understandingPct < UNDERSTANDING_THRESHOLD.NEEDS_ATTENTION) {
    return 'high';
  }
  if (understandingPct < UNDERSTANDING_THRESHOLD.GOOD) {
    return 'medium';
  }
  if (responseRate < RESPONSE_RATE_THRESHOLD.LOW) {
    return 'medium'; // Low participation is concerning
  }
  return 'low';
}

// ================== Lecture Feedback Summary ==================

export function summarizeLectureFeedback(
  lectureId: string,
  feedbacks: FeedbackItem[],
  enrolledCount: number,
  topics: string[] = []
): LectureFeedbackSummary {
  const distribution = computeFeedbackDistribution(feedbacks);
  const understandingPct = computeUnderstandingPct(distribution);
  const responseRate = enrolledCount > 0 
    ? Math.round((feedbacks.length / enrolledCount) * 100) 
    : 0;
  const reasonBreakdown = computeReasonBreakdown(feedbacks);
  const topQuestions = extractQuestions(feedbacks);
  const riskLevel = assessRiskLevel(understandingPct, responseRate);
  
  // Identify confusion topics based on feedback with questions
  const confusionTopics = topics.filter((_, i) => i < 3); // Simplified - would use NLP in production

  // Determine if revision is needed
  const needsRevision = 
    understandingPct < UNDERSTANDING_THRESHOLD.GOOD ||
    riskLevel === 'high';

  // Generate recommendations
  const recommendations = generateLectureRecommendations(
    understandingPct,
    responseRate,
    reasonBreakdown,
    topQuestions.length
  );

  return {
    lecture_id: lectureId,
    response_count: feedbacks.length,
    response_rate: responseRate,
    understanding_pct: understandingPct,
    distribution,
    reason_breakdown: reasonBreakdown,
    top_questions: topQuestions,
    confusion_topics: confusionTopics,
    needs_revision: needsRevision,
    risk_level: riskLevel,
    recommendations,
  };
}

function generateLectureRecommendations(
  understandingPct: number,
  responseRate: number,
  reasons: ReasonBreakdown,
  questionCount: number
): string[] {
  const recs: string[] = [];

  if (understandingPct < UNDERSTANDING_THRESHOLD.NEEDS_ATTENTION) {
    recs.push('Schedule a revision session for this lecture');
  }

  if (responseRate < RESPONSE_RATE_THRESHOLD.LOW) {
    recs.push('Encourage more students to submit feedback');
  }

  if (reasons.pace_too_fast > 2) {
    recs.push('Consider slowing down the pace for similar topics');
  }

  if (reasons.needs_more_examples > 2) {
    recs.push('Add more worked examples in the next session');
  }

  if (reasons.prerequisite_gap > 2) {
    recs.push('Review prerequisite concepts before continuing');
  }

  if (questionCount > 5) {
    recs.push('Dedicate time to address student questions in next class');
  }

  if (recs.length === 0) {
    recs.push('Continue with current teaching approach');
  }

  return recs;
}

// ================== Course Insights ==================

export function computeCourseInsights(
  courseId: string,
  courseName: string,
  history: CourseFeedbackHistory,
  silentCount: number = 0
): CourseInsightsSummary {
  const lectures = history.lectures;
  
  if (lectures.length === 0) {
    return {
      course_id: courseId,
      average_understanding: 0,
      understanding_trend: 'stable',
      trend_delta: 0,
      participation_rate: 0,
      at_risk_topics: [],
      strong_topics: [],
      lectures_needing_revision: 0,
      silent_student_count: silentCount,
      overall_health: 'needs_attention',
      recommendations: ['No lecture data available yet'],
    };
  }

  // Calculate average understanding
  const avgUnderstanding = Math.round(
    lectures.reduce((sum, l) => sum + l.understanding_pct, 0) / lectures.length
  );

  // Calculate trend (compare last 3 vs previous 3)
  const { trend, delta } = calculateTrend(lectures.map(l => l.understanding_pct));

  // Calculate participation rate
  const avgParticipation = Math.round(
    lectures.reduce((sum, l) => sum + l.response_rate, 0) / lectures.length
  );

  // Identify at-risk and strong topics
  const topicStats = aggregateTopicStats(lectures);
  const atRiskTopics = topicStats
    .filter(t => t.understanding_pct < UNDERSTANDING_THRESHOLD.GOOD)
    .map(t => t.topic);
  const strongTopics = topicStats
    .filter(t => t.understanding_pct >= UNDERSTANDING_THRESHOLD.EXCELLENT)
    .map(t => t.topic);

  // Count lectures needing revision
  const lecturesNeedingRevision = lectures.filter(
    l => l.understanding_pct < UNDERSTANDING_THRESHOLD.GOOD
  ).length;

  // Determine overall health
  const health = determineOverallHealth(
    avgUnderstanding,
    avgParticipation,
    silentCount,
    lecturesNeedingRevision
  );

  // Generate recommendations
  const recommendations = generateCourseRecommendations(
    avgUnderstanding,
    avgParticipation,
    trend,
    silentCount,
    atRiskTopics.length
  );

  return {
    course_id: courseId,
    average_understanding: avgUnderstanding,
    understanding_trend: trend,
    trend_delta: delta,
    participation_rate: avgParticipation,
    at_risk_topics: atRiskTopics,
    strong_topics: strongTopics,
    lectures_needing_revision: lecturesNeedingRevision,
    silent_student_count: silentCount,
    overall_health: health,
    recommendations,
  };
}

function calculateTrend(
  values: number[]
): { trend: 'improving' | 'declining' | 'stable'; delta: number } {
  if (values.length < 2) {
    return { trend: 'stable', delta: 0 };
  }

  const recentCount = Math.min(3, Math.floor(values.length / 2));
  const recent = values.slice(-recentCount);
  const previous = values.slice(-recentCount * 2, -recentCount);

  if (previous.length === 0) {
    return { trend: 'stable', delta: 0 };
  }

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
  const delta = Math.round(recentAvg - previousAvg);

  if (delta > 5) return { trend: 'improving', delta };
  if (delta < -5) return { trend: 'declining', delta };
  return { trend: 'stable', delta };
}

function aggregateTopicStats(
  lectures: CourseFeedbackHistory['lectures']
): Array<{ topic: string; understanding_pct: number }> {
  const topicMap = new Map<string, number[]>();

  for (const lecture of lectures) {
    for (const topic of lecture.topics) {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, []);
      }
      topicMap.get(topic)!.push(lecture.understanding_pct);
    }
  }

  return Array.from(topicMap.entries()).map(([topic, values]) => ({
    topic,
    understanding_pct: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
  }));
}

function determineOverallHealth(
  avgUnderstanding: number,
  avgParticipation: number,
  silentCount: number,
  lecturesNeedingRevision: number
): 'excellent' | 'good' | 'needs_attention' | 'critical' {
  let score = 0;

  // Understanding score (0-40)
  if (avgUnderstanding >= UNDERSTANDING_THRESHOLD.EXCELLENT) score += 40;
  else if (avgUnderstanding >= UNDERSTANDING_THRESHOLD.GOOD) score += 30;
  else if (avgUnderstanding >= UNDERSTANDING_THRESHOLD.NEEDS_ATTENTION) score += 15;

  // Participation score (0-30)
  if (avgParticipation >= RESPONSE_RATE_THRESHOLD.GOOD) score += 30;
  else if (avgParticipation >= RESPONSE_RATE_THRESHOLD.LOW) score += 15;

  // Silent student penalty (0 to -15)
  if (silentCount === 0) score += 15;
  else if (silentCount <= 3) score += 5;

  // Revision penalty (0 to -15)
  if (lecturesNeedingRevision === 0) score += 15;
  else if (lecturesNeedingRevision <= 2) score += 5;

  if (score >= 85) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 35) return 'needs_attention';
  return 'critical';
}

function generateCourseRecommendations(
  avgUnderstanding: number,
  avgParticipation: number,
  trend: 'improving' | 'declining' | 'stable',
  silentCount: number,
  atRiskTopicCount: number
): string[] {
  const recs: string[] = [];

  if (trend === 'declining') {
    recs.push('Understanding is declining - review recent teaching approach');
  }

  if (avgParticipation < RESPONSE_RATE_THRESHOLD.LOW) {
    recs.push('Low participation rate - consider incentivizing feedback');
  }

  if (silentCount > 3) {
    recs.push(`${silentCount} silent students detected - reach out proactively`);
  }

  if (atRiskTopicCount > 2) {
    recs.push(`${atRiskTopicCount} topics need attention - plan revision sessions`);
  }

  if (avgUnderstanding < UNDERSTANDING_THRESHOLD.NEEDS_ATTENTION) {
    recs.push('Overall understanding is low - consider course restructuring');
  }

  if (recs.length === 0 && avgUnderstanding >= UNDERSTANDING_THRESHOLD.GOOD) {
    recs.push('Course is performing well - maintain current approach');
  }

  return recs;
}

// ================== Topic Analytics ==================

export function analyzeTopics(history: CourseFeedbackHistory): TopicAnalytics[] {
  const topicData = new Map<string, {
    understanding: number[];
    confusion: number;
    questions: number;
  }>();

  for (const lecture of history.lectures) {
    for (const topic of lecture.topics) {
      if (!topicData.has(topic)) {
        topicData.set(topic, { understanding: [], confusion: 0, questions: 0 });
      }
      const data = topicData.get(topic)!;
      data.understanding.push(lecture.understanding_pct);
      // In real implementation, would track confusion/questions per topic
    }
  }

  return Array.from(topicData.entries()).map(([topic, data]) => {
    const values = data.understanding;
    const avgUnderstanding = Math.round(
      values.reduce((a, b) => a + b, 0) / values.length
    );
    const { trend } = calculateTrend(values);

    return {
      topic_name: topic,
      understanding_pct: avgUnderstanding,
      confusion_count: data.confusion,
      question_count: data.questions,
      trend,
      needs_revision: avgUnderstanding < UNDERSTANDING_THRESHOLD.GOOD,
    };
  });
}

export default {
  computeFeedbackDistribution,
  computeUnderstandingPct,
  computeReasonBreakdown,
  getTopReasons,
  extractQuestions,
  assessRiskLevel,
  summarizeLectureFeedback,
  computeCourseInsights,
  analyzeTopics,
};
