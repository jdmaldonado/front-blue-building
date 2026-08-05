import { Upload } from 'lucide-react';
import { useEffect, useState, type ChangeEvent } from 'react';
import { Text } from '../../../ui';

type ImagePickerProps = {
  label: string;
  file: File | null;
  onPick: (file: File | null) => void;
};

export function ImagePicker({ label, file, onPick }: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(null);

  // One object URL per picked file, released when it is replaced.
  useEffect(() => {
    if (file === null) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onPick(event.target.files?.[0] ?? null);
  };

  return (
    <label className="flex cursor-pointer flex-col gap-2">
      <Text as="span" size="label" weight="medium">
        {label}
      </Text>

      <span className="flex aspect-[4/3] items-center justify-center overflow-hidden border border-(--card-border) border-dashed bg-(--surface-sunken) hover:border-(--accent) focus-within:ring-2 focus-within:ring-(--border-focus)">
        {preview === null ? (
          <span className="flex flex-col items-center gap-1 p-3 text-center text-(--text-muted)">
            <Upload size={20} aria-hidden />
            <Text as="span" size="caption" tone="muted">
              Elegir imagen
            </Text>
          </span>
        ) : (
          <img src={preview} alt="" className="size-full object-cover" />
        )}
      </span>

      <input type="file" accept="image/*" onChange={handleChange} className="sr-only" />
    </label>
  );
}
