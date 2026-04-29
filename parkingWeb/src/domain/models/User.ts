import type { UserRole } from '../constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  parqueadero_id?: string;
  max_places?: number;
  current_places?: number;
}

