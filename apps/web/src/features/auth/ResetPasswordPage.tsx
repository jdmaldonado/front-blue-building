import { PASSWORD_MIN_LENGTH, ResetPasswordFormSchema } from '@bb/core';
import { useResetPassword } from '@bb/logic';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState, type SubmitEvent } from 'react';
import { AppRoute } from '../../app/navigation';
import { Alert, Button, Field, Input, linkVariants } from '../../ui';
import { AuthHeading } from './components';
import { recoveryErrorMessage } from './lib';

type FieldErrors = {
  password?: string;
  passwordConfirm?: string;
};

type ResetPasswordPageProps = {
  // Comes from the email link: /reset_password?token=...
  token: string;
};

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const resetPassword = useResetPassword({
    onSuccess: () => {
      void navigate({ to: AppRoute.Login });
    },
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = ResetPasswordFormSchema.safeParse({ token, password, passwordConfirm });
    if (!form.success) {
      const errors: FieldErrors = {};
      for (const issue of form.error.issues) {
        const field = issue.path[0];
        if (field === 'password' || field === 'passwordConfirm') {
          errors[field] ??= issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    resetPassword.mutate({ token: form.data.token, password: form.data.password });
  };

  // A link without a token is a broken link; there is nothing to submit.
  if (token === '') {
    return (
      <>
        <AuthHeading title="Enlace inválido" description="Este enlace no trae la información necesaria." />
        <Alert variant="error" title="No pudimos leer el enlace">
          Ábrelo directamente desde el correo que te enviamos, o solicita uno nuevo.
        </Alert>
        <Link to={AppRoute.ForgotPassword} className={linkVariants()}>
          Solicitar un enlace nuevo
        </Link>
      </>
    );
  }

  const alert = resetPassword.isError ? recoveryErrorMessage(resetPassword.error) : null;
  const disabled = resetPassword.isPending || resetPassword.isSuccess;

  return (
    <>
      <AuthHeading title="Nueva contraseña" description="Elige la contraseña con la que vas a entrar." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {alert ? (
          <Alert variant={alert.variant} title={alert.title}>
            {alert.description}
          </Alert>
        ) : null}

        {resetPassword.isSuccess ? (
          <Alert variant="success" title="Contraseña actualizada">
            Ya puedes iniciar sesión.
          </Alert>
        ) : null}

        <div className="flex flex-col gap-3.5">
          <Field
            label="Contraseña nueva"
            htmlFor="password"
            error={fieldErrors.password}
            hint={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`}
          >
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Contraseña nueva"
              value={password}
              disabled={disabled}
              aria-invalid={fieldErrors.password !== undefined}
              aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          <Field label="Repite la contraseña" htmlFor="passwordConfirm" error={fieldErrors.passwordConfirm}>
            <Input
              id="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              value={passwordConfirm}
              disabled={disabled}
              aria-invalid={fieldErrors.passwordConfirm !== undefined}
              aria-describedby={fieldErrors.passwordConfirm ? 'passwordConfirm-error' : undefined}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
          </Field>
        </div>

        <Button
          type="submit"
          size="lg"
          intent={resetPassword.isSuccess ? 'success' : 'primary'}
          loading={resetPassword.isPending}
          disabled={disabled}
        >
          {resetPassword.isSuccess ? 'Contraseña guardada' : resetPassword.isPending ? 'Guardando...' : 'Guardar'}
        </Button>

        <Link to={AppRoute.Login} className={linkVariants({ tone: 'muted' })}>
          Volver al inicio de sesión
        </Link>
      </form>
    </>
  );
}
