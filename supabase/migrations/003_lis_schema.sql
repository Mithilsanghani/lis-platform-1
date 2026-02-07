-- ============================================
-- LIS Database Schema
-- Lecture Intelligence System
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('professor', 'student', 'admin');
CREATE TYPE understanding_level AS ENUM ('full', 'partial', 'unclear');
CREATE TYPE course_role AS ENUM ('student', 'ta');
CREATE TYPE insight_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE insight_owner_type AS ENUM ('course', 'lecture', 'student');

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- nullable for SSO users
  department VARCHAR(100),
  roll_number VARCHAR(50), -- for students only
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);

-- ============================================
-- COURSES TABLE
-- ============================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  semester VARCHAR(20) NOT NULL, -- e.g., "Fall 2025", "Spring 2026"
  department VARCHAR(100) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT unique_course_code_semester UNIQUE(code, semester)
);

CREATE INDEX idx_courses_semester ON courses(semester);
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_created_by ON courses(created_by);

-- ============================================
-- COURSE ENROLLMENTS TABLE
-- ============================================

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_in_course course_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_enrollment UNIQUE(course_id, user_id)
);

CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);

-- ============================================
-- LECTURES TABLE
-- ============================================

CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  topics JSONB DEFAULT '[]'::jsonb, -- array of topic strings
  feedback_deadline TIMESTAMP WITH TIME ZONE,
  qr_code_url TEXT,
  short_link VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_lectures_date ON lectures(date_time);
CREATE INDEX idx_lectures_short_link ON lectures(short_link);

-- ============================================
-- FEEDBACK TABLE
-- ============================================

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  understanding understanding_level NOT NULL,
  reasons JSONB DEFAULT '[]'::jsonb, -- array of reason codes
  subtopics JSONB DEFAULT '[]'::jsonb, -- array of subtopic strings
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_feedback_per_lecture UNIQUE(lecture_id, student_id)
);

CREATE INDEX idx_feedback_lecture ON feedback(lecture_id);
CREATE INDEX idx_feedback_student ON feedback(student_id);
CREATE INDEX idx_feedback_understanding ON feedback(understanding);
CREATE INDEX idx_feedback_created ON feedback(created_at);

-- ============================================
-- AI INSIGHTS TABLE
-- ============================================

CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_type insight_owner_type NOT NULL,
  owner_id UUID NOT NULL,
  priority insight_priority NOT NULL DEFAULT 'medium',
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  action VARCHAR(255),
  action_route VARCHAR(255),
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_insights_owner ON ai_insights(owner_type, owner_id);
CREATE INDEX idx_insights_priority ON ai_insights(priority);

-- ============================================
-- REVISION SESSIONS TABLE
-- ============================================

CREATE TABLE revision_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  topics JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_revisions_course ON revision_sessions(course_id);
CREATE INDEX idx_revisions_scheduled ON revision_sessions(scheduled_at);

-- ============================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  feedback_reminder BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_preferences UNIQUE(user_id)
);

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Lecture Insights View
CREATE OR REPLACE VIEW lecture_insights AS
SELECT 
  l.id AS lecture_id,
  l.course_id,
  l.title,
  l.date_time,
  COUNT(f.id) AS response_count,
  COUNT(CASE WHEN f.understanding = 'full' THEN 1 END) AS full_count,
  COUNT(CASE WHEN f.understanding = 'partial' THEN 1 END) AS partial_count,
  COUNT(CASE WHEN f.understanding = 'unclear' THEN 1 END) AS unclear_count,
  ROUND(100.0 * COUNT(CASE WHEN f.understanding = 'full' THEN 1 END) / NULLIF(COUNT(f.id), 0), 1) AS full_pct,
  ROUND(100.0 * COUNT(CASE WHEN f.understanding = 'partial' THEN 1 END) / NULLIF(COUNT(f.id), 0), 1) AS partial_pct,
  ROUND(100.0 * COUNT(CASE WHEN f.understanding = 'unclear' THEN 1 END) / NULLIF(COUNT(f.id), 0), 1) AS unclear_pct
FROM lectures l
LEFT JOIN feedback f ON f.lecture_id = l.id
GROUP BY l.id, l.course_id, l.title, l.date_time;

-- Student Metrics View (per course)
CREATE OR REPLACE VIEW student_metrics AS
SELECT 
  ce.user_id AS student_id,
  ce.course_id,
  COUNT(f.id) AS feedback_submitted_count,
  COUNT(CASE WHEN f.understanding = 'full' THEN 1 END) AS full_count,
  COUNT(CASE WHEN f.understanding = 'partial' THEN 1 END) AS partial_count,
  COUNT(CASE WHEN f.understanding = 'unclear' THEN 1 END) AS unclear_count,
  ROUND(
    100.0 * (
      COUNT(CASE WHEN f.understanding = 'full' THEN 1 END) * 1.0 +
      COUNT(CASE WHEN f.understanding = 'partial' THEN 1 END) * 0.5
    ) / NULLIF(COUNT(f.id), 0), 
    1
  ) AS understanding_pct,
  MAX(f.created_at) AS last_feedback_at,
  COUNT(CASE WHEN f.comment IS NOT NULL AND f.comment != '' THEN 1 END) AS comment_count
FROM course_enrollments ce
LEFT JOIN lectures l ON l.course_id = ce.course_id
LEFT JOIN feedback f ON f.lecture_id = l.id AND f.student_id = ce.user_id
WHERE ce.role_in_course = 'student'
GROUP BY ce.user_id, ce.course_id;

-- Course Health View
CREATE OR REPLACE VIEW course_health AS
SELECT 
  c.id AS course_id,
  c.code,
  c.title,
  COUNT(DISTINCT ce.user_id) AS student_count,
  COUNT(DISTINCT l.id) AS lecture_count,
  COUNT(DISTINCT f.id) AS total_feedback,
  ROUND(
    100.0 * (
      COUNT(CASE WHEN f.understanding = 'full' THEN 1 END) * 1.0 +
      COUNT(CASE WHEN f.understanding = 'partial' THEN 1 END) * 0.5
    ) / NULLIF(COUNT(f.id), 0),
    1
  ) AS health_pct
FROM courses c
LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.role_in_course = 'student'
LEFT JOIN lectures l ON l.course_id = c.id
LEFT JOIN feedback f ON f.lecture_id = l.id
WHERE c.archived_at IS NULL
GROUP BY c.id, c.code, c.title;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to detect silent students
CREATE OR REPLACE FUNCTION get_silent_students(p_course_id UUID)
RETURNS TABLE (
  student_id UUID,
  full_name VARCHAR,
  understanding_pct NUMERIC,
  partial_count BIGINT,
  unclear_count BIGINT,
  comment_rate NUMERIC,
  lectures_attended BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sm.student_id,
    u.full_name,
    sm.understanding_pct,
    sm.partial_count,
    sm.unclear_count,
    ROUND(100.0 * sm.comment_count / NULLIF(sm.feedback_submitted_count, 0), 1) AS comment_rate,
    sm.feedback_submitted_count AS lectures_attended
  FROM student_metrics sm
  JOIN users u ON u.id = sm.student_id
  WHERE sm.course_id = p_course_id
    AND sm.feedback_submitted_count >= 3
    AND (sm.partial_count + sm.unclear_count) >= 3
    AND (100.0 * sm.comment_count / NULLIF(sm.feedback_submitted_count, 0)) < 30;
END;
$$ LANGUAGE plpgsql;

-- Function to get topic confusion scores
CREATE OR REPLACE FUNCTION get_topic_confusion(p_course_id UUID)
RETURNS TABLE (
  topic TEXT,
  total_mentions BIGINT,
  unclear_mentions BIGINT,
  partial_mentions BIGINT,
  confusion_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.topic::TEXT,
    COUNT(*) AS total_mentions,
    COUNT(CASE WHEN f.understanding = 'unclear' THEN 1 END) AS unclear_mentions,
    COUNT(CASE WHEN f.understanding = 'partial' THEN 1 END) AS partial_mentions,
    ROUND(
      (COUNT(CASE WHEN f.understanding = 'unclear' THEN 1 END) * 2 +
       COUNT(CASE WHEN f.understanding = 'partial' THEN 1 END)) * 100.0 / 
      NULLIF(COUNT(*) * 2, 0),
      1
    ) AS confusion_score
  FROM lectures l
  CROSS JOIN LATERAL jsonb_array_elements_text(l.topics) AS t(topic)
  JOIN feedback f ON f.lecture_id = l.id
  WHERE l.course_id = p_course_id
  GROUP BY t.topic
  ORDER BY confusion_score DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);

-- Professors can see their courses
CREATE POLICY courses_professor_select ON courses FOR SELECT 
  USING (created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM course_enrollments WHERE course_id = courses.id AND user_id = auth.uid()
  ));

-- Students can see courses they're enrolled in
CREATE POLICY enrollments_select ON course_enrollments FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM courses WHERE id = course_id AND created_by = auth.uid()
  ));

-- Lectures visible to enrolled users and course creator
CREATE POLICY lectures_select ON lectures FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM courses c 
    LEFT JOIN course_enrollments ce ON ce.course_id = c.id
    WHERE c.id = lectures.course_id 
      AND (c.created_by = auth.uid() OR ce.user_id = auth.uid())
  ));

-- Students can insert their own feedback
CREATE POLICY feedback_insert ON feedback FOR INSERT 
  WITH CHECK (student_id = auth.uid());

-- Feedback visible to student who submitted or course professor
CREATE POLICY feedback_select ON feedback FOR SELECT 
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM lectures l 
    JOIN courses c ON c.id = l.course_id 
    WHERE l.id = lecture_id AND c.created_by = auth.uid()
  ));
