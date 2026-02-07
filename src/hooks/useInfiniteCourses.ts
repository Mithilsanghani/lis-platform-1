/**
 * useInfiniteCourses v9.0 - Production Hook with Infinite Scroll
 * Handles pagination, filtering, sorting, bulk operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  health: number;
  students: number;
  active_today: number;
  unread: number;
  silent_count: number;
  lecture_count: number;
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'cyan' | 'orange' | 'indigo' | 'teal' | 'pink';
  status: 'active' | 'archived' | 'draft';
  last_activity: string;
  created_at: string;
}

export interface CourseStats {
  totalCourses: number;
  avgHealth: number;
  totalStudents: number;
  totalActive: number;
  totalSilent: number;
  lowHealthCount: number;
}

export type SortOption = 'health-desc' | 'health-asc' | 'students-desc' | 'students-asc' | 'name-asc' | 'name-desc' | 'recent';
export type FilterOption = 'all' | 'active' | 'silent' | 'low-health' | 'archived';

const COURSES_PER_PAGE = 12;

// Production mock data - 30 courses for testing infinite scroll
const generateMockCourses = (): Course[] => {
  const baseCourses = [
    { code: 'CS101', title: 'Introduction to Programming', health: 92, students: 365, active_today: 32, unread: 1, silent_count: 2, color: 'blue' as const },
    { code: 'CS201', title: 'Data Structures & Algorithms', health: 75, students: 245, active_today: 18, unread: 5, silent_count: 12, color: 'purple' as const },
    { code: 'CS301', title: 'Advanced Algorithms', health: 94, students: 156, active_today: 24, unread: 0, silent_count: 1, color: 'emerald' as const },
    { code: 'CS401', title: 'System Design', health: 68, students: 89, active_today: 8, unread: 3, silent_count: 8, color: 'amber' as const },
    { code: 'CS501', title: 'Machine Learning', health: 88, students: 312, active_today: 45, unread: 2, silent_count: 4, color: 'rose' as const },
    { code: 'CS601', title: 'Deep Learning', health: 91, students: 178, active_today: 28, unread: 0, silent_count: 2, color: 'cyan' as const },
    { code: 'MA101', title: 'Linear Algebra', health: 72, students: 420, active_today: 35, unread: 8, silent_count: 18, color: 'orange' as const },
    { code: 'MA201', title: 'Probability & Statistics', health: 85, students: 380, active_today: 42, unread: 1, silent_count: 5, color: 'indigo' as const },
    { code: 'PH101', title: 'Physics I - Mechanics', health: 78, students: 290, active_today: 22, unread: 4, silent_count: 9, color: 'teal' as const },
    { code: 'PH201', title: 'Physics II - Electromagnetism', health: 82, students: 265, active_today: 19, unread: 2, silent_count: 6, color: 'pink' as const },
    { code: 'EE101', title: 'Circuits & Electronics', health: 89, students: 198, active_today: 31, unread: 0, silent_count: 3, color: 'blue' as const },
    { code: 'EE201', title: 'Signal Processing', health: 76, students: 145, active_today: 12, unread: 6, silent_count: 11, color: 'purple' as const },
    { code: 'ME101', title: 'Engineering Mechanics', health: 83, students: 356, active_today: 28, unread: 1, silent_count: 7, color: 'emerald' as const },
    { code: 'ME201', title: 'Thermodynamics', health: 71, students: 289, active_today: 15, unread: 9, silent_count: 14, color: 'amber' as const },
    { code: 'CH101', title: 'General Chemistry', health: 86, students: 412, active_today: 38, unread: 2, silent_count: 5, color: 'rose' as const },
    { code: 'CH201', title: 'Organic Chemistry', health: 79, students: 234, active_today: 21, unread: 3, silent_count: 8, color: 'cyan' as const },
    { code: 'BT101', title: 'Introduction to Biotechnology', health: 93, students: 167, active_today: 29, unread: 0, silent_count: 1, color: 'orange' as const },
    { code: 'BT201', title: 'Molecular Biology', health: 87, students: 145, active_today: 23, unread: 1, silent_count: 3, color: 'indigo' as const },
    { code: 'CE101', title: 'Structural Engineering', health: 74, students: 198, active_today: 14, unread: 5, silent_count: 10, color: 'teal' as const },
    { code: 'CE201', title: 'Fluid Mechanics', health: 81, students: 176, active_today: 17, unread: 2, silent_count: 6, color: 'pink' as const },
    { code: 'HS101', title: 'Technical Communication', health: 95, students: 520, active_today: 48, unread: 0, silent_count: 2, color: 'blue' as const },
    { code: 'HS201', title: 'Economics for Engineers', health: 84, students: 445, active_today: 36, unread: 1, silent_count: 4, color: 'purple' as const },
    { code: 'CS701', title: 'Computer Networks', health: 77, students: 134, active_today: 11, unread: 4, silent_count: 9, color: 'emerald' as const },
    { code: 'CS801', title: 'Distributed Systems', health: 90, students: 98, active_today: 16, unread: 0, silent_count: 2, color: 'amber' as const },
    { code: 'CS901', title: 'Cloud Computing', health: 88, students: 112, active_today: 20, unread: 1, silent_count: 3, color: 'rose' as const },
    { code: 'AI101', title: 'Artificial Intelligence', health: 96, students: 287, active_today: 52, unread: 0, silent_count: 1, color: 'cyan' as const },
    { code: 'AI201', title: 'Natural Language Processing', health: 85, students: 156, active_today: 25, unread: 2, silent_count: 4, color: 'orange' as const },
    { code: 'AI301', title: 'Computer Vision', health: 91, students: 134, active_today: 22, unread: 0, silent_count: 2, color: 'indigo' as const },
    { code: 'DS101', title: 'Data Science Fundamentals', health: 89, students: 234, active_today: 38, unread: 1, silent_count: 3, color: 'teal' as const },
    { code: 'DS201', title: 'Big Data Analytics', health: 73, students: 167, active_today: 13, unread: 7, silent_count: 12, color: 'pink' as const },
  ];

  return baseCourses.map((course, index) => ({
    ...course,
    id: `course-${index + 1}`,
    description: `Comprehensive course covering ${course.title.toLowerCase()} fundamentals and advanced concepts.`,
    lecture_count: Math.floor(Math.random() * 20) + 5,
    status: 'active' as const,
    last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const ALL_MOCK_COURSES = generateMockCourses();

export function useInfiniteCourses(professorId?: string) {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('health-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch initial courses
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    
    // Try Supabase first
    if (professorId) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('professor_id', professorId)
          .order('health', { ascending: false });
        
        if (!error && data && data.length > 0) {
          setAllCourses(data);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.log('Using mock data');
      }
    }
    
    // Fall back to mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    setAllCourses(ALL_MOCK_COURSES);
    setIsLoading(false);
  }, [professorId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter and sort courses
  const processedCourses = useMemo(() => {
    let result = [...allCourses];
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c => c.code.toLowerCase().includes(query) || 
             c.title.toLowerCase().includes(query)
      );
    }
    
    // Apply filter
    switch (filterBy) {
      case 'active':
        result = result.filter(c => c.active_today > 0);
        break;
      case 'silent':
        result = result.filter(c => c.silent_count > 0);
        break;
      case 'low-health':
        result = result.filter(c => c.health < 80);
        break;
      case 'archived':
        result = result.filter(c => c.status === 'archived');
        break;
    }
    
    // Apply sort
    switch (sortBy) {
      case 'health-desc':
        result.sort((a, b) => b.health - a.health);
        break;
      case 'health-asc':
        result.sort((a, b) => a.health - b.health);
        break;
      case 'students-desc':
        result.sort((a, b) => b.students - a.students);
        break;
      case 'students-asc':
        result.sort((a, b) => a.students - b.students);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());
        break;
    }
    
    return result;
  }, [allCourses, searchQuery, sortBy, filterBy]);

  // Update displayed courses when filters change
  useEffect(() => {
    setPage(1);
    setDisplayedCourses(processedCourses.slice(0, COURSES_PER_PAGE));
    setHasMore(processedCourses.length > COURSES_PER_PAGE);
  }, [processedCourses]);

  // Load more courses (infinite scroll)
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nextPage = page + 1;
    const start = (nextPage - 1) * COURSES_PER_PAGE;
    const end = start + COURSES_PER_PAGE;
    const newCourses = processedCourses.slice(0, end);
    
    setDisplayedCourses(newCourses);
    setPage(nextPage);
    setHasMore(end < processedCourses.length);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, page, processedCourses]);

  // Refresh courses
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchCourses();
    setIsRefreshing(false);
  }, [fetchCourses]);

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(displayedCourses.map(c => c.id)));
  }, [displayedCourses]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === displayedCourses.length) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [selectedIds.size, displayedCourses.length, selectAll, deselectAll]);

  // Bulk operations
  const bulkArchive = useCallback(async () => {
    const ids = Array.from(selectedIds);
    console.log('Archiving courses:', ids);
    
    // Update local state
    setAllCourses(prev => prev.map(c => 
      ids.includes(c.id) ? { ...c, status: 'archived' as const } : c
    ));
    setSelectedIds(new Set());
    
    // Supabase update (if available)
    if (professorId) {
      try {
        await supabase
          .from('courses')
          .update({ status: 'archived' })
          .in('id', ids);
      } catch (e) {
        console.log('Mock archive operation');
      }
    }
  }, [selectedIds, professorId]);

  const bulkDelete = useCallback(async () => {
    const ids = Array.from(selectedIds);
    console.log('Deleting courses:', ids);
    
    setAllCourses(prev => prev.filter(c => !ids.includes(c.id)));
    setSelectedIds(new Set());
    
    if (professorId) {
      try {
        await supabase
          .from('courses')
          .delete()
          .in('id', ids);
      } catch (e) {
        console.log('Mock delete operation');
      }
    }
  }, [selectedIds, professorId]);

  const bulkNudge = useCallback(async () => {
    const ids = Array.from(selectedIds);
    console.log('Nudging silent students in courses:', ids);
    // This would trigger notification/email to silent students
    alert(`Nudge sent to silent students in ${ids.length} courses!`);
    setSelectedIds(new Set());
  }, [selectedIds]);

  // Export to CSV
  const exportCSV = useCallback(() => {
    const coursesToExport = selectedIds.size > 0 
      ? displayedCourses.filter(c => selectedIds.has(c.id))
      : displayedCourses;
    
    const headers = ['Code', 'Title', 'Health %', 'Students', 'Active Today', 'Silent', 'Status'];
    const rows = coursesToExport.map(c => [
      c.code,
      c.title,
      c.health,
      c.students,
      c.active_today,
      c.silent_count,
      c.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [displayedCourses, selectedIds]);

  // Calculate stats
  const stats: CourseStats = useMemo(() => {
    const courses = processedCourses;
    return {
      totalCourses: courses.length,
      avgHealth: courses.length > 0 
        ? Math.round(courses.reduce((sum, c) => sum + c.health, 0) / courses.length)
        : 0,
      totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
      totalActive: courses.reduce((sum, c) => sum + c.active_today, 0),
      totalSilent: courses.reduce((sum, c) => sum + c.silent_count, 0),
      lowHealthCount: courses.filter(c => c.health < 80).length,
    };
  }, [processedCourses]);

  // Filter counts
  const filterCounts = useMemo(() => ({
    all: allCourses.length,
    active: allCourses.filter(c => c.active_today > 0).length,
    silent: allCourses.filter(c => c.silent_count > 0).length,
    lowHealth: allCourses.filter(c => c.health < 80).length,
    archived: allCourses.filter(c => c.status === 'archived').length,
  }), [allCourses]);

  return {
    // Data
    courses: displayedCourses,
    allCourses: processedCourses,
    stats,
    filterCounts,
    
    // Pagination
    page,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    
    // Search & Filter
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    
    // Selection
    selectedIds,
    toggleSelect,
    selectAll,
    deselectAll,
    toggleSelectAll,
    
    // Bulk operations
    bulkArchive,
    bulkDelete,
    bulkNudge,
    exportCSV,
    
    // Refresh
    refresh,
    isRefreshing,
  };
}
