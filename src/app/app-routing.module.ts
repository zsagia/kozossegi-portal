import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: 'newsfeed',
    loadChildren: () => import('./newsfeed/newsfeed.module').then(m => m.NewsfeedModul),
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
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/newsfeed'
  },
  {
    path: '**',
    redirectTo: '/newsfeed'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
