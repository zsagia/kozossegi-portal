import { Observable, Subscription } from 'rxjs';
import { UserNotification } from 'src/app/shared/models/notification.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  public notifications$!: Observable<UserNotification[]>;

  constructor(private notificationService: NotificationService) {}

  public close(notificationId: number): void {
    this.notificationService.deleteNotificationById(notificationId);
  }

  public ngOnDestroy(): void {
  }

  public ngOnInit() {
    this.resetNotifications();
    this.notificationService.getNotificationsFromServer();
    this.getNotifications();
  }

  private getNotifications(): void {
    this.notifications$ = this.notificationService.getNotifications();
  }

  private resetNotifications() {
    this.notificationService.resetNotifications();
  }
}
