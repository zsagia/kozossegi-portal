import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUpdatedSubject = new BehaviorSubject<User[]>([]);
  private authenticatedUser!: User | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getAutheticatedUserFromServer();
    this.getUsersFromServer();
  }

  private getAutheticatedUserFromServer(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }

  getUsersUpdateListener() {
    return this.usersUpdatedSubject.asObservable();
  }

  private getUsersFromServer(): void{
    this.http.get<User[]>('api/users').pipe(
      map(usersArray => {
        return usersArray.map((user, index, usersArray) => {
          user.contactState = this.getUserContactState(user, usersArray);
          return user;
        })
      })
    )
    .subscribe(usersWithContactState => {
      this.usersUpdatedSubject.next(usersWithContactState);
    });
  }

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
            !user.markedUsers.includes(this.authenticatedUser.id)) {
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

  getUserFromServer(userId: number): Observable<User> {
    return this.http.get<User>('api/users/' + userId);
  }

  updateUser(updatedUser: User): void {
    this.http.put<User>('api/users/' + updatedUser.id, updatedUser).subscribe(user =>
      this.getUsersFromServer()
    );
  }

}
