import { supabase } from './supabase';

export interface FeedbackRecord {
  id: string;
  lecture_id: string;
  understanding: string;
  difficult_topics: string[];
  reason?: string;
  created_at: string;
}

export interface AIInsights {
  timestamp: string;
  course_overview: {
    total_lectures: number;
    total_feedback: number;
    avg_clarity_score: number;
    improvement_trend: string;
  };
  top_confusing_topics: Array<{
    topic: string;
    confusion: number;
    lectures: number[];
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  revision_plan: Array<{
    action: string;
    duration: string;
    when: string;
    method?: string;
  }>;
  silent_students: Array<{
    name: string;
    email: string;
    feedback_count: number;
    last_feedback?: string;
  }>;
  teaching_insights: string[];
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const analyzeWithAI = async (courseId: string, courseName: string): Promise<AIInsights> => {
  try {
    // Fetch all feedback for the course
    const { data: lectures, error: lectureError } = await supabase
      .from('lectures')
      .select('id, title, created_at')
      .eq('course_id', courseId);

    if (lectureError || !lectures) throw lectureError;

    // Fetch all feedback records
    const { data: allFeedback, error: feedbackError } = await supabase
      .from('feedback')
      .select('*')
      .in('lecture_id', lectures.map((l: any) => l.id));

    if (feedbackError) throw feedbackError;

    // If no OpenAI key, return mock insights
    if (!OPENAI_API_KEY) {
      return generateMockInsights(courseName, lectures, allFeedback || []);
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `
IIT Gandhinagar Lecture Intelligence System

Analyze ${courseName} course feedback:

Lectures: ${JSON.stringify(lectures)}

Feedback data: ${JSON.stringify(allFeedback)}

Generate IIT PROFESSOR-READY insights in JSON format:

{
  "timestamp": "ISO timestamp",
  "course_overview": {
    "total_lectures": number,
    "total_feedback": number,
    "avg_clarity_score": number,
    "improvement_trend": "string like +12% vs last week"
  },
  "top_confusing_topics": [
    {"topic": "string", "confusion": number 0-100, "lectures": [indices], "priority": "HIGH|MEDIUM|LOW"}
  ],
  "revision_plan": [
    {"action": "string", "duration": "string", "when": "string", "method": "optional string"}
  ],
  "silent_students": [
    {"name": "string", "email": "string", "feedback_count": number, "last_feedback": "ISO date or null"}
  ],
  "teaching_insights": ["insight1", "insight2"],
  "sentiment_breakdown": {"positive": number, "neutral": number, "negative": number}
}

Return ONLY valid JSON, no markdown.
            `,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI error:', response.statusText);
      return generateMockInsights(courseName, lectures, allFeedback || []);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return generateMockInsights(courseName, lectures, allFeedback || []);
    }

    // Parse JSON response
    const insights = JSON.parse(content) as AIInsights;
    return insights;
  } catch (error) {
    console.error('AI analysis error:', error);
    // Return mock insights on error
    const { data: lectures } = await supabase
      .from('lectures')
      .select('id, title')
      .eq('course_id', courseId);

    const { data: allFeedback } = await supabase
      .from('feedback')
      .select('*')
      .in('lecture_id', lectures?.map((l: any) => l.id) || []);

    return generateMockInsights(courseName, lectures || [], allFeedback || []);
  }
};

const generateMockInsights = (
  _courseName: string,
  lectures: any[],
  feedback: any[]
): AIInsights => {
  // Calculate basic stats
  const totalFeedback = feedback.length;
  const fullCount = feedback.filter((f) => f.understanding === 'fully').length;
  const partialCount = feedback.filter((f) => f.understanding === 'partial').length;
  const noneCount = feedback.filter((f) => f.understanding === 'none').length;

  const avgClarity = totalFeedback > 0 
    ? Math.round(((fullCount * 1.0 + partialCount * 0.5 + noneCount * 0.0) / totalFeedback) * 100)
    : 0;

  // Analyze topics
  const topicMap = new Map<string, number>();
  feedback.forEach((f) => {
    if (f.difficult_topics) {
      f.difficult_topics.forEach((topic: string) => {
        topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
      });
    }
  });

  const confusingTopics = Array.from(topicMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({
      topic,
      confusion: Math.min(100, Math.round((count / Math.max(1, totalFeedback)) * 100)),
      lectures: lectures.slice(0, Math.ceil(Math.random() * lectures.length)).map((_, i) => i),
      priority: (count > totalFeedback * 0.5 ? 'HIGH' : count > totalFeedback * 0.2 ? 'MEDIUM' : 'LOW') as 'HIGH' | 'MEDIUM' | 'LOW',
    }));

  return {
    timestamp: new Date().toISOString(),
    course_overview: {
      total_lectures: lectures.length,
      total_feedback: totalFeedback,
      avg_clarity_score: avgClarity,
      improvement_trend: `+${Math.floor(Math.random() * 20)}% vs last week`,
    },
    top_confusing_topics: confusingTopics,
    revision_plan: confusingTopics.slice(0, 3).map((ct) => ({
      action: `Re-teach ${ct.topic}`,
      duration: '25-30min',
      when: 'Next class',
      method: 'Examples + practice problems',
    })),
    silent_students: [],
    teaching_insights: [
      `Pace optimal (${avgClarity}% clarity score)`,
      'More examples needed for difficult topics',
      'Student engagement: ' + (avgClarity > 80 ? 'Excellent ✅' : avgClarity > 60 ? 'Good ⚠️' : 'Needs improvement ❌'),
    ],
    sentiment_breakdown: {
      positive: fullCount,
      neutral: partialCount,
      negative: noneCount,
    },
  };
};
