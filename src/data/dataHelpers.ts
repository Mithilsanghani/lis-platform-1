/**
 * Data Access Helper
 * Utility functions to easily access and filter mock data
 */

import { enhancedMockData } from './enhancedMockData';
import type { User} from '../types/lis';

// ============================================
// PROFESSOR HELPERS
// ============================================

/**
 * Get complete professor data by ID
 */
export function getProfessorById(professorId: string) {
  const basic = enhancedMockData.professors.find(p => p.id === professorId);
  const profile = enhancedMockData.professorProfiles.find(p => p.professor_id === professorId);
  const dashboard = enhancedMockData.professorDashboards.find(p => p.professor_id === professorId);
  
  return basic ? { ...basic, profile, dashboard } : null;
}

/**
 * Get all professors with their profiles
 */
export function getAllProfessors() {
  return enhancedMockData.professors.map(prof => ({
    ...prof,
    profile: enhancedMockData.professorProfiles.find(p => p.professor_id === prof.id),
    dashboard: enhancedMockData.professorDashboards.find(p => p.professor_id === prof.id),
  }));
}

/**
 * Get professors by department
 */
export function getProfessorsByDepartment(department: string) {
  return enhancedMockData.professors.filter(p => p.department === department);
}

/**
 * Get professors by teaching style
 */
export function getProfessorsByTeachingStyle(style: 'interactive' | 'lecture-heavy' | 'project-based' | 'balanced') {
  const matchingProfiles = enhancedMockData.professorProfiles.filter(p => p.teaching_style === style);
  const profIds = matchingProfiles.map(p => p.professor_id);
  return enhancedMockData.professors.filter(p => profIds.includes(p.id));
}

/**
 * Get top-rated professors
 */
export function getTopRatedProfessors(limit = 5) {
  const allProfs = getAllProfessors();
  return allProfs
    .filter(p => p.profile)
    .sort((a, b) => (b.profile?.avg_student_rating ?? 0) - (a.profile?.avg_student_rating ?? 0))
    .slice(0, limit);
}

// ============================================
// STUDENT HELPERS
// ============================================

/**
 * Get complete student data by ID
 */
export function getStudentById(studentId: string) {
  const basic = enhancedMockData.students.find(s => s.id === studentId);
  const profile = enhancedMockData.studentProfiles.find(s => s.student_id === studentId);
  const dashboard = enhancedMockData.studentDashboards.find(s => s.student_id === studentId);
  
  return basic ? { ...basic, profile, dashboard } : null;
}

/**
 * Get all students with their profiles
 */
export function getAllStudents() {
  return enhancedMockData.students.map(stu => ({
    ...stu,
    profile: enhancedMockData.studentProfiles.find(s => s.student_id === stu.id),
    dashboard: enhancedMockData.studentDashboards.find(s => s.student_id === stu.id),
  }));
}

/**
 * Get students by department
 */
export function getStudentsByDepartment(department: string) {
  return enhancedMockData.students.filter(s => s.department === department);
}

/**
 * Get students by learning style
 */
export function getStudentsByLearningStyle(style: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing') {
  const matchingProfiles = enhancedMockData.studentProfiles.filter(s => s.learning_style === style);
  const stuIds = matchingProfiles.map(s => s.student_id);
  return enhancedMockData.students.filter(s => stuIds.includes(s.id));
}

/**
 * Get students by participation level
 */
export function getStudentsByParticipation(level: 'high' | 'medium' | 'low') {
  const matchingProfiles = enhancedMockData.studentProfiles.filter(s => s.participation_level === level);
  const stuIds = matchingProfiles.map(s => s.student_id);
  return enhancedMockData.students.filter(s => stuIds.includes(s.id));
}

/**
 * Get top-performing students
 */
export function getTopPerformingStudents(limit = 10) {
  const allStudents = getAllStudents();
  return allStudents
    .filter(s => s.profile)
    .sort((a, b) => (b.profile?.cgpa ?? 0) - (a.profile?.cgpa ?? 0))
    .slice(0, limit);
}

/**
 * Get at-risk students (low CGPA or engagement)
 */
export function getAtRiskStudents() {
  const allStudents = getAllStudents();
  return allStudents.filter(s => {
    const cgpa = s.profile?.cgpa ?? 10;
    const participation = s.profile?.participation_level;
    const attendance = s.profile?.attendance_rate ?? 100;
    
    return cgpa < 7.5 || participation === 'low' || attendance < 85;
  });
}

/**
 * Get students with high engagement
 */
export function getHighEngagementStudents() {
  const allStudents = getAllStudents();
  return allStudents.filter(s => {
    const responseRate = s.dashboard?.response_rate ?? 0;
    const streak = s.dashboard?.engagement_streak_days ?? 0;
    
    return responseRate >= 95 && streak >= 10;
  });
}

// ============================================
// COURSE HELPERS
// ============================================

/**
 * Get course by ID
 */
export function getCourseById(courseId: string) {
  return enhancedMockData.courses.find(c => c.id === courseId);
}

/**
 * Get courses by professor
 */
export function getCoursesByProfessor(professorId: string) {
  return enhancedMockData.courses.filter(c => c.created_by === professorId);
}

/**
 * Get courses by department
 */
export function getCoursesByDepartment(department: string) {
  return enhancedMockData.courses.filter(c => c.department === department);
}

/**
 * Get courses by health status
 */
export function getCoursesByHealthStatus(minHealth?: number, maxHealth?: number) {
  return enhancedMockData.courses.filter(c => {
    const health = c.health_pct ?? 0;
    if (minHealth !== undefined && health < minHealth) return false;
    if (maxHealth !== undefined && health > maxHealth) return false;
    return true;
  });
}

/**
 * Get healthy courses (>80% health)
 */
export function getHealthyCourses() {
  return getCoursesByHealthStatus(80);
}

/**
 * Get struggling courses (<70% health)
 */
export function getStrugglingCourses() {
  return getCoursesByHealthStatus(undefined, 70);
}

// ============================================
// ANALYTICS HELPERS
// ============================================

/**
 * Get department statistics
 */
export function getDepartmentStats() {
  const departments = new Set([
    ...enhancedMockData.professors.map(p => p.department),
    ...enhancedMockData.students.map(s => s.department),
  ]);
  
  return Array.from(departments).map(dept => ({
    department: dept,
    professors: getProfessorsByDepartment(dept).length,
    students: getStudentsByDepartment(dept).length,
    courses: getCoursesByDepartment(dept).length,
  }));
}

/**
 * Get learning style distribution
 */
export function getLearningStyleDistribution() {
  const styles = ['visual', 'auditory', 'kinesthetic', 'reading-writing'] as const;
  return styles.map(style => ({
    style,
    count: enhancedMockData.studentProfiles.filter(s => s.learning_style === style).length,
  }));
}

/**
 * Get teaching style distribution
 */
export function getTeachingStyleDistribution() {
  const styles = ['interactive', 'lecture-heavy', 'project-based', 'balanced'] as const;
  return styles.map(style => ({
    style,
    count: enhancedMockData.professorProfiles.filter(p => p.teaching_style === style).length,
  }));
}

/**
 * Get CGPA distribution
 */
export function getCGPADistribution() {
  const ranges = [
    { label: '9.0-10.0', min: 9.0, max: 10.0 },
    { label: '8.0-8.9', min: 8.0, max: 8.9 },
    { label: '7.0-7.9', min: 7.0, max: 7.9 },
    { label: 'Below 7.0', min: 0, max: 6.9 },
  ];
  
  return ranges.map(range => ({
    ...range,
    count: enhancedMockData.studentProfiles.filter(
      s => s.cgpa >= range.min && s.cgpa <= range.max
    ).length,
  }));
}

/**
 * Get overall platform statistics
 */
export function getPlatformStats() {
  return {
    totalProfessors: enhancedMockData.professors.length,
    totalStudents: enhancedMockData.students.length,
    totalCourses: enhancedMockData.courses.length,
    avgCGPA: (
      enhancedMockData.studentProfiles.reduce((sum, s) => sum + s.cgpa, 0) /
      enhancedMockData.studentProfiles.length
    ).toFixed(2),
    avgProfessorRating: (
      enhancedMockData.professorProfiles.reduce((sum, p) => sum + p.avg_student_rating, 0) /
      enhancedMockData.professorProfiles.length
    ).toFixed(2),
    avgCourseHealth: (
      enhancedMockData.courses.reduce((sum, c) => sum + (c.health_pct ?? 0), 0) /
      enhancedMockData.courses.length
    ).toFixed(1),
    highEngagementStudents: getHighEngagementStudents().length,
    atRiskStudents: getAtRiskStudents().length,
    healthyCourses: getHealthyCourses().length,
    strugglingCourses: getStrugglingCourses().length,
  };
}

// ============================================
// SEARCH HELPERS
// ============================================

/**
 * Search users (professors or students) by name or email
 */
export function searchUsers(query: string, role?: 'professor' | 'student'): User[] {
  const allUsers = role === 'professor' 
    ? enhancedMockData.professors
    : role === 'student'
    ? enhancedMockData.students
    : [...enhancedMockData.professors, ...enhancedMockData.students];
  
  const lowerQuery = query.toLowerCase();
  return allUsers.filter(u => 
    u.full_name.toLowerCase().includes(lowerQuery) ||
    u.email.toLowerCase().includes(lowerQuery) ||
    (u.roll_number && u.roll_number.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Search courses by code or title
 */
export function searchCourses(query: string) {
  const lowerQuery = query.toLowerCase();
  return enhancedMockData.courses.filter(c =>
    c.code.toLowerCase().includes(lowerQuery) ||
    c.title.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// RANDOM DATA HELPERS (for demos)
// ============================================

/**
 * Get a random professor
 */
export function getRandomProfessor() {
  const professors = enhancedMockData.professors;
  return professors[Math.floor(Math.random() * professors.length)];
}

/**
 * Get a random student
 */
export function getRandomStudent() {
  const students = enhancedMockData.students;
  return students[Math.floor(Math.random() * students.length)];
}

/**
 * Get random students
 */
export function getRandomStudents(count: number) {
  const students = [...enhancedMockData.students];
  const shuffled = students.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, students.length));
}

/**
 * Get a random course
 */
export function getRandomCourse() {
  const courses = enhancedMockData.courses;
  return courses[Math.floor(Math.random() * courses.length)];
}

// ============================================
// DEMO DATA GENERATORS
// ============================================

/**
 * Generate demo professor dashboard
 */
export function generateDemoProfessorDashboard(professorId?: string) {
  const profId = professorId || getRandomProfessor().id;
  return getProfessorById(profId);
}

/**
 * Generate demo student dashboard
 */
export function generateDemoStudentDashboard(studentId?: string) {
  const stuId = studentId || getRandomStudent().id;
  return getStudentById(stuId);
}

// Export all
export default {
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
};
