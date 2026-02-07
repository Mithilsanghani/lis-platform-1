/**
 * useInfiniteStudents Hook - Production - NO MOCK DATA
 * All student data comes from useLISStore
 * Returns empty arrays when no data exists
 */

import { useState, useMemo, useCallback } from 'react';
import { useLISStore } from '../store/useLISStore';

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  course_id: string;
  course_code: string;
  course_name: string;
  avatar?: string;
  health_pct: number;
  lectures_attended: number;
  lectures_total: number;
  feedback_count: number;
  last_active: string;
  silent_days: number;
  status: 'active' | 'silent' | 'inactive' | 'at-risk';
  joined_date: string;
  phone?: string;
}

export type StudentFilter = 'all' | 'active' | 'silent' | 'at-risk' | 'inactive' | 'low-health' | 'high-performers';
export type StudentSort = 'name-asc' | 'name-desc' | 'health-desc' | 'health-asc' | 'silent-desc' | 'activity-desc' | 'course' | 'rollno';

interface UseInfiniteStudentsProps {
  professorId?: string;
  pageSize?: number;
}

export interface StudentStats {
  total: number;
  active: number;
  silent: number;
  atRisk: number;
  inactive: number;
  avgHealth: number;
  avgFeedback: number;
}

const PAGE_SIZE = 20;

export function useInfiniteStudents({ professorId, pageSize = PAGE_SIZE }: UseInfiniteStudentsProps = {}) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<StudentFilter>('all');
  const [sortBy, setSortBy] = useState<StudentSort>('name-asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get real data from stores
  const { courses, students: storeStudents, feedback, lectures, getProfessorCourses, getCourseStudents } = useLISStore();

  // Build student list from enrolled students across professor's courses
  const allStudents = useMemo((): Student[] => {
    const profCourses = professorId ? getProfessorCourses(professorId) : courses;
    if (profCourses.length === 0) return [];

    const studentMap = new Map<string, Student>();

    profCourses.forEach(course => {
      const enrolled = getCourseStudents(course.id);
      const courseLectures = lectures.filter(l => l.courseId === course.id);
      const courseFeedback = feedback.filter(f => f.courseId === course.id);

      enrolled.forEach(e => {
        // Skip if already added from another course - use first course as primary
        if (studentMap.has(e.id)) return;

        const storeStudent = storeStudents.find(s => s.id === e.id);
        const studentFeedback = courseFeedback.filter(f => f.studentId === e.id);

        // Calculate health from feedback
        let healthPct = 75;
        if (studentFeedback.length > 0) {
          const scores = studentFeedback.map(f => {
            switch (f.understandingLevel) {
              case 'fully': return 100;
              case 'partial': return 60;
              case 'confused': return 20;
              default: return 50;
            }
          });
          healthPct = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }

        // Calculate silent days
        let silentDays = 0;
        if (studentFeedback.length > 0) {
          const lastFeedback = studentFeedback.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0];
          silentDays = Math.floor(
            (Date.now() - new Date(lastFeedback.timestamp).getTime()) / (1000 * 60 * 60 * 24)
          );
        } else {
          silentDays = 7;
        }

        // Determine status
        let status: Student['status'] = 'active';
        if (silentDays >= 10) status = 'inactive';
        else if (silentDays >= 7) status = 'silent';
        else if (healthPct < 70) status = 'at-risk';

        const lastActive = silentDays === 0 ? 'Today' :
          silentDays === 1 ? 'Yesterday' :
            `${silentDays} days ago`;

        // Count lectures attended (where student gave feedback)
        const attendedLectureIds = new Set(studentFeedback.map(f => f.lectureId));
        const lecturesAttended = attendedLectureIds.size;

        studentMap.set(e.id, {
          id: e.id,
          name: storeStudent?.name || e.name || e.id,
          email: storeStudent?.email || e.email || `${e.id}@university.edu`,
          rollNo: e.rollNumber || storeStudent?.rollNumber || e.id,
          course_id: course.id,
          course_code: course.code,
          course_name: course.name,
          health_pct: healthPct,
          lectures_attended: lecturesAttended,
          lectures_total: courseLectures.length,
          feedback_count: studentFeedback.length,
          last_active: lastActive,
          silent_days: silentDays,
          status,
          joined_date: storeStudent?.createdAt || new Date().toISOString(),
        });
      });
    });

    return Array.from(studentMap.values());
  }, [courses, storeStudents, feedback, lectures, professorId, getProfessorCourses, getCourseStudents]);

  // Calculate stats
  const stats = useMemo((): StudentStats => {
    if (allStudents.length === 0) {
      return {
        total: 0,
        active: 0,
        silent: 0,
        atRisk: 0,
        inactive: 0,
        avgHealth: 0,
        avgFeedback: 0,
      };
    }

    const total = allStudents.length;
    const active = allStudents.filter(s => s.status === 'active').length;
    const silent = allStudents.filter(s => s.status === 'silent').length;
    const atRisk = allStudents.filter(s => s.status === 'at-risk').length;
    const inactive = allStudents.filter(s => s.status === 'inactive').length;
    const avgHealth = Math.round(allStudents.reduce((sum, s) => sum + s.health_pct, 0) / total);
    const avgFeedback = Math.round(allStudents.reduce((sum, s) => sum + s.feedback_count, 0) / total);

    return { total, active, silent, atRisk, inactive, avgHealth, avgFeedback };
  }, [allStudents]);

  // Apply search and filters
  const filteredStudents = useMemo(() => {
    let result = [...allStudents];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.course_code.toLowerCase().includes(q)
      );
    }

    // Filter
    switch (filterBy) {
      case 'active':
        result = result.filter(s => s.status === 'active');
        break;
      case 'silent':
        result = result.filter(s => s.status === 'silent' || s.silent_days >= 5);
        break;
      case 'at-risk':
        result = result.filter(s => s.status === 'at-risk' || s.health_pct < 70);
        break;
      case 'inactive':
        result = result.filter(s => s.status === 'inactive');
        break;
      case 'low-health':
        result = result.filter(s => s.health_pct < 60);
        break;
      case 'high-performers':
        result = result.filter(s => s.health_pct >= 90);
        break;
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'health-desc':
        result.sort((a, b) => b.health_pct - a.health_pct);
        break;
      case 'health-asc':
        result.sort((a, b) => a.health_pct - b.health_pct);
        break;
      case 'silent-desc':
        result.sort((a, b) => b.silent_days - a.silent_days);
        break;
      case 'activity-desc':
        result.sort((a, b) => a.silent_days - b.silent_days);
        break;
      case 'course':
        result.sort((a, b) => a.course_code.localeCompare(b.course_code));
        break;
      case 'rollno':
        result.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
        break;
    }

    return result;
  }, [allStudents, searchQuery, filterBy, sortBy]);

  // Pagination
  const displayedStudents = useMemo(() => {
    return filteredStudents.slice(0, page * pageSize);
  }, [filteredStudents, page, pageSize]);

  const hasMore = displayedStudents.length < filteredStudents.length;
  const isLoading = false;
  const isLoadingMore = false;

  // Actions
  const loadMore = useCallback(() => {
    if (hasMore) setPage(p => p + 1);
  }, [hasMore]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    setSelectedIds(new Set());
    await new Promise(r => setTimeout(r, 300));
    setIsRefreshing(false);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(displayedStudents.map(s => s.id)));
  }, [displayedStudents]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Get courses for filter dropdown
  const courseOptions = useMemo(() => {
    const profCourses = professorId ? getProfessorCourses(professorId) : courses;
    return profCourses.map(c => ({ id: c.id, code: c.code, name: c.name }));
  }, [courses, professorId, getProfessorCourses]);

  return {
    students: displayedStudents,
    stats,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    searchQuery,
    setSearchQuery,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    refresh,
    isRefreshing,
    courseOptions,
    totalFiltered: filteredStudents.length,
  };
}

export default useInfiniteStudents;
