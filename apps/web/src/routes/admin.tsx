import { LoginMode } from '@bb/core';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { requireMode } from '../app/guards';

export const Route = createFileRoute('/admin')({
  beforeLoad: requireMode(LoginMode.Admin),
  component: Outlet,
});
