import { useRef, type PointerEvent } from 'react';

// How far the pointer travels before it counts as a swipe, and how much it may
// drift up or down before we read it as a scroll instead.
const MIN_DISTANCE = 50;
const MAX_DRIFT = 60;

type SwipeInput = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

type SwipeHandlers = {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: () => void;
};

// Horizontal swipe, by finger, pen or mouse drag. The element needs `touch-pan-y`
// so the browser leaves the drag to us, and `touch-pinch-zoom` to keep the zoom.
export function useSwipe({ onSwipeLeft, onSwipeRight }: SwipeInput): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (event) => {
      // A second finger means a pinch, not a swipe.
      start.current = event.isPrimary ? { x: event.clientX, y: event.clientY } : null;
    },
    onPointerCancel: () => {
      start.current = null;
    },
    onPointerUp: (event) => {
      const from = start.current;
      start.current = null;
      // Zoomed in, a sideways drag is someone looking around the picture.
      const zoomed = (window.visualViewport?.scale ?? 1) > 1;
      if (from === null || zoomed) {
        return;
      }

      const deltaX = event.clientX - from.x;
      if (Math.abs(deltaX) < MIN_DISTANCE || Math.abs(event.clientY - from.y) > MAX_DRIFT) {
        return;
      }

      if (deltaX < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    },
  };
}
