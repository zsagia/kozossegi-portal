import { AuthStateService } from 'src/app/auth/service';
import { UserMessage } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { MessagesService } from 'src/app/shared/services/messages.service';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnChanges {
  authenticatedUser!: User | null;
  @Input() public contactId: number | null = null;
  @Input() public contactName: string | null = null;
  public messages: UserMessage[] = [];

  constructor(
    private messagesService: MessagesService,
    private authStateService: AuthStateService
  ) {}

  public loadMessagesForContact(contactId: number | null): void {
    if (contactId === null) return;
    this.messagesService
      .getMessagesWithUser(contactId)
      .subscribe(
        (messages) => (this.messages = messages.sort((a, b) => b.id - a.id))
      );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactId']) {
      this.loadMessagesForContact(this.contactId);
    }
  }

  public ngOnInit(): void {
    this.getAuthenticatedUser();
  }

  private getAuthenticatedUser(): void {
    this.authStateService
      .getAuthenticatedUser()
      .subscribe((user) => (this.authenticatedUser = user));
  }
}
