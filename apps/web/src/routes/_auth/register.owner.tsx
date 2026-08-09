import { ApartmentRole, RegistrationSearchSchema } from '@bb/core';
import { createFileRoute } from '@tanstack/react-router';
import { RegisterPage } from '../../features/registration';

export const Route = createFileRoute('/_auth/register/owner')({
  validateSearch: RegistrationSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterPage role={ApartmentRole.Owner} search={Route.useSearch()} />;
}
