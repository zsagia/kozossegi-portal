import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UserStateService } from './module/user/state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'kozossegi-portal';

  public constructor(private userStateService: UserStateService) {}

  public ngOnInit(): void {
    this.userStateService.dispatchGetUsers();
  }
}
