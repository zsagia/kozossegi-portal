import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { UserStateService } from 'src/app/module/user/state';
import { UserRegData } from 'src/app/shared/models/user-reg.model';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthStateService } from './auth-state.service';
import { User, UserAdd } from 'src/app/shared/models/user.model';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { HttpClient } from '@angular/common/http';
import { UserLoginData } from 'src/app/shared/models/user-login.model';
import { AuthResponse } from 'src/app/shared/models/auth-response.model';

@Injectable({providedIn: 'root'})
export class AuthUtilService {
  constructor(private authStateService: AuthStateService, private userStateService: UserStateService, private http: HttpClient,
              private router: Router) {}

  public checkLogin(): Observable<boolean> {
    return this.authStateService.getAuthenticatedUser().pipe(map(user => !!user));
  }

  public createUser(user: UserRegData): Observable<boolean> {
    const newUser: UserAdd = {
      name: user.name,
      email: user.email,
      password: this.encryptPassword(user.password),
      active: false,
      about: '',
      markedUsers: [],
      contacts: [],
      role: UserRole.User
    };
    
    this.userStateService.dispatchCreateUser(newUser);

    return of(true);
  }

  public signIn(formUser: UserLoginData): Observable<AuthResponse> {
    const encodedEmail = encodeURIComponent(formUser.email);
    return this.http.get<User[]>('http://localhost:3000/users?email=' + encodedEmail)
      .pipe(map(users => {
        const dbUser = users.find(dbUser =>
          dbUser.email === formUser.email &&
          dbUser.password === this.encryptPassword(formUser.password));
        if (!dbUser) {
          this.authStateService.dispatchUpdateAuthenticatedUser(null);
          return { success: false, message: 'Sikertelen bejelentkezés' };
        }
        else if (!dbUser.active) {
          this.authStateService.dispatchUpdateAuthenticatedUser(null);
          return { success: false, message: 'Nem aktivált felhasználó' };
        }
        else {
          this.authStateService.dispatchUpdateAuthenticatedUser(dbUser);
          const token = this.generateToken(dbUser);
          this.setAuthToken(token);
          return { success: true, message: '' }
        }
      }));
  }

  public signOut(): void {
    this.authStateService.dispatchUpdateAuthenticatedUser(null);
    this.setCookie('auth_token', '', -1);
    this.router.navigate(['/signin']);
  }

  public signUp(user: UserRegData): Observable<any> {
    return this.isEmailAvailable(user.email).pipe(
      switchMap((mailIsAvailable) => {
        if (mailIsAvailable) {
          return this.createUser(user);
        } else {
          return new Observable(observer => {
            observer.error('Email is not available');
            observer.complete();
          });
        }
      })
    );
  }

  private encryptPassword(password: string): string {
    return btoa(password);
  }

  private generateToken(user: User): string {
    return btoa(user.id + user.email);
  }

  private isEmailAvailable(email: string): Observable<boolean> {
    const encodedEmail = encodeURIComponent(email);
    return this.userStateService.getUsers().pipe(
      map((users) => {
        return !users.some((user) => user.email === email);
      }),
      catchError(error => {
        console.error('Error while checking Email availability:', error);
        return of(false);
      })
    );
  }

  private setAuthToken(token: string): void {
    this.setCookie('auth_token', token, 2);
  }

  private setCookie(name: string, value: string, hours: number): void {
    const date = new Date();
    date.setTime(date.getTime() + hours * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }
}
