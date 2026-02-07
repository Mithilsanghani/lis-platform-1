/**
 * LIS v2.0 - Student Study Tips Generator
 * Generate personalized study recommendations for students
 */

import type { UnderstandingLevel } from '../../types/lis-v2';
import type { StudentFeedbackHistory, StudyTip, StudentStudyPlan } from './types';

// ================== Study Plan Generation ==================

export function generateStudentStudyPlan(
  history: StudentFeedbackHistory,
  courseName: string = 'this course'
): StudentStudyPlan {
  const tips: StudyTip[] = [];
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];
  const suggestedQuestions: string[] = [];

  // Analyze feedback patterns
  const understandingScores = history.feedbacks.map(f => ({
    lecture_id: f.lecture_id,
    score: levelToScore(f.understanding_level),
    has_question: f.has_question,
  }));

  // Calculate overall status
  const avgScore = understandingScores.reduce((sum, s) => sum + s.score, 0) / 
    Math.max(understandingScores.length, 1);
  
  let overallStatus: 'on_track' | 'needs_attention' | 'at_risk';
  if (avgScore >= 75) {
    overallStatus = 'on_track';
  } else if (avgScore >= 50) {
    overallStatus = 'needs_attention';
  } else {
    overallStatus = 'at_risk';
  }

  // Identify weak areas (lectures where understanding was low)
  const weakLectures = history.feedbacks.filter(
    f => f.understanding_level === 'not_understood' || f.understanding_level === 'partially_understood'
  );

  // Generate tips based on patterns
  
  // Tip 1: Review weak lectures
  if (weakLectures.length > 0) {
    const recentWeak = weakLectures[weakLectures.length - 1];
    tips.push({
      type: 'review_lecture',
      title: 'Review Recent Material',
      description: `You indicated difficulty with recent lectures. Consider reviewing the material and reaching out if concepts are still unclear.`,
      priority: 'high',
      related_lecture_id: recentWeak.lecture_id,
    });
  }

  // Tip 2: Ask questions
  const hasAskedQuestions = history.feedbacks.some(f => f.has_question);
  if (!hasAskedQuestions && avgScore < 75) {
    tips.push({
      type: 'ask_question',
      title: 'Don\'t Hesitate to Ask',
      description: 'You haven\'t asked any questions yet. Remember, questions help clarify concepts - your professor is here to help!',
      priority: avgScore < 50 ? 'high' : 'medium',
    });
  }

  // Tip 3: Participation encouragement
  if (history.participation_rate < 60) {
    tips.push({
      type: 'general',
      title: 'Stay Engaged',
      description: 'Regular feedback helps track your understanding. Try to submit feedback after each lecture to stay on top of the material.',
      priority: 'medium',
    });
  }

  // Tip 4: Trend-based advice
  const recentScores = understandingScores.slice(-3);
  const isImproving = recentScores.length >= 2 && 
    recentScores[recentScores.length - 1].score > recentScores[0].score;
  const isDeclining = recentScores.length >= 2 && 
    recentScores[recentScores.length - 1].score < recentScores[0].score;

  if (isImproving) {
    tips.push({
      type: 'general',
      title: 'Great Progress! 🎉',
      description: 'Your understanding has been improving! Keep up the good work and maintain your current study habits.',
      priority: 'low',
    });
  } else if (isDeclining) {
    tips.push({
      type: 'topic_focus',
      title: 'Attention Needed',
      description: 'Recent lectures seem more challenging. Consider scheduling extra study time or visiting office hours.',
      priority: 'high',
    });
  }

  // Tip 5: Practice recommendation
  if (avgScore >= 50 && avgScore < 75) {
    tips.push({
      type: 'practice',
      title: 'Practice Makes Perfect',
      description: 'Work through practice problems or examples to reinforce your understanding of recent concepts.',
      priority: 'medium',
    });
  }

  // Generate suggested questions based on weak areas
  if (avgScore < 75) {
    suggestedQuestions.push(
      'Could you explain [concept] with a different example?',
      'How does [topic A] relate to [topic B]?',
      'What are common mistakes students make with this material?',
      'Are there any resources you recommend for additional practice?'
    );
  }

  // Ensure at least one positive tip
  if (tips.every(t => t.priority !== 'low') && avgScore >= 50) {
    tips.push({
      type: 'general',
      title: 'Keep Going!',
      description: `You're making progress in ${courseName}. Stay consistent with your studies!`,
      priority: 'low',
    });
  }

  // Sort tips by priority
  tips.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return {
    student_id: history.student_id,
    generated_at: new Date().toISOString(),
    overall_status: overallStatus,
    tips,
    weak_topics: weakTopics,
    strong_topics: strongTopics,
    suggested_questions: suggestedQuestions,
  };
}

// ================== Daily Tips ==================

export interface DailyTip {
  id: string;
  message: string;
  category: 'motivation' | 'study' | 'engagement' | 'wellness';
  icon: string;
}

const DAILY_TIPS: DailyTip[] = [
  {
    id: 'tip_1',
    message: 'Review your notes within 24 hours of a lecture to boost retention by up to 80%!',
    category: 'study',
    icon: '📚',
  },
  {
    id: 'tip_2',
    message: 'Don\'t be afraid to ask questions - they show you\'re engaged and help everyone learn.',
    category: 'engagement',
    icon: '❓',
  },
  {
    id: 'tip_3',
    message: 'Take a 5-minute break every 25 minutes of studying to maintain focus.',
    category: 'wellness',
    icon: '⏰',
  },
  {
    id: 'tip_4',
    message: 'Teaching a concept to someone else is one of the best ways to master it.',
    category: 'study',
    icon: '👥',
  },
  {
    id: 'tip_5',
    message: 'Your feedback helps professors improve - be honest and constructive!',
    category: 'engagement',
    icon: '💬',
  },
  {
    id: 'tip_6',
    message: 'Struggling with a concept? That\'s okay! Growth happens at the edge of your comfort zone.',
    category: 'motivation',
    icon: '💪',
  },
  {
    id: 'tip_7',
    message: 'Connect new concepts to what you already know - it makes learning stick.',
    category: 'study',
    icon: '🔗',
  },
  {
    id: 'tip_8',
    message: 'A good night\'s sleep is crucial for memory consolidation. Aim for 7-8 hours!',
    category: 'wellness',
    icon: '😴',
  },
  {
    id: 'tip_9',
    message: 'Practice active recall - test yourself instead of just re-reading notes.',
    category: 'study',
    icon: '🧠',
  },
  {
    id: 'tip_10',
    message: 'Every expert was once a beginner. Keep at it!',
    category: 'motivation',
    icon: '⭐',
  },
];

export function getDailyTip(date: Date = new Date()): DailyTip {
  // Deterministic selection based on date
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % DAILY_TIPS.length;
  return DAILY_TIPS[index];
}

export function getPersonalizedTip(
  history: StudentFeedbackHistory | null
): DailyTip {
  if (!history) {
    return getDailyTip();
  }

  // Customize based on student's situation
  const avgScore = history.average_understanding;
  const hasQuestions = history.feedbacks.some(f => f.has_question);
  const isActive = history.participation_rate >= 60;

  if (avgScore < 50) {
    return {
      id: 'personalized_1',
      message: 'Remember: seeking help early is a sign of strength, not weakness. Office hours are there for you!',
      category: 'motivation',
      icon: '🌟',
    };
  }

  if (!hasQuestions && avgScore < 75) {
    return {
      id: 'personalized_2',
      message: 'You haven\'t asked any questions yet. Even one question can clear up a lot of confusion!',
      category: 'engagement',
      icon: '💡',
    };
  }

  if (!isActive) {
    return {
      id: 'personalized_3',
      message: 'Your feedback matters! Regular check-ins help you and your professor track progress.',
      category: 'engagement',
      icon: '📝',
    };
  }

  return getDailyTip();
}

// ================== Helper Functions ==================

function levelToScore(level: UnderstandingLevel): number {
  switch (level) {
    case 'fully_understood':
    case 'full':
      return 100;
    case 'partially_understood':
    case 'partial':
      return 50;
    case 'not_understood':
    case 'unclear':
      return 0;
    default:
      return 50;
  }
}

// ================== Course-Specific Recommendations ==================

export interface CourseRecommendation {
  course_id: string;
  course_name: string;
  status: 'on_track' | 'needs_attention' | 'at_risk';
  recommendation: string;
  action?: {
    type: 'review' | 'practice' | 'ask' | 'attend';
    label: string;
    target_id?: string;
  };
}

export function generateCourseRecommendations(
  courseHistories: Array<StudentFeedbackHistory & { course_name: string }>
): CourseRecommendation[] {
  return courseHistories.map(history => {
    const avgScore = history.average_understanding;
    let status: CourseRecommendation['status'];
    let recommendation: string;
    let action: CourseRecommendation['action'];

    if (avgScore >= 75) {
      status = 'on_track';
      recommendation = 'You\'re doing great! Keep up the consistent effort.';
      action = {
        type: 'practice',
        label: 'Try advanced problems',
      };
    } else if (avgScore >= 50) {
      status = 'needs_attention';
      recommendation = 'Some concepts need reinforcement. Review recent lectures.';
      action = {
        type: 'review',
        label: 'Review materials',
        target_id: history.feedbacks[history.feedbacks.length - 1]?.lecture_id,
      };
    } else {
      status = 'at_risk';
      recommendation = 'You\'re struggling with this course. Please reach out for help.';
      action = {
        type: 'ask',
        label: 'Visit office hours',
      };
    }

    return {
      course_id: history.course_id,
      course_name: history.course_name,
      status,
      recommendation,
      action,
    };
  });
}

export default {
  generateStudentStudyPlan,
  getDailyTip,
  getPersonalizedTip,
  generateCourseRecommendations,
};
