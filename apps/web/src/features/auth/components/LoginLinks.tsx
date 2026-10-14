import { Link } from '@tanstack/react-router';
import { AppRoute } from '../../../app/navigation';
import { Text, cn, linkVariants } from '../../../ui';

const linkClass = linkVariants({ size: 'md', className: 'py-2 font-semibold' });

// Only for residents: admin accounts are made by Blue Building, and the API
// only recovers passwords of resident accounts.
export function LoginLinks() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Text as="span" tone="secondary">
        ¿Es la primera vez? Regístrate como...
      </Text>
      <div className="flex flex-wrap justify-center gap-x-6">
        <Link to={AppRoute.RegisterOwner} className={linkClass}>
          Propietario o líder
        </Link>
        <Link to={AppRoute.RegisterResident} className={linkClass}>
          Residente o colaborador
        </Link>
      </div>
      <Link to={AppRoute.ForgotPassword} className={cn(linkClass, 'mt-4')}>
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  );
}
