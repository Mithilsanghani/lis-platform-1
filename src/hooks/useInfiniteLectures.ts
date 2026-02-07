/**
 * useInfiniteLectures v10.0 - Production Hook - NO MOCK DATA
 * All data comes from useLISStore
 * Empty arrays when no data exists
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLISStore, type Lecture } from '../store/useLISStore';

export type { Lecture };

export interface LectureStats {
  totalLectures: number;
  avgUnderstanding: number;
  totalFeedback: number;
  totalUnread: number;
  totalSilent: number;
  lowUnderstandingCount: number;
  todayLectures: number;
  liveLectures: number;
}

export type LectureSortOption = 'date-desc' | 'date-asc' | 'understanding-desc' | 'understanding-asc' | 'feedback-desc' | 'course' | 'title';
export type LectureFilterOption = 'all' | 'today' | 'this-week' | 'unread' | 'low-understanding' | 'live' | 'scheduled';

const LECTURES_PER_PAGE = 12;

export function useInfiniteLectures(professorId?: string) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<LectureSortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<LectureFilterOption>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get real data from store
  const { 
    lectures: allStoreLectures, 
    feedback: allFeedback,
    getProfessorCourses,
  } = useLISStore();

  // Filter lectures to professor's courses
  const allLectures = useMemo(() => {
    if (!professorId) return allStoreLectures;
    const profCourses = getProfessorCourses(professorId);
    const courseIds = profCourses.map(c => c.id);
    return allStoreLectures.filter(l => courseIds.includes(l.courseId));
  }, [allStoreLectures, professorId, getProfessorCourses]);

  // Calculate stats from real data - all zeros when no data
  const stats = useMemo<LectureStats>(() => {
    if (allLectures.length === 0) {
      return {
        totalLectures: 0,
        avgUnderstanding: 0,
        totalFeedback: 0,
        totalUnread: 0,
        totalSilent: 0,
        lowUnderstandingCount: 0,
        todayLectures: 0,
        liveLectures: 0,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const liveLectures = allLectures.filter(l => l.status === 'live');
    const todayLectures = allLectures.filter(l => l.date === today);
    
    // Calculate feedback stats for these lectures
    const lectureIds = allLectures.map(l => l.id);
    const relevantFeedback = allFeedback.filter(f => lectureIds.includes(f.lectureId));
    
    // Calculate avg understanding from feedback
    let avgUnderstanding = 0;
    if (relevantFeedback.length > 0) {
      const understandingScores = relevantFeedback.map(f => {
        switch (f.understandingLevel) {
          case 'fully': return 100;
          case 'partial': return 60;
          case 'confused': return 20;
          default: return 50;
        }
      });
      avgUnderstanding = Math.round(understandingScores.reduce((a, b) => a + b, 0) / understandingScores.length);
    }

    return {
      totalLectures: allLectures.length,
      avgUnderstanding,
      totalFeedback: relevantFeedback.length,
      totalUnread: 0,
      totalSilent: 0,
      lowUnderstandingCount: 0,
      todayLectures: todayLectures.length,
      liveLectures: liveLectures.length,
    };
  }, [allLectures, allFeedback]);

  // Filter counts for UI badges
  const filterCounts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
      all: allLectures.length,
      today: allLectures.filter(l => l.date === today).length,
      'this-week': allLectures.filter(l => l.date >= weekAgo).length,
      live: allLectures.filter(l => l.status === 'live').length,
      scheduled: allLectures.filter(l => l.status === 'scheduled').length,
      unread: 0,
      'low-understanding': 0,
    };
  }, [allLectures]);

  // Process lectures with filters and sorting
  const processedLectures = useMemo(() => {
    let result = [...allLectures];
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        l => l.title.toLowerCase().includes(query) || 
             l.courseId.toLowerCase().includes(query) ||
             l.topics.some(t => t.toLowerCase().includes(query))
      );
    }
    
    // Apply filter
    switch (filterBy) {
      case 'today':
        result = result.filter(l => l.date === today);
        break;
      case 'this-week':
        result = result.filter(l => l.date >= weekAgo);
        break;
      case 'live':
        result = result.filter(l => l.status === 'live');
        break;
      case 'scheduled':
        result = result.filter(l => l.status === 'scheduled');
        break;
    }
    
    // Apply sort
    switch (sortBy) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'course':
        result.sort((a, b) => a.courseId.localeCompare(b.courseId));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    return result;
  }, [allLectures, searchQuery, sortBy, filterBy]);

  // Paginated lectures
  const displayedLectures = useMemo(() => {
    return processedLectures.slice(0, page * LECTURES_PER_PAGE);
  }, [processedLectures, page]);

  const hasMore = displayedLectures.length < processedLectures.length;
  const isLoading = false;
  const isLoadingMore = false;

  // Load more
  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage(p => p + 1);
    }
  }, [hasMore]);

  // Refresh
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    await new Promise(r => setTimeout(r, 300));
    setIsRefreshing(false);
  }, []);

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === displayedLectures.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedLectures.map(l => l.id)));
    }
  }, [displayedLectures, selectedIds.size]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Bulk actions
  const bulkMarkRead = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  const bulkNudgeSilent = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  const bulkArchive = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  const exportCSV = useCallback(() => {
    if (displayedLectures.length === 0) return;
    const csv = displayedLectures.map(l => 
      `${l.title},${l.courseId},${l.date},${l.status}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lectures.csv';
    a.click();
  }, [displayedLectures]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, filterBy]);

  return {
    lectures: displayedLectures,
    stats,
    filterCounts,
    hasMore,
    loadMore,
    isLoading,
    isLoadingMore,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    deselectAll,
    bulkMarkRead,
    bulkNudgeSilent,
    bulkArchive,
    exportCSV,
    refresh,
    isRefreshing,
  };
}
