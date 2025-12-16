import { useEffect, useState } from 'react';

/**
 * Check if we're running inside Tauri
 */
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

/**
 * Hook to detect Tauri environment
 */
export function useTauri() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    if (isTauri()) {
      setIsNative(true);
      // Detect platform from navigator
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('mac')) setPlatform('macos');
      else if (userAgent.includes('win')) setPlatform('windows');
      else if (userAgent.includes('linux')) setPlatform('linux');
      else setPlatform('unknown');
    }
  }, []);

  return { isNative, platform };
}

/**
 * Get platform-specific keyboard modifier key text
 */
export function getModifierKey(): string {
  if (typeof navigator === 'undefined') return 'Ctrl';
  return navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';
}

