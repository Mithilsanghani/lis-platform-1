# STEP 1: SUPABASE MIGRATION & RLS POLICIES ✅ COMPLETE

## Quick Setup Instructions

### 1. Create Supabase Project
```
1. Go to https://supabase.com
2. Click "Start your project"
3. Name: "lis-platform"
4. Region: Choose closest to IIT Gandhinagar (Mumbai preferred)
5. Password: Store securely
6. Click "Create new project"
7. Wait 2-3 minutes for initialization
```

### 2. Run Database Migration
```
1. Navigate to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire contents of: supabase/migrations/001_initial_schema.sql
4. Paste into SQL Editor
5. Click "Run" (triangle play button)
6. Verify: All CREATE TABLE commands succeeded
```

### 3. (Optional) Seed Demo Data
```
1. Click "New Query" in SQL Editor
2. Copy entire contents of: supabase/seed.sql
3. Paste and "Run"
4. This creates demo courses/lectures/feedback for testing
```

### 4. Get Credentials
```
1. Go to Settings → API
2. Copy:
   - Project URL → VITE_SUPABASE_URL
   - Anon Public Key → VITE_SUPABASE_ANON_KEY
3. Save to .env file (see Step 2)
```

### 5. Enable Realtime (Important!)
```
1. Go to Realtime → Backend Subscriptions
2. Enable "feedback", "lectures", "course_enrollments"
3. This allows professor to see live student feedback
```

### 6. Verify RLS Policies
```
1. Go to SQL Editor → New Query
2. Run: SELECT * FROM information_schema.role_privilege_grants WHERE role_name = 'authenticated';
3. You should see row-level security policies loaded
4. If not, re-run the migration script
```

## Database Schema Overview

### Tables Created:
- **courses**: Professor creates course (name, professor_id)
- **lectures**: Course lecture (title, topics as JSONB array)
- **feedback**: Student submissions (understanding_level, difficult_topics, reason)
- **course_enrollments**: Student ↔ Course relationship

### Security:
- ✅ Row-Level Security (RLS) enabled
- ✅ Professors can only see/edit their courses
- ✅ Students can only submit feedback for enrolled courses
- ✅ Anonymous signups allowed for public access

## Next Steps
→ Run "Step 2: Vite + React + Tailwind boilerplate"
