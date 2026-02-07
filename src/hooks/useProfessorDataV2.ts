/**
 * LIS v2.0 - Professor Data Hooks
 * React Query hooks for professor portal data fetching
 */

// @ts-nocheck - TODO: Install @tanstack/react-query
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professorApi } from '../api/professor';
import type { SilentLevel } from '../types/lis-v2';

// Stub implementations until react-query is installed
const useQuery = (options: any) => ({ data: null, isLoading: false, error: null });
const useMutation = (options: any) => ({ mutate: () => {}, isLoading: false });
const useQueryClient = () => ({ invalidateQueries: () => {} });

// ================== Query Keys ==================

export const professorKeys = {
  all: ['professor'] as const,
  overview: () => [...professorKeys.all, 'overview'] as const,
  
  // Courses
  courses: () => [...professorKeys.all, 'courses'] as const,
  course: (id: string) => [...professorKeys.courses(), id] as const,
  courseTopics: (id: string) => [...professorKeys.course(id), 'topics'] as const,
  
  // Lectures
  lectures: (courseId?: string) => [...professorKeys.all, 'lectures', courseId] as const,
  lecture: (id: string) => [...professorKeys.all, 'lecture', id] as const,
  lectureInsights: (id: string) => [...professorKeys.lecture(id), 'insights'] as const,
  
  // Students
  students: (courseId: string) => [...professorKeys.all, 'students', courseId] as const,
  student: (courseId: string, studentId: string) => [...professorKeys.students(courseId), studentId] as const,
  
  // Silent Students
  silentStudents: (courseId?: string) => [...professorKeys.all, 'silent', courseId] as const,
  
  // Revision
  revisionPlan: (courseId: string) => [...professorKeys.all, 'revision', courseId] as const,
  
  // Analytics
  analytics: (filters?: object) => [...professorKeys.all, 'analytics', filters] as const,
};

// ================== Overview Hook ==================

export function useProfessorOverview() {
  return useQuery({
    queryKey: professorKeys.overview(),
    queryFn: professorApi.getOverview,
    staleTime: 1000 * 60 * 5,
  });
}

// ================== Course Hooks ==================

export function useProfessorCourses() {
  return useQuery({
    queryKey: professorKeys.courses(),
    queryFn: professorApi.getCourses,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProfessorCourse(courseId: string) {
  return useQuery({
    queryKey: professorKeys.course(courseId),
    queryFn: () => professorApi.getCourse(courseId),
    staleTime: 1000 * 60 * 2,
    enabled: !!courseId,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: professorApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorKeys.courses() });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: Parameters<typeof professorApi.updateCourse>[1] }) =>
      professorApi.updateCourse(courseId, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: professorKeys.course(courseId) });
      queryClient.invalidateQueries({ queryKey: professorKeys.courses() });
    },
  });
}

export function useCourseTopics(courseId: string) {
  return useQuery({
    queryKey: professorKeys.courseTopics(courseId),
    queryFn: () => professorApi.getCourseTopics(courseId),
    staleTime: 1000 * 60 * 10,
    enabled: !!courseId,
  });
}

// ================== Lecture Hooks ==================

export function useProfessorLectures(courseId?: string) {
  return useQuery({
    queryKey: professorKeys.lectures(courseId),
    queryFn: () => professorApi.getLectures(courseId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useProfessorLecture(lectureId: string) {
  return useQuery({
    queryKey: professorKeys.lecture(lectureId),
    queryFn: () => professorApi.getLecture(lectureId),
    staleTime: 1000 * 60,
    enabled: !!lectureId,
  });
}

export function useLectureInsights(lectureId: string) {
  return useQuery({
    queryKey: professorKeys.lectureInsights(lectureId),
    queryFn: () => professorApi.getLectureInsights(lectureId),
    staleTime: 1000 * 60 * 2,
    enabled: !!lectureId,
  });
}

export function useCreateLecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: professorApi.createLecture,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: professorKeys.lectures(variables.course_id) });
      queryClient.invalidateQueries({ queryKey: professorKeys.overview() });
    },
  });
}

export function useUpdateLecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lectureId, data }: { lectureId: string; data: Parameters<typeof professorApi.updateLecture>[1] }) =>
      professorApi.updateLecture(lectureId, data),
    onSuccess: (_, { lectureId }) => {
      queryClient.invalidateQueries({ queryKey: professorKeys.lecture(lectureId) });
      queryClient.invalidateQueries({ queryKey: professorKeys.lectures() });
    },
  });
}

export function useMarkConfusionAddressed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lectureId, topicName }: { lectureId: string; topicName: string }) =>
      professorApi.markConfusionAddressed(lectureId, topicName),
    onSuccess: (_, { lectureId }) => {
      queryClient.invalidateQueries({ queryKey: professorKeys.lecture(lectureId) });
      queryClient.invalidateQueries({ queryKey: professorKeys.lectureInsights(lectureId) });
    },
  });
}

// ================== Student Hooks ==================

export function useCourseStudents(courseId: string) {
  return useQuery({
    queryKey: professorKeys.students(courseId),
    queryFn: () => professorApi.getStudents(courseId),
    staleTime: 1000 * 60 * 5,
    enabled: !!courseId,
  });
}

export function useStudentDetail(courseId: string, studentId: string) {
  return useQuery({
    queryKey: professorKeys.student(courseId, studentId),
    queryFn: () => professorApi.getStudentDetail(courseId, studentId),
    staleTime: 1000 * 60 * 2,
    enabled: !!courseId && !!studentId,
  });
}

// ================== Silent Student Hooks ==================

export function useSilentStudents(courseId?: string, minLevel?: SilentLevel) {
  return useQuery({
    queryKey: professorKeys.silentStudents(courseId),
    queryFn: () => professorApi.getSilentStudents(courseId, minLevel),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAcknowledgeSilentFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: professorApi.acknowledgeSilentFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorKeys.silentStudents() });
      queryClient.invalidateQueries({ queryKey: professorKeys.overview() });
    },
  });
}

export function useResolveSilentFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flagId, resolution_notes }: { flagId: string; resolution_notes?: string }) =>
      professorApi.resolveSilentFlag(flagId, resolution_notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorKeys.silentStudents() });
      queryClient.invalidateQueries({ queryKey: professorKeys.overview() });
    },
  });
}

export function useSendNudge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: professorApi.sendNudge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: professorKeys.silentStudents() });
    },
  });
}

// ================== Revision Hooks ==================

export function useRevisionPlan(courseId: string) {
  return useQuery({
    queryKey: professorKeys.revisionPlan(courseId),
    queryFn: () => professorApi.getRevisionPlan(courseId),
    staleTime: 1000 * 60 * 10,
    enabled: !!courseId,
  });
}

export function useScheduleRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: professorApi.scheduleRevisionSession,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: professorKeys.revisionPlan(variables.course_id) });
      queryClient.invalidateQueries({ queryKey: professorKeys.lectures(variables.course_id) });
    },
  });
}

// ================== Analytics Hooks ==================

export function useProfessorAnalytics(filters?: {
  course_id?: string;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: professorKeys.analytics(filters),
    queryFn: () => professorApi.getAnalytics(filters),
    staleTime: 1000 * 60 * 10,
  });
}

export function useExportAnalytics() {
  return useMutation({
    mutationFn: professorApi.exportAnalytics,
  });
}

// ================== Combined Dashboard Hook ==================

export function useProfessorDashboardData() {
  const overview = useProfessorOverview();
  const courses = useProfessorCourses();
  const silentStudents = useSilentStudents(undefined, 'moderate');

  return {
    overview: overview.data,
    courses: courses.data,
    silentStudents: silentStudents.data,
    isLoading: overview.isLoading || courses.isLoading || silentStudents.isLoading,
    isError: overview.isError || courses.isError || silentStudents.isError,
    refetch: () => {
      overview.refetch();
      courses.refetch();
      silentStudents.refetch();
    },
  };
}

export default {
  useProfessorOverview,
  useProfessorCourses,
  useProfessorCourse,
  useCreateCourse,
  useUpdateCourse,
  useCourseTopics,
  useProfessorLectures,
  useProfessorLecture,
  useLectureInsights,
  useCreateLecture,
  useUpdateLecture,
  useMarkConfusionAddressed,
  useCourseStudents,
  useStudentDetail,
  useSilentStudents,
  useAcknowledgeSilentFlag,
  useResolveSilentFlag,
  useSendNudge,
  useRevisionPlan,
  useScheduleRevision,
  useProfessorAnalytics,
  useExportAnalytics,
  useProfessorDashboardData,
};
