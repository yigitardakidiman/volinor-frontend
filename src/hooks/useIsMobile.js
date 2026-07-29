import { useState, useEffect } from 'react';

/**
 * Hook to detect if current screen width is mobile (< 768px by default).
 * Updates automatically on window resize.
 * 
 * @param {number} breakpoint - Width threshold in pixels (default: 768)
 * @returns {boolean} True if screen width is less than breakpoint
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}
