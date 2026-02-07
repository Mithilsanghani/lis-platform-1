/**
 * LIS Intelligence Layer
 * Rule-based analysis functions (can be replaced with AI later)
 */

import type {
  Feedback,
  UnderstandingLevel,
  FeedbackReason,
  LectureInsight,
  SilentStudent,
  StudentMetrics,
  RevisionPlan,
  AIInsight,
  TopicPerformance,
  UnderstandingSummary,
  InsightPriority,
} from '../types/lis';

// ============================================
// LECTURE FEEDBACK ANALYSIS
// ============================================

export interface LectureFeedbackAnalysis {
  summary: UnderstandingSummary;
  topReasons: { reason: FeedbackReason; count: number; percentage: number }[];
  strugglingTopics: { topic: string; unclearCount: number; partialCount: number }[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export function analyzeLectureFeedback(feedbackList: Feedback[]): LectureFeedbackAnalysis {
  const total = feedbackList.length;
  
  if (total === 0) {
    return {
      summary: {
        full_pct: 0,
        partial_pct: 0,
        unclear_pct: 0,
        response_count: 0,
        full_count: 0,
        partial_count: 0,
        unclear_count: 0,
      },
      topReasons: [],
      strugglingTopics: [],
      recommendations: ['No feedback received yet. Consider sending a reminder to students.'],
      riskLevel: 'low',
    };
  }

  // Count understanding levels
  const fullCount = feedbackList.filter(f => f.understanding === 'full').length;
  const partialCount = feedbackList.filter(f => f.understanding === 'partial').length;
  const unclearCount = feedbackList.filter(f => f.understanding === 'unclear').length;

  const summary: UnderstandingSummary = {
    full_pct: Math.round((fullCount / total) * 100),
    partial_pct: Math.round((partialCount / total) * 100),
    unclear_pct: Math.round((unclearCount / total) * 100),
    response_count: total,
    full_count: fullCount,
    partial_count: partialCount,
    unclear_count: unclearCount,
  };

  // Aggregate reasons
  const reasonCounts: Record<FeedbackReason, number> = {
    pace_fast: 0,
    examples_few: 0,
    concept_unclear: 0,
    missed_part: 0,
    good_explanation: 0,
    helpful_examples: 0,
  };

  feedbackList.forEach(f => {
    f.reasons.forEach(reason => {
      reasonCounts[reason]++;
    });
  });

  const topReasons = Object.entries(reasonCounts)
    .filter(([_, count]) => count > 0)
    .map(([reason, count]) => ({
      reason: reason as FeedbackReason,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Aggregate struggling topics
  const topicCounts: Record<string, { unclear: number; partial: number }> = {};
  
  feedbackList.forEach(f => {
    if (f.understanding !== 'full') {
      f.subtopics.forEach(topic => {
        if (!topicCounts[topic]) {
          topicCounts[topic] = { unclear: 0, partial: 0 };
        }
        if (f.understanding === 'unclear') {
          topicCounts[topic].unclear++;
        } else {
          topicCounts[topic].partial++;
        }
      });
    }
  });

  const strugglingTopics = Object.entries(topicCounts)
    .map(([topic, counts]) => ({
      topic,
      unclearCount: counts.unclear,
      partialCount: counts.partial,
    }))
    .sort((a, b) => (b.unclearCount * 2 + b.partialCount) - (a.unclearCount * 2 + a.partialCount))
    .slice(0, 5);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (summary.unclear_pct >= 30) {
    recommendations.push('⚠️ High confusion detected. Consider scheduling a dedicated revision session.');
  }
  
  if (summary.unclear_pct + summary.partial_pct >= 50) {
    recommendations.push('📝 Over half the class needs clarification. Start next lecture with a 10-minute recap.');
  }
  
  const paceIssue = topReasons.find(r => r.reason === 'pace_fast');
  if (paceIssue && paceIssue.percentage >= 40) {
    recommendations.push('🐢 Many students found the pace too fast. Consider slowing down for complex topics.');
  }
  
  const examplesIssue = topReasons.find(r => r.reason === 'examples_few');
  if (examplesIssue && examplesIssue.percentage >= 30) {
    recommendations.push('📊 Students need more examples. Add 2-3 practical examples for struggling topics.');
  }

  if (strugglingTopics.length > 0) {
    const topStruggle = strugglingTopics[0];
    recommendations.push(`🎯 Focus on "${topStruggle.topic}" - ${topStruggle.unclearCount + topStruggle.partialCount} students need help.`);
  }

  if (summary.full_pct >= 80) {
    recommendations.push('✅ Great job! Most students understood well. You can proceed with new material.');
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (summary.unclear_pct >= 30 || (summary.unclear_pct + summary.partial_pct >= 60)) {
    riskLevel = 'high';
  } else if (summary.unclear_pct >= 15 || (summary.unclear_pct + summary.partial_pct >= 40)) {
    riskLevel = 'medium';
  }

  return {
    summary,
    topReasons,
    strugglingTopics,
    recommendations,
    riskLevel,
  };
}

// ============================================
// SILENT STUDENT DETECTION
// ============================================

export interface StudentFeedbackHistory {
  studentId: string;
  studentName: string;
  feedbackList: Feedback[];
  totalLectures: number;
}

export function detectSilentStudents(
  courseHistory: StudentFeedbackHistory[]
): SilentStudent[] {
  const silentStudents: SilentStudent[] = [];

  courseHistory.forEach(({ studentId, studentName, feedbackList, totalLectures }) => {
    if (feedbackList.length < 3) return; // Need minimum data

    const partialCount = feedbackList.filter(f => f.understanding === 'partial').length;
    const unclearCount = feedbackList.filter(f => f.understanding === 'unclear').length;
    const commentCount = feedbackList.filter(f => f.comment && f.comment.trim().length > 0).length;
    const commentRate = (commentCount / feedbackList.length) * 100;

    // Heuristic: 3+ partial/unclear AND less than 30% comment rate
    const isSilent = (partialCount + unclearCount >= 3) && commentRate < 30;

    if (isSilent) {
      const fullCount = feedbackList.filter(f => f.understanding === 'full').length;
      const understandingPct = Math.round(
        ((fullCount * 100 + partialCount * 50) / feedbackList.length)
      );

      silentStudents.push({
        student: {
          id: studentId,
          full_name: studentName,
          email: '',
          role: 'student',
          department: '',
          created_at: '',
        },
        course_id: '',
        metrics: {
          student_id: studentId,
          course_id: '',
          understanding_pct: understandingPct,
          feedback_submitted_count: feedbackList.length,
          streak_days: 0,
          last_feedback_at: feedbackList[feedbackList.length - 1]?.created_at || '',
          is_silent: true,
          risk_level: unclearCount >= 5 ? 'high' : partialCount >= 5 ? 'medium' : 'low',
        },
        pattern: {
          partial_count: partialCount,
          unclear_count: unclearCount,
          comment_rate: commentRate,
          lectures_attended: feedbackList.length,
        },
      });
    }
  });

  // Sort by risk (unclear count * 2 + partial count)
  return silentStudents.sort((a, b) => 
    (b.pattern.unclear_count * 2 + b.pattern.partial_count) - 
    (a.pattern.unclear_count * 2 + a.pattern.partial_count)
  );
}

// ============================================
// REVISION PLAN COMPUTATION
// ============================================

export interface CourseRevisionData {
  courseId: string;
  courseName: string;
  lectures: {
    lectureId: string;
    title: string;
    topics: string[];
    feedbackList: Feedback[];
    date: string;
  }[];
}

export function computeRevisionPlan(courseData: CourseRevisionData): RevisionPlan {
  const topicScores: Record<string, {
    confusionScore: number;
    unclearCount: number;
    partialCount: number;
    totalMentions: number;
    lastMentionDate: string;
  }> = {};

  // Aggregate confusion scores per topic
  courseData.lectures.forEach(lecture => {
    const analysis = analyzeLectureFeedback(lecture.feedbackList);
    
    lecture.topics.forEach(topic => {
      if (!topicScores[topic]) {
        topicScores[topic] = {
          confusionScore: 0,
          unclearCount: 0,
          partialCount: 0,
          totalMentions: 0,
          lastMentionDate: lecture.date,
        };
      }

      // Count feedback for this topic
      const topicFeedback = lecture.feedbackList.filter(f => 
        f.subtopics.includes(topic) || (f.understanding !== 'full' && lecture.topics.includes(topic))
      );

      const unclear = topicFeedback.filter(f => f.understanding === 'unclear').length;
      const partial = topicFeedback.filter(f => f.understanding === 'partial').length;

      topicScores[topic].unclearCount += unclear;
      topicScores[topic].partialCount += partial;
      topicScores[topic].totalMentions += topicFeedback.length;
      topicScores[topic].confusionScore += (unclear * 2 + partial);
      
      if (lecture.date > topicScores[topic].lastMentionDate) {
        topicScores[topic].lastMentionDate = lecture.date;
      }
    });
  });

  // Rank topics by confusion score
  const rankedTopics = Object.entries(topicScores)
    .filter(([_, data]) => data.confusionScore > 0)
    .sort((a, b) => b[1].confusionScore - a[1].confusionScore)
    .slice(0, 5)
    .map(([topic, data]) => {
      let priority: InsightPriority = 'low';
      if (data.confusionScore >= 10) priority = 'high';
      else if (data.confusionScore >= 5) priority = 'medium';

      // Estimate duration based on confusion
      let duration = 10;
      if (data.confusionScore >= 10) duration = 30;
      else if (data.confusionScore >= 5) duration = 20;

      const reasoning = generateTopicReasoning(topic, data);

      return {
        topic,
        priority,
        confusion_score: data.confusionScore,
        suggested_duration_mins: duration,
        reasoning,
      };
    });

  // Suggest date (next week)
  const suggestedDate = new Date();
  suggestedDate.setDate(suggestedDate.getDate() + 7);

  // Count affected students
  const affectedStudents = new Set<string>();
  courseData.lectures.forEach(lecture => {
    lecture.feedbackList
      .filter(f => f.understanding !== 'full')
      .forEach(f => affectedStudents.add(f.student_id));
  });

  return {
    course_id: courseData.courseId,
    recommended_topics: rankedTopics,
    suggested_date: suggestedDate.toISOString().split('T')[0],
    affected_students_count: affectedStudents.size,
  };
}

function generateTopicReasoning(topic: string, data: {
  confusionScore: number;
  unclearCount: number;
  partialCount: number;
  totalMentions: number;
}): string {
  const parts: string[] = [];

  if (data.unclearCount > 0) {
    parts.push(`${data.unclearCount} students marked "need clarity"`);
  }
  if (data.partialCount > 0) {
    parts.push(`${data.partialCount} partially understood`);
  }

  if (data.confusionScore >= 10) {
    return `High priority: ${parts.join(', ')}. Consider a dedicated 30-min session.`;
  } else if (data.confusionScore >= 5) {
    return `Medium priority: ${parts.join(', ')}. A 15-20 min recap recommended.`;
  } else {
    return `Low priority: ${parts.join(', ')}. Brief mention should suffice.`;
  }
}

// ============================================
// STUDENT INSIGHTS GENERATION
// ============================================

export interface StudentHistory {
  studentId: string;
  studentName: string;
  feedbackList: Feedback[];
  courses: { courseId: string; courseName: string }[];
}

export function generateStudentInsights(history: StudentHistory): AIInsight[] {
  const insights: AIInsight[] = [];
  const { feedbackList, studentName } = history;

  if (feedbackList.length === 0) {
    return [{
      id: `insight-${Date.now()}-1`,
      owner_type: 'student',
      owner_id: history.studentId,
      priority: 'medium',
      title: 'Start giving feedback',
      description: 'Submit feedback on your lectures to track your understanding over time.',
      action: 'View pending feedback',
      action_route: '/student/feedback',
      created_at: new Date().toISOString(),
    }];
  }

  // Analyze understanding distribution
  const fullCount = feedbackList.filter(f => f.understanding === 'full').length;
  const partialCount = feedbackList.filter(f => f.understanding === 'partial').length;
  const unclearCount = feedbackList.filter(f => f.understanding === 'unclear').length;
  const total = feedbackList.length;

  const fullPct = Math.round((fullCount / total) * 100);
  const unclearPct = Math.round((unclearCount / total) * 100);

  // Insight: Overall performance
  if (fullPct >= 80) {
    insights.push({
      id: `insight-${Date.now()}-perf`,
      owner_type: 'student',
      owner_id: history.studentId,
      priority: 'low',
      title: 'Excellent understanding! 🌟',
      description: `You've marked "fully understood" on ${fullPct}% of lectures. Keep up the great work!`,
      created_at: new Date().toISOString(),
    });
  } else if (unclearPct >= 30) {
    insights.push({
      id: `insight-${Date.now()}-struggle`,
      owner_type: 'student',
      owner_id: history.studentId,
      priority: 'high',
      title: 'Struggling with some topics',
      description: `${unclearPct}% of your feedback indicates need for more clarity. Consider attending office hours or forming a study group.`,
      action: 'View weak topics',
      action_route: '/student/performance',
      created_at: new Date().toISOString(),
    });
  }

  // Identify weak topics
  const topicStruggles: Record<string, number> = {};
  feedbackList.forEach(f => {
    if (f.understanding !== 'full') {
      f.subtopics.forEach(topic => {
        topicStruggles[topic] = (topicStruggles[topic] || 0) + (f.understanding === 'unclear' ? 2 : 1);
      });
    }
  });

  const weakTopics = Object.entries(topicStruggles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (weakTopics.length > 0) {
    insights.push({
      id: `insight-${Date.now()}-topics`,
      owner_type: 'student',
      owner_id: history.studentId,
      priority: 'medium',
      title: 'Topics to review',
      description: `Focus on: ${weakTopics.map(([t]) => t).join(', ')}. These appeared in your "need clarity" feedback.`,
      action: 'Create study plan',
      action_route: '/student/performance',
      created_at: new Date().toISOString(),
    });
  }

  // Analyze time patterns (mock - would need timestamps)
  const recentFeedback = feedbackList.slice(-5);
  const recentFullPct = recentFeedback.filter(f => f.understanding === 'full').length / recentFeedback.length * 100;

  if (recentFullPct > fullPct + 10) {
    insights.push({
      id: `insight-${Date.now()}-trend`,
      owner_type: 'student',
      owner_id: history.studentId,
      priority: 'low',
      title: 'Improving trend! 📈',
      description: 'Your recent understanding scores are higher than your overall average. Great progress!',
      created_at: new Date().toISOString(),
    });
  } else if (recentFullPct < fullPct - 15) {
    insights.push({
      id: `insight-${Date.now()}-decline`,
      owner_type: 'student',
      owner_id: history.studentId,
      priority: 'medium',
      title: 'Recent dip in understanding',
      description: 'Your recent feedback shows more difficulty. Consider reviewing material before it accumulates.',
      action: 'Schedule revision',
      created_at: new Date().toISOString(),
    });
  }

  // Engagement insight
  if (feedbackList.filter(f => f.comment && f.comment.length > 10).length < total * 0.2) {
    insights.push({
      id: `insight-${Date.now()}-engage`,
      owner_type: 'student',
      owner_id: history.studentId,
      priority: 'low',
      title: 'Share more details',
      description: 'Adding comments to your feedback helps professors understand exactly what to clarify.',
      created_at: new Date().toISOString(),
    });
  }

  return insights.slice(0, 4); // Return max 4 insights
}

// ============================================
// COURSE HEALTH ANALYSIS
// ============================================

export function analyzeCourseHealth(
  lectures: { feedbackList: Feedback[]; date: string }[]
): {
  overallHealth: number;
  trend: 'improving' | 'stable' | 'declining';
  weeklyScores: { week: string; score: number }[];
} {
  if (lectures.length === 0) {
    return {
      overallHealth: 100,
      trend: 'stable',
      weeklyScores: [],
    };
  }

  // Calculate health per lecture
  const lectureScores = lectures.map(l => {
    const total = l.feedbackList.length;
    if (total === 0) return { date: l.date, score: 100 };

    const fullCount = l.feedbackList.filter(f => f.understanding === 'full').length;
    const partialCount = l.feedbackList.filter(f => f.understanding === 'partial').length;
    
    const score = Math.round(((fullCount * 100 + partialCount * 50) / total));
    return { date: l.date, score };
  });

  // Overall health
  const overallHealth = Math.round(
    lectureScores.reduce((sum, l) => sum + l.score, 0) / lectureScores.length
  );

  // Trend analysis (compare first half vs second half)
  const midpoint = Math.floor(lectureScores.length / 2);
  const firstHalfAvg = lectureScores.slice(0, midpoint).reduce((s, l) => s + l.score, 0) / midpoint || 0;
  const secondHalfAvg = lectureScores.slice(midpoint).reduce((s, l) => s + l.score, 0) / (lectureScores.length - midpoint) || 0;

  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (secondHalfAvg > firstHalfAvg + 5) trend = 'improving';
  else if (secondHalfAvg < firstHalfAvg - 5) trend = 'declining';

  // Group by week
  const weeklyScores: { week: string; score: number }[] = [];
  // Simplified: just return lecture scores as weekly
  lectureScores.forEach((l, i) => {
    weeklyScores.push({
      week: `Week ${Math.floor(i / 2) + 1}`,
      score: l.score,
    });
  });

  return { overallHealth, trend, weeklyScores };
}

// ============================================
// TOPIC PERFORMANCE ANALYSIS
// ============================================

export function analyzeTopicPerformance(
  lectures: { topics: string[]; feedbackList: Feedback[] }[]
): TopicPerformance[] {
  const topicData: Record<string, {
    full: number;
    partial: number;
    unclear: number;
    total: number;
    recentScore: number;
    oldScore: number;
  }> = {};

  lectures.forEach((lecture, lectureIndex) => {
    const isRecent = lectureIndex >= lectures.length - 3;

    lecture.topics.forEach(topic => {
      if (!topicData[topic]) {
        topicData[topic] = { full: 0, partial: 0, unclear: 0, total: 0, recentScore: 0, oldScore: 0 };
      }

      lecture.feedbackList.forEach(f => {
        topicData[topic].total++;
        if (f.understanding === 'full') {
          topicData[topic].full++;
          if (isRecent) topicData[topic].recentScore += 100;
          else topicData[topic].oldScore += 100;
        } else if (f.understanding === 'partial') {
          topicData[topic].partial++;
          if (isRecent) topicData[topic].recentScore += 50;
          else topicData[topic].oldScore += 50;
        } else {
          topicData[topic].unclear++;
        }
      });
    });
  });

  return Object.entries(topicData)
    .map(([topic, data]) => {
      const clarityPct = data.total > 0 
        ? Math.round(((data.full * 100 + data.partial * 50) / data.total))
        : 100;

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (data.recentScore > data.oldScore + 10) trend = 'improving';
      else if (data.recentScore < data.oldScore - 10) trend = 'declining';

      return {
        topic,
        course_id: '',
        full_count: data.full,
        partial_count: data.partial,
        unclear_count: data.unclear,
        total_count: data.total,
        clarity_pct: clarityPct,
        trend,
      };
    })
    .sort((a, b) => a.clarity_pct - b.clarity_pct);
}
