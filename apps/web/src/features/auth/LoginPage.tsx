import { LoginMode } from '@bb/core';
import { useLogin } from '@bb/logic';
import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Field, Input } from '../../ui';

export function LoginPage() {
  const navigate = useNavigate();
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');

  const login = useLogin({
    onSuccess: () => {
      void navigate({ to: '/' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate({ cedula, password, mode: LoginMode.Usuario });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--surface-base) p-6 text-(--text-primary)">
      <Card className="w-full max-w-sm p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h1 className="text-xl font-semibold">Blue Building</h1>
          <Field label="Cédula" htmlFor="cedula">
            <Input
              id="cedula"
              value={cedula}
              onChange={(event) => setCedula(event.target.value)}
              placeholder="Número de cédula"
            />
          </Field>
          <Field label="Contraseña" htmlFor="password">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
            />
          </Field>
          {login.isError ? (
            <Alert variant="error" title="Credenciales inválidas">
              Revisa tu cédula y contraseña.
            </Alert>
          ) : null}
          <Button type="submit" loading={login.isPending}>
            {login.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
