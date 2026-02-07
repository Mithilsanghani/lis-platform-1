import { supabase } from './supabase';

export interface StudentWithFeedback {
  id: string;
  name: string;
  email: string;
  roll_number: string;
  total_feedback: number;
  clarity_score: number;
  is_silent: boolean;
  streak_count: number;
}

// Enroll students in bulk
export const enrollStudents = async (courseId: string, students: Array<{ name: string; email: string; roll_number: string }>) => {
  try {
    // Insert into students table
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert(
        students.map((s) => ({
          course_id: courseId,
          name: s.name,
          email: s.email,
          roll_number: s.roll_number,
        }))
      )
      .select('id');

    if (studentError) throw studentError;

    // Create enrollments
    const enrollmentRecords = studentData?.map((s: any) => ({
      course_id: courseId,
      student_id: s.id,
      status: 'active',
    })) || [];

    const { error: enrollError } = await supabase
      .from('student_enrollments')
      .insert(enrollmentRecords);

    if (enrollError) throw enrollError;

    return { success: true, count: studentData?.length || 0 };
  } catch (error) {
    console.error('Enrollment error:', error);
    throw error;
  }
};

// Fetch enrolled students
export const fetchStudents = async (courseId: string): Promise<StudentWithFeedback[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Fetch students error:', error);
    return [];
  }
};

// Get silent students
export const getSilentStudents = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_silent_students', { p_course_id: courseId });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Silent students error:', error);
    return [];
  }
};

// Update student clarity score
export const updateStudentClarity = async (studentId: string, score: number) => {
  try {
    const { error } = await supabase
      .from('students')
      .update({ clarity_score: score })
      .eq('id', studentId);

    if (error) throw error;
  } catch (error) {
    console.error('Update clarity error:', error);
  }
};

// Flag silent student
export const flagSilentStudent = async (studentId: string, isSilent: boolean) => {
  try {
    const { error } = await supabase
      .from('students')
      .update({ is_silent: isSilent })
      .eq('id', studentId);

    if (error) throw error;
  } catch (error) {
    console.error('Flag silent error:', error);
  }
};

// Add student badge
export const addStudentBadge = async (studentId: string, badge: string) => {
  try {
    const { data: student, error: fetchError } = await supabase
      .from('students')
      .select('badges')
      .eq('id', studentId)
      .single();

    if (fetchError) throw fetchError;

    const badges = student?.badges || [];
    if (!badges.includes(badge)) {
      badges.push(badge);

      const { error } = await supabase
        .from('students')
        .update({ badges })
        .eq('id', studentId);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Badge error:', error);
  }
};

// Get lecture analytics
export const getLectureAnalytics = async (lectureId: string) => {
  try {
    const { data, error } = await supabase
      .from('lecture_analytics')
      .select('*')
      .eq('lecture_id', lectureId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Analytics error:', error);
    return null;
  }
};

// Delete student
export const deleteStudent = async (studentId: string) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) throw error;
  } catch (error) {
    console.error('Delete student error:', error);
  }
};
