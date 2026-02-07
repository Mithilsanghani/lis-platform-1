/**
 * LIS Mock Data
 * Realistic seed data for development
 */

import type {
  User,
  Course,
  Lecture,
  Feedback,
  AIInsight,
  UnderstandingLevel,
  FeedbackReason,
  StudentMetrics,
  TopicPerformance,
} from '../types/lis';

// ============================================
// USERS
// ============================================

export const mockProfessors: User[] = [
  {
    id: 'prof-1',
    role: 'professor',
    full_name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@iitgn.ac.in',
    department: 'Computer Science',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prof-2',
    role: 'professor',
    full_name: 'Dr. Priya Sharma',
    email: 'priya.sharma@iitgn.ac.in',
    department: 'Computer Science',
    created_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 'prof-3',
    role: 'professor',
    full_name: 'Dr. Amit Patel',
    email: 'amit.patel@iitgn.ac.in',
    department: 'Mathematics',
    created_at: '2024-02-01T10:00:00Z',
  },
];

export const mockStudents: User[] = [
  { id: 'stu-1', role: 'student', full_name: 'Rahul Sharma', email: 'rahul.s@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10045', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-2', role: 'student', full_name: 'Ananya Gupta', email: 'ananya.g@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10012', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-3', role: 'student', full_name: 'Vikram Singh', email: 'vikram.s@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10078', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-4', role: 'student', full_name: 'Priyanka Reddy', email: 'priyanka.r@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10052', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-5', role: 'student', full_name: 'Arjun Nair', email: 'arjun.n@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10008', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-6', role: 'student', full_name: 'Sneha Iyer', email: 'sneha.i@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10065', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-7', role: 'student', full_name: 'Karan Mehta', email: 'karan.m@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10034', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-8', role: 'student', full_name: 'Divya Joshi', email: 'divya.j@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10021', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-9', role: 'student', full_name: 'Rohan Verma', email: 'rohan.v@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10058', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-10', role: 'student', full_name: 'Meera Krishnan', email: 'meera.k@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10041', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-11', role: 'student', full_name: 'Aditya Saxena', email: 'aditya.s@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10003', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-12', role: 'student', full_name: 'Pooja Desai', email: 'pooja.d@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10049', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-13', role: 'student', full_name: 'Nikhil Rao', email: 'nikhil.r@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10044', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-14', role: 'student', full_name: 'Sanya Kapoor', email: 'sanya.k@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10061', created_at: '2024-08-01T10:00:00Z' },
  { id: 'stu-15', role: 'student', full_name: 'Harsh Agarwal', email: 'harsh.a@iitgn.ac.in', department: 'Computer Science', roll_number: '21CS10028', created_at: '2024-08-01T10:00:00Z' },
];

// ============================================
// COURSES
// ============================================

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    code: 'CS201',
    title: 'Advanced Data Structures',
    semester: 'Spring 2026',
    department: 'Computer Science',
    created_by: 'prof-1',
    created_at: '2026-01-10T10:00:00Z',
    student_count: 45,
    lecture_count: 12,
    health_pct: 78,
    silent_students_count: 8,
    pending_feedback_count: 12,
  },
  {
    id: 'course-2',
    code: 'CS202',
    title: 'Algorithms & Complexity',
    semester: 'Spring 2026',
    department: 'Computer Science',
    created_by: 'prof-2',
    created_at: '2026-01-10T10:00:00Z',
    student_count: 52,
    lecture_count: 10,
    health_pct: 85,
    silent_students_count: 5,
    pending_feedback_count: 8,
  },
  {
    id: 'course-3',
    code: 'CS301',
    title: 'Machine Learning',
    semester: 'Spring 2026',
    department: 'Computer Science',
    created_by: 'prof-1',
    created_at: '2026-01-10T10:00:00Z',
    student_count: 38,
    lecture_count: 8,
    health_pct: 65,
    silent_students_count: 12,
    pending_feedback_count: 18,
  },
  {
    id: 'course-4',
    code: 'MA201',
    title: 'Linear Algebra',
    semester: 'Spring 2026',
    department: 'Mathematics',
    created_by: 'prof-3',
    created_at: '2026-01-10T10:00:00Z',
    student_count: 60,
    lecture_count: 14,
    health_pct: 92,
    silent_students_count: 3,
    pending_feedback_count: 5,
  },
];

// ============================================
// LECTURES
// ============================================

export const mockLectures: Lecture[] = [
  // CS201 Lectures
  {
    id: 'lec-1',
    course_id: 'course-1',
    title: 'Binary Search Trees',
    date_time: '2026-01-20T10:00:00Z',
    topics: ['BST Basics', 'Insertion', 'Deletion', 'Search Operations'],
    feedback_deadline: '2026-01-21T23:59:59Z',
    created_at: '2026-01-15T10:00:00Z',
    feedback_count: 38,
  },
  {
    id: 'lec-2',
    course_id: 'course-1',
    title: 'AVL Trees',
    date_time: '2026-01-22T10:00:00Z',
    topics: ['Balance Factor', 'Rotations', 'LL Rotation', 'RR Rotation', 'LR Rotation', 'RL Rotation'],
    feedback_deadline: '2026-01-23T23:59:59Z',
    created_at: '2026-01-15T10:00:00Z',
    feedback_count: 42,
  },
  {
    id: 'lec-3',
    course_id: 'course-1',
    title: 'Red-Black Trees',
    date_time: '2026-01-27T10:00:00Z',
    topics: ['RB Properties', 'Insertion Cases', 'Deletion Cases', 'Recoloring'],
    feedback_deadline: '2026-01-28T23:59:59Z',
    created_at: '2026-01-20T10:00:00Z',
    feedback_count: 35,
  },
  {
    id: 'lec-4',
    course_id: 'course-1',
    title: 'Graph Representations',
    date_time: '2026-01-29T10:00:00Z',
    topics: ['Adjacency Matrix', 'Adjacency List', 'Edge List', 'Weighted Graphs'],
    created_at: '2026-01-22T10:00:00Z',
    feedback_count: 40,
  },
  {
    id: 'lec-5',
    course_id: 'course-1',
    title: 'Graph Traversals',
    date_time: '2026-01-29T14:00:00Z',
    topics: ['BFS', 'DFS', 'Applications', 'Time Complexity'],
    created_at: '2026-01-22T10:00:00Z',
    feedback_count: 0, // Today's lecture, no feedback yet
  },
  // CS301 Lectures (ML)
  {
    id: 'lec-6',
    course_id: 'course-3',
    title: 'Neural Networks Basics',
    date_time: '2026-01-25T14:00:00Z',
    topics: ['Perceptron', 'Activation Functions', 'Forward Propagation', 'Loss Functions'],
    created_at: '2026-01-20T10:00:00Z',
    feedback_count: 32,
  },
  {
    id: 'lec-7',
    course_id: 'course-3',
    title: 'Backpropagation',
    date_time: '2026-01-27T14:00:00Z',
    topics: ['Chain Rule', 'Gradient Computation', 'Weight Updates', 'Vanishing Gradients'],
    created_at: '2026-01-20T10:00:00Z',
    feedback_count: 28,
  },
];

// ============================================
// FEEDBACK
// ============================================

function generateFeedback(
  lectureId: string,
  studentId: string,
  understanding: UnderstandingLevel,
  reasons: FeedbackReason[] = [],
  subtopics: string[] = [],
  comment: string = ''
): Feedback {
  return {
    id: `fb-${lectureId}-${studentId}`,
    lecture_id: lectureId,
    student_id: studentId,
    understanding,
    reasons,
    subtopics,
    comment,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const mockFeedback: Feedback[] = [
  // Lecture 1 - BST (mostly understood)
  generateFeedback('lec-1', 'stu-1', 'full', ['good_explanation'], ['BST Basics'], 'Great introduction!'),
  generateFeedback('lec-1', 'stu-2', 'full', ['helpful_examples'], ['Insertion']),
  generateFeedback('lec-1', 'stu-3', 'partial', ['pace_fast'], ['Deletion'], 'Deletion was a bit fast'),
  generateFeedback('lec-1', 'stu-4', 'full', [], ['Search Operations']),
  generateFeedback('lec-1', 'stu-5', 'partial', ['examples_few'], ['Deletion']),
  generateFeedback('lec-1', 'stu-6', 'full', ['good_explanation'], []),
  generateFeedback('lec-1', 'stu-7', 'unclear', ['concept_unclear', 'pace_fast'], ['Deletion'], 'Confused about deletion cases'),
  generateFeedback('lec-1', 'stu-8', 'full', [], []),
  generateFeedback('lec-1', 'stu-9', 'partial', ['examples_few'], ['BST Basics']),
  generateFeedback('lec-1', 'stu-10', 'full', ['helpful_examples'], []),

  // Lecture 2 - AVL Trees (more confusion on rotations)
  generateFeedback('lec-2', 'stu-1', 'partial', ['pace_fast'], ['Rotations'], 'Rotations need more practice'),
  generateFeedback('lec-2', 'stu-2', 'unclear', ['concept_unclear', 'examples_few'], ['RL Rotation', 'LR Rotation'], 'Double rotations very confusing'),
  generateFeedback('lec-2', 'stu-3', 'unclear', ['pace_fast', 'concept_unclear'], ['Rotations']),
  generateFeedback('lec-2', 'stu-4', 'partial', ['examples_few'], ['Balance Factor']),
  generateFeedback('lec-2', 'stu-5', 'full', ['good_explanation'], []),
  generateFeedback('lec-2', 'stu-6', 'partial', ['pace_fast'], ['LL Rotation', 'RR Rotation']),
  generateFeedback('lec-2', 'stu-7', 'unclear', ['concept_unclear'], ['LR Rotation'], ''),  // Silent student - no comment
  generateFeedback('lec-2', 'stu-8', 'partial', [], ['Rotations']),
  generateFeedback('lec-2', 'stu-9', 'unclear', ['examples_few', 'concept_unclear'], ['RL Rotation']),
  generateFeedback('lec-2', 'stu-10', 'partial', ['pace_fast'], []),
  generateFeedback('lec-2', 'stu-11', 'unclear', ['concept_unclear'], ['Rotations'], ''),  // Silent student
  generateFeedback('lec-2', 'stu-12', 'full', [], []),

  // Lecture 3 - Red-Black Trees (high confusion)
  generateFeedback('lec-3', 'stu-1', 'unclear', ['concept_unclear', 'pace_fast'], ['Deletion Cases'], 'RB deletion is very complex'),
  generateFeedback('lec-3', 'stu-2', 'unclear', ['concept_unclear'], ['Insertion Cases', 'Recoloring']),
  generateFeedback('lec-3', 'stu-3', 'partial', ['examples_few'], ['RB Properties']),
  generateFeedback('lec-3', 'stu-4', 'unclear', ['pace_fast', 'concept_unclear'], ['Deletion Cases'], ''),
  generateFeedback('lec-3', 'stu-5', 'partial', ['examples_few'], ['Recoloring']),
  generateFeedback('lec-3', 'stu-6', 'unclear', ['concept_unclear'], ['Insertion Cases'], ''),
  generateFeedback('lec-3', 'stu-7', 'unclear', ['concept_unclear', 'pace_fast'], ['Deletion Cases'], ''),  // Silent student
  generateFeedback('lec-3', 'stu-8', 'partial', ['pace_fast'], []),
  generateFeedback('lec-3', 'stu-9', 'unclear', ['concept_unclear'], ['Recoloring'], ''),

  // Lecture 6 - Neural Networks (mixed)
  generateFeedback('lec-6', 'stu-1', 'full', ['good_explanation'], ['Perceptron']),
  generateFeedback('lec-6', 'stu-2', 'partial', ['examples_few'], ['Loss Functions']),
  generateFeedback('lec-6', 'stu-3', 'unclear', ['concept_unclear'], ['Forward Propagation', 'Loss Functions'], 'Math is hard'),
  generateFeedback('lec-6', 'stu-4', 'full', [], []),
  generateFeedback('lec-6', 'stu-5', 'partial', ['pace_fast'], ['Activation Functions']),

  // Lecture 7 - Backpropagation (very confused)
  generateFeedback('lec-7', 'stu-1', 'unclear', ['concept_unclear', 'pace_fast'], ['Chain Rule', 'Gradient Computation'], 'Need more examples'),
  generateFeedback('lec-7', 'stu-2', 'unclear', ['concept_unclear'], ['Vanishing Gradients']),
  generateFeedback('lec-7', 'stu-3', 'unclear', ['pace_fast', 'examples_few'], ['Weight Updates'], ''),
  generateFeedback('lec-7', 'stu-4', 'partial', ['examples_few'], ['Chain Rule']),
  generateFeedback('lec-7', 'stu-5', 'unclear', ['concept_unclear'], ['Gradient Computation'], ''),
];

// ============================================
// STUDENT METRICS
// ============================================

export const mockStudentMetrics: StudentMetrics[] = [
  { student_id: 'stu-1', course_id: 'course-1', understanding_pct: 78, feedback_submitted_count: 12, streak_days: 12, last_feedback_at: '2026-01-29T11:00:00Z', is_silent: false, risk_level: 'low' },
  { student_id: 'stu-2', course_id: 'course-1', understanding_pct: 65, feedback_submitted_count: 10, streak_days: 8, last_feedback_at: '2026-01-28T15:00:00Z', is_silent: false, risk_level: 'medium' },
  { student_id: 'stu-3', course_id: 'course-1', understanding_pct: 55, feedback_submitted_count: 11, streak_days: 5, last_feedback_at: '2026-01-27T10:00:00Z', is_silent: true, risk_level: 'high' },
  { student_id: 'stu-4', course_id: 'course-1', understanding_pct: 72, feedback_submitted_count: 9, streak_days: 9, last_feedback_at: '2026-01-29T09:00:00Z', is_silent: false, risk_level: 'low' },
  { student_id: 'stu-5', course_id: 'course-1', understanding_pct: 82, feedback_submitted_count: 12, streak_days: 12, last_feedback_at: '2026-01-29T10:30:00Z', is_silent: false, risk_level: 'low' },
  { student_id: 'stu-6', course_id: 'course-1', understanding_pct: 68, feedback_submitted_count: 8, streak_days: 4, last_feedback_at: '2026-01-26T14:00:00Z', is_silent: false, risk_level: 'medium' },
  { student_id: 'stu-7', course_id: 'course-1', understanding_pct: 42, feedback_submitted_count: 10, streak_days: 7, last_feedback_at: '2026-01-28T11:00:00Z', is_silent: true, risk_level: 'high' },
  { student_id: 'stu-8', course_id: 'course-1', understanding_pct: 75, feedback_submitted_count: 11, streak_days: 11, last_feedback_at: '2026-01-29T10:00:00Z', is_silent: false, risk_level: 'low' },
  { student_id: 'stu-9', course_id: 'course-1', understanding_pct: 48, feedback_submitted_count: 9, streak_days: 3, last_feedback_at: '2026-01-25T16:00:00Z', is_silent: true, risk_level: 'high' },
  { student_id: 'stu-10', course_id: 'course-1', understanding_pct: 85, feedback_submitted_count: 12, streak_days: 12, last_feedback_at: '2026-01-29T11:30:00Z', is_silent: false, risk_level: 'low' },
];

// ============================================
// TOPIC PERFORMANCE
// ============================================

export const mockTopicPerformance: TopicPerformance[] = [
  { topic: 'BST Basics', course_id: 'course-1', full_count: 35, partial_count: 8, unclear_count: 2, total_count: 45, clarity_pct: 87, trend: 'stable' },
  { topic: 'BST Insertion', course_id: 'course-1', full_count: 32, partial_count: 10, unclear_count: 3, total_count: 45, clarity_pct: 82, trend: 'improving' },
  { topic: 'BST Deletion', course_id: 'course-1', full_count: 18, partial_count: 15, unclear_count: 12, total_count: 45, clarity_pct: 57, trend: 'declining' },
  { topic: 'AVL Rotations', course_id: 'course-1', full_count: 12, partial_count: 18, unclear_count: 15, total_count: 45, clarity_pct: 47, trend: 'declining' },
  { topic: 'Red-Black Properties', course_id: 'course-1', full_count: 8, partial_count: 12, unclear_count: 18, total_count: 38, clarity_pct: 37, trend: 'declining' },
  { topic: 'Graph BFS', course_id: 'course-1', full_count: 30, partial_count: 10, unclear_count: 5, total_count: 45, clarity_pct: 78, trend: 'stable' },
  { topic: 'Graph DFS', course_id: 'course-1', full_count: 28, partial_count: 12, unclear_count: 5, total_count: 45, clarity_pct: 76, trend: 'stable' },
];

// ============================================
// AI INSIGHTS
// ============================================

export const mockProfessorInsights: AIInsight[] = [
  {
    id: 'ins-1',
    owner_type: 'course',
    owner_id: 'course-1',
    priority: 'high',
    title: '18 Silent Students Detected',
    description: 'These students consistently mark "partial" or "unclear" but rarely leave comments. Consider reaching out individually.',
    action: 'View silent students',
    action_route: '/professor/students?filter=silent',
    created_at: '2026-01-29T08:00:00Z',
  },
  {
    id: 'ins-2',
    owner_type: 'lecture',
    owner_id: 'lec-3',
    priority: 'high',
    title: 'Red-Black Trees Need Revision',
    description: '65% of students marked "need clarity" on Red-Black deletion. Schedule a revision session.',
    action: 'Plan revision',
    action_route: '/professor/courses/course-1/revision',
    created_at: '2026-01-28T18:00:00Z',
  },
  {
    id: 'ins-3',
    owner_type: 'course',
    owner_id: 'course-1',
    priority: 'medium',
    title: 'AVL Rotations Confusion Persists',
    description: 'Double rotations (LR/RL) are still confusing 40% of students. More visual examples recommended.',
    action: 'View topic analytics',
    action_route: '/professor/courses/course-1/analytics',
    created_at: '2026-01-27T10:00:00Z',
  },
  {
    id: 'ins-4',
    owner_type: 'course',
    owner_id: 'course-3',
    priority: 'high',
    title: 'ML Course Health Declining',
    description: 'Course health dropped from 78% to 65% after Backpropagation lecture. Students need foundational math review.',
    created_at: '2026-01-28T12:00:00Z',
  },
  {
    id: 'ins-5',
    owner_type: 'course',
    owner_id: 'course-4',
    priority: 'low',
    title: 'Linear Algebra Performing Well',
    description: '92% average clarity score. Top performing course this semester.',
    created_at: '2026-01-29T06:00:00Z',
  },
];

export const mockStudentInsights: AIInsight[] = [
  {
    id: 'stu-ins-1',
    owner_type: 'student',
    owner_id: 'stu-1',
    priority: 'medium',
    title: 'Focus on Tree Rotations',
    description: 'You marked "need clarity" on AVL and RB tree rotations. Review these before the next lecture.',
    action: 'View weak topics',
    action_route: '/student/performance',
    created_at: '2026-01-29T07:00:00Z',
  },
  {
    id: 'stu-ins-2',
    owner_type: 'student',
    owner_id: 'stu-1',
    priority: 'low',
    title: 'Great engagement streak! 🔥',
    description: "You've submitted feedback for 12 consecutive lectures. Keep it up!",
    created_at: '2026-01-29T08:00:00Z',
  },
  {
    id: 'stu-ins-3',
    owner_type: 'student',
    owner_id: 'stu-1',
    priority: 'medium',
    title: 'Morning lectures work better for you',
    description: 'Your understanding scores are 15% higher in morning lectures vs afternoon.',
    created_at: '2026-01-28T20:00:00Z',
  },
];

// ============================================
// DASHBOARD SUMMARIES
// ============================================

export const mockProfessorDashboard = {
  total_students: 135,
  total_courses: 4,
  active_lectures: 28,
  new_feedback_count: 48,
  avg_engagement_pct: 82,
  silent_students_count: 18,
  topics_needing_revision: [
    { topic: 'Red-Black Deletion', course_code: 'CS201', confusion_score: 85 },
    { topic: 'AVL Rotations', course_code: 'CS201', confusion_score: 72 },
    { topic: 'Backpropagation', course_code: 'CS301', confusion_score: 68 },
    { topic: 'BST Deletion', course_code: 'CS201', confusion_score: 45 },
  ],
  recent_insights: mockProfessorInsights.slice(0, 3),
};

export const mockStudentDashboard = {
  enrolled_courses: 3,
  feedback_submitted: 28,
  avg_clarity_score: 78,
  engagement_streak: 12,
  pending_feedback_count: 2,
  today_lectures: mockLectures.filter(l => l.id === 'lec-5'),
  ai_tip: mockStudentInsights[0],
};
