import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsComponent } from './posts/posts.component';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent {
  @ViewChild('postForm') postForm!: NgForm;
  @ViewChild('postsComponentRef', { static: false }) postsComponent!: PostsComponent;

  constructor(private postService: PostService) {}

  send(form: NgForm): void {
    if (form.value.newPost) {
      this.postService.addPost(form.value.newPost);
      form.resetForm();
    }
  }
}
