import { Alert } from '../../../ui';

type SkippedResidentsAlertProps = {
  count: number | undefined;
};

// Some records could not be identified, so they are not on the table. Saying how
// many beats a list that quietly claims to be complete.
//
// TODO: the reason for each dropped record only reaches the browser log. An
// admin cannot tell which users are missing or fix them from here.
export function SkippedResidentsAlert({ count }: SkippedResidentsAlertProps) {
  if (count === undefined || count === 0) {
    return null;
  }

  return (
    <Alert
      variant="warning"
      title={count === 1 ? 'Un usuario no se pudo leer' : `${count} usuarios no se pudieron leer`}
    >
      Sus datos no traen documento o nombre, así que no aparecen en la lista.
    </Alert>
  );
}
