import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  private users: User[] = [];
  private usersSubscription!: Subscription | null;
  private authenticatedUser!: User | null;
  filteredUsers$!: Observable<User[]> | null;
  filter: string = 'all';

  constructor(private userService: UserService,
              private authService: AuthService,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.getAuthenticatedUser();
    this.userService.getAutheticatedUserFromServer();
    this.getUsers();
  }

  private getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }

  private getUsers(): void {
    this.userService.getUsersFromServer();
    this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.filteredUsers$ = this.getFilteredUsers(this.filter);
      });
  }

  setFilter(filter: string): void {
    this.filter = filter;
    this.filteredUsers$ = this.getFilteredUsers(filter);
  }

  private getFilteredUsers(filter: string): Observable<User[]> {
    if (filter !== 'all') {
      return of(this.users.filter(
        user => user.contactState === filter && user.contactState !== 'own'
      ));
    }
    return of(this.users.filter(user => user.contactState !== 'own'));
  }

  markUser(userId: number): void {
    if (this.authenticatedUser !== null) {
      this.authenticatedUser.markedUsers.push(userId);
      this.userService.updateUser(this.authenticatedUser);
      this.notificationService.addNotification('markUser', this.authenticatedUser.id, userId);
    }
  }

  cancelMark(userId: number): void {
    if (this.authenticatedUser !== null) {
      const indexToRemove = this.authenticatedUser.markedUsers.indexOf(userId);
      if (indexToRemove > -1) {
        this.authenticatedUser.markedUsers.splice(indexToRemove, 1);
      }
      this.userService.updateUser(this.authenticatedUser);
    }
  }

  acceptMark(userId: number): void {
    if (this.authenticatedUser !== null) {
      this.authenticatedUser.contacts.push(userId);
      this.userService.updateUser(this.authenticatedUser);
      this.userService.getUserFromServer(userId).subscribe(
        otherUser => {
          otherUser.contacts.push(this.authenticatedUser!.id);
          const indexToRemove = otherUser.markedUsers.indexOf(this.authenticatedUser!.id);
          if (indexToRemove > -1) {
            otherUser.markedUsers.splice(indexToRemove, 1);
          }
          this.userService.updateUser(otherUser);
        }
      );
    }
  }

  declineMark(userId: number): void {
    if (this.authenticatedUser !== null) {
      this.userService.getUserFromServer(userId).subscribe(
        otherUser => {
          const indexToRemove = otherUser.markedUsers.indexOf(this.authenticatedUser!.id);
          if (indexToRemove > -1) {
            otherUser.markedUsers.splice(indexToRemove, 1);
          }
          this.userService.updateUser(otherUser);
        }
      );
    }
  }

  activate(userId: number): void {
    let userToActivate = this.users.find(user => user.id === userId);
    if (userToActivate) {
      userToActivate.active = true;
      this.userService.updateUser(userToActivate);
    }
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
