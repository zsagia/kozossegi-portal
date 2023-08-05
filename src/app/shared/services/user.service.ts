import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUpdatedSubject = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getUsersUpdateListener() {
    return this.usersUpdatedSubject.asObservable();
  }

  getUsersFromServer(): void{
    this.http.get<User[]>('api/users').pipe(
      map(usersArray => {
        return usersArray.map((user, i, usersArray) => {
          user.contactState = this.getUserContactState(user, usersArray);
          return user;
        })
      })
    )
    .subscribe(usersWithContactState => {
      this.usersUpdatedSubject.next(usersWithContactState);
    });
  }

  getUserContactState(user: User, usersArray: User[]): string | undefined {
    const authenticatedUser = this.authService.getAuthenticatedUser();
    const userContacts = usersArray.find(user => user.id === authenticatedUser.id)?.contacts || [];
    const markedUserIds = usersArray.find(user => user.id === authenticatedUser.id)?.markedUsers || [];

    if (user.id !== authenticatedUser.id) {
      if (userContacts.includes(user.id))  {
        return 'contact'
      }
      if (!userContacts.includes(user.id) &&
          !markedUserIds.includes(user.id) &&
          !user.markedUsers.includes(authenticatedUser.id)) {
        return 'unknown'
      }
      if (markedUserIds.includes(user.id)) {
        return 'marked'
      }
      if (user.markedUsers.includes(authenticatedUser.id)) {
        return 'markedBy'
      }
    }
    return 'own';
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>('api/users/' + userId);
  }

  updateUser(updatedUser: User): void {
    this.http.put<User>('api/users/' + updatedUser.id, updatedUser).subscribe(user =>
      this.getUsersFromServer()
    );
  }

}
