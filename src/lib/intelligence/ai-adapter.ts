/**
 * LIS v2.0 - Pluggable AI Adapter
 * Interface for integrating external AI services
 */

import type { 
  AIAdapter, 
  AIAdapterConfig, 
  FeedbackItem,
  CourseFeedbackHistory,
  TopicAnalytics,
  StudentFeedbackHistory,
  StudyTip 
} from './types';

// ================== Null AI Adapter (Default) ==================

/**
 * Default adapter that uses rule-based logic instead of AI
 * Falls back gracefully when no AI service is configured
 */
class NullAIAdapter implements AIAdapter {
  config: AIAdapterConfig = { provider: 'none' };

  isAvailable(): boolean {
    return false;
  }

  async summarizeFeedback(feedbacks: FeedbackItem[]): Promise<string> {
    const total = feedbacks.length;
    const understood = feedbacks.filter(f => f.understanding_level === 'fully_understood').length;
    const partial = feedbacks.filter(f => f.understanding_level === 'partially_understood').length;
    const notUnderstood = feedbacks.filter(f => f.understanding_level === 'not_understood').length;
    const questions = feedbacks.filter(f => f.question).length;

    return `${total} responses received. ${understood} students fully understood (${Math.round(understood/total*100)}%), ${partial} partially (${Math.round(partial/total*100)}%), ${notUnderstood} did not understand (${Math.round(notUnderstood/total*100)}%). ${questions} questions were asked.`;
  }

  async generateRecommendations(context: Record<string, unknown>): Promise<string[]> {
    const recs: string[] = [];
    const understanding = context.understanding_pct as number | undefined;
    
    if (understanding !== undefined && understanding < 70) {
      recs.push('Consider reviewing this material with additional examples');
    }
    if (understanding !== undefined && understanding < 50) {
      recs.push('Schedule a revision session for this topic');
    }
    
    return recs.length > 0 ? recs : ['Continue with current approach'];
  }

  async analyzeTopics(history: CourseFeedbackHistory): Promise<TopicAnalytics[]> {
    // Return empty - handled by rule-based logic
    return [];
  }

  async generateStudyTips(history: StudentFeedbackHistory): Promise<StudyTip[]> {
    // Return empty - handled by rule-based logic
    return [];
  }
}

// ================== OpenAI Adapter ==================

class OpenAIAdapter implements AIAdapter {
  config: AIAdapterConfig;

  constructor(config: Partial<AIAdapterConfig>) {
    this.config = {
      provider: 'openai',
      model: config.model || 'gpt-4o-mini',
      max_tokens: config.max_tokens || 500,
      temperature: config.temperature || 0.7,
      ...config,
    };
  }

  isAvailable(): boolean {
    return !!this.config.api_key;
  }

  async summarizeFeedback(feedbacks: FeedbackItem[]): Promise<string> {
    if (!this.isAvailable()) {
      return new NullAIAdapter().summarizeFeedback(feedbacks);
    }

    const prompt = this.buildFeedbackSummaryPrompt(feedbacks);
    return this.callAPI(prompt);
  }

  async generateRecommendations(context: Record<string, unknown>): Promise<string[]> {
    if (!this.isAvailable()) {
      return new NullAIAdapter().generateRecommendations(context);
    }

    const prompt = this.buildRecommendationsPrompt(context);
    const response = await this.callAPI(prompt);
    
    // Parse response into array
    return response.split('\n').filter(line => line.trim().length > 0);
  }

  async analyzeTopics(history: CourseFeedbackHistory): Promise<TopicAnalytics[]> {
    if (!this.isAvailable()) {
      return [];
    }

    // Would implement topic analysis with AI
    return [];
  }

  async generateStudyTips(history: StudentFeedbackHistory): Promise<StudyTip[]> {
    if (!this.isAvailable()) {
      return [];
    }

    // Would implement personalized tips with AI
    return [];
  }

  private buildFeedbackSummaryPrompt(feedbacks: FeedbackItem[]): string {
    const understood = feedbacks.filter(f => f.understanding_level === 'fully_understood').length;
    const partial = feedbacks.filter(f => f.understanding_level === 'partially_understood').length;
    const notUnderstood = feedbacks.filter(f => f.understanding_level === 'not_understood').length;
    const questions = feedbacks.filter(f => f.question).map(f => f.question);

    return `Summarize this lecture feedback for a professor:
- Total responses: ${feedbacks.length}
- Fully understood: ${understood}
- Partially understood: ${partial}  
- Did not understand: ${notUnderstood}
- Student questions: ${questions.slice(0, 5).join('; ')}

Provide a 2-3 sentence summary focusing on actionable insights.`;
  }

  private buildRecommendationsPrompt(context: Record<string, unknown>): string {
    return `Based on this lecture data, provide 3-5 specific recommendations:
${JSON.stringify(context, null, 2)}

Format: One recommendation per line, be specific and actionable.`;
  }

  private async callAPI(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api_key}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.max_tokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      return '';
    }
  }
}

// ================== Anthropic Adapter ==================

class AnthropicAdapter implements AIAdapter {
  config: AIAdapterConfig;

  constructor(config: Partial<AIAdapterConfig>) {
    this.config = {
      provider: 'anthropic',
      model: config.model || 'claude-3-haiku-20240307',
      max_tokens: config.max_tokens || 500,
      temperature: config.temperature || 0.7,
      ...config,
    };
  }

  isAvailable(): boolean {
    return !!this.config.api_key;
  }

  async summarizeFeedback(feedbacks: FeedbackItem[]): Promise<string> {
    if (!this.isAvailable()) {
      return new NullAIAdapter().summarizeFeedback(feedbacks);
    }
    // Would implement Anthropic API call
    return new NullAIAdapter().summarizeFeedback(feedbacks);
  }

  async generateRecommendations(context: Record<string, unknown>): Promise<string[]> {
    if (!this.isAvailable()) {
      return new NullAIAdapter().generateRecommendations(context);
    }
    return new NullAIAdapter().generateRecommendations(context);
  }

  async analyzeTopics(history: CourseFeedbackHistory): Promise<TopicAnalytics[]> {
    return [];
  }

  async generateStudyTips(history: StudentFeedbackHistory): Promise<StudyTip[]> {
    return [];
  }
}

// ================== Adapter Factory ==================

let currentAdapter: AIAdapter = new NullAIAdapter();

export function configureAI(config: AIAdapterConfig): AIAdapter {
  switch (config.provider) {
    case 'openai':
      currentAdapter = new OpenAIAdapter(config);
      break;
    case 'anthropic':
      currentAdapter = new AnthropicAdapter(config);
      break;
    case 'local':
      // Would implement local LLM adapter
      currentAdapter = new NullAIAdapter();
      break;
    default:
      currentAdapter = new NullAIAdapter();
  }
  
  return currentAdapter;
}

export function getAIAdapter(): AIAdapter {
  return currentAdapter;
}

export function isAIAvailable(): boolean {
  return currentAdapter.isAvailable();
}

// ================== Convenience Functions ==================

export async function aiSummarizeFeedback(feedbacks: FeedbackItem[]): Promise<string> {
  return currentAdapter.summarizeFeedback(feedbacks);
}

export async function aiGenerateRecommendations(
  context: Record<string, unknown>
): Promise<string[]> {
  return currentAdapter.generateRecommendations(context);
}

export async function aiAnalyzeTopics(
  history: CourseFeedbackHistory
): Promise<TopicAnalytics[]> {
  return currentAdapter.analyzeTopics(history);
}

export async function aiGenerateStudyTips(
  history: StudentFeedbackHistory
): Promise<StudyTip[]> {
  return currentAdapter.generateStudyTips(history);
}

export default {
  configureAI,
  getAIAdapter,
  isAIAvailable,
  aiSummarizeFeedback,
  aiGenerateRecommendations,
  aiAnalyzeTopics,
  aiGenerateStudyTips,
};
