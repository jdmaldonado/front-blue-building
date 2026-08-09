import { ApartmentRole } from '@bb/core';
import { Link } from '@tanstack/react-router';
import { AppRoute } from '../../../app/navigation';
import { Alert, Text, linkVariants } from '../../../ui';

type RegistrationSuccessProps = {
  role: ApartmentRole;
};

// The old app pushed straight to the login and said nothing
// (front/src/views/Apartment/ownerRegister.js:420), so nobody knew their
// account was waiting for someone else to approve it.
export function RegistrationSuccess({ role }: RegistrationSuccessProps) {
  return (
    <div className="flex flex-col gap-4">
      <Alert variant="success" title="Solicitud enviada">
        {role === ApartmentRole.Owner
          ? 'La administración del edificio la revisa y te avisa por correo.'
          : 'El propietario o líder de tu apartamento la revisa y te avisa por correo.'}
      </Alert>

      <Text as="p" tone="secondary">
        Hasta entonces tu cuenta existe pero no abre puertas. Cuando la aprueben, entra con tu documento y la contraseña
        que acabas de elegir.
      </Text>

      <Link to={AppRoute.Login} className={linkVariants()}>
        Ir al acceso
      </Link>
    </div>
  );
}
