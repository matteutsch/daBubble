import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from './components/home/home.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogCreateChannelComponent } from './shared/dialog-create-channel/dialog-create-channel.component';
import { ChatChannelComponent } from './components/chat-channel/chat-channel.component';
import { ChannelMessageComponent } from './shared/channel-message/channel-message.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';
import { CustomTextareaComponent } from './shared/custom-textarea/custom-textarea.component';
import { ThreadComponent } from './components/thread/thread.component';
import { DialogEditChannelComponent } from './shared/dialog-edit-channel/dialog-edit-channel.component';
import { MatMenuModule } from '@angular/material/menu';
import { ThreadMessageComponent } from './shared/thread-message/thread-message.component';
import { MainChatComponent } from './components/main-chat/main-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SidebarComponent,
    HomeComponent,
    DialogCreateChannelComponent,
    ChatChannelComponent,
    ChannelMessageComponent,
    CustomTextareaComponent,
    ThreadComponent,
    DialogEditChannelComponent,
    ThreadMessageComponent,
    MainChatComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatInputModule,
    AppRoutingModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSidenavModule,
    MatDialogModule,
    MatTooltipModule,
    MtxTooltipModule,
    MatMenuModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble-a4d50',
        appId: '1:748766129558:web:35deae58792d029fe3c1b7',
        storageBucket: 'dabubble-a4d50.appspot.com',
        apiKey: 'AIzaSyDVMt0LFYltUGd0ecMh4__0KEy4sXltY4Q',
        authDomain: 'dabubble-a4d50.firebaseapp.com',
        messagingSenderId: '748766129558',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
