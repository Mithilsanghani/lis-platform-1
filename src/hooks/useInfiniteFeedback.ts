/**
 * useInfiniteFeedback - Production Hook - NO MOCK DATA
 * All data comes from useLISStore
 * Returns interface expected by FeedbackPageV11
 */

import { useState, useCallback, useMemo } from 'react';
import { useLISStore, type Feedback } from '../store/useLISStore';

export type { Feedback };

// Flat feedback item that FeedbackPageV11 and FeedbackCardPro expect
export interface FeedbackItem {
  id: string;
  lecture_id: string;
  lecture_title: string;
  course_id: string;
  course_code: string;
  student_id: string;
  student_name: string;
  student_rollno: string;
  understanding: number; // 1-5 rating
  reason: string; // Comment/reason
  comment: string; // Alias for reason
  timestamp: string;
  resolved: boolean;
  read: boolean;
  reply?: string;
  category?: 'pace' | 'examples' | 'clarity' | 'general';
  similar_count?: number;
}

export interface FeedbackStats {
  totalFeedback: number;
  todayCount: number;
  unreadCount: number;
  unresolvedCount: number;
  avgRating: number;
  lowRatingCount: number;
  categoryStats: {
    pace: number;
    examples: number;
    clarity: number;
  };
}

export type FeedbackFilter = 'all' | 'unread' | 'unresolved' | 'low-rating' | 'high-rating' | 'today' | 'pace' | 'examples' | 'clarity';
export type FeedbackSort = 'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'course';

const ITEMS_PER_PAGE = 20;

interface UseInfiniteFeedbackProps {
  professorId?: string;
}

export function useInfiniteFeedback({ professorId }: UseInfiniteFeedbackProps = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FeedbackFilter>('all');
  const [sort, setSort] = useState<FeedbackSort>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Get real data from store
  const { 
    feedback: allFeedback, 
    lectures: allLectures,
    courses: allCourses,
    students: allStudents,
    getProfessorCourses,
  } = useLISStore();

  // Convert store feedback to flat format expected by component
  const flatFeedback = useMemo<FeedbackItem[]>(() => {
    if (allFeedback.length === 0) return [];

    // Filter to professor's courses if professorId provided
    let filtered = allFeedback;
    if (professorId) {
      const profCourses = getProfessorCourses(professorId);
      const courseIds = profCourses.map(c => c.id);
      filtered = allFeedback.filter(f => courseIds.includes(f.courseId));
    }

    return filtered.map(f => {
      const lecture = allLectures.find(l => l.id === f.lectureId);
      const course = allCourses.find(c => c.id === f.courseId);
      const student = allStudents.find(s => s.id === f.studentId);

      // Convert understanding level to numeric rating
      const understanding = f.understandingLevel === 'fully' ? 5 
        : f.understandingLevel === 'partial' ? 3 
        : 1;

      // Detect category from comment
      let category: FeedbackItem['category'] = 'general';
      const commentText = f.comments || '';
      const commentLower = commentText.toLowerCase();
      if (commentLower.includes('pace') || commentLower.includes('fast') || commentLower.includes('slow')) {
        category = 'pace';
      } else if (commentLower.includes('example') || commentLower.includes('practice')) {
        category = 'examples';
      } else if (commentLower.includes('clear') || commentLower.includes('confus') || commentLower.includes('understand')) {
        category = 'clarity';
      }

      return {
        id: f.id,
        lecture_id: f.lectureId,
        lecture_title: lecture?.title || 'Unknown Lecture',
        course_id: f.courseId,
        course_code: course?.code || 'N/A',
        student_id: f.studentId,
        student_name: student?.name || 'Anonymous',
        student_rollno: student?.rollNumber || 'N/A',
        understanding,
        reason: commentText,
        comment: commentText,
        timestamp: f.timestamp,
        resolved: f.understandingLevel !== 'confused',
        read: true,
        reply: undefined,
        category,
      };
    });
  }, [allFeedback, allLectures, allCourses, allStudents, professorId, getProfessorCourses]);

  // Calculate stats from real data
  const stats = useMemo<FeedbackStats>(() => {
    if (flatFeedback.length === 0) {
      return {
        totalFeedback: 0,
        todayCount: 0,
        unreadCount: 0,
        unresolvedCount: 0,
        avgRating: 0,
        lowRatingCount: 0,
        categoryStats: { pace: 0, examples: 0, clarity: 0 },
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayFeedback = flatFeedback.filter(f => f.timestamp.startsWith(today));
    const unread = flatFeedback.filter(f => !f.read);
    const unresolved = flatFeedback.filter(f => !f.resolved);
    const lowRating = flatFeedback.filter(f => f.understanding <= 2);
    
    const totalUnderstanding = flatFeedback.reduce((sum, f) => sum + f.understanding, 0);
    const avgRating = flatFeedback.length > 0 
      ? Math.round((totalUnderstanding / flatFeedback.length) * 10) / 10 
      : 0;

    const categoryStats = {
      pace: flatFeedback.filter(f => f.category === 'pace').length,
      examples: flatFeedback.filter(f => f.category === 'examples').length,
      clarity: flatFeedback.filter(f => f.category === 'clarity').length,
    };

    return {
      totalFeedback: flatFeedback.length,
      todayCount: todayFeedback.length,
      unreadCount: unread.length,
      unresolvedCount: unresolved.length,
      avgRating,
      lowRatingCount: lowRating.length,
      categoryStats,
    };
  }, [flatFeedback]);

  // Apply search and filters
  const filteredFeedback = useMemo(() => {
    let result = [...flatFeedback];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(f =>
        f.lecture_title.toLowerCase().includes(query) ||
        f.course_code.toLowerCase().includes(query) ||
        f.student_name.toLowerCase().includes(query) ||
        f.comment.toLowerCase().includes(query)
      );
    }

    // Filter
    const today = new Date().toISOString().split('T')[0];
    switch (filter) {
      case 'unread':
        result = result.filter(f => !f.read);
        break;
      case 'unresolved':
        result = result.filter(f => !f.resolved);
        break;
      case 'low-rating':
        result = result.filter(f => f.understanding <= 2);
        break;
      case 'high-rating':
        result = result.filter(f => f.understanding >= 4);
        break;
      case 'today':
        result = result.filter(f => f.timestamp.startsWith(today));
        break;
      case 'pace':
        result = result.filter(f => f.category === 'pace');
        break;
      case 'examples':
        result = result.filter(f => f.category === 'examples');
        break;
      case 'clarity':
        result = result.filter(f => f.category === 'clarity');
        break;
    }

    // Sort
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case 'rating-high':
        result.sort((a, b) => b.understanding - a.understanding);
        break;
      case 'rating-low':
        result.sort((a, b) => a.understanding - b.understanding);
        break;
      case 'course':
        result.sort((a, b) => a.course_code.localeCompare(b.course_code));
        break;
    }

    return result;
  }, [flatFeedback, search, filter, sort]);

  // Pagination
  const displayedFeedback = useMemo(() => {
    return filteredFeedback.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredFeedback, page]);

  const hasMore = displayedFeedback.length < filteredFeedback.length;
  const isLoading = false;
  const filteredCount = filteredFeedback.length;

  // Load more
  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage(p => p + 1);
    }
  }, [hasMore]);

  // Selection management
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.size === displayedFeedback.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedFeedback.map(f => f.id)));
    }
  }, [displayedFeedback, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Bulk actions
  const bulkMarkRead = useCallback(() => {
    console.log('Bulk mark read:', Array.from(selectedIds));
    // Would update store here
    setSelectedIds(new Set());
  }, [selectedIds]);

  const bulkResolve = useCallback(() => {
    console.log('Bulk resolve:', Array.from(selectedIds));
    // Would update store here
    setSelectedIds(new Set());
  }, [selectedIds]);

  // Export CSV
  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Lecture', 'Course', 'Student', 'Rating', 'Comment', 'Date', 'Resolved'];
    const rows = filteredFeedback.map(f => [
      f.id,
      f.lecture_title,
      f.course_code,
      f.student_name,
      f.understanding.toString(),
      f.comment.replace(/,/g, ';'),
      f.timestamp,
      f.resolved ? 'Yes' : 'No',
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredFeedback]);

  return {
    // Data
    feedback: displayedFeedback,
    isLoading,
    hasMore,
    loadMore,
    
    // Search and filters
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort,
    
    // Stats
    stats,
    filteredCount,
    
    // Selection
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    
    // Bulk actions
    bulkMarkRead,
    bulkResolve,
    exportCSV,
  };
}