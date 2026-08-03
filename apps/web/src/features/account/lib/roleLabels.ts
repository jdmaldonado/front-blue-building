import { RoleType, UserType } from '@bb/core';

export const ROLE_LABEL: Record<RoleType, string> = {
  [RoleType.ResidenteLider]: 'Residente líder',
  [RoleType.Residente]: 'Residente',
  [RoleType.ResidenteTemporal]: 'Residente temporal',
  [RoleType.VisitanteConocido]: 'Visitante conocido',
  [RoleType.VisitanteDesconocido]: 'Visitante',
  [RoleType.Administrador]: 'Administrador',
  [RoleType.Conserje]: 'Conserje',
  [RoleType.Accionista]: 'Accionista',
  [RoleType.Propietario]: 'Propietario',
  [RoleType.EmpleadoAdministrativo]: 'Empleado administrativo',
  [RoleType.Servicios]: 'Servicios',
  [RoleType.Policia]: 'Policía',
  [RoleType.Porteria]: 'Portería',
  [RoleType.Monitoreo]: 'Monitoreo',
  [RoleType.ExResidente]: 'Ex residente',
};

export const USER_TYPE_LABEL: Record<UserType, string> = {
  [UserType.SuperUser]: 'Administrador Blue Building',
  [UserType.User]: 'Usuario',
  [UserType.PartialUser]: 'Usuario parcial',
};
