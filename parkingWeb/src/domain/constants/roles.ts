export const ROLES = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
