import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from './news-list/news-list.component';
import { NotificationsComponent } from './news-list/notifications/notifications.component';
import { PostsComponent } from './news-list/posts/posts.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: NewsListComponent,
  }
];

@NgModule({
  declarations: [
    NewsListComponent,
    NotificationsComponent,
    PostsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [RouterModule],
  providers: []
})
export class NewsfeedModul { }
