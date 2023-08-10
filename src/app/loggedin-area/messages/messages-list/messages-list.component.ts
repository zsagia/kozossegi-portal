import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageContact } from 'src/app/shared/models/message-contact.model';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { UserService } from 'src/app/shared/services/user.service';

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

  constructor(private activatedRoute: ActivatedRoute,
              private messagesService: MessagesService,
              private userService: UserService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.selectedContactId = +params['id'];
      }
    });
    this.getMessageContacts();
  }

  getContacts(): void {
    this.userService.getUsers().subscribe();
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
