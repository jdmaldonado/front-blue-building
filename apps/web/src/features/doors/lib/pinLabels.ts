import type { Door } from '@bb/core';

// Always beside the dot, never above or below: that is how the name reads as
// belonging to its door.
export const LabelSide = { Left: 'left', Right: 'right' } as const;
export type LabelSide = (typeof LabelSide)[keyof typeof LabelSide];

export type Rect = { left: number; top: number; width: number; height: number };

export type PinLayout = {
  id: string;
  dot: Rect;
  label: { width: number; height: number };
  // Space between the dot and its label.
  gap: number;
  preferred: LabelSide;
};

const PLAN_MIDDLE_PERCENT = 50;
// A dot under a label is hard to tap, and a name cut by the edge cannot be read
// at all. Both count much more than two names touching, the cut name the most.
const DOT_WEIGHT = 10;
const OUTSIDE_WEIGHT = 30;
// A few passes are enough to settle.
const PASSES = 3;

// Toward the wider side of the plan, which is where a long name fits best.
export function preferredLabelSide(door: Door): LabelSide {
  return (door.left ?? PLAN_MIDDLE_PERCENT) > PLAN_MIDDLE_PERCENT ? LabelSide.Left : LabelSide.Right;
}

function sidesToTry(preferred: LabelSide): LabelSide[] {
  return [preferred, preferred === LabelSide.Left ? LabelSide.Right : LabelSide.Left];
}

function labelRect(pin: PinLayout, side: LabelSide): Rect {
  const { dot, label, gap } = pin;
  const top = dot.top + dot.height / 2 - label.height / 2;
  const left = side === LabelSide.Left ? dot.left - gap - label.width : dot.left + dot.width + gap;
  return { left, top, ...label };
}

function overlap(a: Rect, b: Rect): number {
  const width = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
  const height = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
  return width > 0 && height > 0 ? width * height : 0;
}

// How much of the label lands on something. Zero means it is free.
function cost(label: Rect, dots: Rect[], labels: Rect[], plan: Rect): number {
  const outside = label.width * label.height - overlap(label, plan);
  const onDots = dots.reduce((sum, dot) => sum + overlap(label, dot), 0);
  const onLabels = labels.reduce((sum, other) => sum + overlap(label, other), 0);
  return outside * OUTSIDE_WEIGHT + onDots * DOT_WEIGHT + onLabels;
}

// Each label takes the side that covers the least, given where all the others
// are now. On a tie the earlier side in `sidesToTry` wins.
export function pickLabelSides(pins: PinLayout[], plan: Rect): Record<string, LabelSide> {
  const sides: Record<string, LabelSide> = {};
  pins.forEach((pin) => {
    sides[pin.id] = pin.preferred;
  });

  for (let pass = 0; pass < PASSES; pass++) {
    for (const pin of pins) {
      const others = pins.filter((item) => item !== pin);
      const dots = others.map((item) => item.dot);
      const labels = others.map((item) => labelRect(item, sides[item.id] ?? item.preferred));
      let best = pin.preferred;
      let bestCost = Infinity;
      for (const side of sidesToTry(pin.preferred)) {
        const sideCost = cost(labelRect(pin, side), dots, labels, plan);
        if (sideCost < bestCost) {
          best = side;
          bestCost = sideCost;
        }
      }
      sides[pin.id] = best;
    }
  }

  return sides;
}
