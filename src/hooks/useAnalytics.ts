/**
 * useAnalytics Hook - Production - NO MOCK DATA
 * All analytics computed from useLISStore data
 * Empty states when no data exists
 */

import { useState, useMemo } from 'react';
import { useLISStore } from '../store/useLISStore';

export interface CourseHealth {
  course_code: string;
  course_name: string;
  health_pct: number;
  students: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface DailyMetric {
  date: string;
  understanding: number;
  engagement: number;
  feedback: number;
  silent: number;
}

export interface FeedbackCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopicDifficulty {
  topic: string;
  course: string;
  understanding: number;
  feedback_count: number;
  confusion_rate: number;
}

export interface HourlyActivity {
  hour: string;
  feedback: number;
  engagement: number;
}

export type DateRange = '7d' | '14d' | '30d' | '90d';

interface UseAnalyticsProps {
  professorId?: string;
}

export function useAnalytics({ professorId }: UseAnalyticsProps = {}) {
  const [dateRange, setDateRange] = useState<DateRange>('14d');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Get real data from store
  const { 
    courses: allCourses, 
    feedback: allFeedback,
    students: allStudents,
    getProfessorCourses,
  } = useLISStore();

  // Filter to professor's courses
  const professorCourses = useMemo(() => {
    if (!professorId) return allCourses;
    return getProfessorCourses(professorId);
  }, [allCourses, professorId, getProfessorCourses]);

  const courseIds = useMemo(() => 
    professorCourses.map(c => c.id), 
    [professorCourses]
  );

  // Filter data to professor's scope
  const professorFeedback = useMemo(() =>
    allFeedback.filter(f => courseIds.includes(f.courseId)),
    [allFeedback, courseIds]
  );

  // Course health - computed from real data
  const courseHealth = useMemo<CourseHealth[]>(() => {
    if (professorCourses.length === 0) return [];

    return professorCourses.map(course => {
      const courseFeedback = professorFeedback.filter(f => f.courseId === course.id);
      
      // Calculate understanding %
      let healthPct = 0;
      if (courseFeedback.length > 0) {
        const understandingScores = courseFeedback.map(f => {
          switch (f.understandingLevel) {
            case 'fully': return 100;
            case 'partial': return 60;
            case 'confused': return 20;
            default: return 50;
          }
        });
        healthPct = Math.round(understandingScores.reduce((a, b) => a + b, 0) / understandingScores.length);
      }

      return {
        course_code: course.code,
        course_name: course.name,
        health_pct: healthPct,
        students: allStudents.filter(s => s.enrolledCourses?.includes(course.id)).length,
        trend: 'stable' as const,
        change: 0,
      };
    }).sort((a, b) => b.health_pct - a.health_pct);
  }, [professorCourses, professorFeedback, allStudents]);

  // Daily metrics - computed from real feedback timestamps
  const dailyMetrics = useMemo<DailyMetric[]>(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : dateRange === '30d' ? 30 : 90;
    const metrics: DailyMetric[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayFeedback = professorFeedback.filter(f => f.timestamp.startsWith(dateStr));
      
      // Calculate understanding for the day
      let understanding = 0;
      if (dayFeedback.length > 0) {
        const scores = dayFeedback.map(f => {
          switch (f.understandingLevel) {
            case 'fully': return 100;
            case 'partial': return 60;
            case 'confused': return 20;
            default: return 50;
          }
        });
        understanding = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
      
      const confused = dayFeedback.filter(f => f.understandingLevel === 'confused').length;
      
      metrics.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        understanding,
        engagement: dayFeedback.length > 0 ? Math.min(100, dayFeedback.length * 10) : 0,
        feedback: dayFeedback.length,
        silent: confused,
      });
    }
    
    return metrics;
  }, [dateRange, professorFeedback]);

  // Feedback categories - computed from real comments (simplified)
  const feedbackCategories = useMemo<FeedbackCategory[]>(() => {
    if (professorFeedback.length === 0) return [];

    const fully = professorFeedback.filter(f => f.understandingLevel === 'fully').length;
    const partial = professorFeedback.filter(f => f.understandingLevel === 'partial').length;
    const confused = professorFeedback.filter(f => f.understandingLevel === 'confused').length;
    const total = professorFeedback.length;

    if (total === 0) return [];

    const categories: FeedbackCategory[] = [];
    
    if (fully > 0) {
      categories.push({ 
        category: 'Fully Understood', 
        count: fully, 
        percentage: Math.round((fully / total) * 100), 
        color: '#10b981' 
      });
    }
    if (partial > 0) {
      categories.push({ 
        category: 'Partially Understood', 
        count: partial, 
        percentage: Math.round((partial / total) * 100), 
        color: '#f59e0b' 
      });
    }
    if (confused > 0) {
      categories.push({ 
        category: 'Needs Review', 
        count: confused, 
        percentage: Math.round((confused / total) * 100), 
        color: '#f43f5e' 
      });
    }

    return categories;
  }, [professorFeedback]);

  // Topic difficulty - computed from real topic ratings
  const topicDifficulty = useMemo<TopicDifficulty[]>(() => {
    if (professorFeedback.length === 0) return [];

    // Group feedback by topics from topicRatings
    const topicMap = new Map<string, { scores: number[], courseId: string }>();
    
    professorFeedback.forEach(f => {
      if (f.topicRatings && Array.isArray(f.topicRatings)) {
        f.topicRatings.forEach(tr => {
          const existing = topicMap.get(tr.topicId) || { scores: [], courseId: f.courseId };
          existing.scores.push(tr.rating);
          topicMap.set(tr.topicId, existing);
        });
      }
    });

    return Array.from(topicMap.entries())
      .map(([topic, data]) => {
        const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
        const understanding = Math.round(avgScore * 20); // Convert 1-5 to percentage
        const confusionRate = 100 - understanding;
        const course = professorCourses.find(c => c.id === data.courseId);
        
        return {
          topic,
          course: course?.code || 'N/A',
          understanding,
          feedback_count: data.scores.length,
          confusion_rate: confusionRate,
        };
      })
      .sort((a, b) => a.understanding - b.understanding)
      .slice(0, 10); // Top 10 difficult topics
  }, [professorFeedback, professorCourses]);

  // Hourly activity - computed from real feedback timestamps
  const hourlyActivity = useMemo<HourlyActivity[]>(() => {
    const hours: HourlyActivity[] = [];
    
    for (let h = 8; h <= 18; h++) {
      const hourLabel = h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
      const hourFeedback = professorFeedback.filter(f => {
        const feedbackHour = new Date(f.timestamp).getHours();
        return feedbackHour === h;
      });
      
      hours.push({
        hour: hourLabel,
        feedback: hourFeedback.length,
        engagement: hourFeedback.length > 0 ? Math.min(100, hourFeedback.length * 5) : 0,
      });
    }
    
    return hours;
  }, [professorFeedback]);

  // Summary stats - computed from real data
  const summaryStats = useMemo(() => {
    if (professorFeedback.length === 0) {
      return {
        avgUnderstanding: 0,
        avgUnderstandingChange: 0,
        totalFeedback: 0,
        feedbackChange: 0,
        silentStudents: 0,
        silentChange: 0,
        activeStudents: 0,
        activeChange: 0,
        priorityCourse: professorCourses[0]?.code || 'N/A',
        priorityAction: 'No data yet',
      };
    }

    // Calculate average understanding
    const understandingScores = professorFeedback.map(f => {
      switch (f.understandingLevel) {
        case 'fully': return 100;
        case 'partial': return 60;
        case 'confused': return 20;
        default: return 50;
      }
    });
    const avgUnderstanding = Math.round(
      understandingScores.reduce((a, b) => a + b, 0) / understandingScores.length
    );

    // Count unique students who gave feedback
    const activeStudentIds = new Set(professorFeedback.map(f => f.studentId));
    
    // Count confused students
    const confusedFeedback = professorFeedback.filter(f => f.understandingLevel === 'confused');
    const silentStudentIds = new Set(confusedFeedback.map(f => f.studentId));

    // Find lowest performing course
    const lowestCourse = courseHealth.length > 0 
      ? courseHealth[courseHealth.length - 1] 
      : null;

    return {
      avgUnderstanding,
      avgUnderstandingChange: 0,
      totalFeedback: professorFeedback.length,
      feedbackChange: 0,
      silentStudents: silentStudentIds.size,
      silentChange: 0,
      activeStudents: activeStudentIds.size,
      activeChange: 0,
      priorityCourse: lowestCourse?.course_code || 'N/A',
      priorityAction: lowestCourse ? `Review ${lowestCourse.course_name}` : 'No action needed',
    };
  }, [professorFeedback, courseHealth, professorCourses]);

  // Radar chart data - empty when no data
  const radarData = useMemo(() => {
    if (professorCourses.length === 0) return [];

    const metrics = ['Understanding', 'Engagement', 'Feedback', 'Attendance', 'Completion'];
    const topCourses = professorCourses.slice(0, 3);

    return metrics.map(metric => {
      const result: Record<string, string | number> = { metric };
      
      topCourses.forEach(course => {
        const courseFeedback = professorFeedback.filter(f => f.courseId === course.id);
        let value = 0;
        
        if (courseFeedback.length > 0 && metric === 'Understanding') {
          const scores = courseFeedback.map(f => {
            switch (f.understandingLevel) {
              case 'fully': return 100;
              case 'partial': return 60;
              case 'confused': return 20;
              default: return 50;
            }
          });
          value = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        } else if (metric === 'Feedback') {
          value = Math.min(100, courseFeedback.length * 5);
        }
        
        result[course.code] = value;
      });
      
      return result;
    });
  }, [professorCourses, professorFeedback]);

  return {
    dateRange,
    setDateRange,
    selectedCourse,
    setSelectedCourse,
    courseHealth,
    dailyMetrics,
    feedbackCategories,
    topicDifficulty,
    hourlyActivity,
    summaryStats,
    radarData,
    courses: professorCourses.map(c => ({ code: c.code, name: c.name })),
  };
}
