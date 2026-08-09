import {
  ApartmentRole,
  DOCUMENT_TYPE_LABELS,
  DocumentType,
  DuplicateRegistrationError,
  PHONE_COUNTRY_PREFIX,
  PHOTO_MAX_BYTES,
  RegistrationFormSchema,
  type RegistrationForm as RegistrationFormValues,
} from '@bb/core';
import { useRegister } from '@bb/logic';
import { useState, type SubmitEvent } from 'react';
import { Alert, Button, Checkbox, Field, Input, PhotoInput, Select, Text, type SelectOption } from '../../../ui';
import { registrationErrorMessage, sortByLabel } from '../lib';
import { ApartmentPicker, EMPTY_SELECTION, type ApartmentSelection } from './ApartmentPicker';
import { TermsDialog } from './TermsDialog';

// Where the person is registering. `pick` walks the four selects; `fixed` is
// handed the apartment and hides them, which is what a link shared by a
// resident, or a screen inside the app, needs.
export type ApartmentContext = { mode: 'pick' } | { mode: 'fixed'; apartmentId: string; label?: string };

type RegistrationFormProps = {
  role: ApartmentRole;
  apartment: ApartmentContext;
  onSuccess: () => void;
};

type FieldErrors = Partial<Record<keyof RegistrationFormValues | 'photo' | 'apartmentId', string>>;

const documentOptions: ReadonlyArray<SelectOption<DocumentType>> = sortByLabel(
  Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => ({ value: value as DocumentType, label })),
);

export function RegistrationForm({ role, apartment, onSuccess }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.CedulaCiudadania);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selection, setSelection] = useState<ApartmentSelection>(EMPTY_SELECTION);
  const [termsOpen, setTermsOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const register = useRegister({ onSuccess });

  const apartmentId = apartment.mode === 'fixed' ? apartment.apartmentId : selection.apartmentId;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = RegistrationFormSchema.safeParse({
      name,
      cedula,
      documentType,
      email,
      phone,
      password,
      passwordConfirm,
      acceptTerms,
    });

    const errors: FieldErrors = {};
    if (!form.success) {
      for (const issue of form.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          errors[field as keyof FieldErrors] ??= issue.message;
        }
      }
    }
    // The photo is a File, so it is checked here and not in the schema: `core`
    // has no DOM types.
    if (photo === null) {
      errors.photo = 'Agrega una foto tuya.';
    } else if (photo.size > PHOTO_MAX_BYTES) {
      errors.photo = 'La foto pesa demasiado. Elige una de menos de 5 MB.';
    }
    if (apartmentId === '') {
      errors.apartmentId = 'Elige el apartamento.';
    }

    if (Object.keys(errors).length > 0 || !form.success || photo === null) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    // Field by field: `passwordConfirm` and `acceptTerms` are ours and have no
    // business travelling to the API.
    register.mutate({
      role,
      apartmentId,
      photo,
      name: form.data.name,
      cedula: form.data.cedula,
      documentType: form.data.documentType,
      email: form.data.email,
      phone: form.data.phone,
      password: form.data.password,
    });
  };

  const alert = register.isError ? registrationErrorMessage(register.error, role) : null;
  // A duplicate names its field, so the message lands on the input too.
  const duplicateField = register.error instanceof DuplicateRegistrationError ? register.error.field : null;
  const disabled = register.isPending || register.isSuccess;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {alert ? (
        <Alert variant={alert.variant} title={alert.title}>
          {alert.description}
        </Alert>
      ) : null}

      <Field label="Foto" htmlFor="photo" error={fieldErrors.photo} required>
        <PhotoInput
          id="photo"
          value={photo}
          onChange={(file) => setPhoto(file)}
          label="Agregar"
          disabled={disabled}
          invalid={fieldErrors.photo !== undefined}
        />
      </Field>

      <div className="flex flex-col gap-3.5">
        <Field label="Nombre completo" htmlFor="name" error={fieldErrors.name} required>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Como aparece en tu documento"
            value={name}
            disabled={disabled}
            aria-invalid={fieldErrors.name !== undefined}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>

        <Field label="Tipo de documento" htmlFor="documentType" required>
          <Select
            id="documentType"
            options={documentOptions}
            value={documentType}
            disabled={disabled}
            onChange={setDocumentType}
          />
        </Field>

        <Field
          label="Número de documento"
          htmlFor="cedula"
          error={fieldErrors.cedula ?? (duplicateField === 'cedula' ? 'Ese documento ya está registrado.' : undefined)}
          required
        >
          <Input
            id="cedula"
            className="font-mono"
            inputMode="numeric"
            autoComplete="username"
            value={cedula}
            disabled={disabled}
            aria-invalid={fieldErrors.cedula !== undefined}
            onChange={(event) => setCedula(event.target.value)}
          />
        </Field>

        <Field
          label="Correo"
          htmlFor="email"
          error={fieldErrors.email ?? (duplicateField === 'email' ? 'Ese correo ya está registrado.' : undefined)}
          required
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            disabled={disabled}
            aria-invalid={fieldErrors.email !== undefined}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field
          label="Teléfono"
          htmlFor="phone"
          error={fieldErrors.phone}
          hint={`Se registra con el prefijo ${PHONE_COUNTRY_PREFIX}.`}
          required
        >
          <Input
            id="phone"
            className="font-mono"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="3001234567"
            value={phone}
            disabled={disabled}
            aria-invalid={fieldErrors.phone !== undefined}
            onChange={(event) => setPhone(event.target.value)}
          />
        </Field>

        <Field label="Contraseña" htmlFor="password" error={fieldErrors.password} required>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            disabled={disabled}
            aria-invalid={fieldErrors.password !== undefined}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <Field label="Repite la contraseña" htmlFor="passwordConfirm" error={fieldErrors.passwordConfirm} required>
          <Input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            value={passwordConfirm}
            disabled={disabled}
            aria-invalid={fieldErrors.passwordConfirm !== undefined}
            onChange={(event) => setPasswordConfirm(event.target.value)}
          />
        </Field>
      </div>

      {apartment.mode === 'pick' ? (
        <ApartmentPicker
          role={role}
          value={selection}
          onChange={setSelection}
          disabled={disabled}
          error={fieldErrors.apartmentId}
        />
      ) : (
        <Text as="span" size="body-sm" tone="secondary">
          {apartment.label === undefined
            ? 'Te registras en el apartamento del enlace que abriste.'
            : `Te registras en ${apartment.label}.`}
        </Text>
      )}

      <div className="flex flex-col gap-1">
        {/* The link to read them sits outside the label on purpose: a button
            inside a <label> also toggles the checkbox when clicked. */}
        <Checkbox
          checked={acceptTerms}
          onChange={setAcceptTerms}
          disabled={disabled}
          label={<span className="text-body-sm">Acepto los términos y condiciones</span>}
        />
        <Button appearance="ghost" size="sm" className="self-start" onClick={() => setTermsOpen(true)}>
          Leer los términos
        </Button>
        {fieldErrors.acceptTerms ? (
          <Text as="span" size="caption" tone="destructive">
            {fieldErrors.acceptTerms}
          </Text>
        ) : null}
      </div>

      <Button type="submit" size="lg" loading={register.isPending} disabled={disabled}>
        {register.isPending ? 'Enviando...' : 'Enviar solicitud'}
      </Button>

      <TermsDialog open={termsOpen} onClose={() => setTermsOpen(false)} onAccept={() => setAcceptTerms(true)} />
    </form>
  );
}
