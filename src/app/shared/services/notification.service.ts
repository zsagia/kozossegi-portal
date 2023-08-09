import { Injectable } from '@angular/core';
import { UserNotification } from '../models/notification.model';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable()
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<UserNotification[]>([]);
  private authenticatedUser!: User | null;

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this.getAuthenticatedUser();
    this.getNotificationsFromServer();
  }

  private getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }

  private getNotificationsFromServer(): void {
    this.http.get<UserNotification[]>('api/notifications')
      .pipe(map(notifications =>
        notifications.filter(
          notification => notification.forUser === this.authenticatedUser!.id))
      )
      .subscribe(notifications => this.notificationsSubject.next(notifications));
  }

  getNotificationsUpdateListener(): Observable<UserNotification[]> {
    return this.notificationsSubject.asObservable();
  }

  deleteNotificationById(notificationId: number) {
    this.http.delete<void>('api/notifications/' + notificationId).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.getValue();
        const updatedNotifications = currentNotifications.filter(
          notification => notification.id !== notificationId
        );
        this.notificationsSubject.next(updatedNotifications);
      })
    ).subscribe();
  }

  addNotification(type: string, fromUser: number, forUser: number): void {
    let message;
    switch (type) {
      case 'markUser':
        message = `Új ismerősnek jelölés: ${fromUser}`;
        break;
      case 'markUser':
        message = `Új üzenet tőle: ${fromUser}`;
        break;
      default:
        message = '';
        break;
    }
    if (message.length) {
      const notification = {
        forUser: forUser,
        message: message
      };
      this.http.post<UserNotification>('api/notifications', notification)
        .subscribe(savedNotification => {
          const updatedNotifications = this.notificationsSubject.getValue();
          updatedNotifications.push(savedNotification);
          this.notificationsSubject.next(updatedNotifications);
        });
    }
  }

  resetNotifications() {
    this.notificationsSubject.next([]);
  }
}
