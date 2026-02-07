/**
 * useAIInsights Hook - LIS v11.0
 * Data-driven AI Insights - NO MOCK DATA
 * Insights are ONLY generated from actual data in stores
 */

import { useState, useMemo, useCallback } from 'react';
import { useLISStore } from '../store/useLISStore';

export interface AIInsight {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  priority: number;
  title: string;
  description: string;
  course_code?: string;
  course_name?: string;
  metric_value?: number;
  metric_label?: string;
  actions: AIAction[];
  timestamp: string;
  dismissed: boolean;
  category: 'understanding' | 'engagement' | 'silent' | 'feedback' | 'performance' | 'trend';
}

export interface AIAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary';
  icon?: string;
  completed?: boolean;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
}

export interface AITrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
  prediction: string;
}

interface UseAIInsightsProps {
  professorId?: string;
}

export function useAIInsights({ professorId }: UseAIInsightsProps = {}) {
  // Get data from stores - use LIS store for consistent Course type
  const lisCourses = useLISStore(state => state.courses);
  const lisFeedback = useLISStore(state => state.feedback);
  const getSilentStudents = useLISStore(state => state.getSilentStudents);
  const getAtRiskStudents = useLISStore(state => state.getAtRiskStudents);
  const getCourseEngagement = useLISStore(state => state.getCourseEngagement);

  // State for dismissed insights
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'success' | 'info'>('all');
  const [showDismissed, setShowDismissed] = useState(false);

  // Generate insights from actual store data
  const insights = useMemo((): AIInsight[] => {
    if (!professorId) return [];

    const generatedInsights: AIInsight[] = [];
    let priority = 1;

    // Get professor's courses from LIS store (consistent Course type)
    const professorCourses = lisCourses.filter(c => c.professorId === professorId);
    const professorCourseIds = professorCourses.map(c => c.id);
    
    // Get silent students from LIS store
    const silentStudents = getSilentStudents(professorId);
    
    // Get at-risk students from LIS store
    const atRiskStudents = getAtRiskStudents(professorId);
    
    // Get pending feedback for professor's courses
    const courseFeedback = lisFeedback.filter(f => 
      professorCourseIds.includes(f.courseId)
    );

    // Generate insight for silent students if there are any
    if (silentStudents.length > 0) {
      generatedInsights.push({
        id: `insight-silent-${Date.now()}`,
        type: 'critical',
        priority: priority++,
        title: `${silentStudents.length} Silent Student${silentStudents.length > 1 ? 's' : ''} Detected`,
        description: `No participation from ${silentStudents.length} student${silentStudents.length > 1 ? 's' : ''} in the last 7 days. Consider sending a nudge or scheduling office hours.`,
        metric_value: silentStudents.length,
        metric_label: 'Silent Students',
        actions: [
          { id: 'nudge', label: 'Send Nudge', type: 'primary', icon: 'send' },
          { id: 'view', label: 'View Students', type: 'secondary', icon: 'users' },
        ],
        timestamp: new Date().toISOString(),
        dismissed: dismissedIds.has(`insight-silent-${Date.now()}`),
        category: 'silent',
      });
    }

    // Generate insight for at-risk students
    if (atRiskStudents.length > 0) {
      generatedInsights.push({
        id: `insight-atrisk-${Date.now()}`,
        type: 'warning',
        priority: priority++,
        title: `${atRiskStudents.length} At-Risk Student${atRiskStudents.length > 1 ? 's' : ''}`,
        description: `${atRiskStudents.length} student${atRiskStudents.length > 1 ? 's have' : ' has'} low engagement. They may need additional support.`,
        metric_value: atRiskStudents.length,
        metric_label: 'At-Risk',
        actions: [
          { id: 'contact', label: 'Schedule Meeting', type: 'primary', icon: 'calendar' },
          { id: 'review', label: 'Review Performance', type: 'secondary', icon: 'chart' },
        ],
        timestamp: new Date().toISOString(),
        dismissed: dismissedIds.has(`insight-atrisk-${Date.now()}`),
        category: 'performance',
      });
    }

    // Generate insight for pending feedback
    if (courseFeedback.length > 0) {
      generatedInsights.push({
        id: `insight-feedback-${Date.now()}`,
        type: 'info',
        priority: priority++,
        title: `${courseFeedback.length} Feedback Item${courseFeedback.length > 1 ? 's' : ''}`,
        description: `You have ${courseFeedback.length} student feedback submission${courseFeedback.length > 1 ? 's' : ''} to review.`,
        metric_value: courseFeedback.length,
        metric_label: 'Feedback',
        actions: [
          { id: 'review', label: 'Review Feedback', type: 'primary', icon: 'message' },
        ],
        timestamp: new Date().toISOString(),
        dismissed: dismissedIds.has(`insight-feedback-${Date.now()}`),
        category: 'feedback',
      });
    }

    // Generate course-specific insights
    professorCourses.forEach(course => {
      const engagement = getCourseEngagement(course.id);
      if (engagement > 0) {
        if (engagement >= 80) {
          generatedInsights.push({
            id: `insight-course-success-${course.id}`,
            type: 'success',
            priority: priority++,
            title: `${course.code || course.name} - High Engagement`,
            description: `Great job! This course has ${engagement}% engagement rate.`,
            course_code: course.code,
            course_name: course.name,
            metric_value: engagement,
            metric_label: 'Engagement',
            actions: [
              { id: 'view', label: 'View Details', type: 'primary', icon: 'eye' },
            ],
            timestamp: new Date().toISOString(),
            dismissed: dismissedIds.has(`insight-course-success-${course.id}`),
            category: 'engagement',
          });
        } else if (engagement < 50) {
          generatedInsights.push({
            id: `insight-course-warning-${course.id}`,
            type: 'warning',
            priority: priority++,
            title: `${course.code || course.name} - Low Engagement`,
            description: `This course has only ${engagement}% engagement. Consider reviewing content.`,
            course_code: course.code,
            course_name: course.name,
            metric_value: engagement,
            metric_label: 'Engagement',
            actions: [
              { id: 'review', label: 'Review Content', type: 'primary', icon: 'book' },
              { id: 'contact', label: 'Contact Students', type: 'secondary', icon: 'mail' },
            ],
            timestamp: new Date().toISOString(),
            dismissed: dismissedIds.has(`insight-course-warning-${course.id}`),
            category: 'engagement',
          });
        }
      }
    });

    // Apply action completion state
    return generatedInsights.map(insight => ({
      ...insight,
      dismissed: dismissedIds.has(insight.id),
      actions: insight.actions.map(action => ({
        ...action,
        completed: completedActions.has(`${insight.id}-${action.id}`),
      })),
    }));
  }, [professorId, lisCourses, lisFeedback, getSilentStudents, getAtRiskStudents, getCourseEngagement, dismissedIds, completedActions]);

  // Generate suggestions based on data availability
  const suggestions = useMemo((): AISuggestion[] => {
    if (!professorId) return [];

    const professorCourses = lisCourses.filter(c => c.professorId === professorId);
    const silentStudents = getSilentStudents(professorId);

    const suggestionsList: AISuggestion[] = [];

    if (professorCourses.length === 0) {
      suggestionsList.push({
        id: 'sug-start',
        title: 'Create Your First Course',
        description: 'Get started by creating a course and enrolling students.',
        impact: 'high',
        effort: 'low',
        category: 'Getting Started',
      });
      return suggestionsList;
    }

    if (silentStudents.length > 0) {
      suggestionsList.push({
        id: 'sug-office-hours',
        title: 'Schedule Office Hours',
        description: `You have ${silentStudents.length} silent students. One-on-one sessions can help re-engage them.`,
        impact: 'high',
        effort: 'low',
        category: 'Engagement',
      });
    }

    return suggestionsList;
  }, [professorId, lisCourses, getSilentStudents]);

  // Generate trends (empty when no historical data)
  const trends = useMemo((): AITrend[] => {
    if (!professorId) return [];

    const professorCourses = lisCourses.filter(c => c.professorId === professorId);

    if (professorCourses.length === 0) return [];

    const avgEngagement = professorCourses.length > 0
      ? Math.round(professorCourses.reduce((sum, c) => sum + getCourseEngagement(c.id), 0) / professorCourses.length)
      : 0;

    if (avgEngagement > 0) {
      return [{
        metric: 'Engagement',
        current: avgEngagement,
        previous: 0,
        change: 0,
        direction: 'stable',
        prediction: 'More data needed for predictions',
      }];
    }

    return [];
  }, [professorId, lisCourses, getCourseEngagement]);

  // Filter insights
  const filteredInsights = useMemo(() => {
    let result = insights;
    
    if (!showDismissed) {
      result = result.filter(i => !i.dismissed);
    }
    
    if (filter !== 'all') {
      result = result.filter(i => i.type === filter);
    }
    
    return result.sort((a, b) => a.priority - b.priority);
  }, [insights, filter, showDismissed]);

  // Stats computed from actual data
  const stats = useMemo(() => ({
    criticalCount: insights.filter(i => i.type === 'critical' && !i.dismissed).length,
    warningCount: insights.filter(i => i.type === 'warning' && !i.dismissed).length,
    successCount: insights.filter(i => i.type === 'success' && !i.dismissed).length,
    totalActions: insights.reduce((sum, i) => sum + i.actions.length, 0),
    completedActions: insights.reduce((sum, i) => sum + i.actions.filter(a => a.completed).length, 0),
  }), [insights]);

  // Check if there's enough data for AI insights
  const hasEnoughData = useMemo(() => {
    const professorCourses = lisCourses.filter(c => c.professorId === professorId);
    return professorCourses.length > 0;
  }, [professorId, lisCourses]);

  // Actions
  const dismissInsight = useCallback((id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  }, []);

  const completeAction = useCallback((insightId: string, actionId: string) => {
    setCompletedActions(prev => new Set([...prev, `${insightId}-${actionId}`]));
  }, []);

  const refreshInsights = useCallback(() => {
    setDismissedIds(new Set());
    setCompletedActions(new Set());
  }, []);

  return {
    insights: filteredInsights,
    allInsights: insights,
    filter,
    setFilter,
    showDismissed,
    setShowDismissed,
    stats,
    suggestions,
    trends,
    dismissInsight,
    completeAction,
    refreshInsights,
    hasEnoughData,
  };
}
