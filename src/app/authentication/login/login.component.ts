import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection, onSnapshot } from '@angular/fire/firestore';
import { getAuth, User, GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  [x: string]: any;

  constructor(private UserService: UserService, private _router: Router) {

  }

  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  provider = new GoogleAuthProvider();
  email: string = '';
  password: string = '';
  isEmailFocused: boolean = false;
  isPwFocused: boolean = false;
  pwError: boolean = false;
  mailError: boolean = false;
  loginError: boolean = false;
  requestsError: boolean = false;
  textState: string = 'hidden'; // Initial state


  setNone: boolean = false;
  animationPlayed: boolean = false;
  docRef: any;
  userArr: string[] = [];

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  /* The code block is defining four functions: `onFocusEmail()`, `onFocusPw()`, `onBlurMail()`, and
  `onBlurPw()`. */
  onFocusEmail() {
    this.isEmailFocused = true;
  }

  onFocusPw() {
    this.isPwFocused = true;
  }

  onBlurMail() {
    this.isEmailFocused = false;
  }
  onBlurPw() {
    this.isPwFocused = false;
  }

  /**
   * The `loginUser` function attempts to sign in a user with their email and password, and handles any
   * errors that may occur during the process.
   */
  loginUser() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          this.updateUserDatainService(user);
          this.routeToMainPage();
        }
      })
      .catch((error) => {
        this.checkIfMailError(error.code);
        this.checkIfPasswordError(error.code);
        this.checkIfLoginError(error.code);
        this.checkIfRequestsError(error.code);
      });
  }

  /**
   * The `guestLogin` function navigates to the home page, signs in anonymously, updates user data as a
   * guest, and routes to the main page.
   */
  guestLogin() {
    this._router.navigate(['/home']);
    signInAnonymously(this.auth)
      .then(() => {

        this.updateUserDataAsGuest();
        this.routeToMainPage();
      });
  }

  /* The `googleLogin()` function is used to sign in a user using their Google account. It uses the
  `signInWithPopup()` method from the Firebase Authentication library to open a popup window for the
  user to authenticate with their Google account. Once the user is authenticated, the `result` object
  contains the user information, including their display name, photo URL, email, and unique
  identifier (UID). */
  googleLogin() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const user = result.user;
        if (user) {
          this.updateUserDatainService(user);
          this.checkGoogleInDatabase(user);
          this.routeToMainPage();
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        // The email of the user's account used.
        const email = error.customData.email;

        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  /**
   * The function checks if the error is related to an invalid email and sets a boolean variable
   * accordingly.
   * @param {string} error - A string representing an error code related to email authentication.
   */
  checkIfMailError(error: string) {
    if (error === 'auth/invalid-email') {
      this.mailError = true;
    }
    if (error != 'auth/invalid-email') {
      this.mailError = false;
    }
  }

  /**
   * The function checks if the error is related to a missing password and sets the pwError variable to
   * true if it is.
   * @param {string} error - The `error` parameter is a string that represents an error code or message.
   */
  checkIfPasswordError(error: string) {
    if (error === 'auth/missing-password') {
      this.pwError = true;
    }
  }

  /**
   * The function checks if the error string is 'auth/invalid-login' and sets the loginError variable
   * accordingly.
   * @param {string} error - The error parameter is a string that represents the error message received
   * during a login attempt.
   */
  checkIfLoginError(error: string) {
    if (error === 'auth/invalid-login') {
      this.loginError = true;
    }
    if (error != 'auth/invalid-login') {
      this.loginError = false;
    }
  }

  /**
   * The function checks if the error is 'auth/too-many-requests' and sets the requestsError variable
   * accordingly.
   * @param {string} error - The parameter "error" is a string that represents an error code.
   */
  checkIfRequestsError(error: string) {
    if (error === 'auth/too-many-requests') {
      this.requestsError = true;
    }
    if (error != 'auth/too-many-requests') {
      this.requestsError = false;
    }
  }

  /**
   * The function updates the user data in the UserService with the provided user object.
   * @param {any} user - The `user` parameter is an object that contains the user's information, such as
   * their display name, photo URL, email, and unique identifier (UID).
   */
  updateUserDatainService(user: any) {
    this.UserService.userObject.name = user.displayName;
    this.UserService.userObject.photoURL = user.photoURL;
    this.UserService.userObject.email = user.email;
    this.UserService.userObject.uid = user.uid;
  }

  /**
   * The function updates the user data for a guest user.
   */
  updateUserDataAsGuest() {
    this.UserService.userObject.name = 'Gast';
    this.UserService.userObject.photoURL =
      'assets/characters/default_character.png';
    this.UserService.userObject.email = 'gast@babble.de';
  }

  /**
   * The `subUserList` function retrieves a list of user data from a collection and adds the email
   * addresses to an array.
   * @returns The `subUserList()` function is returning the result of calling `onSnapshot()` on the user
   * collection.
   */
  subUserList() {
    return onSnapshot(this.getUserCollection(), (list) => {
      list.forEach((element) => {
        const userData = element.data();
        this.userArr.push(userData['email']);
      });
    });
  }

  /**
   * The function returns a collection of users from the Firestore database.
   * @returns The function `getUserCollection()` is returning a collection of users from the Firestore
   * database.
   */
  getUserCollection() {
    return collection(this.firestore, 'users');
  }

  /* The `checkGoogleInDatabase(user: User)` function checks if the user's email is not null and if it
  is not already included in the `userArr` array. If the email is not already in the array, it calls
  the `addUserToDatabase(user)` function to add the user to the database. If the email is already in
  the array, it does nothing. */
  checkGoogleInDatabase(user: User) {
    if (user.email != null) {
      if (!this.userArr.includes(user.email)) {
        this.addUserToDatabase(user);
      } else {
      }
    }
  }
  
  async addUserToDatabase(user: User) {
    try {
      const docRef = await addDoc(
        this.getUserCollection(),
        this.UserService.userObject.toJson()
      );
      this.UserService.docId = docRef.id;
    } catch (err) {
      console.error(err);
    }
  }

  routeToMainPage() {
    this._router.navigateByUrl('/home');
  }
}