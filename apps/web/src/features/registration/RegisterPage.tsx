import { ApartmentRole, type RegistrationSearch } from '@bb/core';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AppRoute } from '../../app/navigation';
import { linkVariants } from '../../ui';
import { AuthHeading } from '../auth/components';
import { RegistrationForm, RegistrationSuccess, type ApartmentContext } from './components';

type RegisterPageProps = {
  role: ApartmentRole;
  search: RegistrationSearch;
};

const headings: Record<ApartmentRole, { title: string; description: string }> = {
  [ApartmentRole.Owner]: {
    title: 'Registro de propietario',
    description: 'Para el propietario o líder de un apartamento que todavía no tiene quien lo represente.',
  },
  [ApartmentRole.Resident]: {
    title: 'Registro de residente',
    description: 'Para quien vive o trabaja en un apartamento que ya tiene propietario o líder.',
  },
};

export function RegisterPage({ role, search }: RegisterPageProps) {
  const [done, setDone] = useState(false);
  const heading = headings[role];

  // An apartment in the query skips the picker: that is what a link shared by
  // someone who already lives there carries.
  const apartment: ApartmentContext =
    search.apartmentId === undefined || search.apartmentId === ''
      ? { mode: 'pick' }
      : { mode: 'fixed', apartmentId: search.apartmentId };

  return (
    <>
      <AuthHeading title={heading.title} description={heading.description} />

      {done ? (
        <RegistrationSuccess role={role} />
      ) : (
        <>
          <RegistrationForm role={role} apartment={apartment} onSuccess={() => setDone(true)} />

          <div className="flex flex-col gap-1">
            <Link
              to={role === ApartmentRole.Owner ? AppRoute.RegisterResident : AppRoute.RegisterOwner}
              className={linkVariants()}
            >
              {role === ApartmentRole.Owner
                ? 'Mi apartamento ya tiene propietario registrado'
                : 'Soy el propietario o líder del apartamento'}
            </Link>
            <Link to={AppRoute.Login} className={linkVariants()}>
              Ya tengo cuenta
            </Link>
          </div>
        </>
      )}
    </>
  );
}
