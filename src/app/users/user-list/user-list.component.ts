import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

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

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
    this.userService.getUsersFromServer();
    this.usersSubscription = this.userService.getUsersUpdateListener()
      .subscribe(users => {
        this.users = users;
        this.filteredUsers$ = this.getFilteredUsers('all');
      });
  }

  setFilter(filter: string) {
    this.filter = filter;
    this.filteredUsers$ = this.getFilteredUsers(filter);
  }

  private getFilteredUsers(filter: string): Observable<User[]> {
    if (filter !== 'all') {
      return of(this.users.filter(user => user.contactState === filter));
    }
    return of(this.users.filter(user => user.contactState !== 'own'));
  }

  markUser(userId: number) {
    if (this.authenticatedUser !== null) {
      this.authenticatedUser.markedUsers.push(userId)
      this.userService.updateUser(this.authenticatedUser);
    }
  }
  cancelMark(userId: number) {
    if (this.authenticatedUser !== null) {
      const indexToRemove = this.authenticatedUser.markedUsers.indexOf(userId);
      if (indexToRemove > -1) {
        this.authenticatedUser.markedUsers.splice(indexToRemove, 1);
      }
      this.userService.updateUser(this.authenticatedUser);
    }
  }
  acceptMark(userId: number) {
    if (this.authenticatedUser !== null) {
      this.authenticatedUser.contacts.push(userId);
      this.userService.updateUser(this.authenticatedUser);

      this.userService.getUser(userId).subscribe(
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
  declineMark(userId: number) {
    if (this.authenticatedUser !== null) {
      this.userService.getUser(userId).subscribe(
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

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
