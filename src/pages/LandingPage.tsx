import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Brain, Zap, BarChart3, Users, CheckCircle2, ArrowRight, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'professor' ? '/professor/dashboard' : '/dev/student');
    }
  }, [user, navigate]);

  if (user) {
    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontSize: '18px' }}>Redirecting...</div>
      </div>
    );
  }

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analytics',
      desc: 'GPT-4o analyzes student feedback in real-time',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Magic QR Codes',
      desc: 'Students submit feedback in 8 seconds - no typing',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Live Dashboard',
      desc: 'Real-time confusion tracking & insights',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Student Management',
      desc: 'Bulk CSV enrollment, clarity scores & streaks',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    'Real-time student engagement tracking',
    'Automatic revision recommendations',
    'Silent student detection & alerts',
    'Professional PDF reports',
    'Mobile-first anonymous feedback',
    'Sentiment analysis & trends',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
              LIS
            </div>
            <div>
              <h1 className="font-bold text-lg">LIS Enterprise</h1>
              <p className="text-xs text-slate-400">IIT Gandhinagar</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden lg:flex items-center gap-6">
            <a href="#features" className="hover:text-blue-400 transition">
              Features
            </a>
            <a href="#benefits" className="hover:text-blue-400 transition">
              Benefits
            </a>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              Sign In
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden border-t border-slate-700 bg-slate-800 p-4 space-y-3"
          >
            <a
              href="#features"
              className="block py-2 px-4 hover:bg-slate-700 rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="block py-2 px-4 hover:bg-slate-700 rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Benefits
            </a>
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold"
            >
              Sign In
            </button>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm font-medium">
              🎓 For IIT Gandhinagar Professors
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Transform Student Feedback into Insights
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Real-time analytics, AI-powered recommendations, instant engagement tracking
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                localStorage.removeItem('demo_role');
                navigate('/login');
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition flex items-center justify-center gap-2 group"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-slate-400 rounded-lg font-bold text-lg hover:bg-slate-700 transition"
            >
              View Demo
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { label: 'Real-time Analytics', value: '100%' },
              { label: 'Response Time', value: '8sec' },
              { label: 'Accuracy', value: '95%' },
              { label: 'Universities', value: '1' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-slate-600"
              >
                <p className="text-2xl md:text-3xl font-bold text-blue-400">{stat.value}</p>
                <p className="text-xs md:text-sm text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-800/50 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-300 text-lg">Everything for data-driven teaching</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative p-6 rounded-xl border border-slate-600 hover:border-slate-400 transition duration-300 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition duration-300`}
                  />
                  <div className={`relative bg-gradient-to-br ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose LIS?</h2>
            <p className="text-slate-300 text-lg">Proven results for teaching excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg border border-slate-600 hover:border-blue-500/50 transition"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-200">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-t border-blue-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Teaching?</h2>
            <p className="text-xl text-slate-300 mb-8">Join IIT Gandhinagar in leveraging AI for better learning outcomes</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition"
            >
              Start Your Free Trial
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 LIS Enterprise. Built for IIT Gandhinagar.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
