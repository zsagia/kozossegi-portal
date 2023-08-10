import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSubscription!: Subscription | null;
  private authUseSubscription!: Subscription | null;
  isAuthenticated: boolean = false;

  authenticatedUser!: User | null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSubscription = this.authService.checkLogin().subscribe(
      isAuth => this.isAuthenticated = isAuth
    );
    this.authUseSubscription = this.authService.getAuthenticatedUser().subscribe(
      user => this.authenticatedUser = user
    );
  }

  ngOnDestroy(): void {
    this.authStatusSubscription?.unsubscribe();
    this.authUseSubscription?.unsubscribe();
  }

  logout() {
    this.authService.signOut();
  }

}
