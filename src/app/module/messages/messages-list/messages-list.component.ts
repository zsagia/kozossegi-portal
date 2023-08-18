import {
  combineLatest,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MessageContact } from 'src/app/shared/models/message-contact.model';
import { MessagesService } from 'src/app/shared/services/messages.service';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserStateService } from '../../user/state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
})
export class MessagesListComponent {
  public messageContacts$!: Observable<MessageContact[]>;
  public selectedContactId: number | null = null;
  public selectedContactName: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messagesService: MessagesService,
    private userStateService: UserStateService
  ) {}

  public getContacts(): void {
    this.userStateService.getUsers().subscribe();
  }

  public ngOnInit() {
    this.messageContacts$ = combineLatest([
      this.activatedRoute.params.pipe(
        tap((params) => {
          if (params['id']) {
            this.selectedContactId = +params['id'];
          }
        })
      ),
      this.messagesService.getMessageContacts(),
    ]).pipe(switchMap(([_, messageContacts]) => {
      return of(messageContacts);
    }));
  }

  public selectContact(userId: number, userName: string) {
    this.selectedContactId = userId;
    this.selectedContactName = userName;
  }

  public send(form: NgForm): void {
    if (form.value.newMessage && this.selectedContactId !== null) {
      this.messagesService.addMessage(
        form.value.newMessage,
        this.selectedContactId
      );
      form.resetForm();
    }
  }
}
