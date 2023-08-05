import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  private users: User[] = [];
  private userSubscription: Subscription | null = null;
  private authenticatedUser: User;

  filteredUsers$: Observable<User[]> | null = null;
  filter: string = 'all';

  constructor(private userService: UserService, private authService: AuthService) {
    this.authenticatedUser = this.authService.getAuthenticatedUser();
  }

  ngOnInit() {
    this.userService.getUsersFromServer();
    this.userSubscription = this.userService.getUsersUpdateListener()
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
    this.userService.getUser(this.authenticatedUser.id).subscribe(
      currentUser => {
        currentUser.markedUsers.push(userId);
        this.userService.updateUser(currentUser);
      }
    );
  }
  cancelMark(userId: number) {
    this.userService.getUser(this.authenticatedUser.id).subscribe(
      currentUser => {
        const indexToRemove = currentUser.markedUsers.indexOf(userId);
        if (indexToRemove > -1) {
          currentUser.markedUsers.splice(indexToRemove, 1);
        }
        this.userService.updateUser(currentUser);
      }
    );
  }
  acceptMark(userId: number) {
    this.userService.getUser(this.authenticatedUser.id).subscribe(
      currentUser => {
        currentUser.contacts.push(userId);
        this.userService.updateUser(currentUser);
      }
    );
    this.userService.getUser(userId).subscribe(
      otherUser => {
        otherUser.contacts.push(this.authenticatedUser.id);
        const indexToRemove = otherUser.markedUsers.indexOf(this.authenticatedUser.id);
        if (indexToRemove > -1) {
          otherUser.markedUsers.splice(indexToRemove, 1);
        }
        this.userService.updateUser(otherUser);
      }
    );
  }
  declineMark(userId: number) {
    this.userService.getUser(userId).subscribe(
      otherUser => {
        const indexToRemove = otherUser.markedUsers.indexOf(this.authenticatedUser.id);
        if (indexToRemove > -1) {
          otherUser.markedUsers.splice(indexToRemove, 1);
        }
        this.userService.updateUser(otherUser);
      }
    );
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
