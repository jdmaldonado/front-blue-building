import type { Door } from '@bb/core';
import { useLayoutEffect, useState, type RefObject } from 'react';
import { LabelSide, pickLabelSides, type PinLayout } from '../lib';

// The space the CSS left between the dot and the label, wherever it is drawn.
function measureGap(dot: DOMRect, label: DOMRect, side: string | undefined): number {
  if (side === LabelSide.Left) {
    return dot.left - label.right;
  }
  if (side === LabelSide.Top) {
    return dot.top - label.bottom;
  }
  if (side === LabelSide.Bottom) {
    return label.top - dot.bottom;
  }
  return label.left - dot.right;
}

// Measures the pins drawn on `overlay` and moves each label to where it covers
// nothing. `size` is the drawn plan: a new size means new positions.
export function usePinLabelSides(
  overlay: RefObject<HTMLElement | null>,
  size: { width: number; height: number } | null,
  doors: Door[],
): Record<string, LabelSide> {
  const [sides, setSides] = useState<Record<string, LabelSide>>({});

  useLayoutEffect(() => {
    const root = overlay.current;
    if (root === null || size === null || doors.length === 0) {
      return;
    }
    const plan = { left: 0, top: 0, width: size.width, height: size.height };
    let active = true;

    const measure = () => {
      const origin = root.getBoundingClientRect();
      const pins: PinLayout[] = [];

      root.querySelectorAll<HTMLElement>('[data-pin]').forEach((button) => {
        const label = button.querySelector<HTMLElement>('[data-pin-label]');
        const id = button.dataset.pin;
        if (label === null || id === undefined) {
          return;
        }
        const dot = button.getBoundingClientRect();
        const box = label.getBoundingClientRect();
        pins.push({
          id,
          dot: { left: dot.left - origin.left, top: dot.top - origin.top, width: dot.width, height: dot.height },
          label: { width: box.width, height: box.height },
          gap: measureGap(dot, box, label.dataset.side),
          preferred: button.dataset.preferred === LabelSide.Left ? LabelSide.Left : LabelSide.Right,
        });
      });

      if (active) {
        setSides(pickLabelSides(pins, plan));
      }
    };

    measure();
    // The font changes the width of every name, and it may land later.
    void document.fonts.ready.then(measure);
    return () => {
      active = false;
    };
  }, [overlay, size, doors]);

  return sides;
}
