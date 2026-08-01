import { cn } from '../cn';
import { logoMarkSize, logoVariants, logoWordmarkVariants, type LogoSize } from './Logo-variants';

type LogoProps = {
  size?: LogoSize;
  // Hides the wordmark, leaving only the hexagon mark.
  markOnly?: boolean;
  // The mark paints with currentColor, so it can be tinted apart from the wordmark.
  markClassName?: string;
  className?: string;
};

export function Logo({ size = 'md', markOnly = false, markClassName, className }: LogoProps) {
  const { width, height } = logoMarkSize[size];

  return (
    <div className={cn(logoVariants({ size }), className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 28 32"
        fill="none"
        role="img"
        aria-label="Blue Building"
        className={cn('text-(--accent)', markClassName)}
      >
        <polygon
          points="14,1.5 26.5,8.75 26.5,23.25 14,30.5 1.5,23.25 1.5,8.75"
          stroke="currentColor"
          strokeWidth="2"
        />
        <polygon points="14,9 20,12.5 20,19.5 14,23 8,19.5 8,12.5" fill="currentColor" opacity="0.95" />
      </svg>
      {markOnly ? null : <span className={logoWordmarkVariants({ size })}>Blue Building</span>}
    </div>
  );
}
