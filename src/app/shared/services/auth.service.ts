import { Injectable } from '@angular/core';
import { UserRegData } from '../models/user-reg.model';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, takeWhile } from 'rxjs';
import { UserLoginData } from '../models/user-login.model';
import { Router } from '@angular/router';
import { UserRole } from '../enums/user-role.enum';
import { AuthResponse } from '../models/auth-response.model';

@Injectable()
export class AuthService {
  private authenticatedUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient,
              private router: Router) {}

  getAuthenticatedUser(): Observable<User | null> {
    return this.authenticatedUser$.asObservable();
  }

  checkLogin(): Observable<boolean> {
    return this.authenticatedUser$.pipe(map(user => !!user));
  }

  signUp(user: UserRegData): Observable<any> {
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

  private isEmailAvailable(email: string): Observable<boolean> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get<User[]>('api/users?email=' + encodedEmail).pipe(
      map((users) => {
        return !users.some((user) => user.email === email);
      }),
      catchError(error => {
        console.error('Error while checking Email availability:', error);
        return of(false);
      })
    );
  }

  createUser(user: UserRegData): Observable<User> {
    const newUser = {
      name: user.name,
      email: user.email,
      password: this.encryptPassword(user.password),
      active: false,
      about: '',
      markedUsers: [],
      contacts: [],
      role: UserRole.User
    };
    return this.http.post<User>('api/users', newUser);
  }

  signIn(formUser: UserLoginData): Observable<AuthResponse> {
    const encodedEmail = encodeURIComponent(formUser.email);
    return this.http.get<User[]>('api/users?email=' + encodedEmail)
      .pipe(map(users => {
        const dbUser = users.find(dbUser =>
          dbUser.email === formUser.email &&
          dbUser.password === this.encryptPassword(formUser.password));
        if (!dbUser) {
          this.authenticatedUser$.next(null);
          return { success: false, message: 'Sikertelen bejelentkezés' };
        }
        else if (!dbUser.active) {
          this.authenticatedUser$.next(null);
          return { success: false, message: 'Nem aktivált felhasználó' };
        }
        else {
          this.authenticatedUser$.next(dbUser);
          const token = this.generateToken(dbUser);
          this.setAuthToken(token);
          return { success: true, message: '' }
        }
      }));
  }

  private encryptPassword(password: string): string {
    return btoa(password);
  }

  private generateToken(user: User): string {
    return btoa(user.id + user.email);
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

  signOut(): void {
    this.authenticatedUser$.next(null);
    this.setCookie('auth_token', '', -1);
    this.router.navigate(['/signin']);
  }
}
