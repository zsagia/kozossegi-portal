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
        name: 'Admin',
        email: 'admin@b.c',
        password: 'TVRJeg==',
        active: true,
        about: "Én vagyok az admin :)",
        markedUsers: [2],
        contacts: [3, 5],
        role: UserRole.Admin
      },
      {
        id: 2,
        name: 'User 2',
        email: 'user2@b.c',
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
        email: 'use3@b.c',
        password: 'MTIz',
        about: "Nem mutatkozom be...",
        active: true,
        markedUsers: [],
        contacts: [1, 2],
        role: UserRole.User
      },
      {
        id: 4,
        name: 'User 4',
        email: 'user4@b.c',
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
        email: 'user5@b.c',
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
        email: 'user6@b.c',
        password: 'MTIz',
        about: "Újabb user vagyok.",
        active: false,
        markedUsers: [],
        contacts: [],
        role: UserRole.User
      },
    ];

    const notifications = [
      { id: 1, forUser: 1, message: 'Új ismerősnek jelölés: User 4' },
      { id: 2, forUser: 1, message: 'Új üzenet tőle: User 3' }
    ];

    const posts = [
      { id: 1, fromUser: 2, timestamp: '2023-08-07T11:34:56.789Z', text: 'Ez az első poszt' },
      { id: 2, fromUser: 5, timestamp: '2023-08-07T12:40:12.333Z', text: 'Itt pedig a második' },
      { id: 3, fromUser: 6, timestamp: '2023-08-07T15:50:44.555Z', text: 'Nyilván ez a harmadik' }
    ];

    const messages = [
      {
        id: 1,
        fromUser: 1,
        toUser: 2,
        timestamp: '2023-08-07T11:34:56.789Z',
        message: 'Hello User 2!'
      },
      {
        id: 2,
        fromUser: 3,
        toUser: 1,
        timestamp: '2023-08-07T12:34:56.789Z',
        message: 'Hello User 1!'
      },
      {
        id: 3,
        fromUser: 1,
        toUser: 3,
        timestamp: '2023-08-07T13:34:56.789Z',
        message: 'Hello User!'
      },
      {
        id: 4,
        fromUser: 3,
        toUser: 1,
        timestamp: '2023-08-07T14:34:56.789Z',
        message: 'Mi a helyzet?'
      },
      {
        id: 5,
        fromUser: 1,
        toUser: 3,
        timestamp: '2023-08-07T15:34:56.789Z',
        message: 'Áh, semmi.'
      },
      {
        id: 6,
        fromUser: 5,
        toUser: 1,
        timestamp: '2023-08-07T16:34:56.789Z',
        message: 'Hello from User 5 to User 1'
      },
    ];

    return { users, messages, notifications, posts };
  }
}
