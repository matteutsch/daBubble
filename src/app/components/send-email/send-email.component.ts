import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('hidden', style({ transform: 'translateX(0%)' })),
      state('visible', style({ transform: 'translateX(150%)' })),
      transition('hidden => visible', animate('0.5s ease-in')),
      transition('visible => hidden', animate('0.5s ease-out')),
    ]),
  ],
})
export class SendEmailComponent {
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  email: string = '';
  isEmailFocused: boolean = false;
  mailError: boolean = false;
  animationState: string = 'hidden';
  showAnimationContainer: boolean = false;

  constructor(private UserService: UserService, private _router: Router) {
    this.auth.languageCode = 'de';
  }

  /* The code you provided is a TypeScript class that represents a component in an Angular application.
  Here's a breakdown of what each method does: */
  onFocusEmail() {
    this.isEmailFocused = true;
  }

/**
 * The function onBlurMail sets the isEmailFocused variable to false.
 */
  onBlurMail() {
    this.isEmailFocused = false;
  }

/**
 * The `recoverUser` function sends a password reset email to the user's email address, starts an
 * animation, and routes the user to the login page if the email is valid.
 */
  recoverUser() {
    if (this.mailIsValid()) {
      sendPasswordResetEmail(this.auth, this.email)
        .then(() => {
          this.startAnimation();
          this.routeToLogin();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('Error during password reset:', errorCode, errorMessage);
        });
    }
  }

  /**
   * The function checks if the email is valid by ensuring it has a length greater than 3 and includes
   * the '@' symbol.
   * @returns a boolean value. It returns true if the email is valid (length is greater than 3 and
   * contains '@'), and false otherwise.
   */
  mailIsValid() {
    if (this.email.length > 3 && this.email.includes('@')) {
      this.mailError = false;
      return true;
    }
    if (this.email.length <= 3 || !this.email.includes('@')) {
      this.mailError = true;
      return false;
    }
    return false;
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

  /* The `routeToLogin()` function is used to navigate the user to the login page after a delay of 1500
  milliseconds (1.5 seconds). It uses the Angular `Router` service to navigate to the specified URL,
  which in this case is '/login'. The `setTimeout()` function is used to delay the navigation by the
  specified time. */
  routeToLogin() {
    setTimeout(() => {
      this._router.navigateByUrl('/login');
    }, 1500);
  }
}
