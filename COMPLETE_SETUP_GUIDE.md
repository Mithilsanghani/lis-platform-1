# LECTURE INTELLIGENCE SYSTEM (LIS) - COMPLETE SETUP GUIDE

## 🚀 QUICK START (3 HOURS)

### Phase 1: Supabase Setup (30 minutes)

#### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create account and sign in
4. Click "New Project"
5. Enter:
   - **Name**: `lis-platform`
   - **Database Password**: [Create strong password - save it!]
   - **Region**: `Mumbai` (closest to IIT Gandhinagar)
6. Click "Create New Project"
7. Wait 2-3 minutes for initialization

#### 1.2 Run Database Migration
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open file: `supabase/migrations/001_initial_schema.sql`
4. Copy entire content
5. Paste into SQL Editor
6. Click **Run** button (▶)
7. Verify: See "Success" message

#### 1.3 Get API Credentials
1. Go to **Settings → API**
2. Copy **Project URL** → save as `VITE_SUPABASE_URL`
3. Copy **Anon Public Key** → save as `VITE_SUPABASE_ANON_KEY`

#### 1.4 Enable Realtime
1. Go to **Realtime** (in left sidebar)
2. Under "Backend Subscriptions", find:
   - `feedback`
   - `lectures`
   - `course_enrollments`
3. Toggle ON for each

---

### Phase 2: Frontend Setup (30 minutes)

#### 2.1 Install Project
```bash
cd lis-platform
npm install
```

**Output**: Should see "added 500+ packages"
**Time**: 2-3 minutes

#### 2.2 Configure Environment
```bash
# Create .env.local from template
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
VITE_APP_URL=http://localhost:5173
```

#### 2.3 Start Dev Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Browser automatically opens. If not, visit `http://localhost:5173`

✅ **Checkpoint**: You should see LIS landing page

---

### Phase 3: Create Test Accounts (15 minutes)

#### 3.1 Create Professor Account
1. Click "Get Started" button
2. Click "Sign Up"
3. Select **Professor**
4. Enter:
   - **Email**: `prof@example.com`
   - **Password**: `TestPass123!`
5. Click "Create Account"
6. Navigate to `/professor/dashboard`

#### 3.2 Create Course
1. On Professor Dashboard, click **+ Create Course** button
2. Enter: `Quantum Mechanics 101`
3. Click "Create Course"
4. Click the course card to select it

#### 3.3 Create Lecture
1. With course selected, click **+ Create Lecture** button
2. Fill form:
   - **Title**: `Wave Functions Fundamentals`
   - **Main Topic**: `Quantum Mechanics`
   - **Subtopics**: `Wave Function, Schrodinger Equation, Probability Density`
3. Click "Create Lecture"
4. Click the lecture item
5. Should see "No feedback submitted yet"

#### 3.4 Create Student Accounts (x3)
Repeat for each:
```
Email: student1@example.com / student2@example.com / student3@example.com
Password: TestPass123!
Role: Student
```

---

### Phase 4: Demo the Flow (30 minutes)

#### 4.1 Student Enrollment
1. As **Student 1**, sign in
2. Click **+ Enroll Course**
3. Enter any code (for demo purposes)
4. Click "Enroll"
5. See lecture in dashboard
6. Click "Give Feedback"

#### 4.2 Submit Feedback
1. Click ✅ **Fully Understood**
2. Check topics: `Wave Function`, `Schrodinger Equation`
3. Select reason: `Pace too fast`
4. Click **Submit Feedback**
5. See confetti animation! 🎉

#### 4.3 See Live Heatmap
1. Switch back to **Professor** dashboard
2. Select course → lecture
3. Right panel shows:
   - ✅ Fully: 1 student (33%)
   - ⚠️ Partial: 0 students
   - ❌ Need Clarity: 2 students (66%)
4. See difficult topics list

#### 4.4 Repeat for More Students
Have students 2 and 3:
- Student 2: ⚠️ Partial, mark "Schrodinger Equation" as difficult
- Student 3: ❌ Need Clarity, mark "Probability Density" as difficult

Watch professor dashboard update in **real-time**!

---

## 📊 PROJECT STRUCTURE

```
lis-platform/
├── src/
│   ├── components/
│   │   ├── CourseComponents.tsx    # Course management UI
│   │   ├── LectureComponents.tsx   # Lecture UI
│   │   └── FeedbackComponents.tsx  # Heatmap & stats
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProfessorDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── StudentFeedback.tsx
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth logic
│   │   ├── useProfessor.ts         # Course/lecture logic
│   │   └── useLectureFeedback.ts   # Feedback stats
│   ├── services/
│   │   └── aiAnalysis.ts           # OpenAI integration
│   ├── store/
│   │   └── useStore.ts             # Zustand state
│   ├── lib/
│   │   └── supabase.ts             # Supabase client
│   └── App.tsx                     # Main routing
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Database setup
│   └── seed.sql                    # Demo data
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── .env.local                      # Your secrets
```

---

## 🎯 TECH STACK

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Icons** | Lucide React | Beautiful SVG icons |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **State** | Zustand | Lightweight global state |
| **Backend** | Supabase | Database + Auth + Realtime |
| **Database** | PostgreSQL | Powerful relational DB |
| **AI** | OpenAI GPT-4o-mini | Insights & analysis |
| **Deploy** | Vercel | One-click deployment |

---

## 🔑 KEY FEATURES IMPLEMENTED

✅ **Professor Dashboard**
- Create/manage courses
- Log lectures with topic tree
- Real-time feedback heatmap (3-color system)
- Feedback statistics

✅ **Student Feedback System**
- 3 emoji buttons (✅⚠️❌)
- Multi-select difficult topics
- Optional reason dropdown
- Confetti animation on submit
- Auto-redirect to dashboard

✅ **Real-time Updates**
- Professor sees feedback appear instantly
- Heatmap updates live
- Statistics refresh automatically

✅ **Database Security**
- Row-Level Security (RLS) enabled
- Professors see only their courses
- Students can only submit feedback for enrolled courses
- All data encrypted in transit

---

## 🚀 DEPLOYMENT (Vercel)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial LIS commit"
git remote add origin https://github.com/YOUR_USERNAME/lis-platform.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Set environment variables:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_OPENAI_API_KEY=...
   ```
5. Click "Deploy"
6. Get public URL: `https://lis-platform.vercel.app`

---

## 🧪 TESTING CHECKLIST

- [ ] Landing page loads
- [ ] Sign up as professor works
- [ ] Sign up as student works
- [ ] Professor creates course
- [ ] Professor creates lecture
- [ ] Student enrolls in course
- [ ] Student sees lecture
- [ ] Student submits feedback
- [ ] Feedback appears on professor dashboard
- [ ] Heatmap updates correctly
- [ ] Colors change (green/yellow/red)
- [ ] Confetti animation plays
- [ ] Real-time updates work
- [ ] Mobile view is responsive

---

## 📱 MOBILE OPTIMIZATION

LIS is **100% mobile-first**:
- Responsive grid layouts (md: breakpoint)
- Touch-friendly buttons (44px minimum)
- Large emoji buttons (p-4, text-2xl)
- Bottom-heavy navigation
- Full-width inputs

Test on phone:
```bash
# Get your machine IP
ipconfig getifaddr en0  # Mac
ipconfig              # Windows

# Visit from phone: http://YOUR_IP:5173
```

---

## 🔐 SECURITY NOTES

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate API keys** if ever exposed
3. **Enable RLS** - All policies already set
4. **Test with fake data** before production
5. **Use HTTPS** in production (Vercel does this auto)

---

## 🐛 TROUBLESHOOTING

### Port 5173 in use?
```bash
npm run dev -- --port 3000
```

### Missing Supabase credentials?
```bash
# Check .env.local file exists
# Verify credentials are copied correctly (no extra spaces)
# Clear cache: npm cache clean --force
```

### Feedback not appearing?
1. Check Realtime is enabled in Supabase
2. Verify student is enrolled in course
3. Check browser console for errors
4. Hard refresh: Ctrl+Shift+R

### Type errors?
```bash
npm run type-check
```

---

## 📞 SUPPORT

For issues:
1. Check error console (F12)
2. Review Supabase logs (Dashboard → Logs)
3. Verify environment variables
4. Test with demo data first

---

## ✨ NEXT FEATURES (Post-MVP)

- [ ] AI Insights modal with OpenAI
- [ ] PDF revision plan download
- [ ] Student contribution counter
- [ ] Topic confusion trend chart
- [ ] Dark mode toggle
- [ ] Hindi language support
- [ ] Email notifications
- [ ] Student attendance tracking

---

## 📄 DATABASE SCHEMA RECAP

**courses**: Professor's courses
**lectures**: Course lectures with topic trees
**feedback**: Student feedback submissions
**course_enrollments**: Student enrollments
**RLS Policies**: All data access controlled by user role

---

**Ready to demo!** 🎓

Start with Phase 1, follow through Phase 4, and you'll have a working LIS in under 3 hours.

Good luck! 🚀
