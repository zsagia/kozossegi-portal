import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, Subscription, map, tap } from 'rxjs';
import { UserNotification } from '../models/notification.model';
import { Post } from '../models/post.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private notificationsSubject = new BehaviorSubject<UserNotification[]>([]);
  private postsSubject = new BehaviorSubject<Post[]>([]);
  private users: User[] = [];
  private usersSubscription!: Subscription | null;
  private authenticatedUser!: User | null;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private userService: UserService) {
    this.getAuthenticatedUser();
    this.getUsers();
    this.getNotificationsFromServer();
    this.getPostsFromServer();
  }

  private getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }
  private getUsers(): void {
    this.usersSubscription = this.userService.getUsersUpdateListener()
    .subscribe(users => {
      this.users = users;
    });
  }

  private getNotificationsFromServer(): void {
    this.http.get<UserNotification[]>('api/notifications')
      .pipe(map(notifications =>
        notifications.filter(
          notification => notification.forUser === this.authenticatedUser!.id))
      )
      .subscribe(notifications => this.notificationsSubject.next(notifications));
  }
  getNotificationsUpdateListener(): Observable<UserNotification[]> {
    return this.notificationsSubject.asObservable();
  }
  deleteNotificationById(notificationId: number) {
    this.http.delete<void>('api/notifications/' + notificationId).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.getValue();
        const updatedNotifications = currentNotifications.filter(
          notification => notification.id !== notificationId
        );
        this.notificationsSubject.next(updatedNotifications);
      })
    ).subscribe();
  }
  addNotification(type: string, fromUser: number, forUser: number): void {
    let message;
    switch (type) {
      case 'markUser':
        message = `Új ismerősnek jelölés: ${fromUser}`;
        break;
      case 'markUser':
        message = `Új üzenet tőle: ${fromUser}`;
        break;
      default:
        message = '';
        break;
    }
    if (message.length) {
      const notification = {
        forUser: forUser,
        message: message
      };
      this.http.post<UserNotification>('api/notifications', notification)
        .subscribe(savedNotification => {
          const updatedNotifications = this.notificationsSubject.getValue();
          updatedNotifications.push(savedNotification);
          this.notificationsSubject.next(updatedNotifications);
        });
    }
  }

  private getPostsFromServer(): void {
    this.http.get<Post[]>('api/posts')
      .pipe(
        map((posts: Post[]) => {
          return posts.map(post => {
            const user = this.users.find(user => user.id === post.fromUser);
            if (user) {
              return { ...post, userName: user.name };
            }
            return post;
          });
        })
      )
      .subscribe(posts => this.postsSubject.next(posts));
  }
  getPostsUpdateListener(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }
  addPost(postText: string): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const newPost = {
      fromUser: this.authenticatedUser!.id,
      timestamp: formattedDate,
      text: postText
    };
    this.http.post<Post>('api/posts', newPost).subscribe(savedPost => {
      const updatedPosts = this.postsSubject.getValue();
      updatedPosts.push(savedPost);
      this.postsSubject.next(updatedPosts);
    });
  }

}
