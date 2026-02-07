/**
 * useStudentData - LIS Student Portal v1.0
 * Mock data hooks for student dashboard
 */

import { useState, useMemo } from 'react';

// Types
export interface StudentLecture {
  id: string;
  course_code: string;
  course_title: string;
  topic: string;
  instructor: string;
  time: string;
  date: string;
  status: 'pending' | 'completed' | 'upcoming';
  feedback_submitted: boolean;
}

export interface StudentCourse {
  id: string;
  code: string;
  title: string;
  instructor: string;
  department: string;
  understanding_pct: number;
  health_pct: number;
  next_lecture: string;
  pending_feedback: number;
  total_lectures: number;
  attended_lectures: number;
  type: 'core' | 'elective';
  color: string;
}

export interface StudentFeedback {
  id: string;
  lecture_id: string;
  course_code: string;
  course_title: string;
  topic: string;
  date: string;
  time: string;
  status: 'pending' | 'submitted';
  understanding?: 'full' | 'partial' | 'need-clarity';
  reasons?: string[];
  comment?: string;
  submitted_at?: string;
  due_soon?: boolean;
}

export interface PerformanceSnapshot {
  date: string;
  understanding_pct: number;
  engagement_pct: number;
}

export interface TopicPerformance {
  topic: string;
  course_code: string;
  week: number;
  understanding: 'high' | 'medium' | 'low';
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'success';
  title: string;
  description: string;
  action?: string;
  actionRoute?: string;
}

// Mock data generators
const courses: StudentCourse[] = [
  {
    id: 'c1',
    code: 'CS301',
    title: 'Data Structures & Algorithms',
    instructor: 'Dr. Sharma',
    department: 'Computer Science',
    understanding_pct: 78,
    health_pct: 82,
    next_lecture: 'Today, 10:00 AM',
    pending_feedback: 1,
    total_lectures: 24,
    attended_lectures: 18,
    type: 'core',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'c2',
    code: 'CS401',
    title: 'Machine Learning',
    instructor: 'Dr. Patel',
    department: 'Computer Science',
    understanding_pct: 65,
    health_pct: 70,
    next_lecture: 'Today, 2:00 PM',
    pending_feedback: 2,
    total_lectures: 20,
    attended_lectures: 15,
    type: 'core',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'c3',
    code: 'MA201',
    title: 'Linear Algebra',
    instructor: 'Dr. Gupta',
    department: 'Mathematics',
    understanding_pct: 92,
    health_pct: 95,
    next_lecture: 'Tomorrow, 9:00 AM',
    pending_feedback: 0,
    total_lectures: 22,
    attended_lectures: 20,
    type: 'core',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'c4',
    code: 'HS102',
    title: 'Technical Writing',
    instructor: 'Dr. Mehta',
    department: 'Humanities',
    understanding_pct: 88,
    health_pct: 90,
    next_lecture: 'Friday, 11:00 AM',
    pending_feedback: 0,
    total_lectures: 16,
    attended_lectures: 14,
    type: 'elective',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'c5',
    code: 'EC201',
    title: 'Digital Electronics',
    instructor: 'Dr. Singh',
    department: 'Electronics',
    understanding_pct: 72,
    health_pct: 75,
    next_lecture: 'Thursday, 3:00 PM',
    pending_feedback: 1,
    total_lectures: 18,
    attended_lectures: 16,
    type: 'elective',
    color: 'from-cyan-500 to-blue-600',
  },
];

const todayLectures: StudentLecture[] = [
  {
    id: 'l1',
    course_code: 'CS301',
    course_title: 'Data Structures',
    topic: 'Binary Search Trees',
    instructor: 'Dr. Sharma',
    time: '10:00 AM',
    date: 'Today',
    status: 'completed',
    feedback_submitted: false,
  },
  {
    id: 'l2',
    course_code: 'CS401',
    course_title: 'Machine Learning',
    topic: 'Neural Networks - Backpropagation',
    instructor: 'Dr. Patel',
    time: '2:00 PM',
    date: 'Today',
    status: 'upcoming',
    feedback_submitted: false,
  },
  {
    id: 'l3',
    course_code: 'EC201',
    course_title: 'Digital Electronics',
    topic: 'Flip-Flops & Counters',
    instructor: 'Dr. Singh',
    time: '4:00 PM',
    date: 'Today',
    status: 'upcoming',
    feedback_submitted: false,
  },
];

const feedbackItems: StudentFeedback[] = [
  {
    id: 'f1',
    lecture_id: 'l1',
    course_code: 'CS301',
    course_title: 'Data Structures',
    topic: 'Binary Search Trees',
    date: 'Today',
    time: '10:00 AM',
    status: 'pending',
    due_soon: true,
  },
  {
    id: 'f2',
    lecture_id: 'l0',
    course_code: 'CS401',
    course_title: 'Machine Learning',
    topic: 'Gradient Descent Optimization',
    date: 'Yesterday',
    time: '2:00 PM',
    status: 'pending',
    due_soon: true,
  },
  {
    id: 'f3',
    lecture_id: 'l-1',
    course_code: 'MA201',
    course_title: 'Linear Algebra',
    topic: 'Eigenvalues & Eigenvectors',
    date: 'Jan 27',
    time: '9:00 AM',
    status: 'submitted',
    understanding: 'full',
    reasons: [],
    submitted_at: '2026-01-27T10:30:00',
  },
  {
    id: 'f4',
    lecture_id: 'l-2',
    course_code: 'CS301',
    course_title: 'Data Structures',
    topic: 'AVL Trees',
    date: 'Jan 26',
    time: '10:00 AM',
    status: 'submitted',
    understanding: 'partial',
    reasons: ['pace-fast', 'need-examples'],
    comment: 'Rotation operations were confusing',
    submitted_at: '2026-01-26T11:00:00',
  },
  {
    id: 'f5',
    lecture_id: 'l-3',
    course_code: 'CS401',
    course_title: 'Machine Learning',
    topic: 'Backpropagation',
    date: 'Jan 25',
    time: '2:00 PM',
    status: 'submitted',
    understanding: 'need-clarity',
    reasons: ['concept-unclear', 'pace-fast'],
    comment: 'Chain rule application was not clear',
    submitted_at: '2026-01-25T15:30:00',
  },
];

const weeklyPerformance: PerformanceSnapshot[] = [
  { date: 'Mon', understanding_pct: 75, engagement_pct: 80 },
  { date: 'Tue', understanding_pct: 82, engagement_pct: 85 },
  { date: 'Wed', understanding_pct: 78, engagement_pct: 75 },
  { date: 'Thu', understanding_pct: 85, engagement_pct: 90 },
  { date: 'Fri', understanding_pct: 80, engagement_pct: 82 },
  { date: 'Sat', understanding_pct: 88, engagement_pct: 78 },
  { date: 'Sun', understanding_pct: 82, engagement_pct: 85 },
];

const topicPerformance: TopicPerformance[] = [
  { topic: 'Arrays & Strings', course_code: 'CS301', week: 1, understanding: 'high' },
  { topic: 'Linked Lists', course_code: 'CS301', week: 2, understanding: 'high' },
  { topic: 'Stacks & Queues', course_code: 'CS301', week: 3, understanding: 'medium' },
  { topic: 'Trees', course_code: 'CS301', week: 4, understanding: 'medium' },
  { topic: 'Graphs', course_code: 'CS301', week: 5, understanding: 'low' },
  { topic: 'Linear Regression', course_code: 'CS401', week: 1, understanding: 'high' },
  { topic: 'Logistic Regression', course_code: 'CS401', week: 2, understanding: 'medium' },
  { topic: 'Neural Networks', course_code: 'CS401', week: 3, understanding: 'low' },
  { topic: 'Backpropagation', course_code: 'CS401', week: 4, understanding: 'low' },
  { topic: 'Matrix Operations', course_code: 'MA201', week: 1, understanding: 'high' },
  { topic: 'Vector Spaces', course_code: 'MA201', week: 2, understanding: 'high' },
  { topic: 'Eigenvalues', course_code: 'MA201', week: 3, understanding: 'high' },
];

const aiInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: 'warning',
    title: 'Struggling with Graphs & Neural Networks',
    description: 'You often mark "need clarity" on these topics. Consider revisiting lecture notes or asking questions in the next class.',
    action: 'Review Topics',
    actionRoute: '/student/performance',
  },
  {
    id: 'ai2',
    type: 'tip',
    title: 'Morning lectures show better understanding',
    description: 'Your understanding scores are 15% higher in morning lectures compared to evening ones. Try quick reviews before afternoon classes.',
  },
  {
    id: 'ai3',
    type: 'success',
    title: 'Great progress in Linear Algebra!',
    description: 'Your understanding has improved from 78% to 92% this month. Keep up the good work!',
  },
];

// Hooks
export function useStudentOverview() {
  const stats = useMemo(() => ({
    lecturesTotal: 3,
    pendingFeedback: 2,
    avgUnderstanding: 82,
    streakDays: 5,
    name: 'Sharma',
  }), []);

  return {
    stats,
    todayLectures,
    aiTip: aiInsights[1],
    isLoading: false,
  };
}

export function useStudentCourses(filter?: 'all' | 'core' | 'elective' | 'at-risk') {
  const filteredCourses = useMemo(() => {
    if (!filter || filter === 'all') return courses;
    if (filter === 'core') return courses.filter(c => c.type === 'core');
    if (filter === 'elective') return courses.filter(c => c.type === 'elective');
    if (filter === 'at-risk') return courses.filter(c => c.understanding_pct < 80);
    return courses;
  }, [filter]);

  return {
    courses: filteredCourses,
    totalCount: courses.length,
    isLoading: false,
  };
}

export function useStudentFeedback(status?: 'pending' | 'submitted' | 'all') {
  const [feedbackList, setFeedbackList] = useState(feedbackItems);

  const filtered = useMemo(() => {
    if (!status || status === 'all') return feedbackList;
    return feedbackList.filter(f => f.status === status);
  }, [feedbackList, status]);

  const submitFeedback = (id: string, data: {
    understanding: 'full' | 'partial' | 'need-clarity';
    reasons: string[];
    comment: string;
  }) => {
    setFeedbackList(prev => prev.map(f => 
      f.id === id 
        ? { 
            ...f, 
            status: 'submitted' as const, 
            understanding: data.understanding,
            reasons: data.reasons,
            comment: data.comment,
            submitted_at: new Date().toISOString(),
          }
        : f
    ));
  };

  return {
    feedback: filtered,
    pendingCount: feedbackList.filter(f => f.status === 'pending').length,
    submittedCount: feedbackList.filter(f => f.status === 'submitted').length,
    submitFeedback,
    isLoading: false,
  };
}

export function useStudentPerformance(courseId?: string) {
  const filteredTopics = useMemo(() => {
    if (!courseId) return topicPerformance;
    return topicPerformance.filter(t => t.course_code === courseId);
  }, [courseId]);

  const overallUnderstanding = useMemo(() => {
    const avg = courses.reduce((sum, c) => sum + c.understanding_pct, 0) / courses.length;
    return Math.round(avg);
  }, []);

  return {
    weeklyTrend: weeklyPerformance,
    topicPerformance: filteredTopics,
    overallUnderstanding,
    aiInsights,
    courses,
    isLoading: false,
  };
}

export function useStudentSettings() {
  const [settings, setSettings] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@iitb.ac.in',
    rollNo: '21CS10045',
    notifications: {
      email: true,
      sms: false,
      whatsapp: true,
      inApp: true,
    },
    reminderTiming: 'after-lecture' as 'before-lecture' | 'after-lecture' | 'end-of-day',
    sharePerformance: true,
  });

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
    isLoading: false,
  };
}
