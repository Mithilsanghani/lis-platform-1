import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  X,
  MessageSquare,
  Clock,
  AlertCircle,
  Send,
  CheckCircle2,
  Eye,
} from 'lucide-react';

interface StudentFeedback {
  id: string;
  rollNumber: string;
  lastFeedback: string;
  feedbackDate: string;
  riskLevel: 'high' | 'medium' | 'low';
  lastFeedbackTopic: string;
}

interface SilentStudentsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  students?: StudentFeedback[];
  courseName?: string;
  onSendSMS?: (studentId: string, message: string) => void;
  silentCount?: number;
}

const riskColors = {
  high: 'bg-red-500/10 border-red-500/30 text-red-400',
  medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  low: 'bg-green-500/10 border-green-500/30 text-green-400',
};

const riskBadgeColor = {
  high: 'bg-red-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-green-500 text-white',
};

export default function SilentStudentsModal({
  isOpen = false,
  onClose = () => {},
  students = [
    {
      id: '1001',
      rollNumber: '#1847',
      lastFeedback: 'Graphs are going too fast',
      feedbackDate: '2 hours ago',
      riskLevel: 'high',
      lastFeedbackTopic: 'Graphs',
    },
    {
      id: '1002',
      rollNumber: '#2043',
      lastFeedback: 'Lost after DFS section',
      feedbackDate: '4 hours ago',
      riskLevel: 'high',
      lastFeedbackTopic: 'Graphs',
    },
    {
      id: '1003',
      rollNumber: '#1923',
      lastFeedback: 'Need more examples on BFS',
      feedbackDate: '6 hours ago',
      riskLevel: 'medium',
      lastFeedbackTopic: 'Graphs',
    },
    {
      id: '1004',
      rollNumber: '#2156',
      lastFeedback: 'Understood the concept but need practice',
      feedbackDate: '1 day ago',
      riskLevel: 'low',
      lastFeedbackTopic: 'Graphs',
    },
    {
      id: '1005',
      rollNumber: '#1756',
      lastFeedback: 'Pace too fast',
      feedbackDate: '2 hours ago',
      riskLevel: 'high',
      lastFeedbackTopic: 'Graphs',
    },
  ],
  courseName = 'Data Structures',
  onSendSMS = () => {},
  silentCount = 18,
}: SilentStudentsModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sentSmsId, setSentSmsId] = useState<string | null>(null);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredStudents = students.filter(
    (s) => filterRisk === 'all' || s.riskLevel === filterRisk
  );

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const handleSendSMS = (studentId: string) => {
    onSendSMS(studentId, 'nudge-default');
    setSentSmsId(studentId);
    setTimeout(() => setSentSmsId(null), 2000);
  };

  const handleBulkSendSMS = () => {
    selectedStudents.forEach((id) => {
      onSendSMS(id, 'nudge-bulk');
    });
    setSelectedStudents(new Set());
    setBulkSelectMode(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  Silent Students Alert
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {silentCount} students haven't provided feedback in {courseName}
                </p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-400" />
              </motion.button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setBulkSelectMode(!bulkSelectMode)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    bulkSelectMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {bulkSelectMode ? 'Select Mode: ON' : 'Select Mode'}
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                {['all', 'high', 'medium', 'low'].map((risk) => (
                  <motion.button
                    key={risk}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setFilterRisk(risk as 'all' | 'high' | 'medium' | 'low')
                    }
                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                      filterRisk === risk
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {risk === 'all' ? `All (${students.length})` : risk}
                  </motion.button>
                ))}
              </div>

              {/* Bulk Actions */}
              {bulkSelectMode && selectedStudents.size > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkSendSMS}
                  className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send SMS ({selectedStudents.size})
                </motion.button>
              )}
            </div>

            {/* Student List */}
            <div className="overflow-y-auto flex-1">
              <div className="p-4 space-y-3">
                {filteredStudents.map((student, idx) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-lg border p-4 transition ${riskColors[student.riskLevel]}`}
                  >
                    {/* Student Card Content */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {bulkSelectMode && (
                            <input
                              type="checkbox"
                              checked={selectedStudents.has(student.id)}
                              onChange={() => toggleSelect(student.id)}
                              className="mt-1 w-5 h-5 rounded cursor-pointer"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-lg">{student.rollNumber}</span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  riskBadgeColor[student.riskLevel]
                                }`}
                              >
                                {student.riskLevel.toUpperCase()} RISK
                              </span>
                              {student.lastFeedbackTopic && (
                                <span className="text-xs px-2 py-1 bg-slate-700/50 rounded">
                                  {student.lastFeedbackTopic}
                                </span>
                              )}
                            </div>

                            {/* Feedback Summary */}
                            <div className="flex items-start gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-75" />
                              <div>
                                <p className="text-sm font-medium">
                                  "{student.lastFeedback}"
                                </p>
                                <div className="flex items-center gap-1 text-xs opacity-75 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {student.feedbackDate}
                                </div>
                              </div>
                            </div>

                            {/* Expand Button */}
                            <motion.button
                              onClick={() =>
                                setExpandedId(
                                  expandedId === student.id ? null : student.id
                                )
                              }
                              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              {expandedId === student.id
                                ? 'Hide Details'
                                : 'View Full History'}
                            </motion.button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSendSMS(student.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition flex items-center gap-1"
                          >
                            {sentSmsId === student.id ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Sent
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                SMS
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition"
                          >
                            1:1 Chat
                          </motion.button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: expandedId === student.id ? 'auto' : 0,
                          opacity: expandedId === student.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-current border-opacity-20 space-y-2">
                          <div className="text-xs">
                            <p className="font-bold opacity-75 mb-1">FEEDBACK HISTORY:</p>
                            <div className="space-y-1 opacity-75">
                              <p>• "Graphs too fast" - 2h ago</p>
                              <p>• "Need more practice" - 1d ago</p>
                              <p>• "Understood trees" - 3d ago</p>
                            </div>
                          </div>
                          <div className="text-xs">
                            <p className="font-bold opacity-75 mb-1">RECOMMENDED ACTION:</p>
                            <p className="opacity-75">
                              Schedule 1:1 session focused on Graph fundamentals. Send video
                              link for async learning.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
              <p className="text-xs text-slate-400">
                Showing {filteredStudents.length} of {students.length} students
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
