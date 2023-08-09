import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserNotification } from 'src/app/shared/models/notification.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationsSubscription!: Subscription | null;
  notifications: UserNotification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.resetNotifications();
    this.getNotifications();
  }

  private resetNotifications() {
    this.notificationService.resetNotifications();
  }

  private getNotifications(): void {
    this.notificationsSubscription = this.notificationService.getNotifications()
    .subscribe(notifications => this.notifications = notifications);
  }

  close(notificationId: number): void {
    this.notificationService.deleteNotificationById(notificationId);
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }

}
