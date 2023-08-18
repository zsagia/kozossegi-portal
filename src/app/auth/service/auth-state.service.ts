import { map, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { User } from '../../shared/models/user.model';
import { Store } from '../../shared/store';

export interface AuthState {
  authenticatedUser: User | null;
}
export const initialState: AuthState = {
  authenticatedUser: null,
};

@Injectable({providedIn: 'root'})
export class AuthStateService extends Store<AuthState> {
  public constructor() {
    super(initialState);

  }

  public getAuthenticatedUser(): Observable<User | null> {
    return this.getState$().pipe(map((state) => state.authenticatedUser));
  }

  public dispatchUpdateAuthenticatedUser(user: User | null): void {
      this.setState({...this.state, authenticatedUser: user});
  }
}
