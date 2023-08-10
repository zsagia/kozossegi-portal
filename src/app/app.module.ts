import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';

import { DbMockService } from './shared/mock/inmemorydb.service';
import { AuthService } from './shared/services/auth.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MessagesService } from './shared/services/messages.service';
import { NotificationService } from './shared/services/notification.service';
import { PostService } from './shared/services/post.service';
import { UserService } from './shared/services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    InMemoryWebApiModule.forRoot(DbMockService, { delay: 0 })
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
