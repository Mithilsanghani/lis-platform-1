/**
 * LIS v2.0 - Mock Data
 * Comprehensive mock data for development and testing
 */

import type {
  User,
  Course,
  Lecture,
  Feedback,
  StudentMetrics,
  LectureInsights,
  CourseInsights,
  SilentFlag,
  SilentReason,
  UnderstandingLevel,
  FeedbackReason,
  UserRole,
  TrendDirection,
} from '../types/lis-v2';

// ================== Helper Functions ==================

const generateId = () => Math.random().toString(36).substr(2, 9);

const randomInt = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// ================== Users ==================

export const mockStudents: User[] = [
  { id: 's1', email: 'alex@university.edu', full_name: 'Alex Johnson', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
  { id: 's2', email: 'emma@university.edu', full_name: 'Emma Wilson', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
  { id: 's3', email: 'michael@university.edu', full_name: 'Michael Brown', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
  { id: 's4', email: 'sarah@university.edu', full_name: 'Sarah Davis', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
  { id: 's5', email: 'james@university.edu', full_name: 'James Miller', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
  { id: 's6', email: 'olivia@university.edu', full_name: 'Olivia Garcia', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
  { id: 's7', email: 'david@university.edu', full_name: 'David Martinez', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
  { id: 's8', email: 'sophia@university.edu', full_name: 'Sophia Anderson', role: 'student', department: 'Computer Science', is_active: true, created_at: daysAgo(180), updated_at: daysAgo(1) },
];

export const mockProfessors: User[] = [
  { id: 'p1', email: 'prof.smith@university.edu', full_name: 'Dr. John Smith', role: 'professor', department: 'Computer Science', is_active: true, created_at: daysAgo(365), updated_at: daysAgo(1) },
  { id: 'p2', email: 'prof.jones@university.edu', full_name: 'Dr. Emily Jones', role: 'professor', department: 'Computer Science', is_active: true, created_at: daysAgo(365), updated_at: daysAgo(1) },
];

// ================== Courses ==================

export const mockCourses: Course[] = [
  {
    id: 'c1',
    code: 'CS201',
    title: 'Data Structures',
    semester: 'Spring 2024',
    department: 'Computer Science',
    created_by: 'p1',
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
  },
  {
    id: 'c2',
    code: 'CS301',
    title: 'Operating Systems',
    semester: 'Spring 2024',
    department: 'Computer Science',
    created_by: 'p1',
    created_at: daysAgo(90),
    updated_at: daysAgo(2),
  },
  {
    id: 'c3',
    code: 'CS302',
    title: 'Computer Networks',
    semester: 'Spring 2024',
    department: 'Computer Science',
    created_by: 'p2',
    created_at: daysAgo(90),
    updated_at: daysAgo(3),
  },
];

// ================== Lectures ==================

export const mockLectures: Lecture[] = [
  // Data Structures lectures
  { id: 'l1', course_id: 'c1', title: 'Introduction to Data Structures', date_time: daysAgo(60), duration_mins: 90, mode: 'offline', topics: ['Arrays', 'Big O Notation'], is_cancelled: false, created_at: daysAgo(61), updated_at: daysAgo(61) },
  { id: 'l2', course_id: 'c1', title: 'Arrays and Dynamic Arrays', date_time: daysAgo(53), duration_mins: 90, mode: 'offline', topics: ['Arrays', 'Dynamic Arrays'], is_cancelled: false, created_at: daysAgo(54), updated_at: daysAgo(54) },
  { id: 'l3', course_id: 'c1', title: 'Linked Lists', date_time: daysAgo(46), duration_mins: 90, mode: 'offline', topics: ['Linked Lists', 'Singly Linked', 'Doubly Linked'], is_cancelled: false, created_at: daysAgo(47), updated_at: daysAgo(47) },
  { id: 'l4', course_id: 'c1', title: 'Stacks and Queues', date_time: daysAgo(39), duration_mins: 90, mode: 'offline', topics: ['Stacks', 'Queues', 'Deques'], is_cancelled: false, created_at: daysAgo(40), updated_at: daysAgo(40) },
  { id: 'l5', course_id: 'c1', title: 'Binary Trees', date_time: daysAgo(32), duration_mins: 90, mode: 'offline', topics: ['Trees', 'Binary Trees', 'Traversal'], is_cancelled: false, created_at: daysAgo(33), updated_at: daysAgo(33) },
  { id: 'l6', course_id: 'c1', title: 'Binary Search Trees', date_time: daysAgo(25), duration_mins: 90, mode: 'offline', topics: ['Trees', 'BST', 'Insertion', 'Deletion'], is_cancelled: false, created_at: daysAgo(26), updated_at: daysAgo(26) },
  { id: 'l7', course_id: 'c1', title: 'AVL Trees', date_time: daysAgo(18), duration_mins: 90, mode: 'offline', topics: ['Trees', 'AVL', 'Rotations'], is_cancelled: false, created_at: daysAgo(19), updated_at: daysAgo(19) },
  { id: 'l8', course_id: 'c1', title: 'Hash Tables', date_time: daysAgo(11), duration_mins: 90, mode: 'offline', topics: ['Hash Tables', 'Collision Resolution'], is_cancelled: false, created_at: daysAgo(12), updated_at: daysAgo(12) },
  { id: 'l9', course_id: 'c1', title: 'Graphs Introduction', date_time: daysAgo(4), duration_mins: 90, mode: 'offline', topics: ['Graphs', 'Representations'], is_cancelled: false, created_at: daysAgo(5), updated_at: daysAgo(5) },
  { id: 'l10', course_id: 'c1', title: 'Graph Traversals', date_time: daysAgo(0), duration_mins: 90, mode: 'offline', topics: ['Graphs', 'BFS', 'DFS'], is_cancelled: false, created_at: daysAgo(1), updated_at: daysAgo(1) },
  
  // Operating Systems lectures
  { id: 'l11', course_id: 'c2', title: 'OS Introduction', date_time: daysAgo(58), duration_mins: 90, mode: 'offline', topics: ['Process Management'], is_cancelled: false, created_at: daysAgo(59), updated_at: daysAgo(59) },
  { id: 'l12', course_id: 'c2', title: 'Process Scheduling', date_time: daysAgo(51), duration_mins: 90, mode: 'offline', topics: ['Scheduling', 'Round Robin'], is_cancelled: false, created_at: daysAgo(52), updated_at: daysAgo(52) },
  { id: 'l13', course_id: 'c2', title: 'Memory Management', date_time: daysAgo(44), duration_mins: 90, mode: 'offline', topics: ['Memory Management', 'Paging'], is_cancelled: false, created_at: daysAgo(45), updated_at: daysAgo(45) },
  { id: 'l14', course_id: 'c2', title: 'Virtual Memory', date_time: daysAgo(37), duration_mins: 90, mode: 'offline', topics: ['Memory Management', 'Virtual Memory'], is_cancelled: false, created_at: daysAgo(38), updated_at: daysAgo(38) },
  { id: 'l15', course_id: 'c2', title: 'Deadlocks', date_time: daysAgo(30), duration_mins: 90, mode: 'offline', topics: ['Deadlocks', 'Prevention'], is_cancelled: false, created_at: daysAgo(31), updated_at: daysAgo(31) },
  { id: 'l16', course_id: 'c2', title: 'File Systems', date_time: daysAgo(23), duration_mins: 90, mode: 'offline', topics: ['File Systems', 'Inodes'], is_cancelled: false, created_at: daysAgo(24), updated_at: daysAgo(24) },
  { id: 'l17', course_id: 'c2', title: 'Concurrency', date_time: daysAgo(16), duration_mins: 90, mode: 'offline', topics: ['Concurrency', 'Semaphores'], is_cancelled: false, created_at: daysAgo(17), updated_at: daysAgo(17) },
  { id: 'l18', course_id: 'c2', title: 'Synchronization', date_time: daysAgo(9), duration_mins: 90, mode: 'offline', topics: ['Concurrency', 'Monitors'], is_cancelled: false, created_at: daysAgo(10), updated_at: daysAgo(10) },
];

// ================== Feedback Generation ==================

const understandingLevels: UnderstandingLevel[] = ['fully_understood', 'partially_understood', 'not_understood'];
const feedbackReasons: FeedbackReason[] = ['pace_too_fast', 'needs_more_examples', 'concept_unclear', 'prerequisite_gap', 'other'];

function generateFeedbackForLecture(lectureId: string, lectureNumber: number): Feedback[] {
  const feedbacks: Feedback[] = [];
  const respondingStudents = mockStudents.slice(0, randomInt(5, 8));

  respondingStudents.forEach(student => {
    // Make understanding worse for harder topics (higher lecture numbers)
    const difficultyFactor = Math.min(lectureNumber / 10, 0.6);
    const understandingWeights = [
      Math.max(0.1, 0.6 - difficultyFactor), // fully
      0.3,                                     // partially
      Math.min(0.6, 0.1 + difficultyFactor),  // not
    ];
    
    const rand = Math.random();
    let level: UnderstandingLevel;
    if (rand < understandingWeights[0]) {
      level = 'fully_understood';
    } else if (rand < understandingWeights[0] + understandingWeights[1]) {
      level = 'partially_understood';
    } else {
      level = 'not_understood';
    }

    const hasQuestion = level !== 'fully_understood' && Math.random() > 0.6;
    const hasReason = level !== 'fully_understood' && Math.random() > 0.4;

    feedbacks.push({
      id: generateId(),
      lecture_id: lectureId,
      student_id: student.id,
      understanding: level,
      reasons: hasReason ? [randomChoice(feedbackReasons)] : [],
      subtopics: mockLectures.find(l => l.id === lectureId)?.topics.slice(0, randomInt(1, 2)) || [],
      comment: hasQuestion ? generateQuestion(lectureNumber) : '',
      is_anonymous: Math.random() > 0.7,
      submitted_at: daysAgo(randomInt(0, 7)),
      updated_at: daysAgo(randomInt(0, 7)),
    });
  });

  return feedbacks;
}

function generateQuestion(lectureNumber: number): string {
  const questions = [
    'Can you explain the time complexity again?',
    'What happens in the worst case scenario?',
    'How does this compare to the previous approach?',
    'Could you provide a real-world example?',
    'When would we use this instead of the alternative?',
    'I\'m confused about the edge cases',
    'How do we handle null values?',
    'Can you go over the implementation one more time?',
  ];
  return randomChoice(questions);
}

export const mockFeedback: Feedback[] = mockLectures
  .filter(l => !l.is_cancelled && new Date(l.date_time) < new Date())
  .flatMap((l, idx) => generateFeedbackForLecture(l.id, idx + 1));

// ================== Lecture Insights ==================

function calculateLectureInsights(lectureId: string): LectureInsights {
  const lectureFeedback = mockFeedback.filter(f => f.lecture_id === lectureId);
  const lecture = mockLectures.find(l => l.id === lectureId);
  
  const total = lectureFeedback.length;
  const fullyUnderstood = lectureFeedback.filter(f => f.understanding === 'fully_understood').length;
  const partiallyUnderstood = lectureFeedback.filter(f => f.understanding === 'partially_understood').length;
  const notUnderstood = lectureFeedback.filter(f => f.understanding === 'not_understood').length;
  
  const understandingPct = total > 0 
    ? Math.round((fullyUnderstood * 100 + partiallyUnderstood * 50) / total)
    : 0;

  const questions = lectureFeedback
    .filter(f => f.comment && f.comment.trim() !== '')
    .map(f => f.comment)
    .slice(0, 5);

  return {
    id: generateId(),
    lecture_id: lectureId,
    response_count: total,
    enrolled_count: mockStudents.length,
    response_rate: Math.round((total / mockStudents.length) * 100),
    full_count: fullyUnderstood,
    partial_count: partiallyUnderstood,
    unclear_count: notUnderstood,
    full_pct: total > 0 ? Math.round((fullyUnderstood / total) * 100) : 0,
    partial_pct: total > 0 ? Math.round((partiallyUnderstood / total) * 100) : 0,
    unclear_pct: total > 0 ? Math.round((notUnderstood / total) * 100) : 0,
    pace_fast_count: 0,
    pace_slow_count: 0,
    examples_few_count: 0,
    concept_unclear_count: 0,
    missed_part_count: 0,
    good_explanation_count: 0,
    helpful_examples_count: 0,
    top_subtopics: [],
    risk_level: understandingPct < 50 ? 'high' : understandingPct < 70 ? 'medium' : 'low',
    confusion_addressed: false,
    computed_at: new Date().toISOString(),
  };
}

export const mockLectureInsights: LectureInsights[] = mockLectures
  .filter(l => !l.is_cancelled && new Date(l.date_time) < new Date())
  .map(l => calculateLectureInsights(l.id));

// ================== Course Insights ==================

function calculateCourseInsights(courseId: string): CourseInsights {
  const completedLectures = mockLectures.filter(l => l.course_id === courseId && !l.is_cancelled && new Date(l.date_time) < new Date());
  const courseInsightsData = mockLectureInsights.filter(i => 
    completedLectures.some(l => l.id === i.lecture_id)
  );

  const avgUnderstanding = courseInsightsData.length > 0
    ? Math.round(courseInsightsData.reduce((sum, i) => sum + i.full_pct, 0) / courseInsightsData.length)
    : 0;

  const avgParticipation = courseInsightsData.length > 0
    ? Math.round(courseInsightsData.reduce((sum, i) => sum + i.response_rate, 0) / courseInsightsData.length)
    : 0;

  const recentInsights = courseInsightsData.slice(-3);
  const previousInsights = courseInsightsData.slice(-6, -3);
  
  let trend: TrendDirection = 'stable';
  if (recentInsights.length >= 2 && previousInsights.length >= 1) {
    const recentAvg = recentInsights.reduce((s, i) => s + i.full_pct, 0) / recentInsights.length;
    const prevAvg = previousInsights.reduce((s, i) => s + i.full_pct, 0) / previousInsights.length;
    if (recentAvg > prevAvg + 5) trend = 'improving';
    else if (recentAvg < prevAvg - 5) trend = 'declining';
  }

  const totalFeedback = mockFeedback.filter(f => 
    completedLectures.some(l => l.id === f.lecture_id)
  ).length;

  const highRiskLectures = courseInsightsData.filter(i => i.risk_level === 'high').length;

  return {
    id: generateId(),
    course_id: courseId,
    avg_understanding_pct: avgUnderstanding,
    avg_response_rate: avgParticipation,
    total_lectures: completedLectures.length,
    total_feedback: totalFeedback,
    high_risk_lectures: highRiskLectures,
    high_risk_topics: [],
    trending_issues: [],
    silent_students_count: randomInt(1, 3),
    health_score: avgUnderstanding,
    trend: trend,
    computed_at: new Date().toISOString(),
  };
}

export const mockCourseInsights: CourseInsights[] = mockCourses.map(c => calculateCourseInsights(c.id));

// ================== Silent Students ==================

export const mockSilentFlags: SilentFlag[] = [
  {
    id: 'sf1',
    student_id: 's5',
    course_id: 'c1',
    level: 'high',
    reason: 'low_understanding' as SilentReason,
    detected_at: daysAgo(7),
  },
  {
    id: 'sf2',
    student_id: 's7',
    course_id: 'c1',
    level: 'moderate',
    reason: 'declining_performance' as SilentReason,
    detected_at: daysAgo(3),
    acknowledged_at: daysAgo(1),
  },
  {
    id: 'sf3',
    student_id: 's4',
    course_id: 'c2',
    level: 'critical',
    reason: 'low_understanding' as SilentReason,
    detected_at: daysAgo(5),
  },
];

// ================== Student Metrics ==================

export const mockStudentMetrics: StudentMetrics[] = mockStudents.flatMap(student =>
  mockCourses.map(course => {
    const studentFeedback = mockFeedback.filter(f => 
      f.student_id === student.id && 
      mockLectures.some(l => l.id === f.lecture_id && l.course_id === course.id)
    );

    const fullCount = studentFeedback.filter(f => f.understanding === 'fully_understood').length;
    const partialCount = studentFeedback.filter(f => f.understanding === 'partially_understood').length;
    const unclearCount = studentFeedback.filter(f => f.understanding === 'not_understood').length;

    const understandingPct = studentFeedback.length > 0
      ? Math.round((fullCount * 100 + partialCount * 50) / studentFeedback.length)
      : 0;

    const totalLectures = mockLectures.filter(l => l.course_id === course.id && !l.is_cancelled && new Date(l.date_time) < new Date()).length;

    return {
      id: generateId(),
      student_id: student.id,
      course_id: course.id,
      understanding_pct: understandingPct,
      full_count: fullCount,
      partial_count: partialCount,
      unclear_count: unclearCount,
      feedback_submitted: studentFeedback.length,
      feedback_pending: Math.max(0, totalLectures - studentFeedback.length),
      total_lectures: totalLectures,
      streak_days: randomInt(0, 14),
      longest_streak: randomInt(0, 30),
      last_feedback_at: studentFeedback.length > 0 
        ? studentFeedback[studentFeedback.length - 1].submitted_at
        : undefined,
      computed_at: new Date().toISOString(),
    };
  })
);

// ================== Export All ==================

export const mockData = {
  students: mockStudents,
  professors: mockProfessors,
  courses: mockCourses,
  lectures: mockLectures,
  feedback: mockFeedback,
  lectureInsights: mockLectureInsights,
  courseInsights: mockCourseInsights,
  silentFlags: mockSilentFlags,
  studentMetrics: mockStudentMetrics,
};

export default mockData;
