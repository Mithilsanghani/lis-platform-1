#!/bin/bash
# LIS - COMMAND REFERENCE
# Copy-paste these commands in your terminal

# ============================================
# INITIAL SETUP
# ============================================

# Install all dependencies (run ONCE)
npm install

# Create environment file
cp .env.example .env.local

# Then edit .env.local with your credentials:
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key


# ============================================
# DEVELOPMENT
# ============================================

# Start development server (watches for changes)
npm run dev

# Type check code
npm run type-check

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint


# ============================================
# COMMON ISSUES & FIXES
# ============================================

# If npm install fails
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# If port 5173 is in use, use different port
npm run dev -- --port 3000

# If types are broken
npm run type-check

# Hard refresh in browser
# Windows: Ctrl+Shift+Delete
# Mac: Cmd+Shift+Delete
# Or clear cache manually in DevTools


# ============================================
# DEPLOYMENT
# ============================================

# Build optimized production version
npm run build

# Creates dist/ folder (~100KB gzipped)
# Ready to deploy to Vercel, Netlify, or any static host


# ============================================
# DATABASE SETUP (Run ONCE in Supabase)
# ============================================

# 1. Copy entire contents of:
#    supabase/migrations/001_initial_schema.sql

# 2. Go to Supabase Dashboard → SQL Editor

# 3. Click "New Query"

# 4. Paste the entire SQL file

# 5. Click "Run" button

# 6. Verify: Should see "Success"


# ============================================
# ENVIRONMENT VARIABLES (Copy to .env.local)
# ============================================

VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
VITE_APP_URL=http://localhost:5173


# ============================================
# DIRECTORY STRUCTURE (For reference)
# ============================================

# src/
#   pages/               - Full page components
#   components/          - Reusable UI components
#   hooks/               - Custom React hooks
#   services/            - API services
#   store/               - Global state (Zustand)
#   lib/                 - Utilities (Supabase client)
#   App.tsx              - Main router
#   main.tsx             - React entry point
#   index.css            - Global styles

# supabase/
#   migrations/          - Database schema
#   seed.sql             - Demo data

# public/               - Static assets


# ============================================
# PACKAGE.JSON SCRIPTS
# ============================================

# "dev"         - Development server (watches for changes)
# "build"       - Production build (optimized)
# "preview"     - Preview production build
# "lint"        - Code quality check
# "type-check"  - TypeScript validation


# ============================================
# KEY URLS (When running locally)
# ============================================

http://localhost:5173/              # Landing page
http://localhost:5173/login         # Sign up/Sign in
http://localhost:5173/professor/dashboard  # Professor
http://localhost:5173/student/dashboard    # Student


# ============================================
# GIT COMMANDS (For deployment to Vercel)
# ============================================

# Initialize git (if not already)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial LIS platform commit"

# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/lis-platform.git

# Push to GitHub
git push -u origin main

# Then deploy on Vercel.com


# ============================================
# TROUBLESHOOTING COMMANDS
# ============================================

# Clear npm cache
npm cache clean --force

# Reinstall dependencies from scratch
rm -rf node_modules
npm install

# Check for outdated packages
npm outdated

# Update packages (carefully!)
npm update

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities automatically
npm audit fix


# ============================================
# USEFUL SHORTCUTS
# ============================================

# In VS Code:
Ctrl+Shift+F     - Search entire project
Ctrl+`           - Open terminal
Ctrl+/           - Toggle comment
Alt+Up/Down      - Move line
Ctrl+D           - Select word
F12              - Open browser DevTools

# In Browser:
F12              - Developer tools
Ctrl+Shift+R     - Hard refresh
Ctrl+Shift+Delete - Clear cache
Ctrl+Shift+J     - Console

# In Terminal:
Ctrl+C           - Stop server
npm run dev      - Start dev server
npm run build    - Build for production
clear            - Clear terminal


# ============================================
# TESTING COMMANDS (Manual)
# ============================================

# Test professor workflow:
# 1. npm run dev
# 2. http://localhost:5173
# 3. Sign up as professor
# 4. Create course & lecture
# 5. Check professor dashboard

# Test student workflow:
# 1. Open incognito window
# 2. http://localhost:5173
# 3. Sign up as student
# 4. Enroll in course
# 5. Submit feedback
# 6. Check heatmap updates

# Test on mobile:
# 1. Find your machine IP: ipconfig (Windows) or ifconfig (Mac)
# 2. On phone: http://YOUR_IP:5173
# 3. Test all pages
# 4. Verify mobile responsive


# ============================================
# PERFORMANCE CHECKS
# ============================================

# Bundle size analysis
npm run build

# Check build output in dist/

# Lighthouse audit (in Chrome)
F12 → Lighthouse → Generate report


# ============================================
# CODE QUALITY
# ============================================

# Type checking
npm run type-check

# Linting
npm run lint

# Both
npm run type-check && npm run lint


# ============================================
# DEPLOYMENT TO VERCEL
# ============================================

# 1. Push code to GitHub (see GIT COMMANDS above)

# 2. Go to https://vercel.com

# 3. Click "New Project"

# 4. Import GitHub repo

# 5. Add environment variables:
#    VITE_SUPABASE_URL=...
#    VITE_SUPABASE_ANON_KEY=...
#    VITE_OPENAI_API_KEY=...

# 6. Click "Deploy"

# 7. Wait ~2 minutes for build

# 8. Get public URL (e.g., lis-platform.vercel.app)


# ============================================
# HELPFUL LINKS
# ============================================

# Documentation
http://localhost:5173         - Your app
https://supabase.com         - Database
https://react.dev            - React docs
https://tailwindcss.com      - Tailwind docs
https://vercel.com           - Deployment


# ============================================
# COMMON ERRORS & FIXES
# ============================================

# "ENOENT: no such file or directory"
rm -rf node_modules package-lock.json
npm install

# "Cannot find module"
npm install

# "Port 5173 already in use"
npm run dev -- --port 3000

# "Supabase connection failed"
# Check .env.local has correct values

# "Feedback not saving"
# Check Realtime is enabled in Supabase

# "Module not found (TypeScript)"
npm run type-check


# ============================================
# FINAL CHECKLIST
# ============================================

✓ npm install works
✓ npm run dev starts without errors
✓ http://localhost:5173 loads
✓ Sign up/sign in works
✓ Course creation works
✓ Feedback submission works
✓ Heatmap updates in real-time
✓ Mobile view responsive
✓ No console errors (F12)

If all above pass: You're ready to demo! 🚀


# ============================================
# QUICK START COPY-PASTE
# ============================================

cd C:\Users\sangh\OneDrive\Desktop\lis-platform
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev

# Browser should open to http://localhost:5173
# Start testing!


# ============================================
# READY TO LAUNCH!
# ============================================

# Your LIS platform is complete and ready.
# Follow COMPLETE_SETUP_GUIDE.md for full instructions.
# Questions? Check QUICK_REFERENCE.md

# Good luck! 🚀
