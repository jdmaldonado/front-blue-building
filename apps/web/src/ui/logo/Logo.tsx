import { cn } from '../cn';
import { logoMarkVariants, logoVariants, logoWordmarkVariants, type LogoSize } from './Logo-variants';
import { LogoMark } from './LogoMark';
import { LogoWordmark } from './LogoWordmark';

export const logoParts = ['full', 'mark', 'wordmark'] as const;
export type LogoPart = (typeof logoParts)[number];

type LogoProps = {
  size?: LogoSize;
  // Which piece of the logo to draw: both, only the "bb" symbol, or only the
  // lettering.
  parts?: LogoPart;
  // Both pieces paint with currentColor, so they can be tinted apart.
  markClassName?: string;
  wordmarkClassName?: string;
  className?: string;
};

export function Logo({ size = 'md', parts = 'full', markClassName, wordmarkClassName, className }: LogoProps) {
  return (
    <div role="img" aria-label="Blue Building" className={cn(logoVariants({ size }), 'text-(--accent)', className)}>
      {parts === 'wordmark' ? null : <LogoMark className={cn(logoMarkVariants({ size }), markClassName)} aria-hidden />}
      {parts === 'mark' ? null : (
        <LogoWordmark className={cn(logoWordmarkVariants({ size }), wordmarkClassName)} aria-hidden />
      )}
    </div>
  );
}
