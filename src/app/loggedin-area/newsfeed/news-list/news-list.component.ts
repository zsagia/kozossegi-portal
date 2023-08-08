import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsComponent } from './posts/posts.component';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent {
  @ViewChild('postForm') postForm!: NgForm;
  @ViewChild('postsComponentRef', { static: false }) postsComponent!: PostsComponent;

  constructor(private messagesService: MessagesService) {}

  send(form: NgForm): void {
    if (form.value.newPost) {
      this.messagesService.addPost(form.value.newPost);
      form.resetForm();
    }
  }
}
