import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UserModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/users'
  },
  {
    path: '**',
    redirectTo: '/users'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
