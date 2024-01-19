import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserData } from '../models/models';
import { UserService } from './user.service';
import { Observable, Subscription } from 'rxjs';
import * as auth from 'firebase/auth';
import { PrivateChatService } from '../home/shared/private-chat.service';
import { ChannelChatService } from '../home/shared/channel-chat.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData!: Observable<any>;
  private userDataSubscription!: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private privateChatService: PrivateChatService,
    private channelChatService: ChannelChatService
  ) {
    this.userData = this.afAuth.authState;
    this.subscribeToAuthState();
  }

  /**
   * Subscribes to changes in the authentication state.
   *
   * @private
   */
  private subscribeToAuthState(): void {
    this.userDataSubscription = this.userData.subscribe((user) => {
      if (this.userDataSubscription && !this.userDataSubscription.closed) {
        this.handleAuthStateChange(user);
      }
    });
  }

  /**
   * Handles changes in the authentication state by updating user data and navigating accordingly.
   *
   * @param {any | null} user - The current user or null if not authenticated.
   * @private
   */
  private handleAuthStateChange(user: any | null): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.userService.initializeUserAndChats(user.uid);
    } else {
      localStorage.setItem('user', JSON.stringify(new UserData()));
      this.userService.user = JSON.parse(localStorage.getItem('user')!);
      this.router.navigate([`login`]);
    }
  }

  /**
   * Attempts to sign in the user using email and password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<void>} - A promise indicating the success of the sign-in operation.
   */
  public async SignIn(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.router.navigate(['home', user.uid]);
        }
      });
    } catch (error: any) {
      throw Error('An error occurred during sign-in!', error);
    }
  }

  /**
   * Attempts to sign up a new user with the provided credentials.
   *
   * @param {string} email - The new user's email address.
   * @param {string} password - The new user's password.
   * @param {string} userName - The new user's username.
   * @param {string} photoURL - The URL of the new user's profile photo.
   * @returns {Promise<void>} - A promise indicating the success of the sign-up operation.
   */
  public async SignUp(
    email: string,
    password: string,
    userName: string,
    photoURL: string
  ): Promise<void> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.userService.setUserData(result.user, userName, photoURL);
        this.router.navigate([`login`]);
      })
      .catch((error) => {
        throw Error('An error occurred during sign-up!', error);
      });
  }

  /**
   * Signs out the current user.
   *
   * @returns {Promise<void>} - A promise indicating the success of the sign-out operation.
   */
  public async SignOut(): Promise<void> {
    return this.afAuth.signOut().then((res) => {
      localStorage.removeItem('user');
      this.unsubscribeUserData();
      this.privateChatService.unsubscribePrivateChats();
      this.channelChatService.channelChatsSubscription.unsubscribe();
      this.userService.user = new UserData();
      this.router.navigate(['login']);
    });
  }

  /**
   * Initiates Google authentication.
   *
   * @returns {Promise<void>}
   */
  public async GoogleAuth(): Promise<void> {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {});
  }

  private async AuthLogin(provider: any): Promise<void> {
    return this.afAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        if (result.user) {
          const isUser = await this.userService.isUserInDatabase(
            result.user.uid
          );
          if (!isUser) {
            let url =
              result.user.photoURL ?? 'assets/characters/default_character.png';
            this.userService.setUserData(
              result.user,
              result.user.displayName,
              url
            );
          }
          this.router.navigate(['home', result.user.uid]);
        }
      })
      .catch((error) => {
        throw Error('The app component has thrown an error!', error);
      });
  }

  /**
   * Initiates anonymous login.
   *
   * @returns {Promise<void>} - A promise indicating the success of the anonymous login operation.
   */
  public async anonymousLogin(): Promise<void> {
    return this.afAuth.signInAnonymously().then((result) => {
      this.userService.setUserData(
        result.user,
        'Guest',
        'assets/characters/default_character.png'
      );
      this.router.navigate(['home', result.user?.uid]);
    });
  }

  /**
   * Unsubscribes from user data updates.
   *
   * @returns {void}
   * @private
   */
  private unsubscribeUserData(): void {
    if (this.userDataSubscription && !this.userDataSubscription.closed) {
      this.userDataSubscription.unsubscribe();
    }
  }
}
