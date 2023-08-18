import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User, UserAdd } from '../../../shared/models/user.model';

@Injectable()
export class UserDataService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  public createUser(user: UserAdd): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  public getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  public updateUser(updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${updatedUser.id}`, updatedUser);
  }
}
