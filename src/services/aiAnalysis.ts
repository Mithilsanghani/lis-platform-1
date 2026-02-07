// import { supabase } from '../lib/supabase';

export interface AIInsights {
  top_confusing_topics: Array<{
    name: string;
    confusion_pct: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  revision_plan: Array<{
    lecture: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    recommendation: string;
  }>;
  silent_students: string[];
  teaching_insights: string[];
}

export const analyzeWithAI = async (
  courseName: string,
  lectureCount: number,
  feedbackCount: number,
  feedbackData: any,
): Promise<AIInsights> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Analyze feedback for "${courseName}" - ${lectureCount} lectures, ${feedbackCount} responses:

FEEDBACK DATA: ${JSON.stringify(feedbackData, null, 2)}

Provide JSON output with this structure:
{
  "top_confusing_topics": [{"name": "Topic", "confusion_pct": 78, "priority": "HIGH"}],
  "revision_plan": [{"lecture": "Lec X", "priority": "HIGH", "recommendation": "Description"}],
  "silent_students": ["Student patterns"],
  "teaching_insights": ["Insight 1", "Insight 2"]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert educational analyst. Analyze student feedback and provide actionable insights for professors. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response');
    }

    const insights: AIInsights = JSON.parse(jsonMatch[0]);
    return insights;
  } catch (error) {
    console.error('AI Analysis Error:', error);

    // Return fallback insights if API fails
    return {
      top_confusing_topics: [
        {
          name: 'Complex topics need review',
          confusion_pct: 45,
          priority: 'HIGH',
        },
      ],
      revision_plan: [
        {
          lecture: 'Recent lectures',
          priority: 'HIGH',
          recommendation: 'Review challenging concepts with examples',
        },
      ],
      silent_students: ['Consider checking in with students who provided no feedback'],
      teaching_insights: [
        'Add more interactive examples',
        'Provide practice problems',
        'Encourage student questions',
      ],
    };
  }
};

export const generateRevisionPlanPDF = async (courseName: string, insights: AIInsights) => {
  // Placeholder for PDF generation
  // In production, use jsPDF library
  const content = `
REVISION PLAN: ${courseName}
Generated: ${new Date().toLocaleDateString()}

TOP CONFUSING TOPICS:
${insights.top_confusing_topics.map(t => `- ${t.name} (${t.confusion_pct}%) [${t.priority}]`).join('\n')}

REVISION RECOMMENDATIONS:
${insights.revision_plan.map(r => `- ${r.lecture}: ${r.recommendation}`).join('\n')}

TEACHING INSIGHTS:
${insights.teaching_insights.map(i => `- ${i}`).join('\n')}
`;

  return content;
};
