import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';
import { AuthUtilService } from '../auth/service/auth-util.service';
import { AuthStateService } from '../auth/service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authStatusSubscription!: Subscription | null;
  private authUseSubscription!: Subscription | null;
  isAuthenticated: boolean = false;

  authenticatedUser!: User | null;

  constructor(private authUtilService: AuthUtilService, private authStateService: AuthStateService) {}

  ngOnInit() {
    this.authStatusSubscription = this.authUtilService.checkLogin().subscribe(
      isAuth => this.isAuthenticated = isAuth
    );
    this.authUseSubscription = this.authStateService.getAuthenticatedUser().subscribe(
      user => this.authenticatedUser = user
    );
  }

  ngOnDestroy(): void {
    this.authStatusSubscription?.unsubscribe();
    this.authUseSubscription?.unsubscribe();
  }

  logout() {
    this.authUtilService.signOut();
  }

}
