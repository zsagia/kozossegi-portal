import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private TEMP_ACT_USER: User = {
    id: 1,
    name: 'User 1',
    active: true,
    about: "Én vagyok az admin :)",
    markedUsers: [2],
    contacts: [3, 5],
  }; // TODO: törölni!

  constructor() {}

  getAuthenticatedUser(): User {
      return this.TEMP_ACT_USER;
  }
}
