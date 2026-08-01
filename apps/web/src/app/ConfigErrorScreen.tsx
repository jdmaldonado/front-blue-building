import { AppConfigError } from '../config';
import { Alert, Card } from '../ui';

// Rendered instead of the app when the environment is misconfigured. It has to
// work without any service, so it only uses primitives and tokens.
export function ConfigErrorScreen({ error }: { error: unknown }) {
  const issues = error instanceof AppConfigError ? error.issues : [String(error)];

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--surface-base) p-6 text-(--text-primary)">
      <Card className="w-full max-w-md p-8">
        <Alert variant="error" title="La aplicación no pudo iniciar">
          Falta configuración del entorno. Revisa el archivo <code>.env</code> contra <code>.env.example</code>.
        </Alert>
        <ul className="mt-4 flex flex-col gap-1 text-body-sm text-(--text-secondary)">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
