import { Component } from '@angular/core';
import { getAuth, updateProfile } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';
import { inject } from '@angular/core';
import { Firestore, doc, getDoc, addDoc, updateDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss'],
})
export class ChooseAvatarComponent {
  firestore: Firestore = inject(Firestore);
  isButtonDisabled: boolean = true;

  constructor(private _router: Router, private UserService: UserService) {}

  avatar_list: string[] = [
    'assets/characters/character_1.png',
    'assets/characters/character_2.png',
    'assets/characters/character_3.png',
    'assets/characters/character_4.png',
    'assets/characters/character_5.png',
    'assets/characters/character_6.png',
  ];
  auth = getAuth();
  picked_avatar: string = 'assets/characters/default_character.png';
  name: string = this.UserService.getName();
  currentUser = this.auth.currentUser;

/**
 * The function "chooseAvatar" updates the user's chosen avatar image and enables a button.
 * @param {string} picked_img - The parameter "picked_img" is a string that represents the URL or file
 * path of the selected avatar image.
 */
  chooseAvatar(picked_img: string) {
    this.picked_avatar = picked_img;
    this.UserService.userObject.photoURL = this.picked_avatar;
    this.isButtonDisabled = false;
  }


 /**
  * The updateUser function updates the user's profile information and then updates the user in the
  * database before routing to the main page.
  */
  updateUser() {
    if (this.currentUser) {
      updateProfile(this.currentUser, {
        displayName: this.UserService.userObject.name,
        photoURL: this.UserService.userObject.photoURL,
      })
        .then(() => {
          this.updateUserinDatabase();
          this.routeToMainPage();
        })
        .catch((error) => {
          console.log('Update Error');
        });
    }
  }


  /**
   * The function `updateUserinDatabase` updates the user object in the database using the `updateDoc`
   * function.
   */
  async updateUserinDatabase() {
    let docRef = this.getCurrentUser();
    await updateDoc(docRef, this.UserService.userObject.toJson()).catch(
      (err) => {
        console.log(err);
      }
    );
  }

 /**
  * The getCurrentUser function returns the document of the current user from the 'users' collection in
  * Firestore.
  * @returns The function `getCurrentUser()` is returning a document from the "users" collection in the
  * Firestore database. The specific document being returned is determined by the `docId` property of
  * the `UserService` object.
  */
  getCurrentUser() {
    {
      return doc(collection(this.firestore, 'users'), this.UserService.docId);
    }
  }

  routeToMainPage() {
    this._router.navigateByUrl('/index');
  }
}
