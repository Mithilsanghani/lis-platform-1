/**
 * useAINudge - OpenAI-powered AI insights hook
 * Generates smart nudges, summaries, and recommendations
 * Uses Edge Functions for server-side AI processing
 */

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface AIInsight {
  id: string;
  type: 'nudge' | 'summary' | 'recommendation' | 'alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action?: {
    label: string;
    handler: string;
    data?: Record<string, any>;
  };
  createdAt: Date;
  read: boolean;
}

interface SilentStudentAnalysis {
  studentId: string;
  studentName: string;
  lastActivity: Date;
  daysSilent: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestedAction: string;
}

interface CourseHealthReport {
  courseId: string;
  courseCode: string;
  overallHealth: number;
  engagementTrend: 'up' | 'stable' | 'down';
  keyIssues: string[];
  recommendations: string[];
}

interface AIAnalysisResult {
  silentStudents: SilentStudentAnalysis[];
  courseHealth: CourseHealthReport[];
  topInsights: string[];
  generatedAt: Date;
}

// Mock AI responses for development
const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'alert',
    title: '18 Silent Students Detected',
    message:
      'CS201 has 18 students who haven\'t participated in 3+ lectures. Consider sending engagement nudges.',
    priority: 'high',
    action: {
      label: 'Send Nudge SMS',
      handler: 'send-nudge-sms',
      data: { courseId: 'CS201', count: 18 },
    },
    createdAt: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Optimal Lecture Time',
    message:
      'Based on engagement patterns, 10:00 AM slots show 23% higher participation than afternoon lectures.',
    priority: 'medium',
    createdAt: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: '3',
    type: 'summary',
    title: 'Weekly Performance',
    message:
      'This week: 89% avg attendance, 42 feedback submissions, 3 new insights generated.',
    priority: 'low',
    createdAt: new Date(Date.now() - 86400000),
    read: true,
  },
];

const mockAnalysis: AIAnalysisResult = {
  silentStudents: [
    {
      studentId: 's1',
      studentName: 'Rahul Sharma',
      lastActivity: new Date(Date.now() - 604800000),
      daysSilent: 7,
      riskLevel: 'high',
      suggestedAction: 'Personal outreach recommended',
    },
    {
      studentId: 's2',
      studentName: 'Priya Patel',
      lastActivity: new Date(Date.now() - 432000000),
      daysSilent: 5,
      riskLevel: 'medium',
      suggestedAction: 'Include in group activity',
    },
  ],
  courseHealth: [
    {
      courseId: 'CS201',
      courseCode: 'CS201',
      overallHealth: 78,
      engagementTrend: 'stable',
      keyIssues: ['Low participation in Q&A', 'Feedback frequency declining'],
      recommendations: [
        'Add mid-lecture polls',
        'Implement peer discussion breaks',
      ],
    },
  ],
  topInsights: [
    'Students respond 40% more to visual content',
    'Questions peak during first 15 minutes',
    'Group activities boost engagement by 2.3x',
  ],
  generatedAt: new Date(),
};

export function useAINudge() {
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate AI analysis via Edge Function
  const generateAnalysis = useCallback(async (courseId?: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Call Supabase Edge Function for AI analysis
      const { data, error: fnError } = await supabase.functions.invoke(
        'ai-analysis',
        {
          body: {
            action: 'full-analysis',
            courseId,
          },
        }
      );

      if (fnError) throw fnError;

      setAnalysis(data || mockAnalysis);
      return data;
    } catch (err) {
      console.warn('Using mock AI analysis:', err);
      // Fall back to mock data
      setAnalysis(mockAnalysis);
      return mockAnalysis;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Get nudge suggestions for silent students
  const getNudgeSuggestions = useCallback(
    async (studentIds: string[]): Promise<string[]> => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          'ai-analysis',
          {
            body: {
              action: 'nudge-suggestions',
              studentIds,
            },
          }
        );

        if (fnError) throw fnError;

        return (
          data?.suggestions || [
            'Hey! We noticed you\'ve been quiet lately. Your insights are valuable - join us in the next session!',
            'Quick check-in: Is everything okay? We\'d love to hear your thoughts in class.',
            'The class misses your participation! Got any questions we can help with?',
          ]
        );
      } catch (err) {
        console.warn('Using default nudge suggestions:', err);
        return [
          'Hey! We noticed you\'ve been quiet lately. Your insights are valuable - join us in the next session!',
          'Quick check-in: Is everything okay? We\'d love to hear your thoughts in class.',
          'The class misses your participation! Got any questions we can help with?',
        ];
      }
    },
    []
  );

  // Summarize lecture feedback
  const summarizeFeedback = useCallback(
    async (
      lectureId: string
    ): Promise<{
      summary: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      keyPoints: string[];
    }> => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          'ai-analysis',
          {
            body: {
              action: 'summarize-feedback',
              lectureId,
            },
          }
        );

        if (fnError) throw fnError;

        return (
          data || {
            summary:
              'Overall positive reception with students appreciating practical examples. Some confusion noted around advanced concepts.',
            sentiment: 'positive',
            keyPoints: [
              'Practical examples well received',
              'Request for more code demos',
              'Pace was appropriate for most',
            ],
          }
        );
      } catch (err) {
        console.warn('Using mock feedback summary:', err);
        return {
          summary:
            'Overall positive reception with students appreciating practical examples. Some confusion noted around advanced concepts.',
          sentiment: 'positive',
          keyPoints: [
            'Practical examples well received',
            'Request for more code demos',
            'Pace was appropriate for most',
          ],
        };
      }
    },
    []
  );

  // Mark insight as read
  const markAsRead = useCallback((insightId: string) => {
    setInsights((prev) =>
      prev.map((i) => (i.id === insightId ? { ...i, read: true } : i))
    );
  }, []);

  // Dismiss insight
  const dismissInsight = useCallback((insightId: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== insightId));
  }, []);

  // Execute insight action
  const executeAction = useCallback(
    async (insight: AIInsight) => {
      if (!insight.action) return;

      markAsRead(insight.id);

      switch (insight.action.handler) {
        case 'send-nudge-sms':
          // Would integrate with SMS service
          console.log('Sending nudge SMS:', insight.action.data);
          break;
        case 'generate-report':
          await generateAnalysis(insight.action.data?.courseId);
          break;
        default:
          console.log('Executing action:', insight.action);
      }
    },
    [markAsRead, generateAnalysis]
  );

  return {
    insights,
    analysis,
    isAnalyzing,
    error,
    unreadCount: insights.filter((i) => !i.read).length,
    generateAnalysis,
    getNudgeSuggestions,
    summarizeFeedback,
    markAsRead,
    dismissInsight,
    executeAction,
  };
}

export default useAINudge;
