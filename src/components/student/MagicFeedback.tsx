import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function MagicFeedback() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [step, setStep] = useState<'loading' | 'feedback' | 'submitted'>('loading');
  const [lectureData, setLectureData] = useState<any>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    const loadLecture = async () => {
      if (!lectureId) return;
      
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('id', lectureId)
        .single();

      if (error) {
        console.error('Lecture load error:', error);
        setStep('feedback');
        return;
      }

      setLectureData(data);
      setStep('feedback');
    };

    loadLecture();
  }, [lectureId]);

  const handleSubmitFeedback = async () => {
    if (!selectedFeedback || !lectureId) return;

    setStep('submitted');

    try {
      const studentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await supabase.from('feedback').insert({
        lecture_id: lectureId,
        student_id: studentId,
        understanding: selectedFeedback,
        difficult_topics: selectedTopics.length > 0 ? selectedTopics : null,
        reason: null,
      });

      // Celebration
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setStep('feedback');
    }
  };

  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (step === 'submitted') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-50"
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You! 🎉</h1>
          <p className="text-gray-600">Your feedback helps improve teaching</p>
          <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-32">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {lectureData?.title || 'Lecture Feedback'}
          </h1>
          <p className="text-sm text-gray-600">Help us understand your learning</p>
        </div>
      </motion.div>

      {/* Main Feedback UI */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            How well did you understand?
          </h2>

          {/* Emoji Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { id: 'fully', emoji: '✅', label: 'Fully Understood', color: 'emerald' },
              { id: 'partial', emoji: '⚠️', label: 'Partially', color: 'amber' },
              { id: 'none', emoji: '❌', label: 'Need Clarity', color: 'rose' },
            ].map(({ id, emoji, label, color }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFeedback(id)}
                className={`h-24 rounded-2xl flex flex-col items-center justify-center font-bold text-2xl transition-all shadow-md ${
                  selectedFeedback === id
                    ? `bg-${color}-500 text-white shadow-lg scale-105`
                    : `bg-${color}-50 text-${color}-700 border-2 border-${color}-200 hover:bg-${color}-100`
                }`}
              >
                <span className="text-4xl mb-1">{emoji}</span>
                <span className="text-xs">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Topic Selector (if needed) */}
          {(selectedFeedback === 'partial' || selectedFeedback === 'none') && lectureData?.topics && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200"
            >
              <p className="text-sm font-semibold text-amber-900 mb-3">
                Which topics confused you?
              </p>
              <div className="flex flex-wrap gap-2">
                {lectureData.topics?.map((topic: string, idx: number) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setSelectedTopics(
                        selectedTopics.includes(topic)
                          ? selectedTopics.filter((t) => t !== topic)
                          : [...selectedTopics, topic]
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedTopics.includes(topic)
                        ? 'bg-amber-500 text-white'
                        : 'bg-white border border-amber-300 text-amber-700'
                    }`}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitFeedback}
            disabled={!selectedFeedback}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition ${
              selectedFeedback
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Submit Feedback ✨
          </motion.button>

          <p className="text-xs text-gray-500 text-center mt-4">
            No personal data collected. Anonymous feedback only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
