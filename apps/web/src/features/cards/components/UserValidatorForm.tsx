import type { UserAccount } from '@bb/core';
import { useValidateUser } from '@bb/logic';
import { useState, type SubmitEvent } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';
import { Alert, Button, Card, Text } from '../../../ui';
import { ImagePicker } from './ImagePicker';

type UserValidatorFormProps = {
  user: UserAccount;
};

type Pictures = {
  photo: File | null;
  documentFront: File | null;
  documentBack: File | null;
};

const EMPTY: Pictures = { photo: null, documentFront: null, documentBack: null };

// Until this is done the API refuses to create cards for the person, so the
// screen offers nothing else.
export function UserValidatorForm({ user }: UserValidatorFormProps) {
  const [pictures, setPictures] = useState<Pictures>(EMPTY);
  const validate = useValidateUser();
  const toast = useToast();
  const confirm = useConfirm();

  const { photo, documentFront, documentBack } = pictures;
  const complete = photo !== null && documentFront !== null && documentBack !== null;

  const pick = (key: keyof Pictures) => (file: File | null) => {
    setPictures((current) => ({ ...current, [key]: file }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (photo === null || documentFront === null || documentBack === null) {
      return;
    }

    const confirmed = await confirm({
      title: '¿Validar al usuario?',
      description: `Se suben las tres imágenes de ${user.name} y queda habilitado para recibir tarjetas.`,
      confirmLabel: 'Validar',
    });
    if (!confirmed) {
      return;
    }

    validate.mutate(
      { cedula: user.cedula, photo, documentFront, documentBack },
      {
        onSuccess: () => {
          setPictures(EMPTY);
          toast({ tone: 'success', title: 'Usuario validado', message: `Ya puedes crear tarjetas para ${user.name}.` });
        },
        onError: () => {
          toast({
            tone: 'error',
            title: 'No pudimos validar al usuario',
            message: 'Revisa que las tres imágenes se hayan cargado e intenta de nuevo.',
          });
        },
      },
    );
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Text weight="medium">Validar a {user.name}</Text>
        <Text size="body-sm" tone="secondary">
          Hacen falta las tres imágenes: la foto del rostro y las dos caras del documento.
        </Text>
      </div>

      {validate.isError ? (
        <Alert variant="error" title="No pudimos validar al usuario">
          Revisa las imágenes e intenta de nuevo.
        </Alert>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <ImagePicker label="Foto del rostro" file={photo} onPick={pick('photo')} />
          <ImagePicker label="Documento, frente" file={documentFront} onPick={pick('documentFront')} />
          <ImagePicker label="Documento, reverso" file={documentBack} onPick={pick('documentBack')} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={validate.isPending} disabled={!complete}>
            Validar usuario
          </Button>
        </div>
      </form>
    </Card>
  );
}
