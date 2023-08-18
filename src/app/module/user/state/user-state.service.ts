import {
  combineLatest,
  map,
  Observable,
  takeUntil,
  tap,
} from 'rxjs';

import { Injectable, OnDestroy } from '@angular/core';

import { AuthStateService } from '../../../auth/service';
import { User, UserAdd } from '../../../shared/models/user.model';
import { Store } from '../../../shared/store';
import { UserDataService } from '../data';

export interface UserState {
  users: User[];
}
export const initialState: UserState = {
  users: [],
};

@Injectable()
export class UserStateService extends Store<UserState> implements OnDestroy {
  public constructor(
    private authStateService: AuthStateService,
    private userDataService: UserDataService
  ) {
    super(initialState);
  }

  public dispatchGetUsers(): void {
    this.userDataService
      .getUsers()
      .pipe(
        tap((users) => this.setState({ ...this.getState$(), users })),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  public dispatchCreateUser(user: UserAdd): void {
    this.userDataService
      .createUser(user)
      .pipe(
        tap(() => this.dispatchGetUsers()),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  public dispatchUpdateUser(user: User): void {
    this.userDataService
      .updateUser(user)
      .pipe(
        tap(() => this.dispatchGetUsers()),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  public getUsers(): Observable<User[]> {
    return combineLatest([
      this.authStateService.getAuthenticatedUser(),
      this.getState$(),
    ]).pipe(
      map(([authenticatedUser, state]) => {
        return state.users.map((user, _, users) => {
          user.contactState = this.getUserContactState(authenticatedUser, user, users);

          return user;
        });
      })
    );
  }

  public ngOnDestroy() {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  private getUserContactState(
    authenticatedUser: User | null,
    user: User,
    users: User[]
  ): string {
    if (authenticatedUser) {
      const userContacts =
        users.find((user) => user.id === authenticatedUser!.id)?.contacts || [];
      const markedUserIds =
        users.find((user) => user.id === authenticatedUser!.id)?.markedUsers ||
        [];

      if (user.id !== authenticatedUser.id) {
        if (userContacts.includes(user.id)) {
          return 'contact';
        }

        if (
          !userContacts.includes(user.id) &&
          !markedUserIds.includes(user.id) &&
          !user.markedUsers.includes(authenticatedUser.id) &&
          user.id !== authenticatedUser.id
        ) {
          return 'unknown';
        }

        if (markedUserIds.includes(user.id)) {
          return 'marked';
        }

        if (user.markedUsers.includes(authenticatedUser.id)) {
          return 'markedBy';
        }
      }

      return 'own';
    }

    return '';
  }
}
