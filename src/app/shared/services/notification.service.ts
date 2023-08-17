import { Injectable } from '@angular/core';
import { UserNotification } from '../models/notification.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

/* "Új jelölés" és "Új üzenet" értesítésekért felelős az Üzenőfal képernyőn */

@Injectable()
export class NotificationService {
  private notificationsSubject$ = new BehaviorSubject<UserNotification[]>([]);
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

  // Értesítések lekérdezése a szerverről
  getNotificationsFromServer(): void {
    this.http.get<UserNotification[]>('api/notifications')
      .pipe(map(notifications =>
        notifications.filter(
          notification => notification.forUser === this.authenticatedUser!.id))
      )
      .subscribe(notifications => this.notificationsSubject$.next(notifications));
  }

  // Értesítések kiajánlása
  getNotifications(): Observable<UserNotification[]> {
    return this.notificationsSubject$.asObservable();
  }

  // Egy adott értesítés törlése
  deleteNotificationById(notificationId: number): void {
    this.http.delete<void>('api/notifications/' + notificationId)
      .subscribe(() => this.getNotificationsFromServer());
  }

  // Egy adott értesítés hozzáadása
  addNotification(type: string, forUser: number): void {
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
        message: message
      };
      this.http.post<UserNotification>('api/notifications', notification)
        .subscribe(() => this.getNotificationsFromServer());
    }
  }

  // Értesítések ürítése
  resetNotifications() {
    this.notificationsSubject$.next([]);
  }
}
