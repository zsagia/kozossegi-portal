import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { Post } from 'src/app/shared/models/post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
  private postsSubscription!: Subscription | null;
  posts: Post[] = [];

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts(): void {
    this.postsSubscription = this.messagesService.getPostsUpdateListener()
    .subscribe(posts => this.posts = posts.sort((a, b) => b.id - a.id));
  }

  addPost(postText: string): void {
    this.messagesService.addPost(postText);
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

}
