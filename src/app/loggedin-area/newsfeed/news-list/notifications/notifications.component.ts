import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { UserNotification } from 'src/app/shared/models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  private notificationsSubscription!: Subscription | null;
  notifications: UserNotification[] = [];

  private authenticatedUser!: User | null;

  constructor(private messagesService: MessagesService, private authService: AuthService) {}

  ngOnInit() {
    this.getAuthenticatedUser();
    this.getNotifications();
  }

  private getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser()
    .subscribe(user => this.authenticatedUser = user);
  }

  private getNotifications(): void {
    this.notificationsSubscription = this.messagesService.getNotificationsUpdateListener()
    .subscribe(notifications => this.notifications = notifications);
  }

  close(notificationId: number): void {
    this.messagesService.deleteNotificationById(notificationId);
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }

}
