-- Demo Data Seeder for LIS
-- This file contains sample data for testing and demo purposes

-- Note: In production, use Supabase Auth to create users
-- These UUIDs are for reference only in demo data

-- Demo UUID (replace with actual auth.users IDs from Supabase Auth)
-- Professor ID: 550e8400-e29b-41d4-a716-446655440001
-- Student 1 ID: 550e8400-e29b-41d4-a716-446655440002
-- Student 2 ID: 550e8400-e29b-41d4-a716-446655440003

-- Insert demo course
INSERT INTO courses (id, name, professor_id, created_at)
VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  'Quantum Mechanics 101',
  '550e8400-e29b-41d4-a716-446655440001',
  NOW()
) ON CONFLICT DO NOTHING;

-- Insert demo lectures
INSERT INTO lectures (id, course_id, title, topics, created_at)
VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    'Wave Functions Fundamentals',
    '["Quantum Mechanics", ["Wave Function", "Schrodinger Equation", "Probability Density"]]'::jsonb[],
    NOW()
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440001',
    'Superposition & Entanglement',
    '["Advanced Topics", ["Superposition", "Quantum Entanglement", "Bell States"]]'::jsonb[],
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT DO NOTHING;

-- Insert student enrollments
INSERT INTO course_enrollments (course_id, student_id, joined_at)
VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NOW()),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', NOW())
ON CONFLICT DO NOTHING;

-- Insert sample feedback
INSERT INTO feedback (lecture_id, student_id, understanding_level, difficult_topics, reason, created_at)
VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    'partial',
    '["Schrodinger Equation", "Probability Density"]'::jsonb[],
    'Mathematical notation too complex',
    NOW() - INTERVAL '2 hours'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    'need_clarity',
    '["Wave Function"]'::jsonb[],
    'Physical interpretation unclear',
    NOW() - INTERVAL '1 hour'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'fully',
    NULL,
    NULL,
    NOW() - INTERVAL '30 minutes'
  )
ON CONFLICT DO NOTHING;
