import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analyzeWithAI, AIInsights } from '../lib/aiAnalysis';
import { downloadPDF } from '../lib/pdfExport';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'professor' | 'student';
}

export interface Course {
  id: string;
  name: string;
  professor_id: string;
  created_at: string;
}

export interface Lecture {
  id: string;
  course_id: string;
  title: string;
  topics: string[][];
  created_at: string;
}

export interface Feedback {
  id: string;
  lecture_id: string;
  student_id: string;
  understanding_level: 'fully' | 'partial' | 'need_clarity';
  difficult_topics: string[];
  reason?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'lis-auth-storage' }
  ) as any
);

interface UIState {
  darkMode: boolean;
  language: 'en' | 'hi';
  setDarkMode: (mode: boolean) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const useUIStore = create<UIState>(
  persist(
    (set: any) => ({
      darkMode: localStorage.getItem('darkMode') === 'true',
      language: (localStorage.getItem('language') as 'en' | 'hi') || 'en',
      setDarkMode: (darkMode: boolean) => {
        localStorage.setItem('darkMode', String(darkMode));
        set({ darkMode });
      },
      setLanguage: (language: 'en' | 'hi') => {
        localStorage.setItem('language', language);
        set({ language });
      },
    }),
    { name: 'ui-store' }
  ) as any
);

interface AnalyticsState {
  insights: AIInsights | null;
  analyzing: boolean;
  error: string | null;
  analyzeFullCourse: (courseId: string, courseName: string, professorName: string) => Promise<void>;
  resetInsights: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  insights: null,
  analyzing: false,
  error: null,

  analyzeFullCourse: async (courseId: string, courseName: string, professorName: string) => {
    set({ analyzing: true, error: null });
    try {
      const insights = await analyzeWithAI(courseId, courseName);
      set({ insights, analyzing: false });

      // Auto-download PDF
      try {
        await downloadPDF(insights, courseName, professorName);
      } catch (pdfError) {
        console.error('PDF download failed:', pdfError);
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Analysis failed',
        analyzing: false,
      });
    }
  },

  resetInsights: () => set({ insights: null, error: null }),
}));
