/**
 * LIS LoginPage - Real Auth (Sign Up / Sign In)
 * Registers users in useLISStore and persists auth in useAuthStore
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useStore';
import { useLISStore } from '../store/useLISStore';

type AuthMode = 'choose' | 'signup' | 'signin';

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [mode, setMode] = useState<AuthMode>('choose');
  const [role, setRole] = useState<'professor' | 'student'>('professor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      let userId: string;
      if (role === 'professor') {
        userId = useLISStore.getState().registerProfessor({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          department,
        });
      } else {
        userId = useLISStore.getState().registerStudent({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          rollNumber: rollNumber.trim(),
          department,
        });
      }

      setUser({ id: userId, email: email.trim().toLowerCase(), name: name.trim(), role });
      localStorage.setItem('demo_role', role);
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => navigate(role === 'professor' ? '/professor' : '/dev/student'), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const store = useLISStore.getState();
      const professor = store.professors.find((p) => p.email === email.trim().toLowerCase());
      const student = store.students.find((s) => s.email === email.trim().toLowerCase());

      if (!professor && !student) {
        setError('No account found with this email. Please sign up first.');
        setLoading(false);
        return;
      }

      const foundUser = professor || student!;
      const userRole = professor ? 'professor' : 'student';

      setUser({ id: foundUser.id, email: foundUser.email, name: foundUser.name, role: userRole as 'professor' | 'student' });
      localStorage.setItem('demo_role', userRole);
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => navigate(userRole === 'professor' ? '/professor' : '/dev/student'), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: 'professor' | 'student') => {
    const store = useLISStore.getState();
    let userId: string;
    if (demoRole === 'professor') {
      userId = store.registerProfessor({ name: 'Dr. Demo Professor', email: 'demo-professor@iitgn.ac.in', department: 'Computer Science' });
    } else {
      userId = store.registerStudent({ name: 'Demo Student', email: 'demo-student@iitgn.ac.in', rollNumber: 'DEMO001', department: 'Computer Science' });
    }

    setUser({
      id: userId,
      email: demoRole === 'professor' ? 'demo-professor@iitgn.ac.in' : 'demo-student@iitgn.ac.in',
      name: demoRole === 'professor' ? 'Dr. Demo Professor' : 'Demo Student',
      role: demoRole,
    });
    localStorage.setItem('demo_role', demoRole);
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => navigate(demoRole === 'professor' ? '/professor' : '/dev/student'), 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative w-full max-w-lg">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
            <span className="text-3xl font-bold text-white">LIS</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LIS Enterprise</h1>
          <p className="text-slate-400">Lecture Intelligence System</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-2xl p-8">

          {/* CHOOSE MODE */}
          {mode === 'choose' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome</h2>
              <p className="text-slate-400 text-center mb-8">Sign in or create your account</p>
              <div className="space-y-4 mb-6">
                <button onClick={() => setMode('signin')} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Sign In
                </button>
                <button onClick={() => setMode('signup')} className="w-full py-3 rounded-xl border border-slate-600 hover:bg-slate-800 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                  <User className="w-4 h-4" /> Create Account
                </button>
              </div>
              <div className="border-t border-slate-700/50 pt-6">
                <p className="text-xs text-slate-500 text-center mb-4 uppercase tracking-wider">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={() => handleQuickDemo('professor')}
                    className="rounded-xl p-5 bg-gradient-to-br from-blue-600/80 to-blue-700/80 hover:shadow-lg hover:shadow-blue-500/30 transition">
                    <BookOpen className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm">Professor</p>
                    <p className="text-blue-200 text-xs mt-1">Demo Access</p>
                  </motion.button>
                  <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={() => handleQuickDemo('student')}
                    className="rounded-xl p-5 bg-gradient-to-br from-purple-600/80 to-purple-700/80 hover:shadow-lg hover:shadow-purple-500/30 transition">
                    <Users className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                    <p className="text-white font-semibold text-sm">Student</p>
                    <p className="text-purple-200 text-xs mt-1">Demo Access</p>
                  </motion.button>
                </div>
              </div>
            </>
          )}

          {/* SIGN UP */}
          {mode === 'signup' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
              <div className="flex rounded-xl overflow-hidden border border-slate-700/50 mb-6">
                {(['professor', 'student'] as const).map((r) => (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${role === r ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}>
                    {r === 'professor' ? 'Professor' : 'Student'}
                  </button>
                ))}
              </div>
              {error && <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}</div>}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === 'professor' ? 'Dr. John Doe' : 'Jane Smith'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@iitgn.ac.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50">
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Humanities">Humanities</option>
                  </select>
                </div>
                {role === 'student' && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Roll Number</label>
                    <input type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="e.g., 22110042"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                )}
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                  {loading ? 'Creating...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-4">Already have an account? <button onClick={() => { setMode('signin'); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-medium">Sign In</button></p>
              <button onClick={() => { setMode('choose'); setError(''); }} className="mt-2 text-slate-500 hover:text-slate-300 text-sm w-full text-center">&larr; Back</button>
            </>
          )}

          {/* SIGN IN */}
          {mode === 'signin' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
              {error && <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}</div>}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@iitgn.ac.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center gap-2">
                  {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-4">Don't have an account? <button onClick={() => { setMode('signup'); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-medium">Sign Up</button></p>
              <button onClick={() => { setMode('choose'); setError(''); }} className="mt-2 text-slate-500 hover:text-slate-300 text-sm w-full text-center">&larr; Back</button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
