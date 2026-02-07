/**
 * LIS Student Schedule Page
 * Weekly class schedule and upcoming events
 * ZERO DUMMY DATA - All from store
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Video,
  Users,
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useLISStore } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';

interface ClassSlot {
  id: string;
  courseCode: string;
  courseName: string;
  professor: string;
  time: string;
  endTime: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
  status: 'upcoming' | 'ongoing' | 'completed';
  feedbackPending?: boolean;
}

interface DaySchedule {
  day: string;
  date: string;
  isToday: boolean;
  classes: ClassSlot[];
}

export function StudentSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const today = new Date().getDay();
    // Convert to Mon=0, Tue=1, etc. (Sun becomes 6)
    return today === 0 ? 6 : today - 1;
  });

  // Get real data from store
  const { user } = useAuthStore();
  const { getStudentCourses, getStudentLectures, getStudentPendingFeedback, professors, courses, assessments } = useLISStore();
  
  const studentId = user?.id || '';
  const studentCourses = getStudentCourses(studentId);
  const studentLectures = getStudentLectures(studentId);
  const pendingFeedbackLectures = getStudentPendingFeedback(studentId);

  // Build week schedule from real lectures
  const weekSchedule = useMemo((): DaySchedule[] => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date();
    const currentDay = today.getDay();
    
    return days.map((day, idx) => {
      const dayOffset = idx - (currentDay === 0 ? 6 : currentDay - 1);
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      
      // Filter lectures for this day
      const dayLectures = studentLectures.filter(lecture => {
        const lectureDate = new Date(lecture.date);
        return lectureDate.toDateString() === date.toDateString();
      });

      // Convert lectures to ClassSlot format
      const classes: ClassSlot[] = dayLectures.map(lecture => {
        const course = courses.find(c => c.id === lecture.courseId);
        const professor = professors.find(p => p.id === course?.professorId);
        const isPendingFeedback = pendingFeedbackLectures.some(l => l.id === lecture.id);
        
        const lectureTime = new Date(lecture.date);
        const endTime = new Date(lectureTime.getTime() + lecture.duration * 60000);
        
        const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
        const now = new Date();
        if (lecture.status === 'completed') {
          status = 'completed';
        } else if (lecture.status === 'live') {
          status = 'ongoing';
        } else if (lectureTime > now) {
          status = 'upcoming';
        }

        return {
          id: lecture.id,
          courseCode: course?.code || 'N/A',
          courseName: course?.name || lecture.title,
          professor: professor?.name || 'TBA',
          time: formatTime(lectureTime),
          endTime: formatTime(endTime),
          room: 'TBA', // Would need location in Lecture type
          type: 'lecture' as const,
          status,
          feedbackPending: isPendingFeedback && status === 'completed',
        };
      });

      return {
        day,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isToday: date.toDateString() === today.toDateString(),
        classes,
      };
    });
  }, [studentLectures, courses, professors, pendingFeedbackLectures]);

  // Build upcoming events from assessments
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return assessments
      .filter(a => {
        if (!a.dueDate) return false;
        const course = studentCourses.find(c => c.id === a.courseId);
        if (!course) return false;
        const dueDate = new Date(a.dueDate);
        return dueDate > now;
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 5)
      .map(a => {
        const course = courses.find(c => c.id === a.courseId);
        const dueDate = new Date(a.dueDate!);
        return {
          id: a.id,
          title: a.name,
          date: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time: dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          type: a.type === 'quiz' || a.type === 'midterm' || a.type === 'final' ? 'exam' : 'deadline',
          course: course?.code || 'N/A',
        };
      });
  }, [assessments, studentCourses, courses]);

  // Calculate today's summary
  const todaySummary = useMemo(() => {
    const todaySchedule = weekSchedule.find(d => d.isToday);
    const classes = todaySchedule?.classes || [];
    const totalMinutes = classes.reduce((sum) => {
      // Estimate 90 min per class
      return sum + 90;
    }, 0);
    const feedbackPending = classes.filter(c => c.feedbackPending).length;
    
    return {
      classes: classes.length,
      totalHours: (totalMinutes / 60).toFixed(1),
      feedbackPending,
    };
  }, [weekSchedule]);

  const typeStyles = {
    lecture: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: BookOpen },
    lab: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Video },
    tutorial: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: Users },
  };

  const statusStyles = {
    upcoming: 'border-l-purple-500',
    ongoing: 'border-l-green-500 bg-green-500/5',
    completed: 'border-l-zinc-600 opacity-60',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-purple-400" />
            My Schedule
          </h1>
          <p className="text-zinc-400 mt-1">Your weekly class timetable and events</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-medium text-sm">
            This Week
          </span>
          <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekSchedule.map((day, idx) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(idx)}
            className={`
              flex-shrink-0 px-4 py-3 rounded-xl border transition-all min-w-[100px]
              ${selectedDay === idx 
                ? 'bg-purple-600/20 border-purple-500/40 text-white' 
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }
              ${day.isToday && selectedDay !== idx ? 'border-purple-500/30' : ''}
            `}
          >
            <p className={`text-xs ${selectedDay === idx ? 'text-purple-400' : 'text-zinc-500'}`}>
              {day.isToday ? 'Today' : day.day.slice(0, 3)}
            </p>
            <p className="font-semibold mt-0.5">{day.date}</p>
            <p className="text-xs mt-1">{day.classes.length} classes</p>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Schedule */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {weekSchedule[selectedDay].day}, {weekSchedule[selectedDay].date}
            </h3>
            {weekSchedule[selectedDay].isToday && (
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                Today
              </span>
            )}
          </div>

          {weekSchedule[selectedDay].classes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No classes scheduled</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weekSchedule[selectedDay].classes.map((slot, idx) => {
                const style = typeStyles[slot.type];

                return (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`
                      p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 border-l-4
                      ${statusStyles[slot.status]}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Time */}
                        <div className="text-center min-w-[60px]">
                          <p className="text-lg font-bold text-white">{slot.time.split(' ')[0]}</p>
                          <p className="text-xs text-zinc-500">{slot.time.split(' ')[1]}</p>
                        </div>

                        {/* Details */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
                              {slot.courseCode}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${style.bg} ${style.text}`}>
                              {slot.type}
                            </span>
                          </div>
                          <p className="text-white font-medium">{slot.courseName}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {slot.professor}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {slot.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {slot.time} - {slot.endTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status / Action */}
                      <div>
                        {slot.status === 'completed' && slot.feedbackPending ? (
                          <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5 hover:bg-red-500/30 transition-colors">
                            <AlertCircle size={14} />
                            Give Feedback
                          </button>
                        ) : slot.status === 'completed' ? (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle size={14} />
                            Completed
                          </span>
                        ) : slot.status === 'ongoing' ? (
                          <span className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium animate-pulse">
                            In Progress
                          </span>
                        ) : (
                          <button className="p-2 rounded-lg text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors">
                            <Bell size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar - Events */}
        <div className="space-y-6">
          {/* Today's Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-500/20">
            <h4 className="text-sm font-semibold text-white mb-3">Today's Summary</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Classes</span>
                <span className="text-sm font-medium text-white">{todaySummary.classes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Total Hours</span>
                <span className="text-sm font-medium text-white">{todaySummary.totalHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Feedback Pending</span>
                <span className={`text-sm font-medium ${todaySummary.feedbackPending > 0 ? 'text-orange-400' : 'text-zinc-500'}`}>
                  {todaySummary.feedbackPending}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Bell size={16} className="text-purple-400" />
              Upcoming Events
            </h4>
            
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const eventStyles: Record<string, { bg: string; text: string; border: string }> = {
                    exam: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
                    deadline: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
                    revision: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
                  };
                  const style = eventStyles[event.type] || eventStyles.deadline;

                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-xl ${style.bg} border ${style.border}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${style.text}`}>{event.course}</span>
                        <span className={`text-xs ${style.text}`}>• {event.type}</span>
                      </div>
                      <p className="text-sm font-medium text-white">{event.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {event.date} • {event.time}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="text-sm font-semibold text-white mb-4">This Week</h4>
            {(() => {
              const totalClasses = weekSchedule.reduce((sum, d) => sum + d.classes.length, 0);
              const totalHours = Math.round(totalClasses * 1.5); // Estimate 1.5h per class
              const labCount = weekSchedule.reduce((sum, d) => 
                sum + d.classes.filter(c => c.type === 'lab').length, 0);
              const quizCount = upcomingEvents.filter(e => e.type === 'exam').length;
              
              return (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-zinc-900/50 text-center">
                    <p className="text-xl font-bold text-white">{totalClasses}</p>
                    <p className="text-xs text-zinc-500">Classes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 text-center">
                    <p className="text-xl font-bold text-white">{totalHours}h</p>
                    <p className="text-xs text-zinc-500">Study Time</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 text-center">
                    <p className={`text-xl font-bold ${labCount > 0 ? 'text-purple-400' : 'text-zinc-600'}`}>{labCount}</p>
                    <p className="text-xs text-zinc-500">Labs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 text-center">
                    <p className={`text-xl font-bold ${quizCount > 0 ? 'text-orange-400' : 'text-zinc-600'}`}>{quizCount}</p>
                    <p className="text-xs text-zinc-500">Quiz</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSchedulePage;
