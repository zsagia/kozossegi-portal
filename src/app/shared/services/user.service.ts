import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

/* Felhasználókat érintő logikák */

@Injectable()
export class UserService {
  private authenticatedUser!: User | null;
  private usersSubject$ = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getAutheticatedUserFromServer();
  }

  getAutheticatedUserFromServer(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }

  // Felhasználók cimkézése kapcsolat szerint a bejelentkezett felhasználóhoz képest
  private getUserContactState(user: User, usersArray: User[]): string {
    if (this.authenticatedUser) {
      const userContacts = usersArray.find(
        user => user.id === this.authenticatedUser!.id)?.contacts || [];
      const markedUserIds = usersArray.find(
        user => user.id === this.authenticatedUser!.id)?.markedUsers || [];

      if (user.id !== this.authenticatedUser.id) {
        if (userContacts.includes(user.id))  {
          return 'contact'
        }
        if (!userContacts.includes(user.id) &&
            !markedUserIds.includes(user.id) &&
            !user.markedUsers.includes(this.authenticatedUser.id) &&
            user.id !== this.authenticatedUser.id) {
          return 'unknown'
        }
        if (markedUserIds.includes(user.id)) {
          return 'marked'
        }
        if (user.markedUsers.includes(this.authenticatedUser.id)) {
          return 'markedBy'
        }
      }
      return 'own';
    }
    return '';
  }

  // Felhasználók lekérdezése
  getUsers(): Observable<User[]> {
    return this.usersSubject$.asObservable().pipe(
      map(usersArray => {
        return usersArray.map((user, index, usersArray) => {
          user.contactState = this.getUserContactState(user, usersArray);
          return user;
        })
      })
    );
  }

  // Egy adott user lekérdezése
  getUserFromServer(userId: number): Observable<User> {
    return this.http.get<User>('api/users/' + userId);
  }

  // Összes user lekérdezése és subject-be mentése
  getUsersFromServer(): void {
    this.http.get<User[]>('api/users').subscribe(
      users => this.usersSubject$.next(users)
    );
  }

  // Egy adott user módosítása
  updateUser(updatedUser: User): void {
    this.http.put<User>('api/users/' + updatedUser.id, updatedUser)
      .subscribe(() => this.getUsersFromServer());
  }

}
