/**
 * Define los roles permitidos en la aplicación
 */
export const VALID_ROLES = ['admin', 'gestor', 'auditor'] as const;
export type Role = typeof VALID_ROLES[number];