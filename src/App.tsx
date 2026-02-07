import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useUIStore, useAuthStore } from './store/useStore';
import LoginPage from './pages/LoginPage';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LandingPage from './pages/LandingPage';
import MagicFeedback from './components/student/MagicFeedback';

// Student Portal v1.0 (Legacy)
import { StudentLayout } from './components/student/StudentLayout';
import {
  StudentOverview,
  StudentCourses,
  StudentFeedback,
  StudentPerformance,
  StudentSettings,
} from './pages/student';

// Student Portal v3.0 - New Glassmorphism UI
import { StudentLayoutV3 } from './pages/student/StudentLayoutV3';
import { StudentOverviewV3 } from './pages/student/StudentOverviewV3';
import { StudentSettingsV3 } from './pages/student/StudentSettingsV3';
import { StudentCoursesPage } from './pages/student/StudentCoursesPage';
import { StudentPerformancePage } from './pages/student/StudentPerformancePage';
import { StudentSchedulePage } from './pages/student/StudentSchedulePage';
import { StudentGradesPage } from './pages/student/StudentGradesPageV2';
import StudentEnrollPage from './pages/student/StudentEnrollPage';

// Student Dashboard V2 - Matching Professor UI
import { StudentDashboardV2 } from './pages/student/StudentDashboardV2';

// Unified Components (same UI, different data based on role)
import { UnifiedDashboard } from './pages/unified/UnifiedDashboard';
import { LectureFeedbackForm } from './pages/unified/LectureFeedbackForm';

// NEW: Student Lecture Feedback System with multi-lecture support
import { LectureFeedbackSystem } from './pages/student/LectureFeedbackSystem';

// Professor Portal v2.0
import { ProfessorLayout } from './components/layouts/ProfessorLayout';
import {
  ProfessorOverview,
  ProfessorCourses,
  ProfessorLectures,
  ProfessorStudents,
  ProfessorAnalytics,
  ProfessorInsights,
  ProfessorSettings,
  ProfessorGrades,
} from './pages/professor';

function App() {
  const { user } = useAuth();
  const { darkMode } = useUIStore();
  const [demoRole, setDemoRole] = useState<string | null>(localStorage.getItem('demo_role'));
  
  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setDemoRole(localStorage.getItem('demo_role'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Auth is now persisted via useAuthStore (lis-auth-storage)
  // The user object survives refresh automatically
  const currentUser = user;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''} style={{ width: '100%', minHeight: '100vh' }}>
        <Routes>
          {/* Root shows role selector / login page */}
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to={user?.role === 'professor' ? '/professor/dashboard' : '/dev/student'} /> : <LoginPage />
            } 
          />
          <Route
            path="/professor/dashboard"
            element={currentUser?.role === 'professor' ? <ProfessorDashboard /> : <Navigate to="/login" />}
          />
          {/* DEV MODE - Direct dashboard access */}
          <Route path="/dev/dashboard" element={<ProfessorDashboard />} />
          <Route
            path="/student/dashboard"
            element={currentUser?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />}
          />
          
          {/* STUDENT PORTAL v1.0 - Legacy (redirects to v3) */}
          <Route path="/student" element={<Navigate to="/dev/student" replace />} />
          
          {/* STUDENT PORTAL v2.0 - NEW MATCHING PROFESSOR UI (Main) */}
          <Route path="/dev/student" element={<StudentDashboardV2 />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={null} />
            <Route path="courses" element={<StudentCoursesPage />} />
            <Route path="enroll" element={<StudentEnrollPage />} />
            <Route path="feedback" element={<LectureFeedbackSystem />} />
            <Route path="performance" element={<StudentPerformancePage />} />
            <Route path="schedule" element={<StudentSchedulePage />} />
            <Route path="grades" element={<StudentGradesPage />} />
            <Route path="questions" element={<StudentOverviewV3 />} />
            <Route path="settings" element={<StudentSettingsV3 />} />
          </Route>

          {/* PROFESSOR PORTAL v2.0 */}
          <Route path="/professor" element={<ProfessorLayout />}>
            <Route index element={<ProfessorOverview />} />
            <Route path="courses" element={<ProfessorCourses />} />
            <Route path="courses/:courseId" element={<ProfessorCourses />} />
            <Route path="lectures" element={<ProfessorLectures />} />
            <Route path="lectures/:lectureId" element={<ProfessorLectures />} />
            <Route path="students" element={<ProfessorStudents />} />
            <Route path="grades" element={<ProfessorGrades />} />
            <Route path="analytics" element={<ProfessorAnalytics />} />
            <Route path="insights" element={<ProfessorInsights />} />
            <Route path="settings" element={<ProfessorSettings />} />
          </Route>

          {/* DEV MODE - Direct professor portal access */}
          <Route path="/dev/professor" element={<ProfessorLayout />}>
            <Route index element={<ProfessorOverview />} />
            <Route path="courses" element={<ProfessorCourses />} />
            <Route path="lectures" element={<ProfessorLectures />} />
            <Route path="students" element={<ProfessorStudents />} />
            <Route path="grades" element={<ProfessorGrades />} />
            <Route path="analytics" element={<ProfessorAnalytics />} />
            <Route path="insights" element={<ProfessorInsights />} />
            <Route path="settings" element={<ProfessorSettings />} />
          </Route>

          {/* v3 routes redirect to main /dev/student */}
          <Route path="/v3/student/*" element={<Navigate to="/dev/student" replace />} />

          {/* MAGIC QR FEEDBACK - NO AUTH REQUIRED */}
          <Route path="/feedback/:lectureId" element={<MagicFeedback />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
