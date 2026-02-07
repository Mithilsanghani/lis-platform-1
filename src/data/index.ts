/**
 * Enhanced Mock Data - Main Export
 * Central export point for all enhanced dummy data
 */

// Export the main data
export { enhancedMockData } from './enhancedMockData';
export type { 
  ProfessorProfile, 
  StudentProfile, 
  ProfessorDashboardData, 
  StudentDashboardData 
} from './enhancedMockData';

// Export helper functions
export { default as dataHelpers } from './dataHelpers';

// Export usage examples
export { default as examples } from './examples';

// Also export original mock data for backward compatibility
export { 
  mockProfessors as mockProfessorsV1,
  mockStudents as mockStudentsV1,
  mockCourses as mockCoursesV1,
  mockLectures as mockLecturesV1,
  mockFeedback as mockFeedbackV1,
  mockStudentMetrics as mockStudentMetricsV1,
  mockTopicPerformance,
  mockProfessorInsights,
  mockStudentInsights,
  mockProfessorDashboard,
  mockStudentDashboard,
} from './mockData';

export {
  mockProfessors as mockProfessorsV2,
  mockStudents as mockStudentsV2, 
  mockCourses as mockCoursesV2,
  mockLectures as mockLecturesV2,
  mockFeedback as mockFeedbackV2,
  mockStudentMetrics as mockStudentMetricsV2,
} from './mockDataV2';

// Re-export all helper functions individually for convenience
export {
  // Professor helpers
  getProfessorById,
  getAllProfessors,
  getProfessorsByDepartment,
  getProfessorsByTeachingStyle,
  getTopRatedProfessors,
  
  // Student helpers
  getStudentById,
  getAllStudents,
  getStudentsByDepartment,
  getStudentsByLearningStyle,
  getStudentsByParticipation,
  getTopPerformingStudents,
  getAtRiskStudents,
  getHighEngagementStudents,
  
  // Course helpers
  getCourseById,
  getCoursesByProfessor,
  getCoursesByDepartment,
  getHealthyCourses,
  getStrugglingCourses,
  
  // Analytics helpers
  getDepartmentStats,
  getLearningStyleDistribution,
  getTeachingStyleDistribution,
  getCGPADistribution,
  getPlatformStats,
  
  // Search helpers
  searchUsers,
  searchCourses,
  
  // Random helpers
  getRandomProfessor,
  getRandomStudent,
  getRandomStudents,
  getRandomCourse,
  
  // Demo generators
  generateDemoProfessorDashboard,
  generateDemoStudentDashboard,
} from './dataHelpers';

// Quick access to main data collections
import { enhancedMockData } from './enhancedMockData';

export const {
  professors,
  students,
  professorProfiles,
  studentProfiles,
  courses,
  professorDashboards,
  studentDashboards,
} = enhancedMockData;

/**
 * Quick starter - Get everything you need in one call
 */
export function getAllData() {
  return {
    professors: enhancedMockData.professors,
    students: enhancedMockData.students,
    professorProfiles: enhancedMockData.professorProfiles,
    studentProfiles: enhancedMockData.studentProfiles,
    courses: enhancedMockData.courses,
    professorDashboards: enhancedMockData.professorDashboards,
    studentDashboards: enhancedMockData.studentDashboards,
  };
}

/**
 * Get sample data for quick testing
 */
export function getSampleData() {
  return {
    sampleProfessor: enhancedMockData.professors[0],
    sampleStudent: enhancedMockData.students[0],
    sampleCourse: enhancedMockData.courses[0],
    sampleProfessorProfile: enhancedMockData.professorProfiles[0],
    sampleStudentProfile: enhancedMockData.studentProfiles[0],
    sampleProfessorDashboard: enhancedMockData.professorDashboards[0],
    sampleStudentDashboard: enhancedMockData.studentDashboards[0],
  };
}

// Default export
export default {
  data: enhancedMockData,
  getAllData,
  getSampleData,
};
