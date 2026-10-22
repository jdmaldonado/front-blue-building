import type { Door } from '@bb/core';

export const LabelSide = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom',
} as const;
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
// A name cut by the edge of the plan, or a dot under a label, is lost. A name
// that touches another can still be read. So the first two count much more.
const HIDDEN_WEIGHT = 10;
// A few passes are enough to settle.
const PASSES = 3;

// Toward the wider side of the plan, which is where a long name fits best.
export function preferredLabelSide(door: Door): LabelSide {
  return (door.left ?? PLAN_MIDDLE_PERCENT) > PLAN_MIDDLE_PERCENT ? LabelSide.Left : LabelSide.Right;
}

// Beside the dot first, the way it reads best. Above or below only when both
// sides are taken.
function sidesToTry(preferred: LabelSide): LabelSide[] {
  const other = preferred === LabelSide.Left ? LabelSide.Right : LabelSide.Left;
  return [preferred, other, LabelSide.Bottom, LabelSide.Top];
}

function labelRect(pin: PinLayout, side: LabelSide): Rect {
  const { dot, label, gap } = pin;
  const middleX = dot.left + dot.width / 2 - label.width / 2;
  const middleY = dot.top + dot.height / 2 - label.height / 2;
  const positions: Record<LabelSide, Pick<Rect, 'left' | 'top'>> = {
    left: { left: dot.left - gap - label.width, top: middleY },
    right: { left: dot.left + dot.width + gap, top: middleY },
    top: { left: middleX, top: dot.top - gap - label.height },
    bottom: { left: middleX, top: dot.top + dot.height + gap },
  };

  return { ...positions[side], ...label };
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
  return (outside + onDots) * HIDDEN_WEIGHT + onLabels;
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
