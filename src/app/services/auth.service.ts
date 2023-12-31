import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusType, User } from '../models/models';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import * as auth from 'firebase/auth';
import { chats } from '../models/chats-example';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userID: any;
  private userSubject = new BehaviorSubject<any | null>(null);
  user: Observable<any> = this.userSubject.asObservable();

  exampleChats = chats;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public route: ActivatedRoute,
    public userService: UserService
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      this.handleAuthStateChange(user);
    });

    /*
    This function is triggered when the authentication state changes.*/
    this.afAuth.onAuthStateChanged((user) => {
      this.handleAuthStateChangedEvent(user);
    });
  }

  handleAuthStateChange(user: any | null): void {
    if (user) {
      this.userSubject.next(user);
      localStorage.setItem('user', JSON.stringify(user));
      JSON.parse(localStorage.getItem('user')!);
    } else {
      localStorage.setItem('user', 'null');
      JSON.parse(localStorage.getItem('user')!);
    }
  }

  async handleAuthStateChangedEvent(user: any | null) {
    if (user) {
      this.userID = user.uid;
    } else {
      this.router.navigate([`login`]);
    }
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home', user.uid]);
            this.setOnlineStatus('online');
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  setOnlineStatus(status: string) {
    const userRef = this.userService.getUser(this.userID);
    const docRef = this.afs.collection('users').doc(this.userID);
    userRef.pipe(take(1)).subscribe(() => {
      let statusType;
      if (status === 'online') {
        statusType = StatusType.Online;
      } else if (status === 'offline') {
        statusType = StatusType.Offline;
      }
      docRef.update({
        status: status,
      });
    });
  }

  SignUp(email: string, password: string, userName: string, photoURL: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        // this.SendVerificationMail();
        this.SetUserData(result.user, userName, photoURL);
        this.router.navigate([`login`]);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, userName: any, photoURL: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      name: userName,
      photoURL: photoURL,
      chats: {
        channel: [],
        private: [],
      },
      status: user.status !== undefined ? user.status : null,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SignOut() {
    this.setOnlineStatus('offline');
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {});
  }

  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.SetUserData(
          result.user,
          result.user?.displayName,
          'assets/characters/default_character.png'
        );
        this.router.navigate(['home', result.user?.uid]);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  //TODO: Delete Anonym User on log out
  anonymousLogin() {
    return this.afAuth.signInAnonymously().then((result) => {
      this.SetUserData(
        result.user,
        'Guest',
        'assets/characters/default_character.png'
      );
      this.router.navigate(['home', result.user?.uid]);
    });
  }
}
