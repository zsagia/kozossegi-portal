import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageContact } from 'src/app/shared/models/message-contact.model';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent {
  private messageContactsSubscription!: Subscription | null;
  messageContacts: MessageContact[] = [];

  selectedContactId: number | null = null;
  selectedContactName: string | null = null;

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {
    this.getMessageContacts();
  }

  getMessageContacts(): void {
    this.messageContactsSubscription =
      this.messagesService.getMessageContacts()
        .subscribe(messageContacts => this.messageContacts = messageContacts);
  }

  selectContact(userId: number, userName: string) {
    this.selectedContactId = userId;
    this.selectedContactName = userName;
  }

  send(form: NgForm): void {
    if (form.value.newMessage && this.selectedContactId !== null) {
      this.messagesService.addMessage(form.value.newMessage, this.selectedContactId);
      form.resetForm();
    }
  }

  ngOnDestroy(): void {
    if (this.messageContactsSubscription) {
      this.messageContactsSubscription.unsubscribe();
    }
  }
}
