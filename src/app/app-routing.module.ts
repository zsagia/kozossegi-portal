import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { LoggedinAreaModule } from './loggedin-area/loggedin-area.module';

const routes: Routes = [
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
  imports: [
    RouterModule.forRoot(routes),
    LoggedinAreaModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
