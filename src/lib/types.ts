/**
 * LIS Core Types - Single Source of Truth
 * One system, two roles, same data structures
 */

// ==================== USER & ROLES ====================

export type UserRole = 'student' | 'professor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  rollNo?: string; // students only
  avatar?: string;
}

// ==================== COURSES & ENROLLMENT ====================

export interface Course {
  id: string;
  code: string;
  name: string;
  professorId: string;
  professorName: string;
  semester: string;
  isActive: boolean;
  enrolledCount: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  isActive: boolean;
}

// ==================== LECTURES & TOPICS ====================

export interface Lecture {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  topics: LectureTopic[];
  feedbackDeadline: string; // lecture_time + feedback_window
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface LectureTopic {
  id: string;
  lectureId: string;
  name: string;
  order: number;
}

// ==================== FEEDBACK ====================

export type UnderstandingLevel = 'understood' | 'partial' | 'not-clear';

export interface TopicFeedback {
  topicId: string;
  topicName: string;
  understanding: UnderstandingLevel;
  comment?: string;
}

export interface Feedback {
  id: string;
  lectureId: string;
  studentId: string;
  submittedAt: string;
  topicFeedbacks: TopicFeedback[];
  overallComment?: string;
  pace: 'too-slow' | 'good' | 'too-fast';
  engagementScore: number; // 1-5
}

// ==================== DASHBOARD METRICS ====================

// Same structure, different data based on role
export interface DashboardMetrics {
  // For student: my progress | For professor: class progress
  weeklyProgress: {
    percentage: number;
    feedbacksSubmitted: number;
    lecturesUnderstood: number;
    totalLectures: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
  };
  
  // For student: my pending | For professor: lectures needing attention
  pendingFeedbacks: {
    count: number;
    items: PendingFeedbackItem[];
  };
  
  // For student: my courses | For professor: my courses
  activeCourses: {
    count: number;
    courses: Course[];
  };
  
  // For student: my submissions | For professor: total received
  feedbackStats: {
    submitted: number;
    thisWeek: number;
    thisSemester: number;
  };
  
  // For student: my streak | For professor: class engagement streak
  streak: {
    days: number;
    isActive: boolean;
    lastActivity: string;
  };
  
  // For student: my understanding | For professor: class understanding
  averageScore: {
    percentage: number;
    trend: 'up' | 'down' | 'stable';
    trendValue: number;
    breakdown: {
      understood: number;
      partial: number;
      notClear: number;
    };
  };
}

export interface PendingFeedbackItem {
  lectureId: string;
  lectureTitle: string;
  courseName: string;
  courseCode: string;
  lectureDate: string;
  deadline: string;
  remainingTime: string; // "2 hours", "1 day"
  isUrgent: boolean; // < 6 hours remaining
  topics: string[];
}

// ==================== AI INSIGHTS ====================

export interface AIInsight {
  id: string;
  type: 'learning-pattern' | 'improvement' | 'suggestion' | 'warning';
  title: string;
  description: string;
  metric?: {
    value: number;
    unit: string;
    trend: 'up' | 'down';
  };
  derivedFrom: string; // explains the logic
  forRole: UserRole | 'both';
}

// ==================== ANALYTICS (Professor) ====================

export interface TopicHeatmap {
  topicId: string;
  topicName: string;
  lectureId: string;
  understoodCount: number;
  partialCount: number;
  notClearCount: number;
  totalResponses: number;
  understandingRate: number; // percentage
  needsRevision: boolean;
}

export interface ClassAnalytics {
  courseId: string;
  totalStudents: number;
  responseRate: number;
  averageUnderstanding: number;
  topicsNeedingRevision: TopicHeatmap[];
  weeklyTrend: { week: string; understanding: number }[];
}

// ==================== REVISION FLAGS ====================

export interface RevisionFlag {
  id: string;
  lectureId: string;
  topicId: string;
  topicName: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  suggestedAction: string;
  createdAt: string;
  resolved: boolean;
}
