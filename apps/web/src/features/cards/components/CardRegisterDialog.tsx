import { CardReaderStatus, CardType, type UserAccount } from '@bb/core';
import { useBuildingDoors, useBuildings, useCardMutations, useCardReader } from '@bb/logic';
import { Radio } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';
import { Button, Dialog, Field, Input, Select, Text } from '../../../ui';
import { CARD_TYPE_OPTIONS, cardErrorMessage } from '../lib';
import { CardScanArea } from './CardScanArea';

type CardRegisterDialogProps = {
  open: boolean;
  user: UserAccount;
  // Preselected when the screen was opened from a building.
  buildingId: string;
  doorId: string;
  onBuildingChange: (buildingId: string) => void;
  onDoorChange: (doorId: string) => void;
  onClose: () => void;
};

export function CardRegisterDialog({
  open,
  user,
  buildingId,
  doorId,
  onBuildingChange,
  onDoorChange,
  onClose,
}: CardRegisterDialogProps) {
  const [tag, setTag] = useState('');
  const [type, setType] = useState<CardType>(CardType.Person);
  const toast = useToast();
  const confirm = useConfirm();

  const buildings = useBuildings();
  const doors = useBuildingDoors(buildingId === '' ? null : buildingId);
  const { create } = useCardMutations();

  const reader = useCardReader({
    onTag: setTag,
    onError: () => {
      toast({
        tone: 'error',
        title: 'La lectora no respondió',
        message: 'Revisa que el equipo del edificio esté conectado, o escribe el número a mano.',
      });
    },
  });

  // Leaving the dialog stops the listeners; the reader closes its own window.
  const stopReader = reader.stop;
  useEffect(() => {
    if (!open) {
      stopReader();
      setTag('');
    }
  }, [open, stopReader]);

  const buildingOptions = useMemo(
    () => [
      { value: '', label: 'Elige un edificio' },
      ...(buildings.data ?? []).map((building) => ({ value: building.id, label: building.name })),
    ],
    [buildings.data],
  );

  // Only doors wired to a reader can go into register mode.
  const doorOptions = useMemo(
    () => [
      { value: '', label: 'Elige una puerta' },
      ...(doors.data ?? [])
        .filter((door) => door.localId !== null && door.localId !== undefined)
        .map((door) => ({ value: door.id, label: door.name ?? door.id })),
    ],
    [doors.data],
  );

  const selectedDoor = (doors.data ?? []).find((door) => door.id === doorId) ?? null;
  const canSetup = buildingId !== '' && selectedDoor?.localId !== null && selectedDoor?.localId !== undefined;
  const busy = reader.status === CardReaderStatus.Preparing || reader.status === CardReaderStatus.Waiting;

  const handleSetup = async (): Promise<void> => {
    const localId = selectedDoor?.localId;
    if (buildingId === '' || localId === null || localId === undefined) {
      return;
    }
    const confirmed = await confirm({
      title: '¿Poner la lectora en modo registro?',
      description: `${selectedDoor?.name ?? 'La lectora'} deja de dar acceso normal durante un minuto, hasta que alguien pase una tarjeta.`,
      confirmLabel: 'Configurar lectora',
      intent: 'destructive',
    });
    if (confirmed) {
      reader.start({ buildingId, localId });
    }
  };

  const handleSave = async (): Promise<void> => {
    const confirmed = await confirm({
      title: '¿Crear la tarjeta?',
      description: `La tarjeta ${tag.trim()} podrá abrir las puertas a las que ${user.name} tenga acceso.`,
      confirmLabel: 'Crear tarjeta',
    });
    if (!confirmed) {
      return;
    }

    create.mutate(
      { userId: user.id, tag: tag.trim(), type },
      {
        onSuccess: () => {
          toast({ tone: 'success', title: 'Tarjeta creada', message: `Quedó asociada a ${user.name}.` });
          onClose();
        },
        onError: (error) => {
          toast({ tone: 'error', title: 'No pudimos crear la tarjeta', message: cardErrorMessage(error) });
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="md"
      title="Nueva tarjeta"
      description={user.name}
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => void handleSave()} loading={create.isPending} disabled={tag.trim() === ''}>
            Crear tarjeta
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Edificio" htmlFor="card-building">
            <Select
              id="card-building"
              options={buildingOptions}
              value={buildingId}
              onChange={onBuildingChange}
              disabled={busy}
            />
          </Field>

          <Field label="Puerta" htmlFor="card-door">
            <Select
              id="card-door"
              options={doorOptions}
              value={doorId}
              onChange={onDoorChange}
              disabled={busy || buildingId === ''}
            />
          </Field>
        </div>

        <Button
          intent="neutral"
          appearance="outline"
          onClick={() => void handleSetup()}
          disabled={!canSetup}
          loading={busy}
        >
          <Radio size={16} />
          {busy ? 'Lectora en modo registro' : 'Configurar lectora'}
        </Button>

        <CardScanArea status={reader.status} secondsLeft={reader.secondsLeft} tag={tag} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Número de la tarjeta" htmlFor="card-tag">
            <Input
              id="card-tag"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="font-mono"
              autoComplete="off"
            />
          </Field>

          <Field label="Tipo" htmlFor="card-type">
            <Select id="card-type" options={CARD_TYPE_OPTIONS} value={type} onChange={setType} />
          </Field>
        </div>

        <Text size="body-sm" tone="secondary">
          La lectora queda en modo registro un minuto. También puedes escribir el número a mano.
        </Text>
      </div>
    </Dialog>
  );
}
