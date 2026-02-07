# 🚀 LIS Platform - Quick Start Guide

## ⚡ Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser

### 1. Start Development Server
```bash
cd lis-platform
npm install framer-motion  # If not already installed
npm run dev
```
Opens automatically at: **http://localhost:5173**

### 2. Test the Platform

#### Landing Page (Public)
- **URL:** http://localhost:5173
- **What to see:** Professional landing page with hero section, features, and CTA buttons
- **Test:** Click "Sign In" or "Get Started"

#### Sign In / Register
- **URL:** http://localhost:5173/login
- **Test as Professor:**
  - Email: demo@professor.com
  - Password: password123
  - Role: Professor
- **Test as Student:**
  - Email: demo@student.com
  - Password: password123
  - Role: Student

#### Professor Dashboard
- **URL:** http://localhost:5173/professor/dashboard
- **Features to Test:**
  - **Overview Tab** - See stats & recent courses
  - **Courses Tab** - View course cards, create new course
  - **Lectures Tab** - Select course, view lectures
  - **Students Tab** - Upload CSV, manage students
  - **Analytics Tab** - View feedback & engagement charts
  - **Settings Tab** - Update profile & notifications

#### Student Dashboard
- **URL:** http://localhost:5173/student/dashboard
- **Features to Test:**
  - **Overview Tab** - Dashboard with stats
  - **Courses Tab** - View enrolled courses
  - **Feedback Tab** - Submit & view feedback
  - **Performance Tab** - See analytics & progress
  - **Settings Tab** - Update preferences

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🎨 Testing Different Viewports

### Mobile (375px)
```bash
# In browser DevTools: Toggle Device Toolbar (Ctrl+Shift+M)
# Select "iPhone SE" or set width to 375px
```
**Expected:** Hamburger menu visible, responsive layouts

### Tablet (768px)
```bash
# DevTools: Set width to 768px
```
**Expected:** Two-column grids, optimized spacing

### Desktop (1920px)
```bash
# DevTools: Set width to 1920px
```
**Expected:** Full 4-column layouts, sidebar visible

---

## 📊 Key Features to Explore

### As Professor:
1. **Create a Course**
   - Go to Courses → Click "Create Course"
   - Fill: Name, Code, Semester, Description
   - Click "Create Course"

2. **Manage Students**
   - Go to Students tab
   - See enrollment stats
   - Try CSV download to see format
   - Add students via upload

3. **View Analytics**
   - Go to Analytics tab
   - See feedback summary charts
   - Check engagement trends

### As Student:
1. **Check Performance**
   - Go to Performance tab
   - View clarity progress per course
   - See engagement streak

2. **Submit Feedback**
   - Go to Feedback tab
   - See feedback history
   - View submission timestamps

3. **Track Courses**
   - Go to Courses tab
   - See attendance & clarity scores
   - View course details

---

## 🔧 Environment Setup

### Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENAI_API_KEY=your_openai_key
```

**Note:** Currently uses mock data. Connect Supabase to use real database.

---

## 🐛 Troubleshooting

### White Screen Issue
```bash
# Install missing dependencies
npm install framer-motion

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Fix imports
npm run lint
```

---

## 📁 Project Structure

```
lis-platform/
├── src/
│   ├── pages/              # Route pages
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProfessorDashboard.tsx
│   │   └── StudentDashboard.tsx
│   ├── components/         # Reusable components
│   │   ├── professor/      # Professor-specific
│   │   ├── student/        # Student-specific
│   │   └── *.tsx           # Shared components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & services
│   ├── store/              # Zustand state
│   ├── App.tsx             # Router setup
│   └── main.tsx            # Entry point
├── dist/                   # Built files
├── public/                 # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📱 Responsive Features

### Mobile
- ✅ Hamburger navigation menu
- ✅ Stacked layouts
- ✅ Touch-friendly buttons (48px+)
- ✅ Optimized typography
- ✅ Full-width modals

### Tablet
- ✅ Two-column grids
- ✅ Sidebar visible
- ✅ Horizontal scrolling avoided
- ✅ Balanced spacing

### Desktop
- ✅ Four-column grids
- ✅ Fixed sidebar
- ✅ Wide layouts
- ✅ Multiple panels

---

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css`:
```css
:root {
  --primary: #3b82f6;      /* Blue */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #ec4899;       /* Pink */
}
```

### Modify Dashboard Layout
Edit `src/pages/ProfessorDashboard.tsx`:
```tsx
// Change grid columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Change grid-cols-4 to grid-cols-3 or grid-cols-2 */}
</div>
```

### Add New Navigation Tabs
Edit `src/pages/ProfessorDashboard.tsx`:
```tsx
const navTabs = [
  // Add new tab here
  { id: 'new-tab', icon: Icon, label: 'New Tab' },
];
```

---

## 📚 Learning Resources

### Components
- **Framer Motion:** [framer.com/motion](https://framer.com/motion)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)
- **Lucide Icons:** [lucide.dev](https://lucide.dev)
- **React Router:** [reactrouter.com](https://reactrouter.com)

### Backend Integration
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **OpenAI API:** [platform.openai.com/docs](https://platform.openai.com/docs)

---

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
```bash
docker build -t lis-platform .
docker run -p 3000:80 lis-platform
```

---

## 📝 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

---

## 🆘 Need Help?

1. **Documentation:** Check `FEATURES.md` and `DELIVERY.md`
2. **Code Issues:** Review error messages in browser console
3. **Database:** See database schema in `FEATURES.md`
4. **Deployment:** Follow checklist in `DELIVERY.md`

---

## ✅ Success Checklist

- [x] App runs locally (npm run dev)
- [x] Can navigate all pages
- [x] Responsive on mobile/tablet/desktop
- [x] Smooth animations working
- [x] No console errors
- [x] Build succeeds (npm run build)
- [x] All features accessible
- [x] Login flow works

---

**Ready to launch! 🎉**

Next step: Connect Supabase database and deploy to production.
