import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface FeedbackStats {
  total_responses: number;
  fully_understanding: number;
  partial_understanding: number;
  need_clarity: number;
  confusion_topics: string[];
}

export const useLectureFeedback = (lectureId: string) => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lectureId) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const { data, error: err } = await supabase
          .rpc('get_lecture_feedback_stats', { lecture_id: lectureId });

        if (err) throw err;
        setStats(data?.[0] || null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch stats';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time feedback updates
    const subscription = supabase
      .channel(`feedback:${lectureId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedback', filter: `lecture_id=eq.${lectureId}` },
        () => {
          fetchStats();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [lectureId]);

  return { stats, isLoading, error };
};
