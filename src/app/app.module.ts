import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AuthenticationModule } from './authentication/authentication.module';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
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
export class AppModule { }