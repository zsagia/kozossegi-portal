import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../shared/guard/auth.guard';
import { MessagesService } from '../shared/services/messages.service';
import { UserService } from '../shared/services/user.service';
import { NotificationService } from '../shared/services/notification.service';
import { PostService } from '../shared/services/post.service';

const routes: Routes = [
  {
    path: 'newsfeed',
    loadChildren: () => import('./newsfeed/newsfeed.module').then(m => m.NewsfeedModule),
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UserModule),
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule),
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [
    MessagesService,
    NotificationService,
    PostService,
    UserService
  ]
})
export class LoggedinAreaModule { }
