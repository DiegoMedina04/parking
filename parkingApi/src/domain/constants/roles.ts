export const ROLES = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERADOR',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
