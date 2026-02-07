/**
 * LIS v2.0 - Professor Lectures Page
 * Lecture timeline with feedback insights and revision actions
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MessageSquare,
  ChevronRight,
  BookOpen,
  ArrowUpDown,
} from 'lucide-react';
import { useProfessorLectures, useProfessorCourses } from '../../hooks/useProfessorData';
import { useLISStore } from '../../store/useLISStore';
import { EmptyState, Modal } from '../../components/shared';
import { UnderstandingBar } from '../../components/shared/Charts';

export default function ProfessorLectures() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get('courseId') || '';

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create lecture form state
  const [newLecCourseId, setNewLecCourseId] = useState('');
  const [newLecTitle, setNewLecTitle] = useState('');
  const [newLecTopics, setNewLecTopics] = useState('');
  const [newLecDate, setNewLecDate] = useState('');
  const [newLecTime, setNewLecTime] = useState('');
  const [newLecDuration, setNewLecDuration] = useState(60);
  const [createError, setCreateError] = useState('');

  const createLecture = useLISStore((s) => s.createLecture);

  const { courses } = useProfessorCourses();
  const { lectures, total, isLoading } = useProfessorLectures({
    courseId: selectedCourseId || undefined,
  });

  // Filter by search and sort
  const filteredLectures = lectures
    .filter(lecture => 
      !searchQuery || 
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.date_time).getTime();
      const dateB = new Date(b.date_time).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Lectures</h1>
          <p className="text-slate-400 mt-1">{total} lectures total</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Schedule Lecture
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-[600px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search lectures by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>

        {/* Course Filter */}
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 min-w-[200px]"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.title}
            </option>
          ))}
        </select>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600 transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Lectures List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl p-4 bg-slate-800/50 border border-slate-700/50 animate-pulse">
              <div className="h-5 w-48 bg-slate-700 rounded mb-3" />
              <div className="h-4 w-32 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : filteredLectures.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No lectures found"
          description={searchQuery ? "Try adjusting your search" : "Schedule your first lecture to start collecting feedback"}
          action={{
            label: 'Schedule Lecture',
            onClick: () => setIsCreateModalOpen(true),
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredLectures.map((lecture, index) => {
            const course = courses.find(c => c.id === lecture.course_id);
            const understanding = lecture.understanding_summary;

            return (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/professor/lectures/${lecture.id}`)}
                className="rounded-xl p-5 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Left: Lecture Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {course && (
                        <span className="text-xs font-medium text-indigo-400 uppercase">
                          {course.code}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(lecture.date_time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lecture.date_time).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-white mb-2">{lecture.title}</h3>

                    <div className="flex flex-wrap gap-1.5">
                      {lecture.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-slate-700/50 text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Stats & Understanding */}
                  <div className="flex flex-col lg:items-end gap-3 lg:w-64">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                        {lecture.feedback_count || 0} responses
                      </span>
                      {course && course.student_count && (
                        <span className="text-slate-500">
                          {Math.round(((lecture.feedback_count || 0) / course.student_count) * 100)}% rate
                        </span>
                      )}
                    </div>

                    {understanding && (
                      <div className="w-full lg:w-48">
                        <UnderstandingBar
                          summary={understanding}
                          height={8}
                        />
                        <div className="flex justify-between mt-1 text-xs text-slate-500">
                          <span>{understanding.full_pct.toFixed(0)}% clear</span>
                          <span>{understanding.unclear_pct.toFixed(0)}% need help</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-500 hidden lg:block" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Lecture Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setCreateError(''); }}
        title="Schedule New Lecture"
        size="md"
      >
        <form className="space-y-3" onSubmit={(e) => {
          e.preventDefault();
          if (!newLecCourseId || !newLecTitle.trim() || !newLecDate) {
            setCreateError('Course, title, and date are required');
            return;
          }
          setCreateError('');
          try {
            const dateTime = newLecTime ? `${newLecDate}T${newLecTime}` : `${newLecDate}T09:00`;
            createLecture(newLecCourseId, {
              title: newLecTitle.trim(),
              topics: newLecTopics.split(',').map(t => t.trim()).filter(Boolean),
              date: dateTime,
              duration: newLecDuration,
              status: 'scheduled',
            });
            setNewLecCourseId('');
            setNewLecTitle('');
            setNewLecTopics('');
            setNewLecDate('');
            setNewLecTime('');
            setNewLecDuration(60);
            setIsCreateModalOpen(false);
          } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create lecture');
          }
        }}>
          {createError && (
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {createError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Course *</label>
            <select
              value={newLecCourseId}
              onChange={(e) => setNewLecCourseId(e.target.value)}
              className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Lecture Title *</label>
            <input
              type="text"
              placeholder="e.g., Introduction to Binary Trees"
              value={newLecTitle}
              onChange={(e) => setNewLecTitle(e.target.value)}
              className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Topics (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., Binary Trees, Tree Traversal, BST"
              value={newLecTopics}
              onChange={(e) => setNewLecTopics(e.target.value)}
              className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Date *</label>
              <input
                type="date"
                value={newLecDate}
                onChange={(e) => setNewLecDate(e.target.value)}
                className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
              <input
                type="time"
                value={newLecTime}
                onChange={(e) => setNewLecTime(e.target.value)}
                className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Duration (min)</label>
              <input
                type="number"
                min={15}
                max={240}
                value={newLecDuration}
                onChange={(e) => setNewLecDuration(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-[10px] bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => { setIsCreateModalOpen(false); setCreateError(''); }}
              className="flex-1 h-11 rounded-[10px] border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            >
              Schedule Lecture
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
