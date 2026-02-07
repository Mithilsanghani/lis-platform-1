/**
 * LIS Master Data Store - Single Source of Truth
 * All data flows from this centralized store
 * NO DUMMY DATA - Everything is action-created
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// TYPES - Core Data Model
// ============================================

export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  coursesOwned: string[]; // Course IDs
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  enrolledCourses: string[]; // Course IDs
  createdAt: string;
  lastActiveAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professorId: string;
  semester: string;
  department: string;
  credits: number;
  enrollmentCode: string; // unique join code for students
  students: string[]; // Student IDs
  lectures: string[]; // Lecture IDs
  assessments: string[]; // Assessment IDs
  createdAt: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  topics: string[];
  date: string;
  duration: number; // minutes
  status: 'scheduled' | 'live' | 'completed';
  attendees: string[]; // Student IDs who attended
  qrCode?: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  lectureId: string;
  name: string;
  order: number;
}

export interface Feedback {
  id: string;
  lectureId: string;
  studentId: string;
  courseId: string;
  understandingLevel: 'fully' | 'partial' | 'confused';
  topicRatings: { topicId: string; rating: 1 | 2 | 3 | 4 | 5 }[];
  comments?: string;
  timestamp: string;
}

export type AssessmentType = 'quiz' | 'assignment' | 'midterm' | 'final' | 'lab' | 'project';
export type GradeStatus = 'draft' | 'published';

export interface Assessment {
  id: string;
  courseId: string;
  name: string;
  type: AssessmentType;
  maxMarks: number;
  weightPct: number;
  dueDate?: string;
  status: GradeStatus;
  createdAt: string;
}

export interface Grade {
  id: string;
  assessmentId: string;
  studentId: string;
  courseId: string;
  marksObtained: number | null;
  gradedAt: string | null;
  comments?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'grade' | 'feedback' | 'lecture' | 'nudge' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Settings Types
export interface UserSettings {
  userId: string;
  notifications: {
    email: boolean;
    push: boolean;
    dailyDigest: boolean;
    silentAlerts: boolean;
    weeklyReport: boolean;
    feedbackAlerts: boolean;
  };
  ai: {
    autoInsights: boolean;
    nudgeSuggestions: boolean;
    responseSuggestions: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    dataRetentionMonths: number;
  };
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'hi';
}

// ============================================
// COMPUTED METRICS HELPERS
// ============================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateEnrollmentCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();

const getLetterGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  if (percentage >= 45) return 'D';
  return 'F';
};

const getGpaPoints = (letterGrade: string): number => {
  const gpaMap: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D': 1.0, 'F': 0.0
  };
  return gpaMap[letterGrade] ?? 0;
};

// ============================================
// STORE INTERFACE
// ============================================

interface LISState {
  // Core Data
  professors: Professor[];
  students: Student[];
  courses: Course[];
  lectures: Lecture[];
  feedback: Feedback[];
  assessments: Assessment[];
  grades: Grade[];
  notifications: Notification[];
  settings: UserSettings[];

  // ============================================
  // PROFESSOR ACTIONS
  // ============================================
  
  // Course Management
  createCourse: (professorId: string, data: Omit<Course, 'id' | 'enrollmentCode' | 'students' | 'lectures' | 'assessments' | 'createdAt'>) => string;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  
  // Student Management
  enrollStudent: (courseId: string, studentData: Omit<Student, 'id' | 'enrolledCourses' | 'createdAt' | 'lastActiveAt'>) => string;
  bulkEnrollStudents: (courseId: string, students: Omit<Student, 'id' | 'enrolledCourses' | 'createdAt' | 'lastActiveAt'>[]) => string[];
  removeStudent: (courseId: string, studentId: string) => void;
  
  // Lecture Management
  createLecture: (courseId: string, data: Omit<Lecture, 'id' | 'courseId' | 'attendees' | 'createdAt'>) => string;
  updateLecture: (lectureId: string, updates: Partial<Lecture>) => void;
  deleteLecture: (lectureId: string) => void;
  startLecture: (lectureId: string) => void;
  endLecture: (lectureId: string) => void;
  markAttendance: (lectureId: string, studentId: string) => void;
  
  // Assessment & Grades
  createAssessment: (courseId: string, data: Omit<Assessment, 'id' | 'courseId' | 'createdAt'>) => string;
  updateAssessment: (assessmentId: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (assessmentId: string) => void;
  setGrade: (assessmentId: string, studentId: string, marks: number, comments?: string) => void;
  publishGrades: (assessmentId: string) => void;
  unpublishGrades: (assessmentId: string) => void;
  
  // Delete student entirely (cascade all data)
  deleteStudent: (studentId: string) => void;
  
  // Nudge
  sendNudge: (studentId: string, message: string, professorId: string) => void;

  // ============================================
  // STUDENT ACTIONS
  // ============================================
  
  submitFeedback: (lectureId: string, studentId: string, data: Omit<Feedback, 'id' | 'lectureId' | 'studentId' | 'courseId' | 'timestamp'>) => string;
  updateStudentActivity: (studentId: string) => void;
  
  // Student self-enrollment by code
  enrollByCode: (studentId: string, enrollmentCode: string) => { success: boolean; courseId?: string; error?: string };
  
  // Register a new student in the system (used at sign-up)
  registerStudent: (data: Omit<Student, 'id' | 'enrolledCourses' | 'createdAt' | 'lastActiveAt'>) => string;
  
  // Register a new professor in the system (used at sign-up)
  registerProfessor: (data: Omit<Professor, 'id' | 'coursesOwned' | 'createdAt'>) => string;
  
  // ============================================
  // GETTERS - Computed from real data only
  // ============================================
  
  // Professor Getters
  getCourse: (courseId: string) => Course | undefined;
  getProfessorCourses: (professorId: string) => Course[];
  getCourseStudents: (courseId: string) => Student[];
  getCourseGrades: (courseId: string) => Grade[];
  getAssessmentGrades: (assessmentId: string) => Grade[];
  bulkSetGrades: (assessmentId: string, grades: { studentId: string; marks: number; comments?: string }[]) => void;
  getCourseLectures: (courseId: string) => Lecture[];
  getCourseAssessments: (courseId: string) => Assessment[];
  getCourseFeedback: (courseId: string) => Feedback[];
  
  // Metrics - ALWAYS computed from real data
  getActiveStudents: (courseId: string, hoursAgo?: number) => Student[];
  getSilentStudents: (courseId: string, daysInactive?: number) => Student[];
  getCourseEngagement: (courseId: string) => number; // percentage
  getCourseHealth: (courseId: string) => number; // percentage
  getAtRiskStudents: (courseId: string) => Student[];
  
  // AI Data Sources - Must have real data to work
  getAIDataAvailability: (courseId: string) => { hasFeedback: boolean; hasGrades: boolean; hasAttendance: boolean; totalDataPoints: number; isReady: boolean };
  
  // Student Getters
  getStudentCourses: (studentId: string) => Course[];
  getStudentPublishedGrades: (studentId: string) => { course: Course; assessment: Assessment; grade: Grade }[];
  calculateStudentGPA: (studentId: string) => number;
  getStudentLectures: (studentId: string) => Lecture[];
  getStudentPendingFeedback: (studentId: string) => Lecture[];
  
  // Settings
  getUserSettings: (userId: string) => UserSettings;
  updateUserSettings: (userId: string, updates: Partial<UserSettings>) => void;
  
  // Notifications
  getUserNotifications: (userId: string) => Notification[];
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: (userId: string) => void;
  
  // Reset (for testing)
  resetStore: () => void;
  
  // Seed demo data for testing
  seedDemoData: (professorId: string) => void;
}

// Default settings
const defaultSettings: Omit<UserSettings, 'userId'> = {
  notifications: {
    email: true,
    push: true,
    dailyDigest: true,
    silentAlerts: true,
    weeklyReport: false,
    feedbackAlerts: true,
  },
  ai: {
    autoInsights: true,
    nudgeSuggestions: true,
    responseSuggestions: true,
  },
  privacy: {
    shareAnalytics: false,
    dataRetentionMonths: 12,
  },
  theme: 'dark',
  language: 'en',
};

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useLISStore = create<LISState>()(
  persist(
    (set, get) => ({
      // Initialize with empty arrays - NO DUMMY DATA
      professors: [],
      students: [],
      courses: [],
      lectures: [],
      feedback: [],
      assessments: [],
      grades: [],
      notifications: [],
      settings: [],

      // ============================================
      // PROFESSOR ACTIONS
      // ============================================
      
      createCourse: (professorId, data) => {
        const id = generateId();
        const enrollmentCode = generateEnrollmentCode();
        const course: Course = {
          ...data,
          id,
          professorId,
          enrollmentCode,
          students: [],
          lectures: [],
          assessments: [],
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          courses: [...state.courses, course],
          professors: state.professors.map((p) =>
            p.id === professorId ? { ...p, coursesOwned: [...p.coursesOwned, id] } : p
          ),
        }));
        
        return id;
      },
      
      updateCourse: (courseId, updates) => {
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, ...updates } : c
          ),
        }));
      },
      
      deleteCourse: (courseId) => {
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== courseId),
          lectures: state.lectures.filter((l) => l.courseId !== courseId),
          feedback: state.feedback.filter((f) => f.courseId !== courseId),
          assessments: state.assessments.filter((a) => a.courseId !== courseId),
          grades: state.grades.filter((g) => g.courseId !== courseId),
        }));
      },
      
      enrollStudent: (courseId, studentData) => {
        const existingStudent = get().students.find((s) => s.email === studentData.email);
        
        if (existingStudent) {
          // Student exists, just enroll in course
          set((state) => ({
            students: state.students.map((s) =>
              s.id === existingStudent.id
                ? { ...s, enrolledCourses: [...new Set([...s.enrolledCourses, courseId])] }
                : s
            ),
            courses: state.courses.map((c) =>
              c.id === courseId
                ? { ...c, students: [...new Set([...c.students, existingStudent.id])] }
                : c
            ),
          }));
          return existingStudent.id;
        }
        
        // Create new student
        const id = generateId();
        const student: Student = {
          ...studentData,
          id,
          enrolledCourses: [courseId],
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        
        set((state) => ({
          students: [...state.students, student],
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, students: [...c.students, id] } : c
          ),
        }));
        
        return id;
      },
      
      bulkEnrollStudents: (courseId, studentsData) => {
        const ids: string[] = [];
        studentsData.forEach((studentData) => {
          const id = get().enrollStudent(courseId, studentData);
          ids.push(id);
        });
        return ids;
      },
      
      removeStudent: (courseId, studentId) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? { ...s, enrolledCourses: s.enrolledCourses.filter((c) => c !== courseId) }
              : s
          ),
          courses: state.courses.map((c) =>
            c.id === courseId
              ? { ...c, students: c.students.filter((s) => s !== studentId) }
              : c
          ),
        }));
      },
      
      deleteStudent: (studentId) => {
        // Cascade: remove from all courses, delete their feedback, grades, notifications
        set((state) => ({
          students: state.students.filter((s) => s.id !== studentId),
          courses: state.courses.map((c) => ({
            ...c,
            students: c.students.filter((s) => s !== studentId),
          })),
          feedback: state.feedback.filter((f) => f.studentId !== studentId),
          grades: state.grades.filter((g) => g.studentId !== studentId),
          notifications: state.notifications.filter((n) => n.userId !== studentId),
        }));
      },
      
      createLecture: (courseId, data) => {
        const id = generateId();
        const lecture: Lecture = {
          ...data,
          id,
          courseId,
          attendees: [],
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          lectures: [...state.lectures, lecture],
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, lectures: [...c.lectures, id] } : c
          ),
        }));
        
        return id;
      },
      
      updateLecture: (lectureId, updates) => {
        set((state) => ({
          lectures: state.lectures.map((l) =>
            l.id === lectureId ? { ...l, ...updates } : l
          ),
        }));
      },
      
      deleteLecture: (lectureId) => {
        const lecture = get().lectures.find((l) => l.id === lectureId);
        if (!lecture) return;
        
        set((state) => ({
          lectures: state.lectures.filter((l) => l.id !== lectureId),
          feedback: state.feedback.filter((f) => f.lectureId !== lectureId),
          courses: state.courses.map((c) =>
            c.id === lecture.courseId
              ? { ...c, lectures: c.lectures.filter((l) => l !== lectureId) }
              : c
          ),
        }));
      },
      
      startLecture: (lectureId) => {
        get().updateLecture(lectureId, { status: 'live' });
      },
      
      endLecture: (lectureId) => {
        get().updateLecture(lectureId, { status: 'completed' });
      },
      
      markAttendance: (lectureId, studentId) => {
        set((state) => ({
          lectures: state.lectures.map((l) =>
            l.id === lectureId
              ? { ...l, attendees: [...new Set([...l.attendees, studentId])] }
              : l
          ),
        }));
        get().updateStudentActivity(studentId);
      },
      
      createAssessment: (courseId, data) => {
        const id = generateId();
        const assessment: Assessment = {
          ...data,
          id,
          courseId,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          assessments: [...state.assessments, assessment],
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, assessments: [...c.assessments, id] } : c
          ),
        }));
        
        return id;
      },
      
      updateAssessment: (assessmentId, updates) => {
        set((state) => ({
          assessments: state.assessments.map((a) =>
            a.id === assessmentId ? { ...a, ...updates } : a
          ),
        }));
      },
      
      deleteAssessment: (assessmentId) => {
        const assessment = get().assessments.find((a) => a.id === assessmentId);
        if (!assessment) return;
        
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== assessmentId),
          grades: state.grades.filter((g) => g.assessmentId !== assessmentId),
          courses: state.courses.map((c) =>
            c.id === assessment.courseId
              ? { ...c, assessments: c.assessments.filter((a) => a !== assessmentId) }
              : c
          ),
        }));
      },
      
      setGrade: (assessmentId, studentId, marks, comments) => {
        const assessment = get().assessments.find((a) => a.id === assessmentId);
        if (!assessment) return;
        
        const existingGrade = get().grades.find(
          (g) => g.assessmentId === assessmentId && g.studentId === studentId
        );
        
        if (existingGrade) {
          set((state) => ({
            grades: state.grades.map((g) =>
              g.id === existingGrade.id
                ? { ...g, marksObtained: marks, gradedAt: new Date().toISOString(), comments }
                : g
            ),
          }));
        } else {
          const grade: Grade = {
            id: generateId(),
            assessmentId,
            studentId,
            courseId: assessment.courseId,
            marksObtained: marks,
            gradedAt: new Date().toISOString(),
            comments,
          };
          
          set((state) => ({
            grades: [...state.grades, grade],
          }));
        }
      },
      
      publishGrades: (assessmentId) => {
        get().updateAssessment(assessmentId, { status: 'published' });
        
        // Send notifications to students
        const assessment = get().assessments.find((a) => a.id === assessmentId);
        if (!assessment) return;
        
        const course = get().courses.find((c) => c.id === assessment.courseId);
        if (!course) return;
        
        const grades = get().grades.filter((g) => g.assessmentId === assessmentId);
        grades.forEach((grade) => {
          const notification: Notification = {
            id: generateId(),
            userId: grade.studentId,
            type: 'grade',
            title: 'New Grade Published',
            message: `Your grade for ${assessment.name} in ${course.code} has been published.`,
            read: false,
            createdAt: new Date().toISOString(),
          };
          
          set((state) => ({
            notifications: [...state.notifications, notification],
          }));
        });
      },
      
      unpublishGrades: (assessmentId) => {
        get().updateAssessment(assessmentId, { status: 'draft' });
      },
      
      sendNudge: (studentId, message, professorId) => {
        const notification: Notification = {
          id: generateId(),
          userId: studentId,
          type: 'nudge',
          title: 'Reminder from Professor',
          message,
          read: false,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          notifications: [...state.notifications, notification],
        }));
      },

      // ============================================
      // STUDENT ACTIONS
      // ============================================
      
      submitFeedback: (lectureId, studentId, data) => {
        const lecture = get().lectures.find((l) => l.id === lectureId);
        if (!lecture) return '';
        
        const id = generateId();
        const feedback: Feedback = {
          ...data,
          id,
          lectureId,
          studentId,
          courseId: lecture.courseId,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          feedback: [...state.feedback, feedback],
        }));
        
        get().updateStudentActivity(studentId);
        return id;
      },
      
      updateStudentActivity: (studentId) => {
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId ? { ...s, lastActiveAt: new Date().toISOString() } : s
          ),
        }));
      },

      enrollByCode: (studentId, enrollmentCode) => {
        const course = get().courses.find((c) => c.enrollmentCode === enrollmentCode);
        if (!course) return { success: false, error: 'Invalid enrollment code' };
        
        // Check if already enrolled
        if (course.students.includes(studentId)) {
          return { success: false, error: 'Already enrolled in this course' };
        }
        
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? { ...s, enrolledCourses: [...new Set([...s.enrolledCourses, course.id])] }
              : s
          ),
          courses: state.courses.map((c) =>
            c.id === course.id
              ? { ...c, students: [...new Set([...c.students, studentId])] }
              : c
          ),
        }));
        
        return { success: true, courseId: course.id };
      },

      registerStudent: (data) => {
        // Check if student with same email exists
        const existing = get().students.find((s) => s.email === data.email);
        if (existing) return existing.id;
        
        const id = generateId();
        const student: Student = {
          ...data,
          id,
          enrolledCourses: [],
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        
        set((state) => ({ students: [...state.students, student] }));
        return id;
      },

      registerProfessor: (data) => {
        const existing = get().professors.find((p) => p.email === data.email);
        if (existing) return existing.id;
        
        const id = generateId();
        const professor: Professor = {
          ...data,
          id,
          coursesOwned: [],
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({ professors: [...state.professors, professor] }));
        return id;
      },

      // ============================================
      // GETTERS
      // ============================================
      
      getCourse: (courseId) => {
        return get().courses.find((c) => c.id === courseId);
      },

      getProfessorCourses: (professorId) => {
        return get().courses.filter((c) => c.professorId === professorId);
      },

      getCourseGrades: (courseId) => {
        return get().grades.filter((g) => g.courseId === courseId);
      },

      getAssessmentGrades: (assessmentId) => {
        return get().grades.filter((g) => g.assessmentId === assessmentId);
      },

      bulkSetGrades: (assessmentId, grades) => {
        const assessment = get().assessments.find((a) => a.id === assessmentId);
        if (!assessment) return;
        grades.forEach(({ studentId, marks, comments }) => {
          get().setGrade(assessmentId, studentId, marks, comments);
        });
      },
      
      getCourseStudents: (courseId) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return [];
        return get().students.filter((s) => course.students.includes(s.id));
      },
      
      getCourseLectures: (courseId) => {
        return get().lectures.filter((l) => l.courseId === courseId);
      },
      
      getCourseAssessments: (courseId) => {
        return get().assessments.filter((a) => a.courseId === courseId);
      },
      
      getCourseFeedback: (courseId) => {
        return get().feedback.filter((f) => f.courseId === courseId);
      },
      
      getActiveStudents: (courseId, hoursAgo = 24) => {
        const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return [];
        
        return get().students.filter(
          (s) => course.students.includes(s.id) && s.lastActiveAt >= cutoff
        );
      },
      
      getSilentStudents: (courseId, daysInactive = 7) => {
        const cutoff = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000).toISOString();
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return [];
        
        return get().students.filter(
          (s) => course.students.includes(s.id) && s.lastActiveAt < cutoff
        );
      },
      
      getCourseEngagement: (courseId) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course || course.students.length === 0) return 0;
        
        const lectures = get().lectures.filter((l) => l.courseId === courseId && l.status === 'completed');
        if (lectures.length === 0) return 0;
        
        const feedbackCount = get().feedback.filter((f) => f.courseId === courseId).length;
        const expectedFeedback = lectures.length * course.students.length;
        
        return expectedFeedback > 0 ? Math.round((feedbackCount / expectedFeedback) * 100) : 0;
      },
      
      getCourseHealth: (courseId) => {
        const engagement = get().getCourseEngagement(courseId);
        const course = get().courses.find((c) => c.id === courseId);
        if (!course || course.students.length === 0) return 0;
        
        const silentStudents = get().getSilentStudents(courseId);
        const silentRatio = silentStudents.length / course.students.length;
        
        // Health = (engagement * 0.6) + ((1 - silentRatio) * 40)
        return Math.round(engagement * 0.6 + (1 - silentRatio) * 40);
      },
      
      getAtRiskStudents: (courseId) => {
        const course = get().courses.find((c) => c.id === courseId);
        if (!course) return [];
        
        const silentStudents = get().getSilentStudents(courseId, 5);
        const publishedAssessments = get().assessments.filter(
          (a) => a.courseId === courseId && a.status === 'published'
        );
        
        // Students with low grades
        const lowGradeStudents = course.students.filter((studentId) => {
          const studentGrades = get().grades.filter(
            (g) =>
              g.courseId === courseId &&
              g.studentId === studentId &&
              publishedAssessments.some((a) => a.id === g.assessmentId)
          );
          
          if (studentGrades.length === 0) return false;
          
          const avgPercentage = studentGrades.reduce((sum, g) => {
            const assessment = publishedAssessments.find((a) => a.id === g.assessmentId);
            return sum + ((g.marksObtained ?? 0) / (assessment?.maxMarks ?? 100)) * 100;
          }, 0) / studentGrades.length;
          
          return avgPercentage < 50;
        });
        
        const atRiskIds = [...new Set([...silentStudents.map((s) => s.id), ...lowGradeStudents])];
        return get().students.filter((s) => atRiskIds.includes(s.id));
      },
      
      getAIDataAvailability: (courseId) => {
        const feedback = get().feedback.filter((f) => f.courseId === courseId);
        const grades = get().grades.filter((g) => g.courseId === courseId);
        const lectures = get().lectures.filter((l) => l.courseId === courseId && l.status === 'completed');
        const attendance = lectures.reduce((sum, l) => sum + l.attendees.length, 0);
        
        const totalDataPoints = feedback.length + grades.length + attendance;
        
        return {
          hasFeedback: feedback.length > 0,
          hasGrades: grades.length > 0,
          hasAttendance: attendance > 0,
          totalDataPoints,
          isReady: totalDataPoints >= 10, // Minimum 10 data points for AI insights
        };
      },
      
      getStudentCourses: (studentId) => {
        const student = get().students.find((s) => s.id === studentId);
        if (!student) return [];
        return get().courses.filter((c) => student.enrolledCourses.includes(c.id));
      },
      
      getStudentPublishedGrades: (studentId) => {
        const student = get().students.find((s) => s.id === studentId);
        if (!student) return [];
        
        const publishedAssessments = get().assessments.filter((a) => a.status === 'published');
        const studentGrades = get().grades.filter(
          (g) => g.studentId === studentId && publishedAssessments.some((a) => a.id === g.assessmentId)
        );
        
        return studentGrades.map((grade) => {
          const assessment = publishedAssessments.find((a) => a.id === grade.assessmentId)!;
          const course = get().courses.find((c) => c.id === assessment.courseId)!;
          return { course, assessment, grade };
        });
      },
      
      calculateStudentGPA: (studentId) => {
        const grades = get().getStudentPublishedGrades(studentId);
        if (grades.length === 0) return 0;
        
        // Group by course
        const courseGrades: Record<string, { total: number; count: number; credits: number }> = {};
        
        grades.forEach(({ course, assessment, grade }) => {
          if (!courseGrades[course.id]) {
            courseGrades[course.id] = { total: 0, count: 0, credits: course.credits };
          }
          if (grade.marksObtained !== null) {
            const percentage = (grade.marksObtained / assessment.maxMarks) * 100;
            courseGrades[course.id].total += percentage;
            courseGrades[course.id].count++;
          }
        });
        
        let totalPoints = 0;
        let totalCredits = 0;
        
        Object.values(courseGrades).forEach(({ total, count, credits }) => {
          if (count > 0) {
            const avgPercentage = total / count;
            const letterGrade = getLetterGrade(avgPercentage);
            totalPoints += getGpaPoints(letterGrade) * credits;
            totalCredits += credits;
          }
        });
        
        return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
      },
      
      getStudentLectures: (studentId) => {
        const student = get().students.find((s) => s.id === studentId);
        if (!student) return [];
        
        return get().lectures.filter((l) => student.enrolledCourses.includes(l.courseId));
      },
      
      getStudentPendingFeedback: (studentId) => {
        const studentLectures = get().getStudentLectures(studentId);
        const completedLectures = studentLectures.filter((l) => l.status === 'completed');
        const submittedFeedback = get().feedback.filter((f) => f.studentId === studentId);
        
        return completedLectures.filter(
          (l) => !submittedFeedback.some((f) => f.lectureId === l.id)
        );
      },
      
      getUserSettings: (userId) => {
        const existing = get().settings.find((s) => s.userId === userId);
        if (existing) return existing;
        
        // Create default settings
        const newSettings: UserSettings = { ...defaultSettings, userId };
        set((state) => ({
          settings: [...state.settings, newSettings],
        }));
        return newSettings;
      },
      
      updateUserSettings: (userId, updates) => {
        set((state) => ({
          settings: state.settings.map((s) =>
            s.userId === userId ? { ...s, ...updates } : s
          ),
        }));
      },
      
      getUserNotifications: (userId) => {
        return get().notifications
          .filter((n) => n.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      
      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }));
      },
      
      clearAllNotifications: (userId) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.userId !== userId),
        }));
      },
      
      resetStore: () => {
        set({
          professors: [],
          students: [],
          courses: [],
          lectures: [],
          feedback: [],
          assessments: [],
          grades: [],
          notifications: [],
          settings: [],
        });
      },
      
      seedDemoData: (professorId) => {
        const state = get();
        
        // Only seed if no courses exist for this professor
        if (state.courses.some(c => c.professorId === professorId)) {
          return;
        }
        
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        
        // Create demo courses
        const course1Id = generateId();
        const course2Id = generateId();
        const course3Id = generateId();
        
        // Create demo students
        const studentIds: string[] = [];
        const demoStudents: Student[] = [];
        const studentNames = [
          'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown',
          'Emma Davis', 'Frank Miller', 'Grace Wilson', 'Henry Moore',
          'Isabella Taylor', 'Jack Anderson', 'Kate Thomas', 'Liam Jackson'
        ];
        
        studentNames.forEach((name, i) => {
          const id = generateId();
          studentIds.push(id);
          demoStudents.push({
            id,
            name,
            email: `${name.toLowerCase().replace(' ', '.')}@university.edu`,
            rollNumber: `2024CS${String(i + 1).padStart(3, '0')}`,
            department: 'Computer Science',
            enrolledCourses: i < 8 ? [course1Id, course2Id] : [course2Id, course3Id],
            createdAt: new Date(now.getTime() - 30 * oneDay).toISOString(),
            lastActiveAt: new Date(now.getTime() - Math.random() * 7 * oneDay).toISOString(),
          });
        });
        
        // Create demo courses
        const demoCourses: Course[] = [
          {
            id: course1Id,
            code: 'CS301',
            name: 'Data Structures & Algorithms',
            professorId,
            semester: 'Spring 2026',
            department: 'Computer Science',
            credits: 4,
            enrollmentCode: 'DSA2026',
            students: studentIds.slice(0, 8),
            lectures: [],
            assessments: [],
            createdAt: new Date(now.getTime() - 60 * oneDay).toISOString(),
          },
          {
            id: course2Id,
            code: 'CS201',
            name: 'Object Oriented Programming',
            professorId,
            semester: 'Spring 2026',
            department: 'Computer Science',
            credits: 3,
            enrollmentCode: 'OOP2026',
            students: studentIds,
            lectures: [],
            assessments: [],
            createdAt: new Date(now.getTime() - 45 * oneDay).toISOString(),
          },
          {
            id: course3Id,
            code: 'CS401',
            name: 'Machine Learning',
            professorId,
            semester: 'Spring 2026',
            department: 'Computer Science',
            credits: 4,
            enrollmentCode: 'ML2026',
            students: studentIds.slice(8),
            lectures: [],
            assessments: [],
            createdAt: new Date(now.getTime() - 30 * oneDay).toISOString(),
          },
        ];
        
        // Create demo lectures
        const demoLectures: Lecture[] = [];
        const lectureTopics = {
          [course1Id]: [
            { title: 'Introduction to Algorithms', topics: ['Big O Notation', 'Time Complexity', 'Space Complexity'] },
            { title: 'Arrays and Linked Lists', topics: ['Array Operations', 'Singly Linked List', 'Doubly Linked List'] },
            { title: 'Stacks and Queues', topics: ['Stack Operations', 'Queue Operations', 'Priority Queue'] },
            { title: 'Binary Trees', topics: ['Tree Traversal', 'BST Operations', 'Balanced Trees'] },
            { title: 'Graph Algorithms', topics: ['BFS', 'DFS', 'Shortest Path'] },
          ],
          [course2Id]: [
            { title: 'OOP Fundamentals', topics: ['Classes', 'Objects', 'Encapsulation'] },
            { title: 'Inheritance & Polymorphism', topics: ['Single Inheritance', 'Method Overriding', 'Interfaces'] },
            { title: 'Design Patterns', topics: ['Singleton', 'Factory', 'Observer'] },
            { title: 'SOLID Principles', topics: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP'] },
          ],
          [course3Id]: [
            { title: 'ML Introduction', topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'] },
            { title: 'Linear Regression', topics: ['Gradient Descent', 'Cost Function', 'Feature Scaling'] },
            { title: 'Neural Networks', topics: ['Perceptron', 'Activation Functions', 'Backpropagation'] },
          ],
        };
        
        Object.entries(lectureTopics).forEach(([courseId, lectures]) => {
          lectures.forEach((lec, i) => {
            const lectureId = generateId();
            const courseStudents = demoCourses.find(c => c.id === courseId)?.students || [];
            demoLectures.push({
              id: lectureId,
              courseId,
              title: lec.title,
              topics: lec.topics,
              date: new Date(now.getTime() - (lectures.length - i) * 3 * oneDay).toISOString(),
              duration: 90,
              status: 'completed',
              attendees: courseStudents.slice(0, Math.floor(courseStudents.length * (0.7 + Math.random() * 0.3))),
              createdAt: new Date(now.getTime() - 60 * oneDay).toISOString(),
            });
            
            // Update course with lecture ID
            const course = demoCourses.find(c => c.id === courseId);
            if (course) course.lectures.push(lectureId);
          });
        });
        
        // Create demo feedback with realistic understanding distribution
        const demoFeedback: Feedback[] = [];
        const understandingLevels: ('fully' | 'partial' | 'confused')[] = ['fully', 'partial', 'confused'];
        
        demoLectures.forEach(lecture => {
          lecture.attendees.forEach(studentId => {
            // Realistic distribution: ~60% fully, ~30% partial, ~10% confused
            const rand = Math.random();
            const level = rand < 0.6 ? 'fully' : rand < 0.9 ? 'partial' : 'confused';
            
            demoFeedback.push({
              id: generateId(),
              lectureId: lecture.id,
              studentId,
              courseId: lecture.courseId,
              understandingLevel: level,
              topicRatings: lecture.topics.map((topic, i) => ({
                topicId: `${lecture.id}-topic-${i}`,
                rating: (level === 'fully' ? 4 + Math.floor(Math.random() * 2) : level === 'partial' ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2)) as 1 | 2 | 3 | 4 | 5,
              })),
              comments: level === 'confused' ? 'I need more examples and practice problems.' : undefined,
              timestamp: new Date(new Date(lecture.date).getTime() + 60 * 60 * 1000).toISOString(),
            });
          });
        });
        
        // Create demo assessments
        const demoAssessments: Assessment[] = [];
        const demoGrades: Grade[] = [];
        
        demoCourses.forEach(course => {
          const quiz1Id = generateId();
          const midtermId = generateId();
          
          demoAssessments.push({
            id: quiz1Id,
            courseId: course.id,
            name: 'Quiz 1',
            type: 'quiz',
            maxMarks: 20,
            weightPct: 10,
            status: 'published',
            createdAt: new Date(now.getTime() - 20 * oneDay).toISOString(),
          });
          
          demoAssessments.push({
            id: midtermId,
            courseId: course.id,
            name: 'Midterm Exam',
            type: 'midterm',
            maxMarks: 100,
            weightPct: 30,
            status: 'published',
            createdAt: new Date(now.getTime() - 15 * oneDay).toISOString(),
          });
          
          course.assessments.push(quiz1Id, midtermId);
          
          // Create grades
          course.students.forEach(studentId => {
            demoGrades.push({
              id: generateId(),
              assessmentId: quiz1Id,
              studentId,
              courseId: course.id,
              marksObtained: Math.floor(12 + Math.random() * 9),
              gradedAt: new Date(now.getTime() - 18 * oneDay).toISOString(),
            });
            
            demoGrades.push({
              id: generateId(),
              assessmentId: midtermId,
              studentId,
              courseId: course.id,
              marksObtained: Math.floor(55 + Math.random() * 45),
              gradedAt: new Date(now.getTime() - 10 * oneDay).toISOString(),
            });
          });
        });
        
        // Update professor with courses
        set((state) => ({
          professors: state.professors.map(p => 
            p.id === professorId 
              ? { ...p, coursesOwned: [...p.coursesOwned, course1Id, course2Id, course3Id] }
              : p
          ),
          students: [...state.students, ...demoStudents],
          courses: [...state.courses, ...demoCourses],
          lectures: [...state.lectures, ...demoLectures],
          feedback: [...state.feedback, ...demoFeedback],
          assessments: [...state.assessments, ...demoAssessments],
          grades: [...state.grades, ...demoGrades],
        }));
      },
    }),
    {
      name: 'lis-master-storage',
    }
  )
);

// Export types
export type { LISState };
