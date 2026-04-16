import type { UserRole } from '../constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  parqueadero_id?: string;
}
