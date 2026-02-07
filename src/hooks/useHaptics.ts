/**
 * useHaptics - Premium haptic feedback hook
 * Provides tactile feedback for mobile interactions
 * Falls back gracefully on unsupported devices
 */

import { useCallback } from 'react';

type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticPatterns {
  light: number[];
  medium: number[];
  heavy: number[];
  success: number[];
  warning: number[];
  error: number[];
}

const patterns: HapticPatterns = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 50, 20],
  warning: [30, 50, 30],
  error: [50, 100, 50, 100, 50],
};

export function useHaptics() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback(
    (intensity: HapticIntensity = 'light') => {
      if (!isSupported) return false;

      try {
        const pattern = patterns[intensity] || patterns.light;
        navigator.vibrate(pattern);
        return true;
      } catch (e) {
        console.warn('Haptic feedback failed:', e);
        return false;
      }
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    try {
      navigator.vibrate(0);
    } catch (e) {
      // Silent fail
    }
  }, [isSupported]);

  const customPattern = useCallback(
    (pattern: number[]) => {
      if (!isSupported) return false;

      try {
        navigator.vibrate(pattern);
        return true;
      } catch (e) {
        console.warn('Custom haptic pattern failed:', e);
        return false;
      }
    },
    [isSupported]
  );

  return {
    vibrate,
    cancel,
    customPattern,
    isSupported,
  };
}

export default useHaptics;
