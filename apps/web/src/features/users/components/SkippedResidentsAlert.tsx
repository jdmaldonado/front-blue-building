import { Alert } from '../../../ui';

type SkippedResidentsAlertProps = {
  count: number | undefined;
};

// Some records could not be identified, so they are not on the table. Saying how
// many beats a list that quietly claims to be complete.
export function SkippedResidentsAlert({ count }: SkippedResidentsAlertProps) {
  if (count === undefined || count === 0) {
    return null;
  }

  return (
    <Alert
      variant="warning"
      title={count === 1 ? 'Un usuario no se pudo leer' : `${count} usuarios no se pudieron leer`}
    >
      Sus datos no traen documento o nombre, así que no se puede actuar sobre ellos y no aparecen en la lista. El
      detalle de cada uno queda en el log de la aplicación.
    </Alert>
  );
}
