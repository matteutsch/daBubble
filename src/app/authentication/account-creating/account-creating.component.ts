import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from 'firebase/auth';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-account-creating',
  templateUrl: './account-creating.component.html',
  styleUrls: ['./account-creating.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('hidden', style({ transform: 'translateX(0%)' })),
      state('visible', style({ transform: 'translateX(150%)' })),
      transition('hidden => visible', animate('0.5s ease-in')),
      transition('visible => hidden', animate('0.5s ease-out')),
    ]),
  ],
})
export class AccountCreatingComponent implements OnInit {
  constructor(private _router: Router, private UserService: UserService) {}

  ngOnInit() {}

  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  name: string = '';
  email: string = '';
  password: string = '';
  isNameFocused: boolean = false;
  isEmailFocused: boolean = false;
  isPwFocused: boolean = false;
  nameError: boolean = false;
  mailError: boolean = false;
  pwError: boolean = false;
  showAnimationContainer: boolean = false;
  animationState: string = 'hidden';

 /* These functions are event handlers for the focus and blur events on the name, email, and password
 input fields. */
  onFocusName() {
    this.isNameFocused = true;
  }

  onFocusEmail() {
    this.isEmailFocused = true;
  }

  onFocusPw() {
    this.isPwFocused = true;
  }

  onBlurName() {
    this.isNameFocused = false;
  }

  onBlurMail() {
    this.isEmailFocused = false;
  }

  onBlurPw() {
    this.isPwFocused = false;
  }
  
  /**
   * The function registers a user by creating an account with email and password, and then performs
   * various checks and actions based on the result.
   */
  registerUser() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.email) {
          this.updateUserDatainService(user);
          this.addUserToDatabase(user);
          this.routeToAvatarSelection();
        }
      })
      .catch((error) => {
        this.checkIfNameError();
        this.checkIfEmailError();
        this.checkIfPwError();
        if (this.noError()) {
          this.mailError = true;
        }
      });
  }

  /**
   * The function checks if the length of the name is less than 1 and sets the nameError flag
   * accordingly.
   */
  checkIfNameError() {
    if (this.name.length < 1) {
      this.nameError = true;
    }
    if (this.name.length > 1) {
      this.nameError = false;
    }
  }

  /**
   * The function checks if there are no errors in the mail, password, and name fields.
   * @returns a boolean value. If all three error conditions (mailError, pwError, and nameError) are
   * false, then the function will return true. Otherwise, it will return false.
   */
  noError() {
    if (!this.mailError && !this.pwError && !this.nameError) {
      return true;
    } else {
      return false;
    }
  }

 /**
  * The function checks if the email address contains the '@' symbol and sets the mailError variable
  * accordingly.
  */
  checkIfEmailError() {
    if (this.email.includes('@')) {
      this.mailError = false;
    }
    if (!this.email.includes('@')) this.mailError = true;
  }

  /**
   * The function checks if the password length is less than 8 characters and sets a boolean flag
   * accordingly.
   */
  checkIfPwError() {
    if (this.password.length < 8) {
      this.pwError = true;
      if (this.password.length >= 8) {
        this.pwError = false;
      }
    }
  }

  /**
   * The function starts an animation by setting the animation container to be visible and then changes
   * the animation state to hidden after a delay of 500 milliseconds.
   */
  startAnimation() {
    this.showAnimationContainer = true;
    this.animationState = 'visible';
    setTimeout(() => {
      this.animationState = 'hidden';
    }, 500);
  }

  routeToAvatarSelection() {
    setTimeout(() => {
      this._router.navigateByUrl('/choose-avatar');
    }, 1500);
  }

  /**
   * The function `addUserToDatabase` adds a user object to a database collection using Firestore in
   * TypeScript.
   * @param {User} user - The `user` parameter is an object of type `User`.
   */
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

  /**
   * The function returns a collection of users from the Firestore database.
   * @returns The function `getUserCollection()` is returning a collection of users from the Firestore
   * database.
   */
  getUserCollection() {
    return collection(this.firestore, 'users');
  }

  /**
   * The function updates the user data in the UserService with the provided user object.
   * @param {any} user - The "user" parameter is an object that contains information about a user, such
   * as their email and unique identifier (uid).
   */
  updateUserDatainService(user: any) {
    this.UserService.userObject.name = this.name;
    this.UserService.userObject.email = user.email;
    this.UserService.userObject.uid = user.uid;
  }


}
