import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { Post } from '../models/post.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable()
export class PostService {
  private postsSubject$ = new BehaviorSubject<Post[]>([]);
  private users: User[] = [];
  private authenticatedUser!: User | null;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private userService: UserService) {
    this.getAuthenticatedUser();
    this.getUsers();
    this.getPostsFromServer();
  }

  private getAuthenticatedUser(): void {
    this.authService.getAuthenticatedUser()
      .subscribe(user => this.authenticatedUser = user);
  }

  private getUsers(): void {
    this.userService.getUsersFromServer();
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  private getPostsFromServer(): void {
    // this.getAuthenticatedUser();
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
      .subscribe(posts => this.postsSubject$.next(posts));
  }

  getPosts(): Observable<Post[]> {
    return this.postsSubject$.asObservable();
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
      const updatedPosts = this.postsSubject$.getValue();
      updatedPosts.push(savedPost);
      this.getPostsFromServer();
    });
  }

}
