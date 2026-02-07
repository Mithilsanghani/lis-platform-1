/**
 * LIS Unified Dashboard Page
 * Same page, same components - different data based on role
 * "One system, two roles, same UI"
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import {
  WelcomeCard,
  QuickStats,
  PendingFeedbackList,
  AIInsightsPanel,
  UnderstandingBreakdown,
} from '../../components/UnifiedDashboard';
import { DataService } from '../../lib/dataService';
import type { UserRole, DashboardMetrics, AIInsight } from '../../lib/types';

interface UnifiedDashboardProps {
  role?: UserRole;
}

export function UnifiedDashboard({ role = 'student' }: UnifiedDashboardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Get current user based on role
  const user = DataService.getCurrentUser(role);

  // Load dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dashboardMetrics = DataService.getDashboardMetrics(user.id, role);
      const aiInsights = DataService.getAIInsights(user.id, role);
      
      setMetrics(dashboardMetrics);
      setInsights(aiInsights);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [role]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Handle feedback item click
  const handleFeedbackClick = (lectureId: string) => {
    if (role === 'student') {
      navigate(`/dev/student/feedback?lecture=${lectureId}`);
    } else {
      navigate(`/dev/professor/analytics?lecture=${lectureId}`);
    }
  };

  // Handle pending action click
  const handlePendingActionClick = () => {
    if (role === 'student') {
      navigate('/dev/student/feedback');
    } else {
      navigate('/dev/professor/analytics');
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {role === 'student' 
              ? 'Track your learning progress and submit feedback'
              : 'Monitor class understanding and plan revisions'
            }
          </p>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Welcome Card */}
      <WelcomeCard
        userName={user.name}
        role={role}
        pendingCount={metrics.pendingFeedbacks.count}
        streak={metrics.streak.days}
        onActionClick={handlePendingActionClick}
      />

      {/* Quick Stats Row */}
      <QuickStats metrics={metrics} role={role} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Pending Feedbacks */}
          <PendingFeedbackList
            items={metrics.pendingFeedbacks.items}
            role={role}
            onItemClick={handleFeedbackClick}
          />
          
          {/* Understanding Breakdown */}
          <UnderstandingBreakdown
            data={metrics.averageScore.breakdown}
            role={role}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Insights */}
          <AIInsightsPanel
            insights={insights}
            role={role}
          />

          {/* Activity Summary */}
          <ActivitySummary metrics={metrics} role={role} />
        </div>
      </div>
    </div>
  );
}

// ==================== ACTIVITY SUMMARY ====================

function ActivitySummary({ metrics, role }: { metrics: DashboardMetrics; role: UserRole }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
    >
      <h3 className="text-base font-semibold text-white mb-4">
        {role === 'student' ? 'This Week' : 'Class Activity'}
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            {role === 'student' ? 'Lectures Attended' : 'Total Students'}
          </span>
          <span className="text-sm font-medium text-white">
            {role === 'student' ? metrics.weeklyProgress.totalLectures : '125'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            {role === 'student' ? 'Feedbacks Submitted' : 'Feedbacks This Week'}
          </span>
          <span className="text-sm font-medium text-white">
            {metrics.feedbackStats.thisWeek}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            {role === 'student' ? 'Topics Understood' : 'Response Rate'}
          </span>
          <span className="text-sm font-medium text-green-400">
            {role === 'student' 
              ? `${metrics.weeklyProgress.lecturesUnderstood}/${metrics.weeklyProgress.totalLectures * 3}`
              : '78%'
            }
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            {role === 'student' ? 'Current Streak' : 'Engagement Streak'}
          </span>
          <span className="text-sm font-medium text-orange-400">
            🔥 {metrics.streak.days} days
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default UnifiedDashboard;
