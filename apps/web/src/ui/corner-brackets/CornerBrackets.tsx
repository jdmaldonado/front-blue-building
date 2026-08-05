import { cn } from '../cn';
import {
  cornerBracketCorners,
  cornerBracketMarkVariants,
  cornerBracketsVariants,
  type CornerBracketsVariants,
} from './CornerBrackets-variants';

type CornerBracketsProps = CornerBracketsVariants & {
  className?: string;
};

// Decoration only: it marks the corners of a frame the way an instrument does,
// instead of rounding them off like a card.
export function CornerBrackets({ tone, className }: CornerBracketsProps) {
  return (
    <span aria-hidden className={cn(cornerBracketsVariants({ tone }), className)}>
      {cornerBracketCorners.map((corner) => (
        <span key={corner} className={cornerBracketMarkVariants({ corner })} />
      ))}
    </span>
  );
}
