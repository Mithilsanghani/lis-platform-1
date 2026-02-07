/**
 * useDailyDigest Hook - Production - NO MOCK DATA
 * All metrics computed from useLISStore
 * Shows zeros when no data exists
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLISStore } from '../store/useLISStore';

interface DigestMetrics {
  totalCourses: number;
  activeStudents: number;
  silentAlerts: number;
  pendingFeedback: number;
  lecturesCompleted: number;
  lecturesScheduled: number;
  engagementRate: number;
  topCourse: string;
  urgentItems: string[];
}

interface DailyDigest {
  summary: string;
  shortSummary: string;
  metrics: DigestMetrics;
  aiSuggestion: string;
  priority: 'normal' | 'attention' | 'urgent';
  generatedAt: Date;
}

// Generate summary from real metrics
const generateSummary = (metrics: DigestMetrics): { 
  summary: string; 
  shortSummary: string; 
  aiSuggestion: string; 
  priority: DailyDigest['priority'];
} => {
  const hour = new Date().getHours();
  const timeContext = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  
  // Determine priority based on real data
  let priority: DailyDigest['priority'] = 'normal';
  if (metrics.silentAlerts > 15) priority = 'urgent';
  else if (metrics.silentAlerts > 8 || metrics.pendingFeedback > 30) priority = 'attention';

  // Empty state
  if (metrics.totalCourses === 0) {
    return {
      summary: `Good ${timeContext}! Create your first course to get started.`,
      shortSummary: 'No courses yet',
      aiSuggestion: 'Create a course to start tracking student engagement.',
      priority: 'normal',
    };
  }

  // Short summary for topbar
  const shortParts = [
    `${metrics.totalCourses} course${metrics.totalCourses !== 1 ? 's' : ''}`,
    metrics.activeStudents > 0 ? `${metrics.activeStudents} active` : null,
    metrics.silentAlerts > 0 ? `${metrics.silentAlerts} silent` : null,
  ].filter(Boolean);
  const shortSummary = shortParts.join(' • ');

  // Full summary
  let summary = `Good ${timeContext}! `;
  
  if (metrics.totalCourses > 0) {
    summary += `You have ${metrics.totalCourses} active course${metrics.totalCourses !== 1 ? 's' : ''}. `;
  }
  
  if (metrics.activeStudents > 0) {
    summary += `${metrics.activeStudents} students engaged today. `;
  }
  
  if (metrics.silentAlerts > 0) {
    summary += `⚠️ ${metrics.silentAlerts} students need attention. `;
  }
  
  if (metrics.lecturesScheduled > 0) {
    summary += `📚 ${metrics.lecturesScheduled} lectures today. `;
  }

  if (metrics.engagementRate > 0) {
    summary += `Overall engagement: ${metrics.engagementRate}%${metrics.engagementRate > 75 ? ' 🎉' : ''}.`;
  }

  // AI Suggestion based on real data
  let aiSuggestion = '';
  if (metrics.silentAlerts > 10) {
    aiSuggestion = `Consider reaching out to ${metrics.silentAlerts} silent students.`;
  } else if (metrics.pendingFeedback > 20) {
    aiSuggestion = `${metrics.pendingFeedback} feedback items to review.`;
  } else if (metrics.engagementRate > 0 && metrics.engagementRate < 60) {
    aiSuggestion = `Engagement at ${metrics.engagementRate}%. Try interactive elements.`;
  } else if (metrics.activeStudents === 0 && metrics.totalCourses > 0) {
    aiSuggestion = 'Share course codes with students to get started.';
  } else if (metrics.totalCourses > 0) {
    aiSuggestion = 'All systems operational. Have a great teaching day!';
  } else {
    aiSuggestion = 'Create your first course to begin tracking engagement.';
  }

  return { summary, shortSummary, aiSuggestion, priority };
};

export function useDailyDigest(professorId?: string) {
  const [loading, setLoading] = useState(true);

  // Get real data from store
  const { 
    courses, 
    students, 
    feedback, 
    lectures,
    getProfessorCourses,
  } = useLISStore();

  // Calculate metrics from store data
  const metrics = useMemo<DigestMetrics>(() => {
    // Filter to professor's courses if ID provided
    const profCourses = professorId ? getProfessorCourses(professorId) : courses;
    const courseIds = profCourses.map(c => c.id);
    
    // Filter related data
    const profLectures = lectures.filter(l => courseIds.includes(l.courseId));
    const profFeedback = feedback.filter(f => courseIds.includes(f.courseId));
    
    // Get unique students from feedback
    const studentIds = new Set(profFeedback.map(f => f.studentId));
    
    // Calculate today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Count today's feedback
    const todayFeedback = profFeedback.filter(f => f.timestamp.startsWith(today));
    const activeStudents = new Set(todayFeedback.map(f => f.studentId)).size;
    
    // Calculate silent students (no feedback in 7+ days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentStudentIds = new Set(
      profFeedback
        .filter(f => new Date(f.timestamp).getTime() > sevenDaysAgo)
        .map(f => f.studentId)
    );
    const silentAlerts = studentIds.size - recentStudentIds.size;

    // Calculate engagement rate
    let engagementRate = 0;
    if (profFeedback.length > 0) {
      const understandingScores = profFeedback.map(f => {
        switch (f.understandingLevel) {
          case 'fully': return 100;
          case 'partial': return 60;
          case 'confused': return 20;
          default: return 50;
        }
      });
      engagementRate = Math.round(
        understandingScores.reduce((a, b) => a + b, 0) / understandingScores.length
      );
    }

    // Count lectures
    const todayLectures = profLectures.filter(l => l.date.startsWith(today));
    const completedLectures = todayLectures.filter(l => l.status === 'completed').length;
    const scheduledLectures = todayLectures.filter(l => l.status === 'scheduled').length;

    // Find top course by feedback
    const courseByFeedback = new Map<string, number>();
    profFeedback.forEach(f => {
      courseByFeedback.set(f.courseId, (courseByFeedback.get(f.courseId) || 0) + 1);
    });
    let topCourse = profCourses[0]?.name || 'N/A';
    let maxFeedback = 0;
    courseByFeedback.forEach((count, courseId) => {
      if (count > maxFeedback) {
        maxFeedback = count;
        const course = profCourses.find(c => c.id === courseId);
        if (course) topCourse = `${course.code} - ${course.name}`;
      }
    });

    // Unread feedback (simplified - all today's feedback)
    const pendingFeedback = todayFeedback.length;

    // Urgent items
    const urgentItems: string[] = [];
    if (silentAlerts > 5) urgentItems.push(`${silentAlerts} silent students`);
    if (profFeedback.filter(f => f.understandingLevel === 'confused').length > 10) {
      urgentItems.push('High confusion rate detected');
    }

    return {
      totalCourses: profCourses.length,
      activeStudents,
      silentAlerts: Math.max(0, silentAlerts),
      pendingFeedback,
      lecturesCompleted: completedLectures,
      lecturesScheduled: scheduledLectures,
      engagementRate,
      topCourse,
      urgentItems,
    };
  }, [courses, students, feedback, lectures, professorId, getProfessorCourses]);

  // Generate digest from metrics
  const digest = useMemo<DailyDigest>(() => {
    const { summary, shortSummary, aiSuggestion, priority } = generateSummary(metrics);
    return {
      summary,
      shortSummary,
      metrics,
      aiSuggestion,
      priority,
      generatedAt: new Date(),
    };
  }, [metrics]);

  // Simulate brief loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  }, []);

  return { 
    digest, 
    loading, 
    error: null, 
    refresh,
  };
}

export default useDailyDigest;
