import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from '@angular/fire/auth';
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('hidden', style({ transform: 'translateX(0%)' })),
      state('visible', style({ transform: 'translateX(150%)' })),
      transition('hidden => visible', animate('0.5s ease-in')),
      transition('visible => hidden', animate('0.5s ease-out')),
    ]),
  ],
})

export class ResetPasswordComponent {
  isPwFocusedFirst: boolean = false;
  isPwFocusedSecond: boolean = false;
  newPassword: string = '';
  confirmedPassword: string = '';
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  oobCode: string = '';
  pwMatch: boolean = true;
  passwordLengthError: boolean = false;
  showAnimationContainer: boolean = false;
  animationState: string = 'hidden';

  constructor(private route: ActivatedRoute, private _router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.oobCode = params['oobCode'];
    });
  }

 /* The `onFocusPwFirst()` function is triggered when the password input field gains focus. It sets the
 `isPwFocusedFirst` variable to `true`, indicating that the password input field is currently
 focused. */
  onFocusPwFirst() {
    this.isPwFocusedFirst = true;
  }

  onBlurPwFirst() {
    this.isPwFocusedFirst = false;
  }

  onFocusPwSecond() {
    this.isPwFocusedSecond = true;
  }

  onBlurPwSecond() {
    this.isPwFocusedSecond = false;
  }

 /**
  * The function checks if the password matches, if it is long enough, and then changes the password if
  * all conditions are met, otherwise it displays an error message.
  */
  resetPassword() {
    if (this.passwordMatches()) {
      this.setPasswordMatchesToTrue();
      if (this.passwordLengthTooShort()) {
        this.setPasswordLengthError();
      }
      if (this.passwordLengthIsEnough()) {
        this.changePassword();
      }
    } else {
      this.passwordsDontMatch();
    }
  }

 /**
  * The function `changePassword()` is used to reset a user's password and then navigate to the login
  * page.
  */
  changePassword() {
    confirmPasswordReset(this.auth, this.oobCode, this.newPassword)
      .then(() => {
        this.startAnimation();
        this.routeToLogin();
      })
      .catch((error) => {
        console.error('Password reset error:', error);
      });
  }

/**
 * The function "passwordsDontMatch" sets the variable "pwMatch" to false.
 */
  passwordsDontMatch() {
    this.pwMatch = false;
  }

/**
 * The function checks if the length of both the new password and the confirmed password is at least 8
 * characters.
 * @returns a boolean value. If both the length of the new password and the confirmed password are
 * greater than or equal to 8, it will return true. Otherwise, it will return false.
 */
  passwordLengthIsEnough() {
    if (this.newPassword.length >= 8 && this.confirmedPassword.length >= 8) {
      return true;
    } else {
      return false;
    }
  }

/**
 * The function checks if the length of both the new password and the confirmed password is less than 8
 * characters.
 * @returns a boolean value. If both the length of the new password and the confirmed password are less
 * than 8 characters, it will return true. Otherwise, it will return false.
 */
  passwordLengthTooShort() {
    if (this.newPassword.length < 8 && this.confirmedPassword.length < 8) {
      return true;
    }
    return false;
  }

/**
 * The function sets a flag to indicate that there is an error with the password length.
 */
  setPasswordLengthError() {
    this.passwordLengthError = true;
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

 /**
  * The function `routeToLogin()` uses a timeout to navigate to the '/login' route after a delay of
  * 1500 milliseconds.
  */
  routeToLogin() {
    setTimeout(() => {
      this._router.navigateByUrl('/login');
    }, 1500);
  }

/**
 * The function checks if the new password matches the confirmed password.
 * @returns a boolean value. If the `newPassword` is equal to the `confirmedPassword`, it will return
 * `true`. Otherwise, it will return `false`.
 */
  passwordMatches() {
    if (this.newPassword === this.confirmedPassword) {
      return true;
    } else {
      return false;
    }
  }

/* The `setPasswordMatchesToTrue()` function is setting the value of the `pwMatch` variable to `true`.
This variable is used to track whether the new password and the confirmed password match. By setting
it to `true`, it indicates that the passwords do match. */
  setPasswordMatchesToTrue() {
    this.pwMatch = true;
  }
}
