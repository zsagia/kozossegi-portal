import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: number;
  name: string;
  active: boolean;
  markedUsers: number[];
  contacts: number[];
  role: UserRole;
}
