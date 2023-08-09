import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserMessage } from '../models/message.model';
import { UserService } from './user.service';
import { MessageContact } from '../models/message-contact.model';

@Injectable()
export class MessagesService {
  private messagesSubject$ = new BehaviorSubject<UserMessage[]>([]);
  private users: User[] = [];
  private authenticatedUser!: User | null;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private userService: UserService) {
    this.getAuthenticatedUser();
    this.getUsers();
    this.getMessagesFromServer();
  }

  private getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }

  private getUsers(): void {
    this.userService.getUsersFromServer();
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  private getMessagesFromServer(): void {
    this.http.get<UserMessage[]>('api/messages')
      .pipe(
        map((messages: UserMessage[]) => {
          return messages.map(message => {
            const user = this.users.find(user => user.id === message.fromUser);
            if (user) {
              return { ...message, userName: user.name };
            }
            return message;
          });
        })
      )
      .subscribe(messages => this.messagesSubject$.next(messages));
  }

  getMessageContacts(): Observable<MessageContact[]> {
    return this.messagesSubject$.pipe(
      map(messages => messages.filter(message =>
        message.toUser === this.authenticatedUser!.id)),
      map((messages: UserMessage[]) => {
        const contacts: MessageContact[] = [];
        messages.forEach(message => {
          const user = this.users.find(user => user.id === message.fromUser);
          if (user) {
            const existingContact = contacts.find(contact => contact.userId === user.id);
            if (!existingContact) {
              contacts.push({ userId: user.id, userName: user.name });
            }
          }
        });
        return contacts;
      })
    );
  }

  getMessagesWithUser(userId: number): Observable<UserMessage[]> {
    return this.messagesSubject$.pipe(
      map((messages: UserMessage[]) => {
        return messages.filter(message =>
            (message.fromUser === userId &&
             message.toUser === this.authenticatedUser!.id) ||
            (message.fromUser === this.authenticatedUser!.id &&
             message.toUser === userId)
        );
      })
    );
  }

  addMessage(messageText: string, toUser: number): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const newMessage = {
      fromUser: this.authenticatedUser!.id,
      toUser: toUser,
      message: messageText,
      timestamp: formattedDate,
    };
    this.http.post<UserMessage>('api/messages', newMessage)
      .subscribe(() => this.getMessagesFromServer());
  }

}
