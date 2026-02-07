/**
 * LIS Professor Hooks - LIVE DATA
 * All data flows from useLISStore (Zustand, persisted)
 * NO mock data - returns empty arrays when no data exists
 */

import { useState, useMemo, useCallback } from 'react';
import { useLISStore, type Student } from '../store/useLISStore';
import { useAuthStore } from '../store/useStore';

// ============================================
// HELPERS
// ============================================

function useProfessorId(): string {
  const user = useAuthStore((s) => s.user);
  return user?.id || '';
}

// ============================================
// DASHBOARD HOOK
// ============================================

export function useProfessorDashboard() {
  const professorId = useProfessorId();
  const courses = useLISStore((s) => s.courses);
  const students = useLISStore((s) => s.students);
  const lectures = useLISStore((s) => s.lectures);
  const feedback = useLISStore((s) => s.feedback);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);
  const getSilentStudents = useLISStore((s) => s.getSilentStudents);

  const data = useMemo(() => {
    const profCourses = getProfessorCourses(professorId);
    const courseIds = profCourses.map((c) => c.id);

    const totalStudents = new Set(profCourses.flatMap((c) => c.students)).size;

    const profLectures = lectures.filter((l) => courseIds.includes(l.courseId));
    const profFeedback = feedback.filter((f) => courseIds.includes(f.courseId));

    let silentCount = 0;
    courseIds.forEach((cid) => {
      silentCount += getSilentStudents(cid).length;
    });

    let avgEngagement = 0;
    if (profLectures.length > 0 && totalStudents > 0) {
      const totalPossible =
        profLectures.filter((l) => l.status === 'completed').length * totalStudents;
      avgEngagement =
        totalPossible > 0 ? Math.round((profFeedback.length / totalPossible) * 100) : 0;
    }

    return {
      total_students: totalStudents,
      total_courses: profCourses.length,
      active_lectures: profLectures.length,
      new_feedback_count: profFeedback.length,
      avg_engagement_pct: avgEngagement,
      silent_students_count: silentCount,
      topics_needing_revision: [] as { topic: string; course_code: string; confusion_score: number }[],
      recent_insights: [] as any[],
    };
  }, [professorId, courses, students, lectures, feedback]);

  return { data, isLoading: false, error: null };
}

// ============================================
// COURSES HOOK
// ============================================

interface CoursesFilters {
  semester?: string;
  department?: string;
  search?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
}

export function useProfessorCourses(filters?: CoursesFilters) {
  const professorId = useProfessorId();
  const courses = useLISStore((s) => s.courses);
  const feedback = useLISStore((s) => s.feedback);
  const students = useLISStore((s) => s.students);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);
  const getCourseHealth = useLISStore((s) => s.getCourseHealth);

  const result = useMemo(() => {
    let profCourses = getProfessorCourses(professorId);

    let mapped = profCourses.map((c) => {
      const health = getCourseHealth(c.id);
      const silentStudents = students.filter(
        (s) =>
          c.students.includes(s.id) &&
          new Date(s.lastActiveAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
      );

      return {
        id: c.id,
        code: c.code,
        title: c.name,
        semester: c.semester,
        department: c.department,
        enrollmentCode: (c as any).enrollmentCode || '',
        created_by: c.professorId,
        created_at: c.createdAt,
        student_count: c.students.length,
        lecture_count: c.lectures.length,
        health_pct: health,
        silent_students_count: silentStudents.length,
        pending_feedback_count: 0,
      };
    });

    if (filters?.semester) {
      mapped = mapped.filter((c) => c.semester === filters.semester);
    }
    if (filters?.department) {
      mapped = mapped.filter((c) => c.department === filters.department);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      mapped = mapped.filter(
        (c) =>
          c.title.toLowerCase().includes(search) || c.code.toLowerCase().includes(search)
      );
    }
    if (filters?.riskLevel && filters.riskLevel !== 'all') {
      mapped = mapped.filter((c) => {
        if (filters.riskLevel === 'high') return (c.health_pct || 0) < 70;
        if (filters.riskLevel === 'medium')
          return (c.health_pct || 0) >= 70 && (c.health_pct || 0) < 85;
        return (c.health_pct || 0) >= 85;
      });
    }

    return mapped;
  }, [professorId, courses, feedback, students, filters]);

  return { courses: result, total: result.length, isLoading: false, error: null };
}

export function useCourseDetail(courseId: string) {
  const courses = useLISStore((s) => s.courses);
  const lectures = useLISStore((s) => s.lectures);

  const course = useMemo(() => {
    const c = courses.find((c) => c.id === courseId);
    if (!c) return null;
    return {
      id: c.id,
      code: c.code,
      title: c.name,
      semester: c.semester,
      department: c.department,
      created_by: c.professorId,
      created_at: c.createdAt,
      student_count: c.students.length,
      lecture_count: c.lectures.length,
      health_pct: 0,
    };
  }, [courses, courseId]);

  const courseLectures = useMemo(() => {
    return lectures
      .filter((l) => l.courseId === courseId)
      .map((l) => ({
        id: l.id,
        course_id: l.courseId,
        title: l.title,
        date_time: l.date,
        topics: l.topics,
        feedback_count: 0,
        created_at: l.createdAt,
      }));
  }, [lectures, courseId]);

  return { course, lectures: courseLectures, isLoading: false, error: null };
}

// ============================================
// LECTURES HOOK
// ============================================

interface LectureFilters {
  courseId?: string;
  fromDate?: string;
  toDate?: string;
  hasFeedback?: boolean;
}

export function useProfessorLectures(filters?: LectureFilters) {
  const professorId = useProfessorId();
  const courses = useLISStore((s) => s.courses);
  const lectures = useLISStore((s) => s.lectures);
  const feedback = useLISStore((s) => s.feedback);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);

  const result = useMemo(() => {
    const profCourses = getProfessorCourses(professorId);
    const courseIds = profCourses.map((c) => c.id);

    let profLectures = lectures.filter((l) => courseIds.includes(l.courseId));

    if (filters?.courseId) {
      profLectures = profLectures.filter((l) => l.courseId === filters.courseId);
    }

    if (filters?.hasFeedback !== undefined) {
      profLectures = profLectures.filter((l) => {
        const fCount = feedback.filter((f) => f.lectureId === l.id).length;
        return filters.hasFeedback ? fCount > 0 : fCount === 0;
      });
    }

    return profLectures.map((l) => {
      const lectureFeedback = feedback.filter((f) => f.lectureId === l.id);
      const fullyCount = lectureFeedback.filter((f) => f.understandingLevel === 'fully').length;
      const partialCount = lectureFeedback.filter((f) => f.understandingLevel === 'partial').length;
      const confusedCount = lectureFeedback.filter((f) => f.understandingLevel === 'confused').length;
      const total = lectureFeedback.length || 1;

      return {
        id: l.id,
        course_id: l.courseId,
        title: l.title,
        date_time: l.date,
        topics: l.topics,
        feedback_count: lectureFeedback.length,
        created_at: l.createdAt,
        understanding_summary: {
          full_pct: Math.round((fullyCount / total) * 100),
          partial_pct: Math.round((partialCount / total) * 100),
          unclear_pct: Math.round((confusedCount / total) * 100),
          full_count: fullyCount,
          partial_count: partialCount,
          unclear_count: confusedCount,
          response_count: lectureFeedback.length,
        },
      };
    });
  }, [professorId, courses, lectures, feedback, filters]);

  return { lectures: result, total: result.length, isLoading: false, error: null };
}

export function useLectureDetail(lectureId: string) {
  const lectures = useLISStore((s) => s.lectures);
  const feedbackAll = useLISStore((s) => s.feedback);
  const courses = useLISStore((s) => s.courses);

  const lecture = useMemo(() => {
    const l = lectures.find((l) => l.id === lectureId);
    if (!l) return null;
    const course = courses.find((c) => c.id === l.courseId);
    return {
      id: l.id,
      course_id: l.courseId,
      title: l.title,
      date_time: l.date,
      topics: l.topics,
      feedback_count: 0,
      created_at: l.createdAt,
      course: course ? { id: course.id, code: course.code, title: course.name } : null,
    };
  }, [lectures, courses, lectureId]);

  const lectureFeedback = useMemo(() => {
    return feedbackAll.filter((f) => f.lectureId === lectureId);
  }, [feedbackAll, lectureId]);

  return { lecture, feedback: lectureFeedback, analysis: null, isLoading: false, error: null };
}

// ============================================
// FEEDBACK ANALYSIS HOOK
// ============================================

export function useLectureFeedbackAnalysis(lectureId: string) {
  const feedback = useLISStore((s) => s.feedback);

  const lectureFeedback = useMemo(() => {
    return feedback.filter((f) => f.lectureId === lectureId);
  }, [feedback, lectureId]);

  const analysis = useMemo(() => {
    if (lectureFeedback.length === 0) return null;
    const fullyCount = lectureFeedback.filter((f) => f.understandingLevel === 'fully').length;
    const partialCount = lectureFeedback.filter((f) => f.understandingLevel === 'partial').length;
    const confusedCount = lectureFeedback.filter((f) => f.understandingLevel === 'confused').length;
    const total = lectureFeedback.length;

    return {
      summary: {
        full_pct: Math.round((fullyCount / total) * 100),
        partial_pct: Math.round((partialCount / total) * 100),
        unclear_pct: Math.round((confusedCount / total) * 100),
        full_count: fullyCount,
        partial_count: partialCount,
        unclear_count: confusedCount,
        response_count: total,
      },
    };
  }, [lectureFeedback]);

  return { analysis, feedback: lectureFeedback, isLoading: false };
}

// ============================================
// STUDENTS HOOK
// ============================================

interface StudentFilters {
  courseId?: string;
  search?: string;
  isSilent?: boolean;
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
}

export function useProfessorStudents(filters?: StudentFilters) {
  const professorId = useProfessorId();
  const courses = useLISStore((s) => s.courses);
  const students = useLISStore((s) => s.students);
  const feedback = useLISStore((s) => s.feedback);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);

  const result = useMemo(() => {
    const profCourses = getProfessorCourses(professorId);
    const courseIds = profCourses.map((c) => c.id);

    const enrolledStudentIds = new Set(profCourses.flatMap((c) => c.students));
    let enrolled = students.filter((s) => enrolledStudentIds.has(s.id));

    if (filters?.courseId) {
      const course = courses.find((c) => c.id === filters.courseId);
      if (course) {
        enrolled = enrolled.filter((s) => course.students.includes(s.id));
      }
    }

    const withMetrics = enrolled.map((s) => {
      const studentFeedback = feedback.filter(
        (f) => f.studentId === s.id && courseIds.includes(f.courseId)
      );

      const fullyCount = studentFeedback.filter((f) => f.understandingLevel === 'fully').length;
      const total = studentFeedback.length || 1;
      const understandingPct = Math.round((fullyCount / total) * 100);

      const daysSinceActive = Math.floor(
        (Date.now() - new Date(s.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const isSilent = daysSinceActive > 7;

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (understandingPct < 40 || isSilent) riskLevel = 'high';
      else if (understandingPct < 70) riskLevel = 'medium';

      return {
        student_id: s.id,
        course_id: filters?.courseId || '',
        understanding_pct: understandingPct,
        feedback_submitted_count: studentFeedback.length,
        streak_days: 0,
        last_feedback_at:
          studentFeedback.length > 0
            ? studentFeedback.sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )[0].timestamp
            : s.lastActiveAt,
        is_silent: isSilent,
        risk_level: riskLevel,
        student: {
          id: s.id,
          full_name: s.name,
          email: s.email,
          roll_number: s.rollNumber,
          department: s.department,
        },
      };
    });

    let filtered = withMetrics;
    if (filters?.isSilent !== undefined) {
      filtered = filtered.filter((m) => m.is_silent === filters.isSilent);
    }
    if (filters?.riskLevel && filters.riskLevel !== 'all') {
      filtered = filtered.filter((m) => m.risk_level === filters.riskLevel);
    }

    return filtered;
  }, [professorId, courses, students, feedback, filters]);

  return { students: result, total: result.length, isLoading: false, error: null };
}

// ============================================
// SILENT STUDENTS HOOK
// ============================================

export function useSilentStudents(courseId?: string) {
  const professorId = useProfessorId();
  const students = useLISStore((s) => s.students);
  const courses = useLISStore((s) => s.courses);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);
  const getSilentStudents = useLISStore((s) => s.getSilentStudents);

  const silentStudents = useMemo(() => {
    if (courseId) {
      return getSilentStudents(courseId);
    }
    const profCourses = getProfessorCourses(professorId);
    const allSilent = new Map<string, Student>();
    profCourses.forEach((c) => {
      getSilentStudents(c.id).forEach((s) => allSilent.set(s.id, s));
    });
    return Array.from(allSilent.values());
  }, [professorId, courseId, students, courses]);

  return { silentStudents, count: silentStudents.length, isLoading: false };
}

// ============================================
// TOPIC PERFORMANCE HOOK
// ============================================

export function useTopicPerformance(courseId?: string) {
  const professorId = useProfessorId();
  const lectures = useLISStore((s) => s.lectures);
  const feedback = useLISStore((s) => s.feedback);
  const courses = useLISStore((s) => s.courses);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);

  const topics = useMemo(() => {
    const profCourses = getProfessorCourses(professorId);
    const courseIds = courseId ? [courseId] : profCourses.map((c) => c.id);

    const topicMap = new Map<
      string,
      {
        topic: string;
        course_id: string;
        full_count: number;
        partial_count: number;
        unclear_count: number;
        total_count: number;
      }
    >();

    const relevantLectures = lectures.filter((l) => courseIds.includes(l.courseId));

    relevantLectures.forEach((lecture) => {
      const lectureFeedback = feedback.filter((f) => f.lectureId === lecture.id);

      lecture.topics.forEach((topic) => {
        const key = `${lecture.courseId}:${topic}`;
        if (!topicMap.has(key)) {
          topicMap.set(key, {
            topic,
            course_id: lecture.courseId,
            full_count: 0,
            partial_count: 0,
            unclear_count: 0,
            total_count: 0,
          });
        }

        const entry = topicMap.get(key)!;
        lectureFeedback.forEach((f) => {
          entry.total_count++;
          if (f.understandingLevel === 'fully') entry.full_count++;
          else if (f.understandingLevel === 'partial') entry.partial_count++;
          else entry.unclear_count++;
        });
      });
    });

    return Array.from(topicMap.values()).map((t) => ({
      ...t,
      clarity_pct: t.total_count > 0 ? Math.round((t.full_count / t.total_count) * 100) : 0,
      trend: 'stable' as 'stable' | 'improving' | 'declining',
    }));
  }, [professorId, courseId, lectures, feedback, courses]);

  const sorted = [...topics].sort((a, b) => a.clarity_pct - b.clarity_pct);

  return {
    topics: sorted,
    problematicTopics: sorted.filter((t) => t.clarity_pct < 60),
    wellUnderstoodTopics: sorted.filter((t) => t.clarity_pct >= 80),
    isLoading: false,
  };
}

// ============================================
// REVISION PLAN HOOK
// ============================================

export function useRevisionPlan(courseId: string) {
  const [plan, setPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const lectures = useLISStore((s) => s.lectures);
  const feedback = useLISStore((s) => s.feedback);
  const courses = useLISStore((s) => s.courses);

  const generatePlan = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const course = courses.find((c) => c.id === courseId);
      const courseLectures = lectures.filter((l) => l.courseId === courseId);

      const topicScores = new Map<string, { total: number; confused: number }>();

      courseLectures.forEach((l) => {
        const lFeedback = feedback.filter((f) => f.lectureId === l.id);
        l.topics.forEach((topic) => {
          if (!topicScores.has(topic)) {
            topicScores.set(topic, { total: 0, confused: 0 });
          }
          const entry = topicScores.get(topic)!;
          lFeedback.forEach((f) => {
            entry.total++;
            if (f.understandingLevel === 'confused') entry.confused++;
          });
        });
      });

      const needsRevision = Array.from(topicScores.entries())
        .filter(([_, v]) => v.total > 0 && v.confused / v.total > 0.3)
        .map(([topic, v]) => ({
          topic,
          confusion_score: Math.round((v.confused / v.total) * 100),
          priority: (v.confused / v.total > 0.6 ? 'high' : v.confused / v.total > 0.4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
          reasoning: `${Math.round((v.confused / v.total) * 100)}% confusion rate across ${v.total} responses`,
        }))
        .sort((a, b) => b.confusion_score - a.confusion_score);

      const uniqueStudents = new Set<string>();
      courseLectures.forEach((l) => {
        feedback.filter((f) => f.lectureId === l.id && f.understandingLevel === 'confused').forEach((f) => uniqueStudents.add(f.studentId));
      });

      setPlan({
        courseId,
        courseName: course?.name || '',
        generatedAt: new Date().toISOString(),
        recommended_topics: needsRevision,
        affected_students_count: uniqueStudents.size,
        sessions:
          needsRevision.length > 0
            ? [
                {
                  title: `Revision: ${needsRevision
                    .slice(0, 3)
                    .map((t) => t.topic)
                    .join(', ')}`,
                  suggestedDate: new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000
                  ).toISOString(),
                  topics: needsRevision.slice(0, 3).map((t) => t.topic),
                },
              ]
            : [],
      });
      setIsGenerating(false);
    }, 500);
  }, [courseId, lectures, feedback, courses]);

  return { plan, isGenerating, generatePlan };
}

// ============================================
// AI INSIGHTS HOOK
// ============================================

export function useProfessorInsights(filters?: { priority?: string; limit?: number }) {
  const professorId = useProfessorId();
  const courses = useLISStore((s) => s.courses);
  const students = useLISStore((s) => s.students);
  const feedback = useLISStore((s) => s.feedback);
  const lectures = useLISStore((s) => s.lectures);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);
  const getSilentStudents = useLISStore((s) => s.getSilentStudents);
  const getCourseHealth = useLISStore((s) => s.getCourseHealth);

  const insights = useMemo(() => {
    const profCourses = getProfessorCourses(professorId);
    const generated: {
      id: string;
      owner_type: string;
      owner_id: string;
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      action?: string;
      action_route?: string;
      created_at: string;
    }[] = [];

    profCourses.forEach((course) => {
      const silentCount = getSilentStudents(course.id).length;
      const health = getCourseHealth(course.id);
      const courseFeedback = feedback.filter((f) => f.courseId === course.id);
      const confusedCount = courseFeedback.filter(
        (f) => f.understandingLevel === 'confused'
      ).length;

      if (silentCount > 0) {
        generated.push({
          id: `insight-silent-${course.id}`,
          owner_type: 'course',
          owner_id: course.id,
          priority: silentCount > 5 ? 'high' : 'medium',
          title: `${silentCount} Silent Student${silentCount > 1 ? 's' : ''} in ${course.code}`,
          description: `Students with low engagement detected. Consider sending personalized nudges.`,
          action: 'View students',
          action_route: `/professor/students?filter=silent`,
          created_at: new Date().toISOString(),
        });
      }

      if (health > 0 && health < 70) {
        generated.push({
          id: `insight-health-${course.id}`,
          owner_type: 'course',
          owner_id: course.id,
          priority: 'high',
          title: `${course.code} Health is Low (${health}%)`,
          description: `Course health is below 70%. Review recent lectures and student feedback.`,
          action: 'View analytics',
          action_route: `/professor/analytics`,
          created_at: new Date().toISOString(),
        });
      }

      if (courseFeedback.length > 5 && confusedCount / courseFeedback.length > 0.4) {
        generated.push({
          id: `insight-confusion-${course.id}`,
          owner_type: 'course',
          owner_id: course.id,
          priority: 'high',
          title: `High Confusion Rate in ${course.code}`,
          description: `${Math.round(
            (confusedCount / courseFeedback.length) * 100
          )}% of feedback indicates confusion. Consider a revision session.`,
          action: 'View analytics',
          action_route: `/professor/analytics`,
          created_at: new Date().toISOString(),
        });
      }

      if (health >= 85) {
        generated.push({
          id: `insight-good-${course.id}`,
          owner_type: 'course',
          owner_id: course.id,
          priority: 'low',
          title: `${course.code} is Performing Well`,
          description: `Course health is ${health}%. Keep up the good work!`,
          created_at: new Date().toISOString(),
        });
      }
    });

    let filtered = generated;
    if (filters?.priority) {
      filtered = filtered.filter((i) => i.priority === filters.priority);
    }
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    return filtered;
  }, [professorId, courses, students, feedback, lectures, filters]);

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const dismissInsight = useCallback((id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  }, []);

  const activeInsights = insights.filter((i) => !dismissedIds.has(i.id));

  return { insights: activeInsights, dismissInsight, isLoading: false };
}

// ============================================
// ANALYTICS HOOK
// ============================================

export function useCourseAnalytics(courseId: string) {
  const courses = useLISStore((s) => s.courses);
  const lectures = useLISStore((s) => s.lectures);
  const feedback = useLISStore((s) => s.feedback);

  const result = useMemo(() => {
    const course = courses.find((c) => c.id === courseId);
    const courseLectures = lectures.filter((l) => l.courseId === courseId);
    const courseFeedback = feedback.filter((f) => f.courseId === courseId);

    const weeklyTrends = courseLectures.map((lecture, index) => {
      const lFeedback = courseFeedback.filter((f) => f.lectureId === lecture.id);
      const fullyCount = lFeedback.filter((f) => f.understandingLevel === 'fully').length;
      const total = lFeedback.length || 1;
      const understanding = Math.round((fullyCount / total) * 100);
      const responseRate =
        course && course.students.length > 0
          ? Math.round((lFeedback.length / course.students.length) * 100)
          : 0;

      return {
        week: `Week ${Math.floor(index / 2) + 1}`,
        lecture: lecture.title,
        understanding,
        responseRate,
      };
    });

    const completedLectures = courseLectures.filter((l) => l.status === 'completed');
    const totalPossible = completedLectures.length * (course?.students.length || 0);
    const engagementRate =
      totalPossible > 0 ? Math.round((courseFeedback.length / totalPossible) * 100) : 0;

    return {
      course: course
        ? {
            id: course.id,
            code: course.code,
            title: course.name,
            health_pct: 0,
            student_count: course.students.length,
          }
        : null,
      weeklyTrends,
      topicPerformance: [],
      engagementRate,
    };
  }, [courses, lectures, feedback, courseId]);

  return { ...result, isLoading: false };
}
