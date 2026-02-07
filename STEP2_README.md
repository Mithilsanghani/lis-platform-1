# STEP 2: VITE + REACT + TAILWIND BOILERPLATE ✅ COMPLETE

## Installation Instructions

### 1. Install Dependencies
```bash
cd lis-platform
npm install
```

This will install:
- **React 18**: UI framework
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Zustand**: Lightweight state management
- **React Hook Form + Zod**: Form validation
- **Supabase**: Database & auth
- **Recharts**: Data visualization
- And more...

**Time**: ~2-3 minutes depending on internet speed

### 2. Setup Environment Variables
```bash
# Copy example to actual file
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_APP_URL=http://localhost:5173
```

Get values from:
- **Supabase URL & Key**: From Step 1 (Supabase → Settings → API)
- **OpenAI API Key**: From https://platform.openai.com/api-keys

### 3. Run Development Server
```bash
npm run dev
```

Output:
```
  VITE v5.0.0  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Auto-opens in your browser. If not, visit `http://localhost:5173`

### 4. Test the Setup
You should see:
1. ✅ Landing page with "LIS" header
2. ✅ "Get Started" button
3. ✅ Features grid
4. ✅ Responsive mobile view

## Project Structure
```
lis-platform/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Full page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProfessorDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── StudentFeedback.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.ts
│   ├── services/           # API services (upcoming)
│   ├── lib/                # Utilities
│   │   └── supabase.ts     # Supabase client
│   ├── store/              # Zustand stores
│   │   └── useStore.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind styles
├── public/                 # Static assets
├── supabase/               # Database migrations
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── index.html
```

## Key Files Explained

### `src/lib/supabase.ts`
Initializes Supabase client. Used throughout app for:
- Authentication
- Database queries
- Real-time subscriptions

### `src/hooks/useAuth.ts`
Custom hook for authentication:
- `signUp()` - Create new account
- `signIn()` - Login
- `signOut()` - Logout
- Auto-fetches current session on mount

### `src/store/useStore.ts`
Zustand stores for global state:
- `useAuthStore` - Current user info
- `useUIStore` - Dark mode, language preferences

### `src/App.tsx`
Main routing:
- `/` - Landing page (public)
- `/login` - Authentication
- `/professor/dashboard` - Professor only
- `/student/dashboard` - Student only
- `/feedback/:lectureId` - Feedback form

## Build for Production
```bash
npm run build
```

Creates optimized build in `dist/` folder:
- Minified CSS/JS
- Optimized images
- ~100KB gzipped

## Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Module not found errors?
```bash
rm -rf node_modules
npm install
```

### TypeScript errors?
```bash
npm run type-check
```

## Next Steps
→ Run "Step 3: Professor Dashboard (Core MVP)"
