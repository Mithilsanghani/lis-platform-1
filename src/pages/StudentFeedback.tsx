import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lecture } from '../store/useStore';
import { ArrowLeft, Loader } from 'lucide-react';
import JSConfetti from 'js-confetti';

const FEEDBACK_REASONS = [
  'Pace too fast',
  'Unclear explanation',
  'Not enough examples',
  'Need more time to process',
  'Other',
];

export default function StudentFeedback() {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [understanding, setUnderstanding] = useState<'fully' | 'partial' | 'need_clarity' | null>(null);
  const [difficultTopics, setDifficultTopics] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState<string | null>(null);

  // Generate anonymous student ID on mount
  const [studentId] = useState(() => {
    const stored = sessionStorage.getItem('lis_student_id');
    if (stored) return stored;
    const newId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('lis_student_id', newId);
    return newId;
  });

  // Fetch lecture and setup realtime counter
  useEffect(() => {
    if (!lectureId) return;
    fetchLecture();
    setupRealtimeCounter();
  }, [lectureId]);

  // Countdown effect
  useEffect(() => {
    if (!isSubmitting || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isSubmitting]);

  const fetchLecture = async () => {
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('lectures')
        .select('*')
        .eq('id', lectureId)
        .single();

      if (err) throw err;
      setLecture(data);
      
      // Get initial feedback count
      const { count } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .eq('lecture_id', lectureId);
      
      setTotalFeedback(count || 0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load lecture';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeCounter = () => {
    if (!lectureId) return;

    const channel = supabase
      .channel(`feedback:${lectureId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback',
          filter: `lecture_id=eq.${lectureId}`,
        },
        () => {
          setTotalFeedback(prev => prev + 1);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const handleTopicToggle = (topic: string) => {
    setDifficultTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic],
    );
  };

  const handleSubmit = async () => {
    if (!understanding || !lectureId) return;

    setIsSubmitting(true);
    setCountdown(3);

    try {
      // Wait for countdown
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Submit feedback
      const { error: err } = await supabase.from('feedback').insert([
        {
          lecture_id: lectureId,
          student_id: studentId,
          understanding_level: understanding,
          difficult_topics: difficultTopics.length > 0 ? difficultTopics : null,
          reason: reason || null,
        },
      ]);

      if (err) throw err;

      // FULL SCREEN CONFETTI
      const jsConfetti = new JSConfetti();
      await jsConfetti.addConfetti({
        confettiRadius: 8,
        confettiNumber: 100,
        confettiColors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      });

      setShowConfetti(true);

      // Redirect after celebration
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit feedback';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading lecture...</p>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-6">Lecture not found</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex-1 text-center px-4">
            <h1 className="text-lg font-bold text-gray-900 truncate">{lecture.title}</h1>
            <p className="text-xs text-gray-500 mt-1">
              {lecture.topics?.length || 0} topics • Lecture feedback
            </p>
          </div>
          {/* LIVE COUNTER CIRCLE */}
          <div className="w-20 h-20 bg-white/80 rounded-3xl shadow-lg flex flex-col items-center justify-center backdrop-blur-sm border-2 border-emerald-200">
            <div className="text-xl font-black text-emerald-600">{totalFeedback}</div>
            <div className="text-xs font-semibold text-gray-600">submitted</div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-32">
        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        {/* THANK YOU MESSAGE (post-submit) */}
        {showConfetti && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-300 text-center animate-pulse">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent mb-2">
              Thank You!
            </p>
            <p className="text-sm text-gray-600">
              Your feedback helps improve teaching. Professor sees this live! ✨
            </p>
          </div>
        )}

        {/* STEP 1: UNDERSTANDING LEVEL - 3 BIG EMOJI BUTTONS */}
        <section className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-6 text-center">
            How well did you understand?
          </h2>

          <div className="space-y-4">
            {/* FULLY UNDERSTOOD - GREEN */}
            <button
              type="button"
              onClick={() => setUnderstanding('fully')}
              disabled={isSubmitting}
              className={`w-full h-24 rounded-2xl shadow-lg flex flex-col items-center justify-center text-5xl font-black active:scale-95 transition-all font-bold border-2 ${
                understanding === 'fully'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xl scale-100'
                  : 'bg-white text-emerald-600 border-emerald-200 hover:border-emerald-400'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-6xl">✅</span>
              <span className="text-xs font-semibold mt-1">Fully Understood</span>
            </button>

            {/* PARTIALLY UNDERSTOOD - YELLOW */}
            <button
              type="button"
              onClick={() => setUnderstanding('partial')}
              disabled={isSubmitting}
              className={`w-full h-24 rounded-2xl shadow-lg flex flex-col items-center justify-center text-5xl font-black active:scale-95 transition-all font-bold border-2 ${
                understanding === 'partial'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xl scale-100'
                  : 'bg-white text-amber-600 border-amber-200 hover:border-amber-400'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-6xl">⚠️</span>
              <span className="text-xs font-semibold mt-1">Partially Understood</span>
            </button>

            {/* NEED CLARITY - RED */}
            <button
              type="button"
              onClick={() => setUnderstanding('need_clarity')}
              disabled={isSubmitting}
              className={`w-full h-24 rounded-2xl shadow-lg flex flex-col items-center justify-center text-5xl font-black active:scale-95 transition-all font-bold border-2 ${
                understanding === 'need_clarity'
                  ? 'bg-rose-500 text-white border-rose-600 shadow-2xl scale-100'
                  : 'bg-white text-rose-600 border-rose-200 hover:border-rose-400'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-6xl">❌</span>
              <span className="text-xs font-semibold mt-1">Need More Clarity</span>
            </button>
          </div>
        </section>

        {/* STEP 2: DIFFICULT TOPICS (Show if ⚠️ or ❌ selected) */}
        {(understanding === 'partial' || understanding === 'need_clarity') && lecture.topics && (
          <section className="mb-8 animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Which topics were difficult?</h2>
            <div className="space-y-3">
              {lecture.topics.map((topic, idx) => {
                const topicString = Array.isArray(topic) ? topic[0] : topic;
                return (
                  <label
                    key={idx}
                    className="flex items-center p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={difficultTopics.includes(topicString)}
                      onChange={() => handleTopicToggle(topicString)}
                      className="h-6 w-6 text-blue-500 rounded cursor-pointer accent-blue-500"
                    />
                    <span className="ml-4 font-semibold text-gray-800">{topicString}</span>
                  </label>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 3: REASON */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Why? (optional)</h2>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-800"
          >
            <option value="">Select a reason...</option>
            {FEEDBACK_REASONS.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </section>

        {/* SUBMIT BUTTON - BIG & BOLD */}
        <div className="mb-4">
          {isSubmitting ? (
            <button
              type="button"
              disabled
              className="w-full h-20 rounded-2xl shadow-2xl flex items-center justify-center text-4xl font-black text-white bg-gradient-to-r from-blue-500 to-emerald-500 animate-pulse border-4 border-blue-600"
            >
              {countdown > 0 ? (
                <span className="text-5xl font-black">{countdown}</span>
              ) : (
                <Loader className="h-10 w-10 animate-spin" />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!understanding || isSubmitting}
              className={`w-full h-20 rounded-2xl shadow-2xl flex items-center justify-center text-2xl font-black transition-all border-4 ${
                understanding && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-blue-600 hover:shadow-xl active:scale-95'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
              }`}
            >
              ✨ SUBMIT FEEDBACK ✨
            </button>
          )}
        </div>

        {/* HELPER TEXT */}
        <p className="text-center text-sm text-gray-600 font-medium">
          🎓 You're helping improve teaching! Professor sees this live.
        </p>
      </main>

      {/* MOBILE BOTTOM SAFE AREA */}
      <div className="h-8" />
    </div>
  );
}
