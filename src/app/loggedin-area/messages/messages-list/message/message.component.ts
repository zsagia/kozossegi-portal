import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserMessage } from 'src/app/shared/models/message.model';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnChanges {
  @Input() contactId: number | null = null;
  messages: UserMessage[] = [];

  constructor(private messagesService: MessagesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactId']) {
      this.loadMessagesForContact(this.contactId);
    }
  }

  loadMessagesForContact(contactId: number | null): void {
    if (contactId === null) return;
    this.messagesService.getMessagesWithUser(contactId)
      .subscribe(messages => this.messages = messages.sort((a, b) => b.id - a.id));
  }

}
