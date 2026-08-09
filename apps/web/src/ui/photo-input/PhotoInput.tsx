import { Camera, X } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type ComponentProps } from 'react';
import { cn } from '../cn';
import { IconButton } from '../icon-button';
import {
  photoInputHintVariants,
  photoInputTriggerVariants,
  photoInputVariants,
  type PhotoInputVariants,
} from './PhotoInput-variants';

type PhotoInputProps = Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'size'> &
  PhotoInputVariants & {
    id: string;
    value: File | null;
    onChange: (file: File | null) => void;
    // Shown inside the empty box, and as the alt text once there is a photo.
    label: string;
    hint?: string;
    disabled?: boolean;
  };

export function PhotoInput({
  id,
  value,
  onChange,
  label,
  hint,
  disabled = false,
  photoInputSize,
  invalid,
  className,
  ...props
}: PhotoInputProps) {
  const preview = usePreviewUrl(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
    // Clearing the value lets someone pick the same file again after removing it.
    event.target.value = '';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={photoInputVariants({ photoInputSize, invalid })}>
        {preview === null ? null : <img src={preview} alt={label} className="size-full object-cover" />}

        {/* Stays clickable once there is a photo: tapping it picks another one. */}
        <label htmlFor={id} className={photoInputTriggerVariants({ overPhoto: preview !== null })}>
          <Camera size={20} aria-hidden />
          <span className={preview === null ? '' : 'sr-only'}>{label}</span>
        </label>

        <input
          id={id}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
      </div>

      <div className="flex flex-col items-start gap-1">
        {hint === undefined ? null : <span className={photoInputHintVariants()}>{hint}</span>}
        {value === null ? null : (
          <IconButton label="Quitar la foto" onClick={() => onChange(null)} disabled={disabled}>
            <X size={16} aria-hidden />
          </IconButton>
        )}
      </div>
    </div>
  );
}

// The preview is a blob URL, so it has to be released when the file changes or
// the field goes away: the browser holds the file alive until then.
function usePreviewUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file === null) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
