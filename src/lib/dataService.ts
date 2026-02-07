/**
 * LIS Mock Data Service
 * Simulates real database queries with proper logic
 * Same functions work for both roles - just different data
 */


import type {
  UserRole,
  DashboardMetrics,
  PendingFeedbackItem,
  AIInsight,
  TopicHeatmap,
  RevisionFlag,
  UnderstandingLevel,
} from './types';
import { enhancedMockData } from '../data';
import * as dataHelpers from '../data/dataHelpers';


// ==================== MOCK DATABASE (ENHANCED) ====================
const MOCK_USERS = [...enhancedMockData.professors, ...enhancedMockData.students];
const MOCK_COURSES = enhancedMockData.courses;
const MOCK_LECTURES = (enhancedMockData.lectures || []) as any[];
const MOCK_FEEDBACKS = (enhancedMockData.feedback || []) as any[];


// Track which lectures student has NOT submitted feedback for
const getStudentPendingFeedbacks = (studentId: string): string[] => {
  const submittedLectureIds = MOCK_FEEDBACKS
    .filter(f => f.studentId === studentId)
    .map(f => f.lectureId);
  // Lectures that need feedback (completed, enrolled, not submitted)
  return MOCK_LECTURES
    .filter(l => l.status === 'completed' && !submittedLectureIds.includes(l.id))
    .map(l => l.id);
};

// ==================== DATA SERVICE ====================

export const DataService = {
  // Get current user (mock - would come from auth)

  getCurrentUser: (role: UserRole = 'student') => {
    return MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
  },

  // Get courses based on role

  getCourses: (userId: string, role: UserRole) => {
    if (role === 'professor') {
      return MOCK_COURSES.filter(c => c.created_by === userId);
    }
    // For students, return enrolled courses (mock: all courses)
    return MOCK_COURSES;
  },

  // Get lectures for a course

  getLectures: (courseId?: string) => {
    if (courseId) {
      return MOCK_LECTURES.filter(l => l.courseId === courseId);
    }
    return MOCK_LECTURES;
  },

  // ==================== DASHBOARD METRICS ====================
  
  getDashboardMetrics: (userId: string, role: UserRole): DashboardMetrics => {
    if (role === 'student') {
      return getStudentMetrics(userId);
    }
    return getProfessorMetrics(userId);
  },

  // ==================== PENDING FEEDBACKS ====================
  
  getPendingFeedbacks: (userId: string, role: UserRole): PendingFeedbackItem[] => {
    if (role === 'student') {
      // Lectures I must respond to
      const pendingIds = getStudentPendingFeedbacks(userId);
      return MOCK_LECTURES
        .filter(l => pendingIds.includes(l.id))
        .map(l => ({
          lectureId: l.id,
          lectureTitle: l.title,
          courseName: l.courseName,
          courseCode: l.courseCode,
          lectureDate: l.date,
          deadline: l.feedbackDeadline,
          remainingTime: calculateRemainingTime(l.feedbackDeadline),
          isUrgent: isUrgent(l.feedbackDeadline),
          topics: l.topics.map(t => t.name),
        }));
    } else {
      // Professor: Lectures needing revision (low understanding)
      return MOCK_LECTURES
        .filter(l => l.status === 'completed')
        .slice(0, 2)
        .map(l => ({
          lectureId: l.id,
          lectureTitle: l.title,
          courseName: l.courseName,
          courseCode: l.courseCode,
          lectureDate: l.date,
          deadline: l.feedbackDeadline,
          remainingTime: '3 topics need attention',
          isUrgent: true,
          topics: l.topics.map(t => t.name),
        }));
    }
  },

  // ==================== SUBMIT FEEDBACK ====================
  
  submitFeedback: async (
    lectureId: string,
    studentId: string,
    topicFeedbacks: { topicId: string; topicName: string; understanding: UnderstandingLevel; comment?: string }[],
    pace: 'too-slow' | 'good' | 'too-fast',
    engagementScore: number,
    overallComment?: string
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newFeedback: any = {
      id: `fb-${Date.now()}`,
      lectureId,
      studentId,
      submittedAt: new Date().toISOString(),
      topicFeedbacks,
      pace,
      engagementScore,
      overallComment,
    };
    
    MOCK_FEEDBACKS.push(newFeedback);
    
    return { success: true, message: 'Feedback submitted successfully!' };
  },

  // ==================== AI INSIGHTS ====================
  
  getAIInsights: (userId: string, role: UserRole): AIInsight[] => {
    if (role === 'student') {
      return [
        {
          id: 'insight-1',
          type: 'learning-pattern',
          title: 'You learn better in morning sessions',
          description: 'Your understanding scores are 23% higher in 10 AM lectures',
          metric: { value: 23, unit: '%', trend: 'up' },
          derivedFrom: 'avg(understanding) GROUP BY lecture_time_slot',
          forRole: 'student',
        },
        {
          id: 'insight-2',
          type: 'improvement',
          title: 'Trees improved 18%',
          description: 'Your understanding of tree data structures has improved since last week',
          metric: { value: 18, unit: '%', trend: 'up' },
          derivedFrom: 'avg_understanding(topic=trees, this_week) - avg_understanding(topic=trees, last_week)',
          forRole: 'student',
        },
        {
          id: 'insight-3',
          type: 'suggestion',
          title: 'Review SQL Joins',
          description: 'You marked "Outer Joins" as partial - consider reviewing before next class',
          derivedFrom: 'topics WHERE understanding = partial ORDER BY date DESC',
          forRole: 'student',
        },
      ];
    } else {
      return [
        {
          id: 'insight-4',
          type: 'warning',
          title: '68% struggled with Correlated Subqueries',
          description: 'Consider a revision session or additional examples',
          metric: { value: 68, unit: '%', trend: 'down' },
          derivedFrom: 'COUNT(understanding != understood) / COUNT(*) WHERE topic = Correlated Subqueries',
          forRole: 'professor',
        },
        {
          id: 'insight-5',
          type: 'improvement',
          title: 'Class engagement up 15%',
          description: 'Feedback submission rate improved this week',
          metric: { value: 15, unit: '%', trend: 'up' },
          derivedFrom: 'feedback_rate(this_week) - feedback_rate(last_week)',
          forRole: 'professor',
        },
        {
          id: 'insight-6',
          type: 'suggestion',
          title: 'Schedule revision for Graph Algorithms',
          description: '3 topics flagged for review based on class feedback',
          derivedFrom: 'topics WHERE needs_revision = true GROUP BY lecture',
          forRole: 'professor',
        },
      ];
    }
  },

  // ==================== TOPIC HEATMAP (Professor) ====================
  
  getTopicHeatmap: (lectureId: string): TopicHeatmap[] => {
    const lecture = MOCK_LECTURES.find(l => l.id === lectureId);
    if (!lecture) return [];

    // Simulate aggregated feedback data
    return lecture.topics.map(topic => {
      const understood = Math.floor(Math.random() * 30) + 10;
      const partial = Math.floor(Math.random() * 15) + 5;
      const notClear = Math.floor(Math.random() * 10);
      const total = understood + partial + notClear;
      const rate = Math.round((understood / total) * 100);
      
      return {
        topicId: topic.id,
        topicName: topic.name,
        lectureId,
        understoodCount: understood,
        partialCount: partial,
        notClearCount: notClear,
        totalResponses: total,
        understandingRate: rate,
        needsRevision: rate < 60,
      };
    });
  },

  // ==================== REVISION FLAGS ====================
  
  getRevisionFlags: (professorId: string): RevisionFlag[] => {
    return [
      {
        id: 'flag-1',
        lectureId: 'lec-2',
        topicId: 'topic-7',
        topicName: 'Correlated Subqueries',
        reason: '68% of students marked as not clear or partial',
        severity: 'high',
        suggestedAction: 'Schedule revision session with more examples',
        createdAt: '2026-02-01T16:00:00',
        resolved: false,
      },
      {
        id: 'flag-2',
        lectureId: 'lec-1',
        topicId: 'topic-4',
        topicName: 'Level Order Traversal',
        reason: '45% of students marked as partial',
        severity: 'medium',
        suggestedAction: 'Provide additional practice problems',
        createdAt: '2026-02-02T12:00:00',
        resolved: false,
      },
    ];
  },
};

// ==================== HELPER FUNCTIONS ====================


// Use enhancedMockData and dataHelpers for metrics
function getStudentMetrics(studentId: string): DashboardMetrics {
  // You can further enhance this to use dataHelpers.getStudentById etc.
  const student = dataHelpers.getStudentById(studentId);
  const dashboard = student?.dashboard as any;
  return (dashboard?.metrics || dashboard) ? {
    weeklyProgress: dashboard.weeklyProgress || { percentage: 0, feedbacksSubmitted: 0, lecturesUnderstood: 0, totalLectures: 0, trend: 'up', trendValue: 0 },
    pendingFeedbacks: dashboard.pendingFeedbacks || { count: 0, items: [] },
    activeCourses: dashboard.activeCourses || { count: 0, courses: [] },
    feedbackStats: dashboard.feedbackStats || { submitted: 0, thisWeek: 0, thisSemester: 0 },
    streak: dashboard.streak || { days: 0, isActive: false, lastActivity: '' },
    averageScore: dashboard.averageScore || { percentage: 0, trend: 'up', trendValue: 0, breakdown: { understood: 0, partial: 0, notClear: 0 } },
  } : {
    weeklyProgress: { percentage: 0, feedbacksSubmitted: 0, lecturesUnderstood: 0, totalLectures: 0, trend: 'up', trendValue: 0 },
    pendingFeedbacks: { count: 0, items: [] },
    activeCourses: { count: 0, courses: [] },
    feedbackStats: { submitted: 0, thisWeek: 0, thisSemester: 0 },
    streak: { days: 0, isActive: false, lastActivity: '' },
    averageScore: { percentage: 0, trend: 'up', trendValue: 0, breakdown: { understood: 0, partial: 0, notClear: 0 } },
  };
}

function getProfessorMetrics(professorId: string): DashboardMetrics {
  const professor = dataHelpers.getProfessorById(professorId);
  const dashboard = professor?.dashboard as any;
  return (dashboard?.metrics || dashboard) ? {
    weeklyProgress: dashboard.weeklyProgress || { percentage: 0, feedbacksSubmitted: 0, lecturesUnderstood: 0, totalLectures: 0, trend: 'up', trendValue: 0 },
    pendingFeedbacks: dashboard.pendingFeedbacks || { count: 0, items: [] },
    activeCourses: dashboard.activeCourses || { count: 0, courses: [] },
    feedbackStats: dashboard.feedbackStats || { submitted: 0, thisWeek: 0, thisSemester: 0 },
    streak: dashboard.streak || { days: 0, isActive: false, lastActivity: '' },
    averageScore: dashboard.averageScore || { percentage: 0, trend: 'up', trendValue: 0, breakdown: { understood: 0, partial: 0, notClear: 0 } },
  } : {
    weeklyProgress: { percentage: 0, feedbacksSubmitted: 0, lecturesUnderstood: 0, totalLectures: 0, trend: 'up', trendValue: 0 },
    pendingFeedbacks: { count: 0, items: [] },
    activeCourses: { count: 0, courses: [] },
    feedbackStats: { submitted: 0, thisWeek: 0, thisSemester: 0 },
    streak: { days: 0, isActive: false, lastActivity: '' },
    averageScore: { percentage: 0, trend: 'up', trendValue: 0, breakdown: { understood: 0, partial: 0, notClear: 0 } },
  };
}

function calculateRemainingTime(deadline: string): string {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Overdue';
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Less than 1 hour';
}

function isUrgent(deadline: string): boolean {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const hours = diffMs / (1000 * 60 * 60);
  return hours < 6;
}

export default DataService;
