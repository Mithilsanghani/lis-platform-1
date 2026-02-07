/**
 * LectureCardPro v10.0 - Production Lecture Card with Checkbox & Hover Actions
 * Features: Understanding bar, feedback badges, QR button, hover menu, functional modals
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  QrCode,
  MoreVertical,
  Check,
  Tag,
  Share2,
  BookOpen,
  Radio,
  Play,
  Bell,
  X,
  Save,
  Plus,
  Copy,
  Download,
  Link,
  CheckCircle,
  Activity,
} from 'lucide-react';
import type { Lecture } from '../../hooks/useInfiniteLectures';

// Edit Lecture Modal
function EditLectureModal({ lecture, onClose, onSave }: { lecture: Lecture; onClose: () => void; onSave: (data: any) => void }) {
  const [title, setTitle] = useState(lecture.title);
  const [date, setDate] = useState(lecture.date);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState((lecture.duration_minutes ?? lecture.duration ?? 60).toString());
  
  const handleSave = () => {
    onSave({ title, date, time, duration_minutes: parseInt(duration) });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Lecture</h3>
              <p className="text-sm text-zinc-400">Update lecture details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Lecture Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="Enter lecture title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Time</label>
              <input type="text" value={time} onChange={e => setTime(e.target.value)} className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="10:00 AM" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Duration (minutes)</label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="60" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-zinc-800 bg-zinc-900/50">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition-all">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Log Topics Modal
function LogTopicsModal({ lecture, onClose, onSave }: { lecture: Lecture; onClose: () => void; onSave: (topics: string[]) => void }) {
  const [topics, setTopics] = useState<string[]>(lecture.topics || []);
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const suggestedTopics = ['Arrays', 'Linked Lists', 'Recursion', 'Dynamic Programming', 'Trees', 'Graphs', 'Sorting', 'Searching', 'Hashing', 'Stack', 'Queue', 'OOP Concepts'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Log Topics</h3>
              <p className="text-sm text-zinc-400">Add topics covered in this lecture</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Add Topic</label>
            <div className="flex gap-2">
              <input type="text" value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTopic()} className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all" placeholder="Type a topic..." />
              <button onClick={addTopic} className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {topics.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Current Topics ({topics.length})</label>
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 min-h-[80px]">
                {topics.map((topic, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {topic}
                    <button onClick={() => removeTopic(topic)} className="hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Suggested Topics</label>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.filter(t => !topics.includes(t)).slice(0, 6).map((topic, i) => (
                <button key={i} onClick={() => setTopics([...topics, topic])} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-all">
                  + {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-zinc-800 bg-zinc-900/50">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">Cancel</button>
          <button onClick={() => { onSave(topics); onClose(); }} className="px-5 py-2.5 rounded-xl font-medium bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 transition-all">
            <Save className="w-4 h-4" />
            Save Topics
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LECTURE DETAIL DRAWER - Opens when Eye/View icon clicked
// Full right-side drawer with lecture info, feedback summary, and quick actions
// ═══════════════════════════════════════════════════════════════════════════════
function LectureDetailDrawer({ lecture, onClose, onViewFeedback }: { lecture: Lecture; onClose: () => void; onViewFeedback?: (id: string) => void }) {
  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const understandingAvg = lecture.understanding_avg ?? 0;
  const healthColor = understandingAvg >= 85 ? 'bg-emerald-500' : understandingAvg >= 70 ? 'bg-amber-500' : 'bg-rose-500';
  const healthText = understandingAvg >= 85 ? 'text-emerald-400' : understandingAvg >= 70 ? 'text-amber-400' : 'text-rose-400';

  // Mock feedback data
  const feedbackSummary = [
    { label: 'Clear explanations', count: 12, positive: true },
    { label: 'Good examples', count: 8, positive: true },
    { label: 'Too fast pacing', count: 3, positive: false },
    { label: 'More practice needed', count: 2, positive: false },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-zinc-900 border-l border-zinc-700 shadow-2xl z-50 flex flex-col"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 p-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Lectures
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-400">
                {lecture.course_code}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                lecture.status === 'live' ? 'bg-rose-500/20 text-rose-400' :
                lecture.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {lecture.status === 'live' ? '● LIVE' : lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{lecture.title}</h2>
            <p className="text-sm text-zinc-400">{lecture.date} • {lecture.time} • {lecture.duration_minutes} min</p>
          </div>

          {/* Topics */}
          {lecture.topics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {lecture.topics.map((topic, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-center">
              <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{lecture.student_count ?? 0}</p>
              <p className="text-xs text-zinc-500">Students</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-center">
              <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{lecture.feedback_count ?? 0}</p>
              <p className="text-xs text-zinc-500">Feedback</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-center">
              <Activity className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className={`text-2xl font-bold ${healthText}`}>{understandingAvg}%</p>
              <p className="text-xs text-zinc-500">Understanding</p>
            </div>
          </div>

          {/* Understanding Bar */}
          {lecture.status === 'completed' && (
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-300">Class Understanding</span>
                <span className={`text-sm font-bold ${healthText}`}>{lecture.understanding_avg}%</span>
              </div>
              <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${understandingAvg}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${healthColor}`}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {understandingAvg >= 85 ? 'Students are tracking well!' :
                 understandingAvg >= 70 ? 'Some students may need revision' :
                 'Consider revisiting key concepts'}
              </p>
            </div>
          )}

          {/* Feedback Summary */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Feedback Summary</h3>
            <div className="space-y-2">
              {feedbackSummary.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                  <span className="text-sm text-zinc-300">{item.label}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.count} mentions
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Silent Students Alert */}
          {(lecture.silent_count ?? 0) > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-300 mb-1">{lecture.silent_count} Silent Students</p>
                  <p className="text-xs text-zinc-400">These students haven't provided feedback yet.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 p-4 flex gap-3">
          <motion.button
            onClick={() => { onViewFeedback?.(lecture.id); onClose(); }}
            className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <Eye className="w-4 h-4" />
            View All Feedback
          </motion.button>
          <motion.button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

// Share QR Modal
function ShareQRModal({ lecture, onClose }: { lecture: Lecture; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const feedbackUrl = `https://lis.edu/feedback/${lecture.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#18181b';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LIS Feedback', 200, 180);
      ctx.font = '16px sans-serif';
      ctx.fillText(lecture.title, 200, 220);
      ctx.fillText('Scan QR Code', 200, 260);
    }
    const link = document.createElement('a');
    link.download = `lecture-qr-${lecture.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Share QR Code</h3>
              <p className="text-sm text-zinc-400">Share with students to collect feedback</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center">
          {/* QR Code Placeholder */}
          <div className="w-56 h-56 bg-white rounded-2xl p-4 mb-6 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-xl flex flex-col items-center justify-center">
              <QrCode className="w-24 h-24 text-zinc-800 mb-2" />
              <p className="text-xs text-zinc-600 font-medium">Scan to give feedback</p>
            </div>
          </div>
          <div className="text-center mb-4">
            <p className="text-white font-semibold mb-1">{lecture.title}</p>
            <p className="text-sm text-zinc-400">{lecture.course_code} • {lecture.date}</p>
          </div>
          <div className="w-full p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 flex items-center gap-3 mb-4">
            <Link className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <span className="text-sm text-zinc-300 truncate flex-1">{feedbackUrl}</span>
            <button onClick={copyLink} className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-zinc-700 text-zinc-400'}`}>
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-zinc-800 bg-zinc-900/50">
          <button onClick={copyLink} className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center gap-2 transition-all">
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button onClick={downloadQR} className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all">
            <Download className="w-4 h-4" />
            Download QR
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Delete Lecture Modal
function DeleteLectureModal({ lecture, onClose, onConfirm }: { lecture: Lecture; onClose: () => void; onConfirm: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Delete Lecture?</h3>
          <p className="text-zinc-400 mb-4">This action cannot be undone. All feedback and data associated with this lecture will be permanently deleted.</p>
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 mb-6">
            <p className="text-white font-semibold">{lecture.title}</p>
            <p className="text-sm text-zinc-400">{lecture.course_code} • {lecture.date} • {lecture.feedback_count} feedback</p>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-zinc-800 bg-zinc-900/50">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition-all">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition-all">
            <Trash2 className="w-4 h-4" />
            Delete Lecture
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface LectureCardProProps {
  lecture: Lecture;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewFeedback?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onQRCode?: (id: string) => void;
  onLogTopics?: (id: string) => void;
  onShare?: (id: string) => void;
  index?: number;
}

const statusStyles = {
  completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Completed' },
  live: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'LIVE', pulse: true },
  scheduled: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Scheduled' },
  cancelled: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'Cancelled' },
};

export function LectureCardPro({
  lecture,
  isSelected,
  onToggleSelect,
  onViewFeedback,
  onEdit,
  onDelete,
  onQRCode: _onQRCode,
  onLogTopics,
  onShare: _onShare,
  index = 0,
}: LectureCardProProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeModal, setActiveModal] = useState<'edit' | 'topics' | 'qr' | 'delete' | 'detail' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);
  
  const understandingAvg = lecture.understanding_avg ?? 0;
  const isLowUnderstanding = lecture.status === 'completed' && understandingAvg < 80;
  const healthColor = understandingAvg >= 85 ? 'bg-emerald-500' : understandingAvg >= 70 ? 'bg-amber-500' : 'bg-rose-500';
  const healthGlow = understandingAvg >= 85 ? 'shadow-emerald-500/30' : understandingAvg >= 70 ? 'shadow-amber-500/30' : 'shadow-rose-500/30';
  const status = statusStyles[lecture.status];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) return 'Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleEditSave = (data: any) => {
    console.log('Saving lecture edit:', data);
    onEdit?.(lecture.id);
  };

  const handleTopicsSave = (topics: string[]) => {
    console.log('Saving topics:', topics);
    onLogTopics?.(lecture.id);
  };

  const handleDelete = () => {
    console.log('Deleting lecture:', lecture.id);
    onDelete?.(lecture.id);
  };

  return (
    <>
      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'edit' && (
          <EditLectureModal lecture={lecture} onClose={() => setActiveModal(null)} onSave={handleEditSave} />
        )}
        {activeModal === 'topics' && (
          <LogTopicsModal lecture={lecture} onClose={() => setActiveModal(null)} onSave={handleTopicsSave} />
        )}
        {activeModal === 'qr' && (
          <ShareQRModal lecture={lecture} onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'delete' && (
          <DeleteLectureModal lecture={lecture} onClose={() => setActiveModal(null)} onConfirm={handleDelete} />
        )}
        {activeModal === 'detail' && (
          <LectureDetailDrawer lecture={lecture} onClose={() => setActiveModal(null)} onViewFeedback={onViewFeedback} />
        )}
      </AnimatePresence>

      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`
        relative group rounded-2xl border backdrop-blur-xl overflow-hidden
        bg-gradient-to-br from-zinc-900/80 to-zinc-900/40
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : isLowUnderstanding ? 'border-amber-500/50' : 'border-zinc-800 hover:border-zinc-700'}
        hover:shadow-lg transition-all duration-300
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
    >
      {/* Low Understanding Warning Frame */}
      {isLowUnderstanding && (
        <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/40 pointer-events-none">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500/20 backdrop-blur-sm rounded-b-lg border border-t-0 border-amber-500/30">
            <span className="text-[10px] font-medium text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Revise?
            </span>
          </div>
        </div>
      )}

      {/* Live Indicator Glow */}
      {lecture.status === 'live' && (
        <div className="absolute inset-0 rounded-2xl border-2 border-rose-500/50 animate-pulse pointer-events-none" />
      )}

      {/* Checkbox */}
      <div 
        className={`absolute top-4 left-4 z-20 transition-opacity duration-200 ${isHovered || isSelected ? 'opacity-100' : 'opacity-40'}`}
        onClick={(e) => { e.stopPropagation(); onToggleSelect(lecture.id); }}
      >
        <motion.div
          className={`
            w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer
            ${isSelected 
              ? 'bg-blue-500 border-blue-500' 
              : 'bg-zinc-900/80 border-zinc-600 hover:border-blue-400'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </motion.div>
      </div>

      {/* Action Icons - ALWAYS VISIBLE (not just on hover) */}
      <div className={`absolute top-4 right-4 z-20 flex items-center gap-1 transition-opacity ${isHovered || showMenu ? 'opacity-100' : 'opacity-60'}`}>
        <motion.button
          onClick={(e) => { e.stopPropagation(); setActiveModal('detail'); }}
          className="p-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 text-zinc-400 hover:text-white hover:border-blue-500/50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={(e) => { e.stopPropagation(); setActiveModal('qr'); }}
          className="p-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="QR Code"
        >
          <QrCode className="w-4 h-4" />
        </motion.button>
        <div className="relative" ref={menuRef}>
          <motion.button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className={`p-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm border text-zinc-400 hover:text-white transition-colors ${showMenu ? 'border-zinc-500 text-white' : 'border-zinc-700 hover:border-zinc-500'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
          
          {/* Dropdown Menu - PERSISTENT until explicitly closed */}
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute top-full right-0 mt-1 w-44 py-1 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl shadow-2xl z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setActiveModal('edit'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Lecture
                  </button>
                  <button
                    onClick={() => { setActiveModal('topics'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Tag className="w-4 h-4" />
                    Log Topics
                  </button>
                  <button
                    onClick={() => { setActiveModal('qr'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Share2 className="w-4 h-4" />
                    Share QR
                  </button>
                  <div className="my-1 border-t border-zinc-800" />
                  <button
                    onClick={() => { setActiveModal('delete'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Lecture
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 pt-12">
        {/* Header Row: Date/Time + Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Calendar className="w-4 h-4" />
              {formatDate(lecture.date)}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-zinc-500">
              <Clock className="w-4 h-4" />
              {lecture.time}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
            {lecture.status === 'live' && <Radio className="w-3 h-3 animate-pulse" />}
            {lecture.status === 'scheduled' && <Play className="w-3 h-3" />}
            {status.label}
          </div>
        </div>

        {/* Course Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-400">
            <BookOpen className="w-3.5 h-3.5" />
            {lecture.course_code}
          </span>
          
          {/* Alert Badges */}
          <div className="flex items-center gap-1.5 ml-auto">
            {(lecture.unread_count ?? 0) > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"
              >
                <MessageSquare className="w-3 h-3" />
                {lecture.unread_count}
              </motion.span>
            )}
            {(lecture.silent_count ?? 0) > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400"
              >
                <Bell className="w-3 h-3" />
                {lecture.silent_count}
              </motion.span>
            )}
          </div>
        </div>

        {/* Lecture Title */}
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-blue-300 transition-colors">
          {lecture.title}
        </h3>
        
        {/* Topics */}
        {lecture.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {lecture.topics.slice(0, 3).map((topic, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-400">
                {topic}
              </span>
            ))}
            {lecture.topics.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-500">
                +{lecture.topics.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Understanding Bar (only for completed) */}
        {lecture.status === 'completed' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-zinc-400">Understanding</span>
              <span className={`text-sm font-bold ${understandingAvg >= 85 ? 'text-emerald-400' : understandingAvg >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                {understandingAvg}%
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${understandingAvg}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
                className={`h-full rounded-full ${healthColor} shadow-lg ${healthGlow}`}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-zinc-400 mb-0.5">
              <Users className="w-3 h-3" />
            </div>
            <span className="text-lg font-bold text-white">{lecture.student_count ?? 0}</span>
            <p className="text-[10px] text-zinc-500">Students</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-0.5">
              <MessageSquare className="w-3 h-3" />
            </div>
            <span className="text-lg font-bold text-white">{lecture.feedback_count ?? 0}</span>
            <p className="text-[10px] text-zinc-500">Feedback</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
              <Clock className="w-3 h-3" />
            </div>
            <span className="text-lg font-bold text-white">{lecture.duration_minutes ?? lecture.duration ?? 0}</span>
            <p className="text-[10px] text-zinc-500">Minutes</p>
          </div>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="px-5 py-3 bg-zinc-900/30 border-t border-zinc-800/50 flex items-center justify-between">
        <button
          onClick={() => setActiveModal('detail')}
          className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          View Feedback
        </button>
        <button
          onClick={() => setActiveModal('qr')}
          className="text-xs font-medium text-purple-400 hover:underline transition-colors flex items-center gap-1.5"
        >
          <QrCode className="w-3.5 h-3.5" />
          QR Code
        </button>
      </div>
    </motion.div>
    </>
  );
}
