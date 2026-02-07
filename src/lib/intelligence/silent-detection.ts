/**
 * LIS v2.0 - Silent Student Detection
 * Rule-based detection of students who may be struggling silently
 */

import type { SilentLevel, SilentReason, UnderstandingLevel } from '../../types/lis-v2';
import type { StudentFeedbackHistory, SilentStudentFlag } from './types';

// ================== Detection Rules ==================

/**
 * Silent Student Detection Rules:
 * 
 * CRITICAL (level = 'critical'):
 * - Understanding < 50% AND never asked questions AND participation > 60%
 * - 5+ consecutive "not_understood" feedbacks
 * 
 * HIGH (level = 'high'):
 * - Understanding < 60% AND no questions in last 3 lectures
 * - Understanding declining for 3+ consecutive lectures
 * 
 * MODERATE (level = 'moderate'):
 * - Understanding 60-70% AND never asked questions
 * - Participation rate < 50% for enrolled student
 * 
 * LOW (level = 'low'):
 * - Understanding 70-75% AND no questions in last 5 lectures
 * - Only submits anonymous feedback consistently
 */

interface DetectionConfig {
  minFeedbacksRequired: number;
  criticalUnderstandingThreshold: number;
  highUnderstandingThreshold: number;
  moderateUnderstandingThreshold: number;
  lowUnderstandingThreshold: number;
  consecutiveLowThreshold: number;
  noQuestionLecturesThreshold: number;
  lowParticipationThreshold: number;
}

const DEFAULT_CONFIG: DetectionConfig = {
  minFeedbacksRequired: 3,
  criticalUnderstandingThreshold: 50,
  highUnderstandingThreshold: 60,
  moderateUnderstandingThreshold: 70,
  lowUnderstandingThreshold: 75,
  consecutiveLowThreshold: 5,
  noQuestionLecturesThreshold: 3,
  lowParticipationThreshold: 50,
};

// ================== Core Detection ==================

export function detectSilentStudent(
  history: StudentFeedbackHistory,
  config: Partial<DetectionConfig> = {}
): SilentStudentFlag | null {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  // Not enough data
  if (history.feedbacks.length < cfg.minFeedbacksRequired) {
    return null;
  }

  const reasons: SilentReason[] = [];
  let level: SilentLevel = 'low';
  let confidence = 0;

  // Calculate metrics
  const hasEverAskedQuestion = history.feedbacks.some(f => f.has_question);
  const consecutiveLow = countConsecutiveLow(history.feedbacks);
  const lecturesSinceQuestion = countLecturesSinceQuestion(history.feedbacks);
  const understandingTrend = calculateUnderstandingTrend(history.feedbacks);

  // ===== CRITICAL Level Detection =====
  
  // Rule: Low understanding + never questions + high participation
  if (
    history.average_understanding < cfg.criticalUnderstandingThreshold &&
    !hasEverAskedQuestion &&
    history.participation_rate >= 60
  ) {
    level = 'critical';
    reasons.push('low_understanding');
    reasons.push('never_asks_questions');
    confidence = 0.9;
  }

  // Rule: 5+ consecutive "not_understood"
  if (consecutiveLow >= cfg.consecutiveLowThreshold) {
    level = 'critical';
    if (!reasons.includes('low_understanding')) {
      reasons.push('low_understanding');
    }
    reasons.push('declining_performance');
    confidence = Math.max(confidence, 0.85);
  }

  // ===== HIGH Level Detection =====
  
  if (level !== 'critical') {
    // Rule: Low understanding + no questions in last 3 lectures
    if (
      history.average_understanding < cfg.highUnderstandingThreshold &&
      lecturesSinceQuestion >= cfg.noQuestionLecturesThreshold
    ) {
      level = 'high';
      reasons.push('low_understanding');
      reasons.push('never_asks_questions');
      confidence = 0.75;
    }

    // Rule: Declining understanding for 3+ lectures
    if (understandingTrend.declining && understandingTrend.count >= 3) {
      level = 'high';
      if (!reasons.includes('declining_performance')) {
        reasons.push('declining_performance');
      }
      confidence = Math.max(confidence, 0.7);
    }
  }

  // ===== MODERATE Level Detection =====
  
  if (level !== 'critical' && level !== 'high') {
    // Rule: Moderate understanding + never asked questions
    if (
      history.average_understanding < cfg.moderateUnderstandingThreshold &&
      !hasEverAskedQuestion
    ) {
      level = 'moderate';
      reasons.push('never_asks_questions');
      confidence = 0.6;
    }

    // Rule: Low participation rate
    if (history.participation_rate < cfg.lowParticipationThreshold) {
      level = 'moderate';
      reasons.push('low_participation');
      confidence = Math.max(confidence, 0.55);
    }
  }

  // ===== LOW Level Detection =====
  
  if (reasons.length === 0) {
    // Rule: Borderline understanding + no recent questions
    if (
      history.average_understanding < cfg.lowUnderstandingThreshold &&
      lecturesSinceQuestion >= 5
    ) {
      level = 'low';
      reasons.push('never_asks_questions');
      confidence = 0.4;
    }
  }

  // No flags detected
  if (reasons.length === 0) {
    return null;
  }

  // Find last question date
  const lastQuestionFeedback = [...history.feedbacks]
    .reverse()
    .find(f => f.has_question);

  return {
    student_id: history.student_id,
    student_name: history.student_name,
    course_id: history.course_id,
    level,
    reasons,
    understanding_pct: Math.round(history.average_understanding),
    participation_rate: Math.round(history.participation_rate),
    last_question_date: lastQuestionFeedback?.created_at,
    consecutive_low_count: consecutiveLow,
    suggested_action: generateSuggestedAction(level, reasons),
    confidence,
  };
}

// ================== Batch Detection ==================

export function detectSilentStudents(
  studentHistories: StudentFeedbackHistory[],
  config: Partial<DetectionConfig> = {}
): SilentStudentFlag[] {
  const flags: SilentStudentFlag[] = [];

  for (const history of studentHistories) {
    const flag = detectSilentStudent(history, config);
    if (flag) {
      flags.push(flag);
    }
  }

  // Sort by level (critical first) then by confidence
  return flags.sort((a, b) => {
    const levelOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
    const levelDiff = levelOrder[a.level] - levelOrder[b.level];
    if (levelDiff !== 0) return levelDiff;
    return b.confidence - a.confidence;
  });
}

// ================== Helper Functions ==================

function countConsecutiveLow(
  feedbacks: StudentFeedbackHistory['feedbacks']
): number {
  let count = 0;
  let maxCount = 0;

  for (const f of feedbacks) {
    if (f.understanding_level === 'not_understood') {
      count++;
      maxCount = Math.max(maxCount, count);
    } else if (f.understanding_level === 'partially_understood') {
      // Partial counts as half
      count = Math.max(0, count - 0.5);
    } else {
      count = 0;
    }
  }

  return Math.floor(maxCount);
}

function countLecturesSinceQuestion(
  feedbacks: StudentFeedbackHistory['feedbacks']
): number {
  let count = 0;

  // Iterate from most recent
  for (let i = feedbacks.length - 1; i >= 0; i--) {
    if (feedbacks[i].has_question) {
      break;
    }
    count++;
  }

  return count;
}

function calculateUnderstandingTrend(
  feedbacks: StudentFeedbackHistory['feedbacks']
): { declining: boolean; count: number } {
  if (feedbacks.length < 3) {
    return { declining: false, count: 0 };
  }

  // Convert to numeric scores
  const scores = feedbacks.map(f => {
    switch (f.understanding_level) {
      case 'fully_understood': return 100;
      case 'partially_understood': return 50;
      case 'not_understood': return 0;
    }
  });

  // Count consecutive declines
  let declineCount = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] !== undefined && scores[i - 1] !== undefined && scores[i]! < scores[i - 1]!) {
      declineCount++;
    } else {
      declineCount = 0;
    }
  }

  return {
    declining: declineCount >= 2,
    count: declineCount,
  };
}

function generateSuggestedAction(
  level: SilentLevel,
  reasons: SilentReason[]
): string {
  if (level === 'critical') {
    return 'Schedule immediate 1-on-1 meeting with student';
  }

  if (level === 'high') {
    if (reasons.includes('declining_performance')) {
      return 'Send personalized message and offer office hours';
    }
    return 'Reach out via email to check on student progress';
  }

  if (level === 'moderate') {
    if (reasons.includes('low_participation')) {
      return 'Send gentle reminder about feedback importance';
    }
    return 'Encourage student to ask questions in class';
  }

  return 'Monitor student progress in upcoming lectures';
}

// ================== Nudge Generation ==================

export interface NudgeTemplate {
  type: 'email' | 'in_app' | 'sms';
  subject?: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

export function generateNudgeTemplate(
  flag: SilentStudentFlag,
  studentFirstName: string
): NudgeTemplate {
  const name = studentFirstName || 'Student';

  if (flag.level === 'critical' || flag.level === 'high') {
    return {
      type: 'email',
      subject: 'Checking In - How Can I Help?',
      message: `Hi ${name},

I noticed you might be finding some of the recent material challenging. I wanted to reach out personally to see if there's anything I can do to help.

Would you be available for a quick chat during my office hours this week? No pressure at all - I just want to make sure you have all the support you need.

Feel free to reply to this email or drop by anytime.

Best regards`,
      urgency: 'high',
    };
  }

  if (flag.level === 'moderate') {
    return {
      type: 'in_app',
      message: `Hi ${name}! 👋 
      
Quick check-in: How are you finding the course so far? Remember, there are no "dumb" questions - your feedback helps me teach better! Feel free to reach out anytime.`,
      urgency: 'medium',
    };
  }

  return {
    type: 'in_app',
    message: `Hey ${name}! Just a friendly reminder that your feedback is valuable. If anything in the lectures is unclear, don't hesitate to ask questions - that's what I'm here for! 📚`,
    urgency: 'low',
  };
}

export default {
  detectSilentStudent,
  detectSilentStudents,
  generateNudgeTemplate,
};
