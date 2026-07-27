import { LoginMode } from '@bb/core';
import { useLogin } from '@bb/logic';
import { useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';

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
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface-base)] text-[var(--text-primary)]">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 p-6">
        <h1 className="text-xl font-semibold">Blue Building</h1>
        <input
          className="rounded border border-[var(--border-default)] bg-[var(--surface-raised)] p-2"
          placeholder="Cédula"
          value={cedula}
          onChange={(event) => setCedula(event.target.value)}
        />
        <input
          className="rounded border border-[var(--border-default)] bg-[var(--surface-raised)] p-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="submit"
          disabled={login.isPending}
          className="rounded bg-[var(--button-primary-bg)] p-2 text-[var(--button-primary-text)] disabled:opacity-60"
        >
          {login.isPending ? 'Entrando...' : 'Entrar'}
        </button>
        {login.isError ? <p className="text-sm text-[var(--status-danger)]">Credenciales inválidas</p> : null}
      </form>
    </main>
  );
}
