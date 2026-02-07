-- LIS (Lecture Intelligence System) - Initial Schema
-- Run this EXACTLY in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  professor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lectures table
CREATE TABLE IF NOT EXISTS lectures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topics JSONB[], -- ["Quantum Mechanics", ["Wave Function", "Schrodinger"]]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  understanding_level TEXT NOT NULL CHECK (understanding_level IN ('fully', 'partial', 'need_clarity')),
  difficult_topics JSONB[], -- ["Wave Function"]
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_enrollments table for students
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

-- Create indexes for performance
CREATE INDEX idx_courses_professor_id ON courses(professor_id);
CREATE INDEX idx_lectures_course_id ON lectures(course_id);
CREATE INDEX idx_feedback_lecture_id ON feedback(lecture_id);
CREATE INDEX idx_feedback_student_id ON feedback(student_id);
CREATE INDEX idx_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_student_id ON course_enrollments(student_id);

-- ============ ROW LEVEL SECURITY (RLS) POLICIES ============

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- COURSES POLICIES
-- Professors can create/update/delete their own courses
CREATE POLICY "Professors can manage their courses" ON courses
  FOR ALL USING (
    auth.uid() = professor_id
  )
  WITH CHECK (
    auth.uid() = professor_id
  );

-- Anyone can view public courses (for enrollment)
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

-- LECTURES POLICIES
-- Anyone can view lectures in courses they're enrolled in or own
CREATE POLICY "Users can view lectures in accessible courses" ON lectures
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lectures.course_id
      AND (
        courses.professor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM course_enrollments
          WHERE course_enrollments.course_id = courses.id
          AND course_enrollments.student_id = auth.uid()
        )
      )
    )
  );

-- Professors can create/update lectures in their courses
CREATE POLICY "Professors can manage lectures" ON lectures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lectures.course_id
      AND courses.professor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lectures.course_id
      AND courses.professor_id = auth.uid()
    )
  );

-- FEEDBACK POLICIES
-- Students can create feedback for lectures in their courses
CREATE POLICY "Students can create feedback" ON feedback
  FOR INSERT WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM lectures
      WHERE lectures.id = feedback.lecture_id
      AND EXISTS (
        SELECT 1 FROM course_enrollments
        WHERE course_enrollments.course_id = lectures.course_id
        AND course_enrollments.student_id = auth.uid()
      )
    )
  );

-- Professors can view all feedback for their lectures
CREATE POLICY "Professors can view feedback" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lectures
      WHERE lectures.id = feedback.lecture_id
      AND EXISTS (
        SELECT 1 FROM courses
        WHERE courses.id = lectures.course_id
        AND courses.professor_id = auth.uid()
      )
    )
    OR auth.uid() = student_id
  );

-- Students can delete only their own feedback
CREATE POLICY "Students can delete own feedback" ON feedback
  FOR DELETE USING (
    auth.uid() = student_id
  );

-- ENROLLMENTS POLICIES
-- Students can join courses
CREATE POLICY "Students can enroll in courses" ON course_enrollments
  FOR INSERT WITH CHECK (
    auth.uid() = student_id
  );

-- Professors can view enrollments of their courses
CREATE POLICY "Professors can view enrollments" ON course_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_enrollments.course_id
      AND courses.professor_id = auth.uid()
    )
    OR auth.uid() = student_id
  );

-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments" ON course_enrollments
  FOR SELECT USING (
    auth.uid() = student_id
  );

-- ============ REALTIME SUBSCRIPTIONS ============

-- Enable realtime for feedback updates
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
  CREATE PUBLICATION supabase_realtime FOR TABLE lectures, feedback, course_enrollments;
COMMIT;

-- ============ UTILITY FUNCTIONS ============

-- Function to get feedback stats for a lecture
CREATE OR REPLACE FUNCTION get_lecture_feedback_stats(lecture_id UUID)
RETURNS TABLE (
  total_responses INTEGER,
  fully_understanding INTEGER,
  partial_understanding INTEGER,
  need_clarity INTEGER,
  confusion_topics TEXT[]
) AS $$
SELECT
  COUNT(*)::INTEGER,
  COUNT(*) FILTER (WHERE understanding_level = 'fully')::INTEGER,
  COUNT(*) FILTER (WHERE understanding_level = 'partial')::INTEGER,
  COUNT(*) FILTER (WHERE understanding_level = 'need_clarity')::INTEGER,
  ARRAY_AGG(DISTINCT jsonb_array_elements(difficult_topics)::TEXT) FILTER (WHERE difficult_topics IS NOT NULL)
FROM feedback
WHERE feedback.lecture_id = $1;
$$ LANGUAGE SQL SECURITY INVOKER;

-- Function to get course statistics
CREATE OR REPLACE FUNCTION get_course_stats(course_id UUID)
RETURNS TABLE (
  total_lectures INTEGER,
  total_enrolled INTEGER,
  total_feedback INTEGER
) AS $$
SELECT
  (SELECT COUNT(*)::INTEGER FROM lectures WHERE lectures.course_id = $1),
  (SELECT COUNT(*)::INTEGER FROM course_enrollments WHERE course_enrollments.course_id = $1),
  (SELECT COUNT(*)::INTEGER FROM feedback WHERE EXISTS (SELECT 1 FROM lectures WHERE lectures.course_id = $1 AND lectures.id = feedback.lecture_id))
$$ LANGUAGE SQL SECURITY INVOKER;
