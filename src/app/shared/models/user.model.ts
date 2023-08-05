import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: number;
  name: string;
  about: string;
  email?: string; // TODO: ?
  password?: string; // TODO: ?
  active: boolean;
  markedUsers: number[];
  contacts: number[];
  role?: UserRole; // TODO: ?
  contactState?: string | null; // TODO: pontosítani, pl. enum és nem null
}
