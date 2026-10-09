import { Eye, EyeOff } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { cn } from '../cn';
import { Input } from '../input';
import { passwordInputFieldVariants, passwordInputVariants, passwordToggleVariants } from './PasswordInput-variants';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>;

export function PasswordInput({ appearance, className, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <span className={passwordInputVariants()}>
      <Input
        appearance={appearance}
        type={visible ? 'text' : 'password'}
        disabled={disabled}
        className={cn(passwordInputFieldVariants({ appearance }), className)}
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible((current) => !current)}
        className={passwordToggleVariants({ appearance })}
      >
        <Icon aria-hidden className="size-5" />
      </button>
    </span>
  );
}
