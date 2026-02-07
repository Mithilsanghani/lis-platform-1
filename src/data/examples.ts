/**
 * Enhanced Mock Data - Usage Examples
 * Demonstrates how to use the comprehensive dummy data
 */

import dataHelpers from './dataHelpers';
import { enhancedMockData } from './enhancedMockData';

// ============================================
// EXAMPLE 1: Get Complete Professor Data
// ============================================
export function exampleProfessorData() {
  // Get specific professor with full profile
  const professor = dataHelpers.getProfessorById('prof-1');
  
  console.log('Professor Basic Info:', {
    id: professor?.id,
    name: professor?.full_name,
    email: professor?.email,
    department: professor?.department,
  });
  
  console.log('Professor Profile:', {
    specialization: professor?.profile?.specialization,
    teaching_style: professor?.profile?.teaching_style,
    experience: professor?.profile?.years_experience,
    rating: professor?.profile?.avg_student_rating,
    office_hours: professor?.profile?.office_hours,
  });
  
  console.log('Professor Dashboard:', {
    total_students: professor?.dashboard?.total_students,
    total_courses: professor?.dashboard?.total_courses,
    engagement: professor?.dashboard?.avg_engagement_pct,
    course_health: professor?.dashboard?.avg_course_health,
  });
  
  return professor;
}

// ============================================
// EXAMPLE 2: Get Complete Student Data
// ============================================
export function exampleStudentData() {
  // Get specific student with full profile
  const student = dataHelpers.getStudentById('stu-1');
  
  console.log('Student Basic Info:', {
    id: student?.id,
    name: student?.full_name,
    email: student?.email,
    roll_number: student?.roll_number,
    department: student?.department,
  });
  
  console.log('Student Profile:', {
    year: student?.profile?.year,
    cgpa: student?.profile?.cgpa,
    learning_style: student?.profile?.learning_style,
    participation: student?.profile?.participation_level,
    attendance: student?.profile?.attendance_rate,
    strengths: student?.profile?.strengths,
    career_interests: student?.profile?.career_interests,
  });
  
  console.log('Student Dashboard:', {
    enrolled_courses: student?.dashboard?.enrolled_courses_count,
    feedback_submitted: student?.dashboard?.feedback_submitted,
    understanding_avg: student?.dashboard?.avg_understanding_pct,
    streak: student?.dashboard?.engagement_streak_days,
    percentile: student?.dashboard?.peer_comparison_percentile,
  });
  
  return student;
}

// ============================================
// EXAMPLE 3: Professor Dashboard View
// ============================================
export function renderProfessorDashboard(professorId: string) {
  const prof = dataHelpers.getProfessorById(professorId);
  const courses = dataHelpers.getCoursesByProfessor(professorId);
  
  if (!prof) return null;
  
  return {
    welcomeMessage: `Welcome back, ${prof.full_name}!`,
    quickStats: {
      totalStudents: prof.dashboard?.total_students || 0,
      activeCourses: courses.length,
      newFeedback: prof.dashboard?.new_feedback_count || 0,
      avgEngagement: prof.dashboard?.avg_engagement_pct || 0,
    },
    coursesOverview: courses.map(course => ({
      code: course.code,
      title: course.title,
      students: course.student_count,
      health: course.health_pct,
      silentStudents: course.silent_students_count,
      pendingFeedback: course.pending_feedback_count,
    })),
    alerts: {
      topPerformingCourse: prof.dashboard?.top_performing_course,
      needsAttentionCourse: prof.dashboard?.needs_attention_course,
      silentStudentsCount: prof.dashboard?.silent_students_count || 0,
    },
    weeklyTrend: prof.dashboard?.weekly_feedback_trend || [],
    profile: {
      specialization: prof.profile?.specialization || [],
      teachingStyle: prof.profile?.teaching_style,
      experience: prof.profile?.years_experience,
      rating: prof.profile?.avg_student_rating,
      officeHours: prof.profile?.office_hours,
    },
  };
}

// ============================================
// EXAMPLE 4: Student Dashboard View
// ============================================
export function renderStudentDashboard(studentId: string) {
  const student = dataHelpers.getStudentById(studentId);
  
  if (!student) return null;
  
  return {
    welcomeMessage: `Hi ${student.full_name.split(' ')[0]}! 👋`,
    quickStats: {
      enrolledCourses: student.dashboard?.enrolled_courses_count || 0,
      lecturesAttended: student.dashboard?.total_lectures_attended || 0,
      feedbackSubmitted: student.dashboard?.feedback_submitted || 0,
      currentStreak: student.dashboard?.engagement_streak_days || 0,
    },
    performance: {
      cgpa: student.profile?.cgpa,
      averageUnderstanding: student.dashboard?.avg_understanding_pct || 0,
      responseRate: student.dashboard?.response_rate || 0,
      peerPercentile: student.dashboard?.peer_comparison_percentile || 0,
    },
    insights: {
      weakTopicsCount: student.dashboard?.weak_topics_count || 0,
      strongTopicsCount: student.dashboard?.strong_topics_count || 0,
      coursesAtRisk: student.dashboard?.courses_at_risk || 0,
      coursesDoingWell: student.dashboard?.courses_doing_well || 0,
    },
    profile: {
      learningStyle: student.profile?.learning_style,
      participationLevel: student.profile?.participation_level,
      attendanceRate: student.profile?.attendance_rate,
      strengths: student.profile?.strengths || [],
      improvementAreas: student.profile?.areas_for_improvement || [],
      careerInterests: student.profile?.career_interests || [],
    },
    weeklyTrend: student.dashboard?.weekly_understanding_trend || [],
    pendingActions: {
      feedbackPending: student.dashboard?.feedback_pending || 0,
      aiTipsCount: student.dashboard?.ai_tips_count || 0,
    },
  };
}

// ============================================
// EXAMPLE 5: Analytics & Insights
// ============================================
export function generateAnalyticsDashboard() {
  const stats = dataHelpers.getPlatformStats();
  const deptStats = dataHelpers.getDepartmentStats();
  const learningStyles = dataHelpers.getLearningStyleDistribution();
  const teachingStyles = dataHelpers.getTeachingStyleDistribution();
  const cgpaDistribution = dataHelpers.getCGPADistribution();
  
  return {
    overview: {
      totalProfessors: stats.totalProfessors,
      totalStudents: stats.totalStudents,
      totalCourses: stats.totalCourses,
      avgCGPA: stats.avgCGPA,
      avgProfessorRating: stats.avgProfessorRating,
      avgCourseHealth: stats.avgCourseHealth,
    },
    alerts: {
      highEngagementStudents: stats.highEngagementStudents,
      atRiskStudents: stats.atRiskStudents,
      healthyCourses: stats.healthyCourses,
      strugglingCourses: stats.strugglingCourses,
    },
    departmentBreakdown: deptStats,
    learningStyleDistribution: learningStyles,
    teachingStyleDistribution: teachingStyles,
    cgpaDistribution: cgpaDistribution,
    topPerformers: {
      professors: dataHelpers.getTopRatedProfessors(3),
      students: dataHelpers.getTopPerformingStudents(5),
    },
    needsAttention: {
      atRiskStudents: dataHelpers.getAtRiskStudents(),
      strugglingCourses: dataHelpers.getStrugglingCourses(),
    },
  };
}

// ============================================
// EXAMPLE 6: Search & Filter
// ============================================
export function searchExamples() {
  // Search professors
  const professorsByName = dataHelpers.searchUsers('Rajesh', 'professor');
  console.log('Search professors named Rajesh:', professorsByName);
  
  // Search students
  const studentsByName = dataHelpers.searchUsers('Sharma', 'student');
  console.log('Search students with Sharma:', studentsByName);
  
  // Search courses
  const dataStructureCourses = dataHelpers.searchCourses('Data');
  console.log('Courses with "Data":', dataStructureCourses);
  
  // Filter by department
  const csStudents = dataHelpers.getStudentsByDepartment('Computer Science');
  console.log('CS Students:', csStudents.length);
  
  // Filter by learning style
  const visualLearners = dataHelpers.getStudentsByLearningStyle('visual');
  console.log('Visual learners:', visualLearners.length);
  
  // Filter by participation
  const highParticipation = dataHelpers.getStudentsByParticipation('high');
  console.log('High participation students:', highParticipation.length);
  
  // Filter by teaching style
  const interactiveProfessors = dataHelpers.getProfessorsByTeachingStyle('interactive');
  console.log('Interactive teaching professors:', interactiveProfessors.length);
  
  return {
    professorsByName,
    studentsByName,
    dataStructureCourses,
    csStudents: csStudents.length,
    visualLearners: visualLearners.length,
    highParticipation: highParticipation.length,
    interactiveProfessors: interactiveProfessors.length,
  };
}

// ============================================
// EXAMPLE 7: Course Management
// ============================================
export function courseManagementExample(professorId: string) {
  const professor = dataHelpers.getProfessorById(professorId);
  const courses = dataHelpers.getCoursesByProfessor(professorId);
  
  return {
    professor: professor?.full_name,
    totalCourses: courses.length,
    courses: courses.map(course => ({
      id: course.id,
      code: course.code,
      title: course.title,
      students: course.student_count,
      health: course.health_pct,
      status: course.health_pct && course.health_pct >= 80 
        ? 'healthy' 
        : course.health_pct && course.health_pct >= 70 
        ? 'normal' 
        : 'needs-attention',
      silentStudents: course.silent_students_count,
      pendingFeedback: course.pending_feedback_count,
    })),
    summary: {
      healthyCourses: courses.filter(c => (c.health_pct ?? 0) >= 80).length,
      normalCourses: courses.filter(c => {
        const h = c.health_pct ?? 0;
        return h >= 70 && h < 80;
      }).length,
      strugglingCourses: courses.filter(c => (c.health_pct ?? 0) < 70).length,
    },
  };
}

// ============================================
// EXAMPLE 8: Student Performance Tracking
// ============================================
export function studentPerformanceTracking(studentId: string) {
  const student = dataHelpers.getStudentById(studentId);
  
  if (!student) return null;
  
  return {
    student: {
      name: student.full_name,
      rollNumber: student.roll_number,
    },
    academics: {
      cgpa: student.profile?.cgpa,
      year: student.profile?.year,
      studyHours: student.profile?.avg_study_hours_per_week,
    },
    engagement: {
      lecturesAttended: student.dashboard?.total_lectures_attended,
      feedbackSubmitted: student.dashboard?.feedback_submitted,
      responseRate: student.dashboard?.response_rate,
      currentStreak: student.dashboard?.engagement_streak_days,
      longestStreak: student.dashboard?.longest_streak,
    },
    performance: {
      avgUnderstanding: student.dashboard?.avg_understanding_pct,
      weakTopics: student.dashboard?.weak_topics_count,
      strongTopics: student.dashboard?.strong_topics_count,
      weeklyTrend: student.dashboard?.weekly_understanding_trend,
    },
    comparison: {
      peerPercentile: student.dashboard?.peer_comparison_percentile,
      aboveAverage: (student.dashboard?.peer_comparison_percentile ?? 0) >= 50,
      topPerformer: (student.dashboard?.peer_comparison_percentile ?? 0) >= 90,
    },
    alerts: {
      coursesAtRisk: student.dashboard?.courses_at_risk,
      lowAttendance: (student.profile?.attendance_rate ?? 100) < 85,
      lowParticipation: student.profile?.participation_level === 'low',
    },
  };
}

// ============================================
// EXAMPLE 9: Compare Students
// ============================================
export function compareStudents(studentId1: string, studentId2: string) {
  const student1 = dataHelpers.getStudentById(studentId1);
  const student2 = dataHelpers.getStudentById(studentId2);
  
  if (!student1 || !student2) return null;
  
  return {
    student1: {
      name: student1.full_name,
      cgpa: student1.profile?.cgpa,
      learningStyle: student1.profile?.learning_style,
      participation: student1.profile?.participation_level,
      avgUnderstanding: student1.dashboard?.avg_understanding_pct,
      streak: student1.dashboard?.engagement_streak_days,
      percentile: student1.dashboard?.peer_comparison_percentile,
    },
    student2: {
      name: student2.full_name,
      cgpa: student2.profile?.cgpa,
      learningStyle: student2.profile?.learning_style,
      participation: student2.profile?.participation_level,
      avgUnderstanding: student2.dashboard?.avg_understanding_pct,
      streak: student2.dashboard?.engagement_streak_days,
      percentile: student2.dashboard?.peer_comparison_percentile,
    },
    comparison: {
      cgpaDiff: (student1.profile?.cgpa ?? 0) - (student2.profile?.cgpa ?? 0),
      understandingDiff: (student1.dashboard?.avg_understanding_pct ?? 0) - (student2.dashboard?.avg_understanding_pct ?? 0),
      streakDiff: (student1.dashboard?.engagement_streak_days ?? 0) - (student2.dashboard?.engagement_streak_days ?? 0),
      percentileDiff: (student1.dashboard?.peer_comparison_percentile ?? 0) - (student2.dashboard?.peer_comparison_percentile ?? 0),
    },
  };
}

// ============================================
// EXAMPLE 10: Department Overview
// ============================================
export function departmentOverview(department: string) {
  const professors = dataHelpers.getProfessorsByDepartment(department);
  const students = dataHelpers.getStudentsByDepartment(department);
  const courses = dataHelpers.getCoursesByDepartment(department);
  
  const avgCGPA = students.reduce((sum, s) => {
    const profile = enhancedMockData.studentProfiles.find(p => p.student_id === s.id);
    return sum + (profile?.cgpa ?? 0);
  }, 0) / (students.length || 1);
  
  const avgProfRating = professors.reduce((sum, p) => {
    const profile = enhancedMockData.professorProfiles.find(pr => pr.professor_id === p.id);
    return sum + (profile?.avg_student_rating ?? 0);
  }, 0) / (professors.length || 1);
  
  return {
    department,
    summary: {
      totalProfessors: professors.length,
      totalStudents: students.length,
      totalCourses: courses.length,
      avgStudentCGPA: avgCGPA.toFixed(2),
      avgProfessorRating: avgProfRating.toFixed(2),
    },
    professors: professors.map(p => ({
      name: p.full_name,
      email: p.email,
      coursesCount: dataHelpers.getCoursesByProfessor(p.id).length,
    })),
    students: students.slice(0, 10).map(s => ({
      name: s.full_name,
      rollNumber: s.roll_number,
      cgpa: enhancedMockData.studentProfiles.find(p => p.student_id === s.id)?.cgpa,
    })),
    courses: courses.map(c => ({
      code: c.code,
      title: c.title,
      students: c.student_count,
      health: c.health_pct,
    })),
  };
}

// Export all examples
export default {
  exampleProfessorData,
  exampleStudentData,
  renderProfessorDashboard,
  renderStudentDashboard,
  generateAnalyticsDashboard,
  searchExamples,
  courseManagementExample,
  studentPerformanceTracking,
  compareStudents,
  departmentOverview,
};
