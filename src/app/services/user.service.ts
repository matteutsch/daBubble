import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';
import {
  ChatData,
  PrivateChat,
  PrivateChatData,
  User,
  UserData,
} from '../models/models';
import { FirestoreService } from './firestore.service';
import { ChatService } from '../home/shared/chat.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user: User = new UserData();
  public users: User[] = [];
  private usersCollection: AngularFirestoreCollection<any>;
  public usersSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private chatService: ChatService,
    private firestoreService: FirestoreService
  ) {
    this.usersCollection = this.afs.collection('users');
    this.getAllUsers();
  }

  /**
   * Asynchronously initializes a user and updates all related chats.
   *
   * @param {string} userId - The ID of the user to initialize.
   * @returns {Promise<void>} - A promise that resolves when the user is initialized and chats are updated.
   */
  public async initializeUserAndChats(userId: string): Promise<void> {
    this.user = await this.firestoreService.getDocumentFromCollection(
      'users',
      userId
    );
    this.chatService.updateAllChats(this.user);
  }

  /**
   * Sets user data in Firestore, including user details, private chat information, and private chat document.
   *
   * @param {any} user - The user object containing authentication details.
   * @param {any} userName - The name of the user.
   * @param {string} photoURL - The URL of the user's profile photo.
   * @returns {Promise<void>} - A promise indicating the success of the operation.
   */
  public setUserData(
    user: any,
    userName: any,
    photoURL: string
  ): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const newChatId = this.afs.createId();
    const newChatData = new ChatData(newChatId, user);
    newChatData.setType('private');
    const userData: User = new UserData(
      user,
      userName,
      photoURL
    ).toFirestoreObject();
    const myChat: PrivateChat = new PrivateChatData(
      newChatId,
      user.uid
    ).toFirestoreObject();
    userData.chats.private.push(myChat);
    this.afs
      .collection('privateChats')
      .doc(newChatData.toFirestoreObject().chatID)
      .set(newChatData.toFirestoreObject());
    return userRef.set(userData, {
      merge: true,
    });
  }

  /**
   * Uploads a file to the Storage and updates the user profile form.
   *
   * @param {File} file - The file to be uploaded.
   * @param {any} form - The form to be updated.
   * @returns {void}
   */
  public uploadFile(file: File, form: any): void {
    const storageRef = this.storage.ref(`images/${file.name}`);
    const uploadTask = storageRef.put(file);
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            this.saveFileData(file.name, downloadURL);
            console.log('File available at', downloadURL);
            this.chooseUserAvatar(downloadURL, form);
          });
        })
      )
      .subscribe();
  }

  /**
   * Saves file data to the Firestore database.
   *
   * @param {string} fileName - The name of the saved file.
   * @param {string} downloadURL - The downloaded URL of the file.
   * @returns {void}
   * @private
   */
  private saveFileData(fileName: string, downloadURL: string): void {
    this.afs
      .collection('files')
      .add({
        fileName: fileName,
        downloadURL: downloadURL,
      })
      .then((docRef) => {
        console.log('File data stored with ID: ', docRef.id);
      })
      .catch((error) => {
        throw Error('Error storing file data: ', error);
      });
  }

  /**
   * Chooses a user avatar and updates the corresponding form control.
   *
   * @param {string} pickedImg - The selected image URL for the user avatar.
   * @param {any} form - The form containing the 'fileControl' to be updated.
   * @returns {void}
   * @throws {Error} If there is an issue updating the form control.
   */
  public chooseUserAvatar(pickedImg: string, form: any): void {
    try {
      form.get('fileControl')?.setValue(pickedImg ? pickedImg : '');
    } catch (error: any) {
      throw new Error(
        'Error updating user avatar form control: ',
        error.message
      );
    }
  }

  /**
   * Asynchronously checks if a user with the specified user ID exists in the local user database.
   *
   * @param {string} userId - The user ID to check for existence.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the user exists.
   */
  public async isUserInDatabase(userId: string): Promise<boolean> {
    const userExists = this.users.some((user: User) => user.uid === userId);
    return userExists;
  }

  /**
   * Retrieves all users from the users collection as an observable.
   *
   * @returns {Observable<User[]>} - An observable that emits an array of User objects representing all users.
   * @private
   */
  private getAllUsers(): Observable<User[]> {
    this.usersCollection
      .snapshotChanges()
      .pipe(
        map((users) => {
          this.users = users.map((user) => user.payload.doc.data());
          this.usersSubject.next(this.users);
        })
      )
      .subscribe();
    return this.usersSubject.asObservable();
  }

  /**
   * Updates user data in the Firestore database.
   * @param {any} id - The ID of the user to be updated.
   * @param {any} data - The user data to be updated.
   * @returns {Promise<void>} - A promise that resolves upon successful update.
   */
  public updateUser(id: any, data: any): Promise<void> {
    this.user.name = data.nameControl;
    this.user.photoURL = data.fileControl;
    return this.afs.collection('users').doc(id).update({
      name: data.nameControl,
      photoURL: data.fileControl,
    });
  }
}
