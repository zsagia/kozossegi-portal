import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserMessage } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {
  authenticatedUser!: User | null;
  @Input() contactId: number | null = null;
  @Input() contactName: string | null = null;
  messages: UserMessage[] = [];

  constructor(private messagesService: MessagesService,
              private authService: AuthService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactId']) {
      this.loadMessagesForContact(this.contactId);
    }
  }

  ngOnInit(): void {
    this.getAuthenticatedUser();
  }

  private getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }

  loadMessagesForContact(contactId: number | null): void {
    if (contactId === null) return;
    this.messagesService.getMessagesWithUser(contactId)
      .subscribe(messages => this.messages = messages.sort((a, b) => b.id - a.id));
  }

}
