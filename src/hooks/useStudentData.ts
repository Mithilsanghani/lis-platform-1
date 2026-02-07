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


// Use enhancedMockData and dataHelpers
import { enhancedMockData, dataHelpers } from '../data';
const courses = enhancedMockData.courses.map(c => ({
  id: c.id,
  code: c.code,
  title: c.title || '',
  instructor: '',
  department: c.department,
  understanding_pct: 80,
  health_pct: 80,
  next_lecture: '',
  pending_feedback: 0,
  total_lectures: 0,
  attended_lectures: 0,
  type: 'core',
  color: 'from-blue-500 to-indigo-600',
}));


const todayLectures: StudentLecture[] = (enhancedMockData.lectures || []).slice(0, 3).map(l => ({
  id: l.id,
  course_code: l.courseCode,
  course_title: l.courseName,
  topic: l.topics?.[0]?.name || '',
  instructor: l.instructor || '',
  time: l.startTime || '',
  date: l.date || '',
  status: l.status as any,
  feedback_submitted: false,
}));


const feedbackItems: StudentFeedback[] = (enhancedMockData.feedback || []).map(fb => ({
  id: fb.id,
  lecture_id: fb.lectureId,
  course_code: fb.courseCode || '',
  course_title: fb.courseName || '',
  topic: fb.topicFeedbacks?.[0]?.topicName || '',
  date: fb.date || '',
  time: fb.time || '',
  status: fb.status as any || 'pending',
  understanding: fb.understanding as any,
  reasons: fb.reasons || [],
  comment: fb.comment,
  submitted_at: fb.submittedAt,
  due_soon: false,
}));


const weeklyPerformance: PerformanceSnapshot[] = enhancedMockData.weeklyPerformance || [];
const topicPerformance: TopicPerformance[] = enhancedMockData.topicPerformance || [];


const aiInsights: AIInsight[] = enhancedMockData.studentInsights || [];

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
