import { cn } from '../cn';
import { Spinner } from '../spinner';
import { loadingVariants, type LoadingLayout, type LoadingSize } from './Loading-variants';

type LoadingProps = {
  label?: string;
  layout?: LoadingLayout;
  size?: LoadingSize;
  className?: string;
};

// The only place that draws a waiting state. Change the animation here and every
// screen follows.
export function Loading({ label = 'Cargando...', layout, size = 'md', className }: LoadingProps) {
  return (
    <div role="status" aria-live="polite" className={cn(loadingVariants({ layout, size }), className)}>
      <Spinner size={size} />
      {label === '' ? null : <span>{label}</span>}
    </div>
  );
}
