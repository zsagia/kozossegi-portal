import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { UserMessage } from '../models/message.model';
import { UserService } from './user.service';
import { MessageContact } from '../models/message-contact.model';

/* Az Üzenetek képernyőt kiszolgáló szerviz */

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

  // Lekérdezi az összes üzenetet a szerverről
  // Kiegészíti mindet a userName-el
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

  // Az Üzenetek képernyő bal oldali oszlopát szolgálja ki
  getMessageContacts(): Observable<MessageContact[]> {
    return this.userService.getUsers().pipe(
      switchMap(users => {
        const messageContacts: MessageContact[] = users
          .filter(user => user.contactState === 'contact')
          .map(user => ({
            userId: user.id,
            userName: user.name
          }));
        return of(messageContacts);
      })
    );
  }

  // Adott kontakthoz tartazó üzenetek
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

  // Üzenet küldési user-nek, majd a teljes lista frissítése
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
