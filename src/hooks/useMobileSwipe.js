import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect horizontal swipe gestures on mobile devices.
 * 
 * @param {Object} params
 * @param {Function} params.onSwipeLeft - Triggered when user swipes left (finger moves right to left -> Next)
 * @param {Function} params.onSwipeRight - Triggered when user swipes right (finger moves left to right -> Prev)
 * @param {boolean} params.enabled - Whether swipe detection is active
 * @param {number} params.minDistance - Minimum horizontal px threshold (default 45px)
 */
export function useMobileSwipe({ onSwipeLeft, onSwipeRight, enabled = true, minDistance = 45 }) {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return; // Ignore multi-touch
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e) => {
      if (!touchStartRef.current.time) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touchStartRef.current.x - touch.clientX; // positive = swipe left
      const deltaY = touchStartRef.current.y - touch.clientY;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Reset touch reference
      touchStartRef.current = { x: 0, y: 0, time: 0 };

      // Ignore slow gestures (> 600ms)
      if (deltaTime > 600) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Ensure horizontal swipe is dominant and exceeds minimum distance
      if (absX >= minDistance && absX > absY * 1.35) {
        if (deltaX > 0) {
          // Finger moved right-to-left -> Swipe Left -> Next
          onSwipeLeft?.();
        } else {
          // Finger moved left-to-right -> Swipe Right -> Prev
          onSwipeRight?.();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, enabled, minDistance]);
}
