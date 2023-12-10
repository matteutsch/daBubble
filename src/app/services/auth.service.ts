import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/models';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { UserService } from './user.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userID: any;
  private userSubject = new BehaviorSubject<any | null>(null);
  user: Observable<any> = this.userSubject.asObservable();

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
      console.log('auth log out user:', this.user);
    }
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home', user.uid]);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SignUp(email: string, password: string, userName: string, photoURL: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(' created userDATA:', result);

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
      chats: user.chats !== undefined ? user.chats : null,
      status: user.status !== undefined ? user.status : null,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
