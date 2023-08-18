import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/newsfeed',
  },
  {
    path: 'user-list',
    loadChildren: () => import('./module/user/list/user-list.module').then(m => m.UserListModule),
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'newsfeed',
    loadChildren: () =>
      import('./module/newsfeed/newsfeed.module').then((m) => m.NewsfeedModule),
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('./module/messages/messages.module').then((m) => m.MessagesModule),
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/newsfeed',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
