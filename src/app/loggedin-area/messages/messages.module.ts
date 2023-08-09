import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { MessageComponent } from './messages-list/message/message.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MessagesListComponent,
  }
];

@NgModule({
  declarations: [
    MessagesListComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [RouterModule]
})
export class MessagesModule { }
