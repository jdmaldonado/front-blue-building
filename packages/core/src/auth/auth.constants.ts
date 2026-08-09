export const UserType = {
  SuperUser: 'SUPER_USER',
  User: 'USER',
  PartialUser: 'PARTIAL_USER',
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];

export const RoleType = {
  ResidenteLider: 'RESIDENTE_LIDER',
  Residente: 'RESIDENTE',
  ResidenteTemporal: 'RESIDENTE_TEMPORAL',
  VisitanteConocido: 'VISITANTE_CONOCIDO',
  VisitanteDesconocido: 'VISITANTE_DESCONOCIDO',
  Administrador: 'ADMINISTRADOR',
  Conserje: 'CONSERJE',
  Accionista: 'ACCIONISTA',
  Propietario: 'PROPIETARIO',
  EmpleadoAdministrativo: 'EMPLEADO_ADMINISTRATIVO',
  Servicios: 'SERVICIOS',
  Policia: 'POLICIA',
  Porteria: 'PORTERIA',
  Monitoreo: 'MONITOREO',
  ExResidente: 'EX_RESIDENTE',
} as const;
export type RoleType = (typeof RoleType)[keyof typeof RoleType];

// The login form asks the user to pick this mode. It is NOT `User.userType`:
// it only decides which login endpoint the front calls.
export const LoginMode = {
  Usuario: 'USUARIO',
  Admin: 'ADMIN',
} as const;
export type LoginMode = (typeof LoginMode)[keyof typeof LoginMode];

// The API validates `MinLength(4)` on the reset form
// (api/src/controllers/users/auth/reset_password_form.ts:7).
export const PASSWORD_MIN_LENGTH = 4;
