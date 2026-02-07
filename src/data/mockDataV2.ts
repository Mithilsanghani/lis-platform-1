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
  UnderstandingLevel,
  FeedbackReason,
  UserRole,
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
  { id: 's1', email: 'alex@university.edu', name: 'Alex Johnson', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
  { id: 's2', email: 'emma@university.edu', name: 'Emma Wilson', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
  { id: 's3', email: 'michael@university.edu', name: 'Michael Brown', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
  { id: 's4', email: 'sarah@university.edu', name: 'Sarah Davis', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
  { id: 's5', email: 'james@university.edu', name: 'James Miller', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
  { id: 's6', email: 'olivia@university.edu', name: 'Olivia Garcia', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
  { id: 's7', email: 'david@university.edu', name: 'David Martinez', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
  { id: 's8', email: 'sophia@university.edu', name: 'Sophia Anderson', role: 'student', department_id: 'd1', created_at: daysAgo(180) },
];

export const mockProfessors: User[] = [
  { id: 'p1', email: 'prof.smith@university.edu', name: 'Dr. John Smith', role: 'professor', department_id: 'd1', created_at: daysAgo(365) },
  { id: 'p2', email: 'prof.jones@university.edu', name: 'Dr. Emily Jones', role: 'professor', department_id: 'd1', created_at: daysAgo(365) },
];

// ================== Courses ==================

export const mockCourses: Course[] = [
  {
    id: 'c1',
    code: 'CS201',
    name: 'Data Structures',
    semester: 'Spring 2024',
    department_id: 'd1',
    professor_id: 'p1',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables', 'Heaps', 'Sorting Algorithms'],
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
  },
  {
    id: 'c2',
    code: 'CS301',
    name: 'Operating Systems',
    semester: 'Spring 2024',
    department_id: 'd1',
    professor_id: 'p1',
    topics: ['Process Management', 'Memory Management', 'File Systems', 'Concurrency', 'Deadlocks', 'Scheduling'],
    created_at: daysAgo(90),
    updated_at: daysAgo(2),
  },
  {
    id: 'c3',
    code: 'CS302',
    name: 'Computer Networks',
    semester: 'Spring 2024',
    department_id: 'd1',
    professor_id: 'p2',
    topics: ['OSI Model', 'TCP/IP', 'Routing', 'DNS', 'HTTP', 'Security'],
    created_at: daysAgo(90),
    updated_at: daysAgo(3),
  },
];

// ================== Lectures ==================

export const mockLectures: Lecture[] = [
  // Data Structures lectures
  { id: 'l1', course_id: 'c1', lecture_number: 1, title: 'Introduction to Data Structures', date: daysAgo(60), topics: ['Arrays', 'Big O Notation'], status: 'completed', created_at: daysAgo(61) },
  { id: 'l2', course_id: 'c1', lecture_number: 2, title: 'Arrays and Dynamic Arrays', date: daysAgo(53), topics: ['Arrays', 'Dynamic Arrays'], status: 'completed', created_at: daysAgo(54) },
  { id: 'l3', course_id: 'c1', lecture_number: 3, title: 'Linked Lists', date: daysAgo(46), topics: ['Linked Lists', 'Singly Linked', 'Doubly Linked'], status: 'completed', created_at: daysAgo(47) },
  { id: 'l4', course_id: 'c1', lecture_number: 4, title: 'Stacks and Queues', date: daysAgo(39), topics: ['Stacks', 'Queues', 'Deques'], status: 'completed', created_at: daysAgo(40) },
  { id: 'l5', course_id: 'c1', lecture_number: 5, title: 'Binary Trees', date: daysAgo(32), topics: ['Trees', 'Binary Trees', 'Traversal'], status: 'completed', created_at: daysAgo(33) },
  { id: 'l6', course_id: 'c1', lecture_number: 6, title: 'Binary Search Trees', date: daysAgo(25), topics: ['Trees', 'BST', 'Insertion', 'Deletion'], status: 'completed', created_at: daysAgo(26) },
  { id: 'l7', course_id: 'c1', lecture_number: 7, title: 'AVL Trees', date: daysAgo(18), topics: ['Trees', 'AVL', 'Rotations'], status: 'completed', created_at: daysAgo(19) },
  { id: 'l8', course_id: 'c1', lecture_number: 8, title: 'Hash Tables', date: daysAgo(11), topics: ['Hash Tables', 'Collision Resolution'], status: 'completed', created_at: daysAgo(12) },
  { id: 'l9', course_id: 'c1', lecture_number: 9, title: 'Graphs Introduction', date: daysAgo(4), topics: ['Graphs', 'Representations'], status: 'completed', created_at: daysAgo(5) },
  { id: 'l10', course_id: 'c1', lecture_number: 10, title: 'Graph Traversals', date: daysAgo(0), topics: ['Graphs', 'BFS', 'DFS'], status: 'scheduled', created_at: daysAgo(1) },
  
  // Operating Systems lectures
  { id: 'l11', course_id: 'c2', lecture_number: 1, title: 'OS Introduction', date: daysAgo(58), topics: ['Process Management'], status: 'completed', created_at: daysAgo(59) },
  { id: 'l12', course_id: 'c2', lecture_number: 2, title: 'Process Scheduling', date: daysAgo(51), topics: ['Scheduling', 'Round Robin'], status: 'completed', created_at: daysAgo(52) },
  { id: 'l13', course_id: 'c2', lecture_number: 3, title: 'Memory Management', date: daysAgo(44), topics: ['Memory Management', 'Paging'], status: 'completed', created_at: daysAgo(45) },
  { id: 'l14', course_id: 'c2', lecture_number: 4, title: 'Virtual Memory', date: daysAgo(37), topics: ['Memory Management', 'Virtual Memory'], status: 'completed', created_at: daysAgo(38) },
  { id: 'l15', course_id: 'c2', lecture_number: 5, title: 'Deadlocks', date: daysAgo(30), topics: ['Deadlocks', 'Prevention'], status: 'completed', created_at: daysAgo(31) },
  { id: 'l16', course_id: 'c2', lecture_number: 6, title: 'File Systems', date: daysAgo(23), topics: ['File Systems', 'Inodes'], status: 'completed', created_at: daysAgo(24) },
  { id: 'l17', course_id: 'c2', lecture_number: 7, title: 'Concurrency', date: daysAgo(16), topics: ['Concurrency', 'Semaphores'], status: 'completed', created_at: daysAgo(17) },
  { id: 'l18', course_id: 'c2', lecture_number: 8, title: 'Synchronization', date: daysAgo(9), topics: ['Concurrency', 'Monitors'], status: 'completed', created_at: daysAgo(10) },
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
      understanding_level: level,
      question: hasQuestion ? generateQuestion(lectureNumber) : undefined,
      reason: hasReason ? randomChoice(feedbackReasons) : undefined,
      is_anonymous: Math.random() > 0.7,
      created_at: daysAgo(randomInt(0, 7)),
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
  .filter(l => l.status === 'completed')
  .flatMap(l => generateFeedbackForLecture(l.id, l.lecture_number));

// ================== Lecture Insights ==================

function calculateLectureInsights(lectureId: string): LectureInsights {
  const lectureFeedback = mockFeedback.filter(f => f.lecture_id === lectureId);
  const lecture = mockLectures.find(l => l.id === lectureId);
  
  const total = lectureFeedback.length;
  const fullyUnderstood = lectureFeedback.filter(f => f.understanding_level === 'fully_understood').length;
  const partiallyUnderstood = lectureFeedback.filter(f => f.understanding_level === 'partially_understood').length;
  const notUnderstood = lectureFeedback.filter(f => f.understanding_level === 'not_understood').length;
  
  const understandingPct = total > 0 
    ? Math.round((fullyUnderstood * 100 + partiallyUnderstood * 50) / total)
    : 0;

  const questions = lectureFeedback
    .filter(f => f.question)
    .map(f => f.question!)
    .slice(0, 5);

  return {
    id: generateId(),
    lecture_id: lectureId,
    response_count: total,
    response_rate: Math.round((total / mockStudents.length) * 100),
    understanding_pct: understandingPct,
    fully_understood_count: fullyUnderstood,
    partially_understood_count: partiallyUnderstood,
    not_understood_count: notUnderstood,
    top_questions: questions,
    confusion_topics: lecture?.topics.slice(0, 2) || [],
    ai_summary: `${understandingPct}% understanding with ${total} responses. ${questions.length} questions asked.`,
    needs_revision: understandingPct < 70,
    computed_at: new Date().toISOString(),
  };
}

export const mockLectureInsights: LectureInsights[] = mockLectures
  .filter(l => l.status === 'completed')
  .map(l => calculateLectureInsights(l.id));

// ================== Course Insights ==================

function calculateCourseInsights(courseId: string): CourseInsights {
  const courseLectures = mockLectures.filter(l => l.course_id === courseId && l.status === 'completed');
  const courseInsightsData = mockLectureInsights.filter(i => 
    courseLectures.some(l => l.id === i.lecture_id)
  );

  const avgUnderstanding = courseInsightsData.length > 0
    ? Math.round(courseInsightsData.reduce((sum, i) => sum + i.understanding_pct, 0) / courseInsightsData.length)
    : 0;

  const avgParticipation = courseInsightsData.length > 0
    ? Math.round(courseInsightsData.reduce((sum, i) => sum + i.response_rate, 0) / courseInsightsData.length)
    : 0;

  const recentInsights = courseInsightsData.slice(-3);
  const previousInsights = courseInsightsData.slice(-6, -3);
  
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recentInsights.length >= 2 && previousInsights.length >= 1) {
    const recentAvg = recentInsights.reduce((s, i) => s + i.understanding_pct, 0) / recentInsights.length;
    const prevAvg = previousInsights.reduce((s, i) => s + i.understanding_pct, 0) / previousInsights.length;
    if (recentAvg > prevAvg + 5) trend = 'improving';
    else if (recentAvg < prevAvg - 5) trend = 'declining';
  }

  return {
    id: generateId(),
    course_id: courseId,
    average_understanding: avgUnderstanding,
    understanding_trend: trend,
    participation_rate: avgParticipation,
    at_risk_topics: mockCourses.find(c => c.id === courseId)?.topics.slice(0, 2) || [],
    strong_topics: mockCourses.find(c => c.id === courseId)?.topics.slice(-2) || [],
    silent_student_count: randomInt(1, 3),
    total_feedbacks: mockFeedback.filter(f => 
      courseLectures.some(l => l.id === f.lecture_id)
    ).length,
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
    reasons: ['low_understanding', 'never_asks_questions'],
    detected_at: daysAgo(7),
    acknowledged_at: null,
    resolved_at: null,
  },
  {
    id: 'sf2',
    student_id: 's7',
    course_id: 'c1',
    level: 'moderate',
    reasons: ['declining_performance'],
    detected_at: daysAgo(3),
    acknowledged_at: daysAgo(1),
    resolved_at: null,
  },
  {
    id: 'sf3',
    student_id: 's4',
    course_id: 'c2',
    level: 'critical',
    reasons: ['low_understanding', 'never_asks_questions', 'declining_performance'],
    detected_at: daysAgo(5),
    acknowledged_at: null,
    resolved_at: null,
  },
];

// ================== Student Metrics ==================

export const mockStudentMetrics: StudentMetrics[] = mockStudents.flatMap(student =>
  mockCourses.map(course => {
    const studentFeedback = mockFeedback.filter(f => 
      f.student_id === student.id && 
      mockLectures.some(l => l.id === f.lecture_id && l.course_id === course.id)
    );

    const avgUnderstanding = studentFeedback.length > 0
      ? Math.round(studentFeedback.reduce((sum, f) => {
          switch (f.understanding_level) {
            case 'fully_understood': return sum + 100;
            case 'partially_understood': return sum + 50;
            case 'not_understood': return sum + 0;
          }
        }, 0) / studentFeedback.length)
      : 0;

    const totalLectures = mockLectures.filter(l => l.course_id === course.id && l.status === 'completed').length;

    return {
      id: generateId(),
      student_id: student.id,
      course_id: course.id,
      feedback_count: studentFeedback.length,
      average_understanding: avgUnderstanding,
      participation_rate: totalLectures > 0 
        ? Math.round((studentFeedback.length / totalLectures) * 100)
        : 0,
      last_feedback_at: studentFeedback.length > 0 
        ? studentFeedback[studentFeedback.length - 1].created_at
        : null,
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
