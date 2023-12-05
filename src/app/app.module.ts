import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';
import { AuthenticationModule } from './authentication/authentication.module';
import { HomeModule } from './home/home.module';
import { DialogAddMembersComponent } from './shared/dialog-add-members/dialog-add-members.component';
import { DialogCreateChannelComponent } from './shared/dialog-create-channel/dialog-create-channel.component';
import { DialogEditChannelComponent } from './shared/dialog-edit-channel/dialog-edit-channel.component';
import { DialogMembersComponent } from './shared/dialog-members/dialog-members.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogCreateChannelComponent,
    DialogEditChannelComponent,
    DialogMembersComponent,
    DialogAddMembersComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatInputModule,
    AppRoutingModule,
    MatBadgeModule,
    MatExpansionModule,
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
    AuthenticationModule,
    HomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
