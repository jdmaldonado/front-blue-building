import { LoginMode } from '@bb/core';
import { createFileRoute } from '@tanstack/react-router';
import { requireMode } from '../app/guards';
import { AdminHomePage } from '../features/admin';

export const Route = createFileRoute('/admin')({
  beforeLoad: requireMode(LoginMode.Admin),
  component: AdminHomePage,
});
