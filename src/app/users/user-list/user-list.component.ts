import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  private users: User[] = [];
  filter: string = 'all';

  private TEMP_ACT_USER: User; // TODO: törölni!

  filteredUsers$: Observable<User[]>;
  private userSubscription: Subscription | null = null;

  constructor(private userService: UserService) {
    this.getUsers();
    this.TEMP_ACT_USER = this.users[0];
    this.filteredUsers$ = this.getFilteredUsers('all');
  }

  ngOnInit() {
  }

  getUsers(): void {
    this.userSubscription = this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  setFilter(filter: string) {
    this.filter = filter;
    this.filteredUsers$ = this.getFilteredUsers(filter);
  }

  private getFilteredUsers(filter: string): Observable<User[]> {
    const userContacts = this.TEMP_ACT_USER.contacts;
    const markedUserIds = this.TEMP_ACT_USER.markedUsers;
    switch (filter) {
      case 'contacts':
        return of(this.users.filter(user => userContacts.includes(user.id)));
      case 'unknowns':
        return of(this.users.filter(user => !userContacts.includes(user.id)));
      case 'marked':
        return of(this.users.filter(user => markedUserIds.includes(user.id)));
      case 'markedBy':
        return of(this.users.filter(user => user.markedUsers.includes(this.TEMP_ACT_USER.id)));
      default:
        return of(this.users);
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
