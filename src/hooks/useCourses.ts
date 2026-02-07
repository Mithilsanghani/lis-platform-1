/**
 * useCourses Hook - LIVE DATA
 * All data flows from useLISStore (Zustand, persisted)
 * NO mock data - returns empty arrays when no data exists
 */

import { useState, useCallback, useMemo } from 'react';
import { useLISStore } from '../store/useLISStore';
import { useAuthStore } from '../store/useStore';

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  health_pct: number;
  student_count: number;
  lecture_count: number;
  unread: number;
  silent_count: number;
  created_at: string;
  professor_id?: string;
  semester?: string;
  color?: string;
}

export type SortOption = 'name' | 'health-asc' | 'health-desc' | 'students' | 'silent' | 'recent';
export type FilterOption = 'all' | 'active' | 'silent-alert' | 'low-health';

const colorPalette = ['blue', 'purple', 'emerald', 'amber', 'rose', 'cyan', 'indigo', 'teal', 'orange', 'pink'];

export function useCourses(professorId?: string) {
  const user = useAuthStore((s) => s.user);
  const profId = professorId || user?.id || '';

  const storeCourses = useLISStore((s) => s.courses);
  const feedback = useLISStore((s) => s.feedback);
  const students = useLISStore((s) => s.students);
  const getProfessorCourses = useLISStore((s) => s.getProfessorCourses);
  const getCourseHealth = useLISStore((s) => s.getCourseHealth);
  const createCourseAction = useLISStore((s) => s.createCourse);
  const deleteCourseAction = useLISStore((s) => s.deleteCourse);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Transform store courses to view format
  const courses: Course[] = useMemo(() => {
    const profCourses = profId ? getProfessorCourses(profId) : storeCourses;

    return profCourses.map((c, idx) => {
      const health = getCourseHealth(c.id);
      const courseFeedback = feedback.filter((f) => f.courseId === c.id);
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentStudentIds = new Set(
        courseFeedback
          .filter((f) => new Date(f.timestamp).getTime() > sevenDaysAgo)
          .map((f) => f.studentId)
      );
      const allStudentIds = new Set(courseFeedback.map((f) => f.studentId));
      const silentCount = Math.max(0, allStudentIds.size - recentStudentIds.size);

      const today = new Date().toISOString().split('T')[0];
      const todayFeedback = courseFeedback.filter((f) => f.timestamp.startsWith(today));

      return {
        id: c.id,
        code: c.code,
        title: c.name,
        description: `${c.department} department course`,
        health_pct: health,
        student_count: c.students.length,
        lecture_count: c.lectures.length,
        unread: todayFeedback.length,
        silent_count: silentCount,
        created_at: c.createdAt,
        professor_id: c.professorId,
        semester: c.semester,
        color: colorPalette[idx % colorPalette.length],
      };
    });
  }, [profId, storeCourses, feedback, students]);

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.code.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query)
      );
    }

    switch (filterBy) {
      case 'active':
        result = result.filter((c) => c.health_pct >= 80);
        break;
      case 'silent-alert':
        result = result.filter((c) => c.silent_count > 0);
        break;
      case 'low-health':
        result = result.filter((c) => c.health_pct < 75);
        break;
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case 'health-asc':
        result.sort((a, b) => a.health_pct - b.health_pct);
        break;
      case 'health-desc':
        result.sort((a, b) => b.health_pct - a.health_pct);
        break;
      case 'students':
        result.sort((a, b) => b.student_count - a.student_count);
        break;
      case 'silent':
        result.sort((a, b) => b.silent_count - a.silent_count);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [courses, searchQuery, sortBy, filterBy]);

  // Stats — computed from real data
  const stats = useMemo(
    () => ({
      totalCourses: courses.length,
      avgHealth:
        courses.length > 0
          ? Math.round(courses.reduce((sum, c) => sum + c.health_pct, 0) / courses.length)
          : 0,
      totalStudents: courses.reduce((sum, c) => sum + c.student_count, 0),
      totalSilent: courses.reduce((sum, c) => sum + c.silent_count, 0),
      totalUnread: courses.reduce((sum, c) => sum + c.unread, 0),
    }),
    [courses]
  );

  // Create course — writes to Zustand store (persisted)
  const createCourse = useCallback(
    async (courseData: Partial<Course>) => {
      const id = createCourseAction(profId, {
        code: courseData.code || 'NEW',
        name: courseData.title || courseData.code || 'New Course',
        professorId: profId,
        semester: courseData.semester || 'Spring 2026',
        department: courseData.description || 'Computer Science',
        credits: 3,
      });
      // Return the newly created course from store
      const created = useLISStore.getState().courses.find((c) => c.id === id);
      return created;
    },
    [profId, createCourseAction]
  );

  // Delete course
  const deleteCourse = useCallback(
    async (courseId: string) => {
      deleteCourseAction(courseId);
    },
    [deleteCourseAction]
  );

  return {
    courses: filteredCourses,
    allCourses: courses,
    loading: false,
    error: null,
    stats,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    refresh: () => {},
    createCourse,
    deleteCourse,
  };
}

export default useCourses;
