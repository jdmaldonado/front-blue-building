import { LoginInputSchema, LoginMode } from '@bb/core';
import { useLogin } from '@bb/logic';
import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { Alert, Button, Field, Input, Logo, RadioGroup, type RadioOption } from '../../ui';
import { BrandPanel } from './BrandPanel';
import { loginErrorMessage } from './loginErrorMessage';

// The two login endpoints are different (resident vs super admin), so the user
// picks which one before submitting.
const modeOptions: ReadonlyArray<RadioOption<LoginMode>> = [
  { value: LoginMode.Usuario, label: 'Residente' },
  { value: LoginMode.Admin, label: 'Administrador' },
];

type FieldErrors = {
  cedula?: string;
  password?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>(LoginMode.Usuario);
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const login = useLogin({
    onSuccess: () => {
      void navigate({ to: '/' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = LoginInputSchema.safeParse({ cedula, password, mode });
    if (!input.success) {
      const errors: FieldErrors = {};
      for (const issue of input.error.issues) {
        const field = issue.path[0];
        if (field === 'cedula' || field === 'password') {
          errors[field] ??= issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    login.mutate(input.data);
  };

  const alert = login.isError ? loginErrorMessage(login.error) : null;
  const disabled = login.isPending || login.isSuccess;

  return (
    // Full-bleed split screen: brand panel from the top-left corner, form filling
    // the rest. On mobile the panel disappears and the form owns the viewport.
    <main className="flex min-h-dvh flex-col bg-(--surface-raised) text-(--text-primary) md:flex-row">
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 md:px-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-[420px] flex-col gap-5">
          <Logo className="md:hidden" />

          <div className="flex flex-col gap-1">
            <h1 className="font-display text-title-lg font-bold tracking-tight md:text-display">Acceso al edificio</h1>
            <span className="text-body text-(--text-secondary)">Ingresa con tu documento y contraseña.</span>
          </div>

          <RadioGroup
            appearance="segmented"
            label="Tipo de acceso"
            options={modeOptions}
            value={mode}
            disabled={disabled}
            onChange={setMode}
          />

          {alert ? (
            <Alert variant={alert.variant} title={alert.title}>
              {alert.description}
            </Alert>
          ) : null}

          {login.isSuccess ? (
            <Alert variant="success" title="Sesión iniciada">
              Abriendo tu edificio...
            </Alert>
          ) : null}

          <div className="flex flex-col gap-3.5">
            <Field label="Documento" htmlFor="cedula" error={fieldErrors.cedula}>
              <Input
                id="cedula"
                className="font-mono"
                inputMode="numeric"
                autoComplete="username"
                placeholder="Número de documento"
                value={cedula}
                disabled={disabled}
                aria-invalid={fieldErrors.cedula !== undefined}
                aria-describedby={fieldErrors.cedula ? 'cedula-error' : undefined}
                onChange={(event) => setCedula(event.target.value)}
              />
            </Field>

            <Field label="Contraseña" htmlFor="password" error={fieldErrors.password}>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Contraseña"
                value={password}
                disabled={disabled}
                aria-invalid={fieldErrors.password !== undefined}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
          </div>

          <Button
            type="submit"
            size="lg"
            intent={login.isSuccess ? 'success' : 'primary'}
            loading={login.isPending}
            disabled={disabled}
            className="bg-[image:var(--pattern-honeycomb)] bg-[length:39px_22.52px]"
          >
            {login.isSuccess ? 'Acceso concedido' : login.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </main>
  );
}
