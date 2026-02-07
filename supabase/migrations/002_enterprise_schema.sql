-- ENTERPRISE TABLES FOR LIS v2.0

-- Students table (PROFESSOR enrolls via CSV)
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  roll_number TEXT,
  photo_url TEXT,
  total_feedback INTEGER DEFAULT 0,
  clarity_score DECIMAL(3,2) DEFAULT 0,
  is_silent BOOLEAN DEFAULT false,
  streak_count INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  last_feedback_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments (professor-controlled)
CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  enrolled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

-- QR Codes per lecture
CREATE TABLE IF NOT EXISTS lecture_qrs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL,
  qr_url TEXT,
  scan_count INTEGER DEFAULT 0,
  scanned_by UUID[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Student scan analytics
CREATE TABLE IF NOT EXISTS lecture_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  qr_id UUID REFERENCES lecture_qrs(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP DEFAULT NOW(),
  device_type TEXT,
  ip_address TEXT,
  UNIQUE(lecture_id, student_id)
);

-- AI Analytics & Insights
CREATE TABLE IF NOT EXISTS lecture_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  total_responses INTEGER DEFAULT 0,
  avg_clarity DECIMAL(3,2) DEFAULT 0,
  confusion_topics TEXT[] DEFAULT '{}',
  silent_students UUID[] DEFAULT '{}',
  sentiment_breakdown JSONB DEFAULT '{"positive": 0, "neutral": 0, "negative": 0}',
  revision_required BOOLEAN DEFAULT false,
  ai_summary TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_qrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_analytics ENABLE ROW LEVEL SECURITY;

-- Students: Professors see their enrolled students
CREATE POLICY "Professors view their course students" ON students
  FOR SELECT USING (
    course_id IN (SELECT id FROM courses WHERE professor_id = auth.uid())
  );

-- Students: Professors can manage students
CREATE POLICY "Professors manage their students" ON students
  FOR ALL USING (
    course_id IN (SELECT id FROM courses WHERE professor_id = auth.uid())
  );

-- Enrollments: Professors manage enrollments
CREATE POLICY "Professors manage enrollments" ON student_enrollments
  FOR ALL USING (
    course_id IN (SELECT id FROM courses WHERE professor_id = auth.uid())
  );

-- QR codes: Public for scanning
CREATE POLICY "QR codes are public for scanning" ON lecture_qrs
  FOR SELECT USING (true);

-- Scans: Track all scans (for analytics)
CREATE POLICY "Track lecture scans" ON lecture_scans
  FOR INSERT WITH CHECK (true);

-- Analytics: Professors view their lecture analytics
CREATE POLICY "Professors view analytics" ON lecture_analytics
  FOR SELECT USING (
    course_id IN (SELECT id FROM courses WHERE professor_id = auth.uid())
  );

-- Indexes for performance
CREATE INDEX idx_students_course ON students(course_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_enrollments_course ON student_enrollments(course_id);
CREATE INDEX idx_enrollments_student ON student_enrollments(student_id);
CREATE INDEX idx_qr_lecture ON lecture_qrs(lecture_id);
CREATE INDEX idx_scans_lecture ON lecture_scans(lecture_id);
CREATE INDEX idx_scans_student ON lecture_scans(student_id);
CREATE INDEX idx_analytics_course ON lecture_analytics(course_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE lecture_qrs;
ALTER PUBLICATION supabase_realtime ADD TABLE lecture_scans;
ALTER PUBLICATION supabase_realtime ADD TABLE lecture_analytics;

-- Utility functions
CREATE OR REPLACE FUNCTION get_silent_students(p_course_id UUID)
RETURNS TABLE(student_id UUID, name TEXT, total_feedback INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name, s.total_feedback
  FROM students s
  WHERE s.course_id = p_course_id
    AND s.is_silent = true
  ORDER BY s.total_feedback ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_clarity_score(p_lecture_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  clarity DECIMAL;
BEGIN
  SELECT AVG(
    CASE 
      WHEN f.understanding = 'fully' THEN 1.0
      WHEN f.understanding = 'partial' THEN 0.5
      WHEN f.understanding = 'none' THEN 0.0
      ELSE 0.5
    END
  ) INTO clarity
  FROM feedback f
  WHERE f.lecture_id = p_lecture_id;
  
  RETURN COALESCE(clarity, 0);
END;
$$ LANGUAGE plpgsql;
