import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { AuthStateService } from 'src/app/auth/service';
import { UserStateService } from 'src/app/module/user/state';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MessageContact } from '../models/message-contact.model';
import { UserMessage } from '../models/message.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private authenticatedUser!: User | null;
  private messagesSubject$ = new BehaviorSubject<UserMessage[]>([]);
  private users: User[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthStateService,
    private userStateService: UserStateService
  ) {
    this.getAuthenticatedUser();
    this.getUsers();
    this.getMessagesFromServer();
  }

  public addMessage(messageText: string, toUser: number): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const newMessage = {
      fromUser: this.authenticatedUser!.id,
      toUser: toUser,
      message: messageText,
      timestamp: formattedDate,
    };
    this.http
      .post<UserMessage>('http://localhost:3000/messages', newMessage)
      .subscribe(() => this.getMessagesFromServer());
  }

  public getMessageContacts(): Observable<MessageContact[]> {
    return this.userStateService.getUsers().pipe(
      switchMap((users) => {
        const messageContacts: MessageContact[] = users
          .filter((user) => user.contactState === 'contact')
          .map((user) => ({
            userId: user.id,
            userName: user.name,
          }));
        return of(messageContacts);
      })
    );
  }

  public getMessagesWithUser(userId: number): Observable<UserMessage[]> {
    return this.messagesSubject$.pipe(
      map((messages: UserMessage[]) => {
        return messages.filter(
          (message) =>
            (message.fromUser === userId &&
              message.toUser === this.authenticatedUser!.id) ||
            (message.fromUser === this.authenticatedUser!.id &&
              message.toUser === userId)
        );
      })
    );
  }

  private getAuthenticatedUser(): void {
    this.authService
      .getAuthenticatedUser()
      .subscribe((user) => (this.authenticatedUser = user));
  }

  private getMessagesFromServer(): void {
    this.http
      .get<UserMessage[]>('http://localhost:3000/messages')
      .pipe(
        map((messages: UserMessage[]) => {
          return messages.map((message) => {
            const user = this.users.find(
              (user) => user.id === message.fromUser
            );
            if (user) {
              return { ...message, userName: user.name };
            }
            return message;
          });
        })
      )
      .subscribe((messages) => this.messagesSubject$.next(messages));
  }

  private getUsers(): void {
    this.userStateService.getUsers().subscribe((users) => (this.users = users));
  }
}
