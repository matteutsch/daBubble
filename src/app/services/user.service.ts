import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/models';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getUser(userID: string, user: User) {
    this.firestore
      .collection('users')
      .doc(userID)
      .valueChanges()
      .subscribe((currentUser: any) => {
        user = currentUser;
      });
  }
}