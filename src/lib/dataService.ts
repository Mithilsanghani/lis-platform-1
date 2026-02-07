/**
 * LIS Mock Data Service
 * Simulates real database queries with proper logic
 * Same functions work for both roles - just different data
 */

import type {
  User,
  UserRole,
  Course,
  Lecture,
  LectureTopic,
  Feedback,
  DashboardMetrics,
  PendingFeedbackItem,
  AIInsight,
  TopicHeatmap,
  RevisionFlag,
  UnderstandingLevel,
} from './types';

// ==================== MOCK DATABASE ====================

const MOCK_USERS: User[] = [
  {
    id: 'student-1',
    email: 'alex.johnson@university.edu',
    name: 'Alex Johnson',
    role: 'student',
    department: 'Computer Science',
    rollNo: 'CS2024001',
  },
  {
    id: 'prof-1',
    email: 'prof.sharma@university.edu',
    name: 'Dr. Sharma',
    role: 'professor',
    department: 'Computer Science',
  },
];

const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    professorId: 'prof-1',
    professorName: 'Dr. Sharma',
    semester: 'Fall 2025',
    isActive: true,
    enrolledCount: 45,
    createdAt: '2025-08-01',
  },
  {
    id: 'course-2',
    code: 'CS302',
    name: 'Database Management Systems',
    professorId: 'prof-1',
    professorName: 'Dr. Sharma',
    semester: 'Fall 2025',
    isActive: true,
    enrolledCount: 38,
    createdAt: '2025-08-01',
  },
  {
    id: 'course-3',
    code: 'CS303',
    name: 'Operating Systems',
    professorId: 'prof-1',
    professorName: 'Dr. Sharma',
    semester: 'Fall 2025',
    isActive: true,
    enrolledCount: 42,
    createdAt: '2025-08-01',
  },
];

const MOCK_LECTURES: Lecture[] = [
  {
    id: 'lec-1',
    courseId: 'course-1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS301',
    title: 'Binary Trees & Traversals',
    date: '2026-02-02',
    startTime: '10:00',
    endTime: '11:30',
    feedbackDeadline: '2026-02-02T18:00:00',
    status: 'completed',
    topics: [
      { id: 'topic-1', lectureId: 'lec-1', name: 'Binary Tree Basics', order: 1 },
      { id: 'topic-2', lectureId: 'lec-1', name: 'Inorder Traversal', order: 2 },
      { id: 'topic-3', lectureId: 'lec-1', name: 'Preorder Traversal', order: 3 },
      { id: 'topic-4', lectureId: 'lec-1', name: 'Level Order Traversal', order: 4 },
    ],
  },
  {
    id: 'lec-2',
    courseId: 'course-2',
    courseName: 'Database Management Systems',
    courseCode: 'CS302',
    title: 'SQL Joins & Subqueries',
    date: '2026-02-01',
    startTime: '14:00',
    endTime: '15:30',
    feedbackDeadline: '2026-02-02T14:00:00',
    status: 'completed',
    topics: [
      { id: 'topic-5', lectureId: 'lec-2', name: 'Inner Joins', order: 1 },
      { id: 'topic-6', lectureId: 'lec-2', name: 'Outer Joins', order: 2 },
      { id: 'topic-7', lectureId: 'lec-2', name: 'Correlated Subqueries', order: 3 },
    ],
  },
  {
    id: 'lec-3',
    courseId: 'course-1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS301',
    title: 'Graph Algorithms',
    date: '2026-01-30',
    startTime: '10:00',
    endTime: '11:30',
    feedbackDeadline: '2026-01-30T18:00:00',
    status: 'completed',
    topics: [
      { id: 'topic-8', lectureId: 'lec-3', name: 'BFS Algorithm', order: 1 },
      { id: 'topic-9', lectureId: 'lec-3', name: 'DFS Algorithm', order: 2 },
      { id: 'topic-10', lectureId: 'lec-3', name: 'Shortest Path', order: 3 },
    ],
  },
];

// Feedbacks already submitted by student-1
const MOCK_FEEDBACKS: Feedback[] = [
  {
    id: 'fb-1',
    lectureId: 'lec-3',
    studentId: 'student-1',
    submittedAt: '2026-01-30T17:30:00',
    topicFeedbacks: [
      { topicId: 'topic-8', topicName: 'BFS Algorithm', understanding: 'understood' },
      { topicId: 'topic-9', topicName: 'DFS Algorithm', understanding: 'partial', comment: 'Need more examples' },
      { topicId: 'topic-10', topicName: 'Shortest Path', understanding: 'understood' },
    ],
    pace: 'good',
    engagementScore: 4,
  },
];

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
  getCurrentUser: (role: UserRole = 'student'): User => {
    return MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
  },

  // Get courses based on role
  getCourses: (userId: string, role: UserRole): Course[] => {
    if (role === 'professor') {
      return MOCK_COURSES.filter(c => c.professorId === userId);
    }
    // For students, return enrolled courses (mock: all courses)
    return MOCK_COURSES;
  },

  // Get lectures for a course
  getLectures: (courseId?: string): Lecture[] => {
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
    
    const newFeedback: Feedback = {
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

function getStudentMetrics(studentId: string): DashboardMetrics {
  const pendingIds = getStudentPendingFeedbacks(studentId);
  const submittedFeedbacks = MOCK_FEEDBACKS.filter(f => f.studentId === studentId);
  
  // Calculate understanding score from feedback
  let totalScore = 0;
  let totalTopics = 0;
  submittedFeedbacks.forEach(f => {
    f.topicFeedbacks.forEach(tf => {
      totalTopics++;
      if (tf.understanding === 'understood') totalScore += 100;
      else if (tf.understanding === 'partial') totalScore += 60;
      else totalScore += 30;
    });
  });
  const avgScore = totalTopics > 0 ? Math.round(totalScore / totalTopics) : 0;

  // Weekly progress = (feedbacks submitted + understood topics) / total lectures this week
  const lecturesThisWeek = 5; // Mock
  const feedbacksThisWeek = submittedFeedbacks.length;
  const understoodTopics = submittedFeedbacks.reduce((acc, f) => 
    acc + f.topicFeedbacks.filter(tf => tf.understanding === 'understood').length, 0);
  const weeklyProgress = Math.round(((feedbacksThisWeek + understoodTopics) / (lecturesThisWeek * 3)) * 100);

  return {
    weeklyProgress: {
      percentage: Math.min(weeklyProgress, 100),
      feedbacksSubmitted: feedbacksThisWeek,
      lecturesUnderstood: understoodTopics,
      totalLectures: lecturesThisWeek,
      trend: 'up',
      trendValue: 12,
    },
    pendingFeedbacks: {
      count: pendingIds.length,
      items: DataService.getPendingFeedbacks(studentId, 'student'),
    },
    activeCourses: {
      count: MOCK_COURSES.length,
      courses: MOCK_COURSES,
    },
    feedbackStats: {
      submitted: submittedFeedbacks.length,
      thisWeek: submittedFeedbacks.length,
      thisSemester: 12, // Mock
    },
    streak: {
      days: 12,
      isActive: true,
      lastActivity: new Date().toISOString(),
    },
    averageScore: {
      percentage: avgScore || 82,
      trend: 'up',
      trendValue: 5,
      breakdown: {
        understood: 65,
        partial: 25,
        notClear: 10,
      },
    },
  };
}

function getProfessorMetrics(professorId: string): DashboardMetrics {
  const courses = MOCK_COURSES.filter(c => c.professorId === professorId);
  const totalStudents = courses.reduce((acc, c) => acc + c.enrolledCount, 0);
  
  // Class-level metrics
  return {
    weeklyProgress: {
      percentage: 73,
      feedbacksSubmitted: 156,
      lecturesUnderstood: 420,
      totalLectures: 15,
      trend: 'up',
      trendValue: 8,
    },
    pendingFeedbacks: {
      count: 3,
      items: DataService.getPendingFeedbacks(professorId, 'professor'),
    },
    activeCourses: {
      count: courses.length,
      courses,
    },
    feedbackStats: {
      submitted: 892,
      thisWeek: 156,
      thisSemester: 892,
    },
    streak: {
      days: 8,
      isActive: true,
      lastActivity: new Date().toISOString(),
    },
    averageScore: {
      percentage: 71,
      trend: 'up',
      trendValue: 3,
      breakdown: {
        understood: 58,
        partial: 28,
        notClear: 14,
      },
    },
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
