import { LoginMode } from '@bb/core';
import { createFileRoute } from '@tanstack/react-router';
import { requireMode } from '../app/guards';
import { HomePage } from '../features/home';

export const Route = createFileRoute('/')({
  beforeLoad: requireMode(LoginMode.Usuario),
  component: HomePage,
});
