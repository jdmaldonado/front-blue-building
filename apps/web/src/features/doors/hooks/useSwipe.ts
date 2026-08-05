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

// Horizontal swipe, by finger, pen or mouse drag. The element that takes these
// handlers needs `touch-pan-y`, or the browser claims the drag for scrolling
// and cancels the pointer before it ends.
export function useSwipe({ onSwipeLeft, onSwipeRight }: SwipeInput): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (event) => {
      start.current = { x: event.clientX, y: event.clientY };
    },
    onPointerCancel: () => {
      start.current = null;
    },
    onPointerUp: (event) => {
      const from = start.current;
      start.current = null;
      if (from === null) {
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
