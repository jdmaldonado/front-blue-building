import { ForgotPasswordInputSchema } from '@bb/core';
import { useForgotPassword } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import { useState, type SubmitEvent } from 'react';
import { AppRoute } from '../../app/navigation';
import { Alert, Button, Field, Input, linkVariants } from '../../ui';
import { AuthHeading } from './components';
import { recoveryErrorMessage } from './lib';

export function ForgotPasswordPage() {
  const [cedula, setCedula] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);

  const forgotPassword = useForgotPassword();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = ForgotPasswordInputSchema.safeParse({ cedula });
    if (!input.success) {
      setFieldError(input.error.issues[0]?.message);
      return;
    }

    setFieldError(undefined);
    forgotPassword.mutate(input.data);
  };

  const alert = forgotPassword.isError ? recoveryErrorMessage(forgotPassword.error) : null;

  // The API answers the same for a known and an unknown document, so the
  // confirmation must not claim the account exists.
  if (forgotPassword.isSuccess) {
    return (
      <>
        <AuthHeading title="Revisa tu correo" description="Si el documento está registrado, te llegará un enlace." />
        <Alert variant="success" title="Solicitud enviada">
          El enlace para crear una contraseña nueva llega al correo asociado a tu cuenta. Revisa también la carpeta de
          spam.
        </Alert>
        <Link to={AppRoute.Login} className={linkVariants()}>
          Volver al inicio de sesión
        </Link>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Recuperar contraseña" description="Te enviamos un enlace al correo de tu cuenta." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {alert ? (
          <Alert variant={alert.variant} title={alert.title}>
            {alert.description}
          </Alert>
        ) : null}

        <Field label="Documento" htmlFor="cedula" error={fieldError}>
          <Input
            id="cedula"
            className="font-mono"
            inputMode="numeric"
            autoComplete="username"
            placeholder="Número de documento"
            value={cedula}
            disabled={forgotPassword.isPending}
            aria-invalid={fieldError !== undefined}
            aria-describedby={fieldError ? 'cedula-error' : undefined}
            onChange={(event) => setCedula(event.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" loading={forgotPassword.isPending} disabled={forgotPassword.isPending}>
          {forgotPassword.isPending ? 'Enviando...' : 'Enviar enlace'}
        </Button>

        <Link to={AppRoute.Login} className={linkVariants({ tone: 'muted' })}>
          Volver al inicio de sesión
        </Link>
      </form>
    </>
  );
}
