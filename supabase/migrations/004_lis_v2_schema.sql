-- ============================================
-- LIS v2.0 DATABASE SCHEMA
-- Feedback-centric design for colleges
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('student', 'professor', 'dept_admin', 'institute_admin');
CREATE TYPE course_role AS ENUM ('student', 'ta', 'co_instructor');
CREATE TYPE understanding_level AS ENUM ('full', 'partial', 'unclear');
CREATE TYPE lecture_mode AS ENUM ('online', 'offline', 'hybrid');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE silent_reason AS ENUM ('low_understanding', 'low_participation', 'no_comments', 'declining_trend');
CREATE TYPE silent_level AS ENUM ('warning', 'critical');
CREATE TYPE reminder_timing AS ENUM ('before', 'after', 'daily_summary');
CREATE TYPE feedback_reason AS ENUM ('pace_fast', 'pace_slow', 'examples_few', 'concept_unclear', 'missed_part', 'good_explanation', 'helpful_examples', 'engaging_delivery');

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'student',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    department VARCHAR(100),
    roll_number VARCHAR(50),
    avatar_url TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);

-- User roles for fine-grained RBAC
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    scope_type VARCHAR(50), -- 'global', 'department', 'course'
    scope_id UUID, -- department_id or course_id
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, role, scope_type, scope_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20),
    credits INTEGER,
    created_by UUID NOT NULL REFERENCES users(id),
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(code, semester, academic_year)
);

CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_department ON courses(department);
CREATE INDEX idx_courses_semester ON courses(semester);
CREATE INDEX idx_courses_created_by ON courses(created_by);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_course course_role DEFAULT 'student',
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    dropped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, user_id)
);

CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_active ON course_enrollments(course_id, user_id) WHERE dropped_at IS NULL;

-- Lectures table
CREATE TABLE IF NOT EXISTS lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date_time TIMESTAMPTZ NOT NULL,
    duration_mins INTEGER DEFAULT 60,
    mode lecture_mode DEFAULT 'offline',
    location VARCHAR(255),
    topics JSONB DEFAULT '[]'::jsonb, -- Array of topic strings
    feedback_deadline TIMESTAMPTZ,
    is_cancelled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_lectures_date ON lectures(date_time);
CREATE INDEX idx_lectures_course_date ON lectures(course_id, date_time DESC);

-- ============================================
-- FEEDBACK SYSTEM
-- ============================================

-- Feedback form templates (for customization)
CREATE TABLE IF NOT EXISTS feedback_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE, -- NULL = global template
    department VARCHAR(100), -- NULL = all departments
    schema JSONB NOT NULL DEFAULT '{
        "understanding": {"required": true, "options": ["full", "partial", "unclear"]},
        "reasons": {"required": false, "multiple": true, "options": ["pace_fast", "pace_slow", "examples_few", "concept_unclear", "missed_part"]},
        "subtopics": {"required": false, "freeform": true},
        "comment": {"required": false, "maxLength": 500}
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_forms_course ON feedback_forms(course_id);
CREATE INDEX idx_feedback_forms_active ON feedback_forms(is_active) WHERE is_active = true;

-- Student feedback submissions
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    understanding understanding_level NOT NULL,
    reasons feedback_reason[] DEFAULT '{}',
    subtopics TEXT[] DEFAULT '{}',
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    form_id UUID REFERENCES feedback_forms(id),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lecture_id, student_id)
);

CREATE INDEX idx_feedback_lecture ON feedback(lecture_id);
CREATE INDEX idx_feedback_student ON feedback(student_id);
CREATE INDEX idx_feedback_understanding ON feedback(understanding);
CREATE INDEX idx_feedback_submitted ON feedback(submitted_at DESC);

-- ============================================
-- ANALYTICS & INSIGHTS TABLES
-- ============================================

-- Student metrics per course (materialized/computed)
CREATE TABLE IF NOT EXISTS student_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    understanding_pct DECIMAL(5,2) DEFAULT 0,
    full_count INTEGER DEFAULT 0,
    partial_count INTEGER DEFAULT 0,
    unclear_count INTEGER DEFAULT 0,
    feedback_submitted INTEGER DEFAULT 0,
    feedback_pending INTEGER DEFAULT 0,
    total_lectures INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_feedback_at TIMESTAMPTZ,
    avg_response_time_mins INTEGER,
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

CREATE INDEX idx_student_metrics_student ON student_metrics(student_id);
CREATE INDEX idx_student_metrics_course ON student_metrics(course_id);
CREATE INDEX idx_student_metrics_understanding ON student_metrics(understanding_pct);

-- Lecture insights (aggregated feedback)
CREATE TABLE IF NOT EXISTS lecture_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE UNIQUE,
    response_count INTEGER DEFAULT 0,
    enrolled_count INTEGER DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 0,
    full_count INTEGER DEFAULT 0,
    partial_count INTEGER DEFAULT 0,
    unclear_count INTEGER DEFAULT 0,
    full_pct DECIMAL(5,2) DEFAULT 0,
    partial_pct DECIMAL(5,2) DEFAULT 0,
    unclear_pct DECIMAL(5,2) DEFAULT 0,
    pace_fast_count INTEGER DEFAULT 0,
    pace_slow_count INTEGER DEFAULT 0,
    examples_few_count INTEGER DEFAULT 0,
    concept_unclear_count INTEGER DEFAULT 0,
    missed_part_count INTEGER DEFAULT 0,
    good_explanation_count INTEGER DEFAULT 0,
    helpful_examples_count INTEGER DEFAULT 0,
    top_subtopics JSONB DEFAULT '[]'::jsonb,
    risk_level risk_level DEFAULT 'low',
    confusion_addressed BOOLEAN DEFAULT false,
    confusion_addressed_at TIMESTAMPTZ,
    computed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lecture_insights_lecture ON lecture_insights(lecture_id);
CREATE INDEX idx_lecture_insights_risk ON lecture_insights(risk_level);

-- Course insights (aggregated over lectures)
CREATE TABLE IF NOT EXISTS course_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE UNIQUE,
    avg_understanding_pct DECIMAL(5,2) DEFAULT 0,
    avg_response_rate DECIMAL(5,2) DEFAULT 0,
    total_lectures INTEGER DEFAULT 0,
    total_feedback INTEGER DEFAULT 0,
    high_risk_lectures INTEGER DEFAULT 0,
    high_risk_topics JSONB DEFAULT '[]'::jsonb,
    trending_issues JSONB DEFAULT '[]'::jsonb,
    silent_students_count INTEGER DEFAULT 0,
    health_score INTEGER DEFAULT 100, -- 0-100
    trend VARCHAR(20) DEFAULT 'stable', -- 'improving', 'stable', 'declining'
    last_lecture_at TIMESTAMPTZ,
    computed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_course_insights_course ON course_insights(course_id);
CREATE INDEX idx_course_insights_health ON course_insights(health_score);

-- Topic performance tracking
CREATE TABLE IF NOT EXISTS topic_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    total_mentions INTEGER DEFAULT 0,
    full_count INTEGER DEFAULT 0,
    partial_count INTEGER DEFAULT 0,
    unclear_count INTEGER DEFAULT 0,
    clarity_pct DECIMAL(5,2) DEFAULT 0,
    confusion_score INTEGER DEFAULT 0, -- 0-100, higher = more confused
    trend VARCHAR(20) DEFAULT 'stable',
    last_mentioned_at TIMESTAMPTZ,
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, topic)
);

CREATE INDEX idx_topic_analytics_course ON topic_analytics(course_id);
CREATE INDEX idx_topic_analytics_confusion ON topic_analytics(confusion_score DESC);

-- ============================================
-- SILENT STUDENT DETECTION
-- ============================================

CREATE TABLE IF NOT EXISTS silent_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    reason silent_reason NOT NULL,
    level silent_level DEFAULT 'warning',
    understanding_pct DECIMAL(5,2),
    participation_pct DECIMAL(5,2),
    comment_rate DECIMAL(5,2),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(student_id, course_id, reason)
);

CREATE INDEX idx_silent_flags_student ON silent_flags(student_id);
CREATE INDEX idx_silent_flags_course ON silent_flags(course_id);
CREATE INDEX idx_silent_flags_level ON silent_flags(level);
CREATE INDEX idx_silent_flags_unresolved ON silent_flags(course_id) WHERE resolved_at IS NULL;

-- Nudge history
CREATE TABLE IF NOT EXISTS nudge_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    sent_by UUID NOT NULL REFERENCES users(id),
    message TEXT,
    channel VARCHAR(50) DEFAULT 'email', -- 'email', 'push', 'whatsapp'
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ
);

CREATE INDEX idx_nudge_history_student ON nudge_history(student_id);
CREATE INDEX idx_nudge_history_course ON nudge_history(course_id);

-- ============================================
-- USER PREFERENCES & SETTINGS
-- ============================================

CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    whatsapp_enabled BOOLEAN DEFAULT false,
    sms_enabled BOOLEAN DEFAULT false,
    reminder_timing reminder_timing DEFAULT 'after',
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    weekly_digest BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);

-- Privacy settings
CREATE TABLE IF NOT EXISTS privacy_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    share_performance_with_professor BOOLEAN DEFAULT true,
    share_trends_with_professor BOOLEAN DEFAULT true,
    allow_anonymous_feedback BOOLEAN DEFAULT true,
    show_in_leaderboards BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_privacy_settings_user ON privacy_settings(user_id);

-- ============================================
-- REVISION & ACTION TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS revision_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES lectures(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topics JSONB DEFAULT '[]'::jsonb,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_mins INTEGER DEFAULT 30,
    created_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    feedback_collected BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revision_sessions_course ON revision_sessions(course_id);
CREATE INDEX idx_revision_sessions_scheduled ON revision_sessions(scheduled_at);

-- ============================================
-- AUDIT & LOGGING
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role user_role,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active courses with stats
CREATE OR REPLACE VIEW v_course_summary AS
SELECT 
    c.id,
    c.code,
    c.title,
    c.department,
    c.semester,
    c.created_by,
    u.full_name as professor_name,
    COUNT(DISTINCT ce.user_id) FILTER (WHERE ce.dropped_at IS NULL) as student_count,
    COUNT(DISTINCT l.id) as lecture_count,
    ci.avg_understanding_pct,
    ci.health_score,
    ci.silent_students_count,
    ci.trend,
    c.created_at
FROM courses c
LEFT JOIN users u ON c.created_by = u.id
LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.role_in_course = 'student'
LEFT JOIN lectures l ON c.id = l.course_id AND l.is_cancelled = false
LEFT JOIN course_insights ci ON c.id = ci.course_id
WHERE c.archived_at IS NULL
GROUP BY c.id, c.code, c.title, c.department, c.semester, c.created_by, u.full_name, 
         ci.avg_understanding_pct, ci.health_score, ci.silent_students_count, ci.trend;

-- Pending feedback for students
CREATE OR REPLACE VIEW v_pending_feedback AS
SELECT 
    l.id as lecture_id,
    l.title as lecture_title,
    l.date_time,
    l.topics,
    l.feedback_deadline,
    c.id as course_id,
    c.code as course_code,
    c.title as course_title,
    ce.user_id as student_id,
    CASE 
        WHEN l.feedback_deadline IS NOT NULL AND l.feedback_deadline < NOW() + INTERVAL '2 hours' THEN true
        ELSE false
    END as due_soon
FROM lectures l
JOIN courses c ON l.course_id = c.id
JOIN course_enrollments ce ON c.id = ce.course_id AND ce.role_in_course = 'student' AND ce.dropped_at IS NULL
LEFT JOIN feedback f ON l.id = f.lecture_id AND f.student_id = ce.user_id
WHERE f.id IS NULL
  AND l.date_time < NOW()
  AND l.is_cancelled = false
  AND c.archived_at IS NULL
  AND (l.feedback_deadline IS NULL OR l.feedback_deadline > NOW());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update student metrics
CREATE OR REPLACE FUNCTION update_student_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO student_metrics (student_id, course_id, feedback_submitted, last_feedback_at)
    SELECT 
        NEW.student_id,
        l.course_id,
        1,
        NEW.submitted_at
    FROM lectures l WHERE l.id = NEW.lecture_id
    ON CONFLICT (student_id, course_id) 
    DO UPDATE SET
        feedback_submitted = student_metrics.feedback_submitted + 1,
        full_count = student_metrics.full_count + CASE WHEN NEW.understanding = 'full' THEN 1 ELSE 0 END,
        partial_count = student_metrics.partial_count + CASE WHEN NEW.understanding = 'partial' THEN 1 ELSE 0 END,
        unclear_count = student_metrics.unclear_count + CASE WHEN NEW.understanding = 'unclear' THEN 1 ELSE 0 END,
        understanding_pct = ROUND(
            (student_metrics.full_count + CASE WHEN NEW.understanding = 'full' THEN 1 ELSE 0 END) * 100.0 / 
            NULLIF(student_metrics.feedback_submitted + 1, 0)
            + (student_metrics.partial_count + CASE WHEN NEW.understanding = 'partial' THEN 1 ELSE 0 END) * 50.0 / 
            NULLIF(student_metrics.feedback_submitted + 1, 0),
            2
        ),
        last_feedback_at = NEW.submitted_at,
        computed_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_student_metrics
AFTER INSERT ON feedback
FOR EACH ROW
EXECUTE FUNCTION update_student_metrics();

-- Function to update lecture insights
CREATE OR REPLACE FUNCTION update_lecture_insights()
RETURNS TRIGGER AS $$
DECLARE
    v_enrolled INTEGER;
BEGIN
    -- Get enrolled count
    SELECT COUNT(*) INTO v_enrolled
    FROM course_enrollments ce
    JOIN lectures l ON l.course_id = ce.course_id
    WHERE l.id = NEW.lecture_id AND ce.role_in_course = 'student' AND ce.dropped_at IS NULL;

    INSERT INTO lecture_insights (lecture_id, enrolled_count)
    VALUES (NEW.lecture_id, v_enrolled)
    ON CONFLICT (lecture_id) DO UPDATE SET
        response_count = (
            SELECT COUNT(*) FROM feedback WHERE lecture_id = NEW.lecture_id
        ),
        full_count = (
            SELECT COUNT(*) FROM feedback WHERE lecture_id = NEW.lecture_id AND understanding = 'full'
        ),
        partial_count = (
            SELECT COUNT(*) FROM feedback WHERE lecture_id = NEW.lecture_id AND understanding = 'partial'
        ),
        unclear_count = (
            SELECT COUNT(*) FROM feedback WHERE lecture_id = NEW.lecture_id AND understanding = 'unclear'
        ),
        enrolled_count = v_enrolled,
        computed_at = NOW();
    
    -- Update percentages
    UPDATE lecture_insights SET
        response_rate = ROUND(response_count * 100.0 / NULLIF(enrolled_count, 0), 2),
        full_pct = ROUND(full_count * 100.0 / NULLIF(response_count, 0), 2),
        partial_pct = ROUND(partial_count * 100.0 / NULLIF(response_count, 0), 2),
        unclear_pct = ROUND(unclear_count * 100.0 / NULLIF(response_count, 0), 2),
        risk_level = CASE 
            WHEN (unclear_count * 100.0 / NULLIF(response_count, 0)) > 30 THEN 'high'
            WHEN (unclear_count * 100.0 / NULLIF(response_count, 0)) > 15 THEN 'medium'
            ELSE 'low'
        END
    WHERE lecture_id = NEW.lecture_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lecture_insights
AFTER INSERT OR UPDATE ON feedback
FOR EACH ROW
EXECUTE FUNCTION update_lecture_insights();

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_lectures_updated_at BEFORE UPDATE ON lectures FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_metrics ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);

-- Professors can read enrolled students
CREATE POLICY users_select_enrolled ON users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM course_enrollments ce
        JOIN courses c ON ce.course_id = c.id
        WHERE ce.user_id = users.id AND c.created_by = auth.uid()
    )
);

-- Students can read courses they're enrolled in
CREATE POLICY courses_select_enrolled ON courses FOR SELECT USING (
    EXISTS (SELECT 1 FROM course_enrollments WHERE course_id = courses.id AND user_id = auth.uid())
    OR created_by = auth.uid()
);

-- Students can only see their own feedback
CREATE POLICY feedback_select_own ON feedback FOR SELECT USING (student_id = auth.uid());

-- Professors can see aggregated feedback for their courses
CREATE POLICY feedback_select_professor ON feedback FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM lectures l
        JOIN courses c ON l.course_id = c.id
        WHERE l.id = feedback.lecture_id AND c.created_by = auth.uid()
    )
);

-- Students can insert their own feedback
CREATE POLICY feedback_insert_own ON feedback FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can update their own feedback
CREATE POLICY feedback_update_own ON feedback FOR UPDATE USING (student_id = auth.uid());
