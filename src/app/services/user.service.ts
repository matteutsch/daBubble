import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersCollection: AngularFirestoreCollection<any>;
  private users: User[] = [];
  public usersSubject = new BehaviorSubject<User[]>([]);

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.usersCollection = this.afs.collection('users');
    this.getAllUsers();
  }

  uploadFile(file: File, form: any): void {
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
        console.error('Error storing file data: ', error);
      });
  }

  chooseUserAvatar(pickedImg: string, form: any) {
    form.get('fileControl')?.setValue(pickedImg ? pickedImg : '');
  }

  getUser(userID: string): Observable<any> {
    return this.usersCollection.doc(userID).valueChanges();
  }

  async fetchUserData(userID: any): Promise<any> {
    try {
      const docRef = this.afs.collection('users').doc(userID);
      const docSnap = await docRef.get();
      if (docSnap) {
        const userData = docSnap;
        return userData;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  getAllUsers() {
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

  updateUser(id: any, data: any) {
    return this.afs.collection('users').doc(id).update({
      name: data.nameControl,
      email: data.mailControl,
    });
  }

  async addNewPrivateChat(id: any, chatMember: User) {
    const userRef = this.afs.collection('users').doc(id);
    let subscription = this.getUser(id).subscribe(async (user) => {
      let existingPrivateChatMember: User[] = user.chats.private;
      const isNewChatMemberAlreadyInArray = existingPrivateChatMember.some(
        (member) => member.uid === chatMember.uid
      );
      if (!isNewChatMemberAlreadyInArray) {
        existingPrivateChatMember.push(chatMember);
      } else {
        console.log('Chat Member already exists in user object.');
        return;
      }
      await userRef.update({
        'chats.private': existingPrivateChatMember,
      });
      subscription.unsubscribe();
    });
  }

  async addNewChannel(id: string, channelID: string) {
    const userRef = this.afs.collection('users').doc(id);
    userRef.get().forEach(async (e) => {
      const user = (await e.data()) as User;
      const existingChannelChats = user.chats.channel;
      existingChannelChats?.push(channelID);
      await userRef.update({
        'chats.channel': existingChannelChats,
      });
    });
  }
}
