import { LoginInputSchema, LoginMode } from '@bb/core';
import { useLogin } from '@bb/logic';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState, type SubmitEvent } from 'react';
import { AppRoute, landingPathFor } from '../../app/navigation';
import { Alert, Button, Field, Input, Text, linkVariants } from '../../ui';
import { AuthHeading } from './components';
import { loginErrorMessage } from './lib';

type FieldErrors = {
  cedula?: string;
  password?: string;
};

// Each door calls a different endpoint, so the mode comes from the route and
// nobody has to pick it. A resident never reads the word "administrador".
const headings: Record<LoginMode, { title: string; description: string }> = {
  [LoginMode.Usuario]: {
    title: 'Acceso al edificio',
    description: 'Ingresa con tu documento y contraseña.',
  },
  [LoginMode.Admin]: {
    title: 'Panel de administración',
    description: 'Acceso del equipo de Blue Building.',
  },
};

type LoginPageProps = {
  mode: LoginMode;
};

export function LoginPage({ mode }: LoginPageProps) {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const login = useLogin({
    // Where the session lands is decided in one place, not here.
    onSuccess: (session) => {
      void navigate({ to: landingPathFor(session) });
    },
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
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
    <>
      <AuthHeading title={headings[mode].title} description={headings[mode].description} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        {/* Recovery exists only for resident accounts: the API filters by
            userType = USER, so it is hidden in admin mode. */}
        {mode === LoginMode.Usuario ? (
          <Link to={AppRoute.ForgotPassword} className={linkVariants({ className: 'self-end' })}>
            ¿Olvidaste tu contraseña?
          </Link>
        ) : null}

        <Button
          type="submit"
          size="lg"
          intent={login.isSuccess ? 'success' : 'primary'}
          loading={login.isPending}
          disabled={disabled}
        >
          {login.isSuccess ? 'Acceso concedido' : login.isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      {/* Registration is for residents only: an admin account is created by
          Blue Building, never from here. */}
      {mode === LoginMode.Usuario ? (
        <div className="flex flex-col gap-2 border-(--border-default) border-t pt-5">
          <Text as="span" size="body-sm" tone="secondary">
            ¿Es la primera vez? Regístrate como...
          </Text>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to={AppRoute.RegisterOwner} className={linkVariants()}>
              Propietario o líder
            </Link>
            <Link to={AppRoute.RegisterResident} className={linkVariants()}>
              Residente o colaborador
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
