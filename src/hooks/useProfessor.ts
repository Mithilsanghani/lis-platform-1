import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Course, Lecture } from '../store/useStore';

export const useProfessor = (userId: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses for professor
  useEffect(() => {
    if (!userId) return;

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const { data, error: err } = await supabase
          .from('courses')
          .select('*')
          .eq('professor_id', userId);

        if (err) throw err;
        setCourses(data || []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch courses';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  // Create new course
  const createCourse = async (name: string) => {
    try {
      const { data, error: err } = await supabase
        .from('courses')
        .insert([{ name, professor_id: userId }])
        .select()
        .single();

      if (err) throw err;
      setCourses([...courses, data]);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create course';
      setError(msg);
      throw err;
    }
  };

  // Create new lecture
  const createLecture = async (courseId: string, title: string, topics: string[][]) => {
    try {
      const { data, error: err } = await supabase
        .from('lectures')
        .insert([{ course_id: courseId, title, topics }])
        .select()
        .single();

      if (err) throw err;
      setLectures([...lectures, data]);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create lecture';
      setError(msg);
      throw err;
    }
  };

  // Fetch lectures for course
  const fetchCourseLectures = async (courseId: string) => {
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('lectures')
        .select('*')
        .eq('course_id', courseId);

      if (err) throw err;
      setLectures(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch lectures';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courses,
    lectures,
    isLoading,
    error,
    createCourse,
    createLecture,
    fetchCourseLectures,
  };
};
