import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { AuthStateService } from 'src/app/auth/service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserNotification } from '../models/notification.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private authenticatedUser!: User | null;
  private notificationsSubject$ = new BehaviorSubject<UserNotification[]>([]);

  constructor(
    private http: HttpClient,
    private authStateService: AuthStateService
  ) {}

  public addNotification(type: string, forUser: number): void {
    let message;
    switch (type) {
      case 'markUser':
        message = `Új ismerősnek jelölés tőle: ${this.authenticatedUser?.name}`;
        break;
      case 'markUser':
        message = `Új üzenet tőle: ${this.authenticatedUser?.name}`;
        break;
      default:
        message = '';
        break;
    }
    if (message.length) {
      const notification = {
        forUser: forUser,
        message: message,
      };
      this.http
        .post<UserNotification>(
          'http://localhost:3000/notifications',
          notification
        )
        .subscribe(() => this.getNotificationsFromServer());
    }
  }

  public deleteNotificationById(notificationId: number): void {
    this.http
      .delete<void>('http://localhost:3000/notifications/' + notificationId)
      .subscribe(() => this.getNotificationsFromServer());
  }

  public getNotifications(): Observable<UserNotification[]> {
    return this.notificationsSubject$;
  }

  public getNotificationsFromServer(): void {
    this.http
      .get<UserNotification[]>('http://localhost:3000/notifications')
      .pipe(
        switchMap((notifications) =>
          this.authStateService
            .getAuthenticatedUser()
            .pipe(
              map((authenticatedUser) => ({ authenticatedUser, notifications }))
            )
        ),
        switchMap(({ authenticatedUser, notifications }) =>
          of(
            notifications.filter(
              (notification) => notification.forUser === authenticatedUser!.id
            )
          )
        )
      )
      .subscribe((notifications) =>
        this.notificationsSubject$.next(notifications)
      );
  }

  public resetNotifications() {
    this.notificationsSubject$.next([]);
  }
}
