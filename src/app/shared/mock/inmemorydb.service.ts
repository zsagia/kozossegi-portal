import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { UserRole } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class DbMockService implements InMemoryDbService {
  createDb() {
    const users = [
      {
        id: 1,
        name: 'User 1',
        email: 'a@b.c',
        password: 'MTIz',
        active: true,
        about: "Én vagyok az admin :)",
        markedUsers: [2],
        contacts: [3, 5],
        role: UserRole.Admin
      },
      {
        id: 2,
        name: 'User 2',
        email: 'a@b.c',
        password: 'MTIz',
        about: "Helló mindenki!",
        active: true,
        markedUsers: [],
        contacts: [3, 4],
        role: UserRole.User
      },
      {
        id: 3,
        name: 'User 3',
        email: 'a@b.c',
        password: 'MTIz',
        about: "Nem mutatkozom be...",
        active: false,
        markedUsers: [],
        contacts: [1, 2],
        role: UserRole.User
      },
      {
        id: 4,
        name: 'User 4',
        email: 'a@b.c',
        password: 'MTIz',
        about: "Hajrá Közösségi Portál :D",
        active: true,
        markedUsers: [5, 1],
        contacts: [],
        role: UserRole.User
      },
      {
        id: 5,
        name: 'User 5',
        email: 'a@b.c',
        password: 'MTIz',
        about: "Ennyit rólam.",
        active: true,
        markedUsers: [],
        contacts: [1],
        role: UserRole.User
      },
      {
        id: 6,
        name: 'User 6',
        email: 'a@b.c',
        password: 'MTIz',
        about: "Újabb user vagyok.",
        active: true,
        markedUsers: [],
        contacts: [],
        role: UserRole.User
      },
    ];

    const messages = [
      {
        id: 1,
        senderId: 1,
        receiverId: 2,
        timestamp: new Date(),
        text: 'Hello from User 1 to User 2'
      },
      {
        id: 2,
        senderId: 2,
        receiverId: 1,
        timestamp: new Date(),
        text: 'Hello from User 2 to User 1'
      },
    ];

    return { users, messages };
  }
}
