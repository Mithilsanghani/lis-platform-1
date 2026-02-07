/**
 * LIS v2.0 - Professor Overview Page
 * Main dashboard with key metrics, silent students banner, and actionable insights
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useProfessorDashboard, useSilentStudents, useTopicPerformance, useProfessorInsights } from '../../hooks/useProfessorData';
import {
  StatCard,
  InsightCard,
  EmptyState,
} from '../../components/shared';
import { WeeklyTrendChart, UNDERSTANDING_COLORS } from '../../components/shared/Charts';
import { useLISStore, type Lecture } from '../../store/useLISStore';
import { useAuthStore } from '../../store/useStore';

export default function ProfessorOverview() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useProfessorDashboard();
  const { count: silentCount } = useSilentStudents();
  const { problematicTopics } = useTopicPerformance();
  const { insights, dismissInsight } = useProfessorInsights({ limit: 3 });
  
  // Get real data from stores
  const { user } = useAuthStore();
  const professorId = user?.id || 'current-professor';
  const { getProfessorCourses, getCourseStudents, lectures } = useLISStore();
  
  // Get professor's courses and filter lectures by those courses
  const professorCourses = getProfessorCourses(professorId);
  const professorCourseIds = professorCourses.map(c => c.id);
  const professorLectures = lectures.filter(l => professorCourseIds.includes(l.courseId));
  
  // Get enrolled students from LIS store
  const enrolledStudents = professorCourses.flatMap(c => getCourseStudents(c.id));

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  // Empty trends if no data
  const weeklyTrends = professorCourses.length > 0 
    ? [
        { week: 'Week 1', understanding: 0, responseRate: 0 },
        { week: 'Week 2', understanding: 0, responseRate: 0 },
        { week: 'Week 3', understanding: 0, responseRate: 0 },
        { week: 'Week 4', understanding: 0, responseRate: 0 },
        { week: 'Week 5', understanding: 0, responseRate: 0 },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.email?.split('@')[0] ? `Dr. ${user.email.split('@')[0].charAt(0).toUpperCase()}${user.email.split('@')[0].slice(1)}` : 'Professor'}</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your courses</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Silent Students Banner */}
      {silentCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">
                  {silentCount} Silent Student{silentCount > 1 ? 's' : ''} Detected
                </h3>
                <p className="text-sm text-slate-400">
                  Students with low engagement patterns need attention
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/professor/students?filter=silent')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View Students
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value={professorCourses.length}
          subtitle="This semester"
          icon={<BookOpen className="w-5 h-5 text-indigo-400" />}
          color="indigo"
          onClick={() => navigate('/professor/courses')}
        />
        <StatCard
          title="Total Students"
          value={enrolledStudents.length}
          subtitle="Across all courses"
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          color="emerald"
          onClick={() => navigate('/professor/students')}
        />
        <StatCard
          title="Feedback Received"
          value={dashboard?.new_feedback_count || 0}
          subtitle="This semester"
          icon={<MessageSquare className="w-5 h-5 text-purple-400" />}
          color="purple"
        />
        <StatCard
          title="Avg Understanding"
          value={professorCourses.length > 0 ? `${dashboard?.avg_engagement_pct || 0}%` : '—'}
          subtitle="Full clarity rate"
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
          color="cyan"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trends */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Understanding Trends</h2>
              <p className="text-sm text-slate-400">Weekly feedback analysis</p>
            </div>
            <button
              onClick={() => navigate('/professor/analytics')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <WeeklyTrendChart data={weeklyTrends} showResponseRate height={280} />
        </div>

        {/* AI Insights */}
        <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">AI Insights</h2>
          </div>
          
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  id={insight.id}
                  type={insight.priority === 'high' ? 'warning' : insight.priority === 'medium' ? 'action' : 'info'}
                  title={insight.title}
                  description={insight.description}
                  priority={insight.priority}
                  onDismiss={dismissInsight}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No new insights"
              description="We'll notify you when we detect patterns"
            />
          )}
          
          <button
            onClick={() => navigate('/professor/insights')}
            className="w-full mt-4 py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-sm font-medium transition-colors"
          >
            View All Insights
          </button>
        </div>
      </div>

      {/* Topics Needing Revision */}
      {problematicTopics.length > 0 && (
        <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Topics Needing Revision</h2>
              <p className="text-sm text-slate-400">
                {problematicTopics.length} topic{problematicTopics.length > 1 ? 's' : ''} with &lt;60% clarity
              </p>
            </div>
            <button
              onClick={() => navigate('/professor/analytics')}
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              See Full Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {problematicTopics.slice(0, 4).map((topic, index) => (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl p-4 bg-slate-900/50 border border-slate-700/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-white">{topic.topic}</h4>
                  <span className={`text-xs font-medium ${
                    topic.clarity_pct >= 60 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {topic.clarity_pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${topic.clarity_pct}%`,
                      backgroundColor: topic.clarity_pct >= 60 ? UNDERSTANDING_COLORS.partial : UNDERSTANDING_COLORS.unclear,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {topic.total_count} mentions • {topic.trend === 'improving' ? '↑' : topic.trend === 'declining' ? '↓' : '→'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-2xl p-6 bg-slate-800/50 border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Lectures</h2>
          <button
            onClick={() => navigate('/professor/lectures')}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {professorLectures.length > 0 ? (
          <div className="space-y-3">
            {professorLectures.slice(0, 3).map((lecture: Lecture) => (
              <div
                key={lecture.id}
                onClick={() => navigate(`/professor/lectures/${lecture.id}`)}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-indigo-500/20">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{lecture.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{lecture.courseId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lecture.date ? new Date(lecture.date).toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{lecture.attendees?.length || 0} attended</p>
                    <p className="text-xs text-slate-400">{lecture.status}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No lectures yet"
            description="Create your first lecture to start tracking student engagement"
          />
        )}
      </div>
    </div>
  );
}
