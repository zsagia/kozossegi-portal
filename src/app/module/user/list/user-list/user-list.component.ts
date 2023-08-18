import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { AuthStateService } from 'src/app/auth/service';
import { User } from 'src/app/shared/models/user.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { UserStateService } from '../../state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  private filter$$: BehaviorSubject<string>;
  private users: User[] = [];
  private usersSubscription!: Subscription | null;

  public authenticatedUser!: User;
  public filter: string = 'all';
  public filteredUsers$!: Observable<User[]>;

  constructor(
    private userStateService: UserStateService,
    private authStateService: AuthStateService,
    private notificationService: NotificationService
  ) {
    this.filter$$ = new BehaviorSubject(this.filter);
  }

  public acceptMark(userId: number): void {
    this.authenticatedUser.contacts.push(userId);
    this.userStateService.dispatchUpdateUser(this.authenticatedUser);

    this.users.forEach((otherUser) => {
      otherUser.contacts.push(this.authenticatedUser!.id);
          const indexToRemove = otherUser.markedUsers.indexOf(this.authenticatedUser!.id);
          if (indexToRemove > -1) {
            otherUser.markedUsers.splice(indexToRemove, 1);
          }
          this.userStateService.dispatchUpdateUser(otherUser);
    })
  }

  public activate(userId: number): void {
    let userToActivate = this.users.find((user) => user.id === userId);
    if (userToActivate) {
      userToActivate.active = true;
      this.userStateService.dispatchUpdateUser(userToActivate);
    }
  }

  public cancelMark(userId: number): void {
    const indexToRemove = this.authenticatedUser.markedUsers.indexOf(userId);
    if (indexToRemove > -1) {
      this.authenticatedUser.markedUsers.splice(indexToRemove, 1);
    }
    this.userStateService.dispatchUpdateUser(this.authenticatedUser);
  }

  public declineMark(user: User): void {
    this.userStateService.dispatchUpdateUser(user);
  }

  public markUser(userId: number): void {
    this.authenticatedUser?.markedUsers.push(userId);
    this.userStateService.dispatchUpdateUser(this.authenticatedUser as User);
    this.notificationService.addNotification('markUser', userId);
  }

  public ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.filteredUsers$ = combineLatest([
      this.userStateService.getUsers(),
      this.filter$$,
      this.authStateService
        .getAuthenticatedUser()
        .pipe(filter((authenticatedUser) => !!authenticatedUser)),
    ]).pipe(
      map(([users, filter, authenticatedUser]) => {
        this.authenticatedUser = authenticatedUser as User;

        return this.filterUsers(filter, users);
      })
    );
  }

  public setFilter(filter: string): void {
    this.filter = filter;
    this.filter$$.next(filter);
  }

  public trackByUserId(index: number, user: User): number {
    return user.id;
  }

  private filterUsers(filter: string, users: User[]): User[] {
    if (filter !== 'all') {
      return users.filter(
        (user) => user.contactState === filter && user.contactState !== 'own'
      );
    }

    return users.filter((user) => user.contactState !== 'own');
  }
}
