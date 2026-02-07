/**
 * PWA Install Prompt - Adds "Add to Home Screen" functionality
 * Shows a beautiful banner prompting users to install the app
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { vibrate } = useHaptics();

  useEffect(() => {
    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    vibrate('medium');
    await deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      vibrate('success');
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    vibrate('light');
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (dismissed || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="bg-[#1A1A2E]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-purple-500/10">
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-4 h-4 text-white/50" />
          </motion.button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <Smartphone className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 pr-6">
              <h3 className="text-sm font-bold text-white mb-1">
                Add LIS to Home Screen
              </h3>
              <p className="text-xs text-white/60 mb-3">
                Get offline access and faster loading with the installed app.
              </p>

              {/* Install Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstall}
                className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
              >
                <Download className="w-4 h-4" />
                Install App
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
