import { UserRole } from '../enums/user-role.enum';
import { UserRegData } from './user-reg.model';

export interface User extends UserRegData {
  id: number;
  active: boolean;
  about: string;
  markedUsers: number[];
  contacts: number[];
  role: UserRole;
  contactState?: string | null;
}

export type UserAdd = Omit<User, 'id'>;