import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

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

  getUser(userID: any): Observable<any> {
    return this.afs.collection('users').doc(userID).valueChanges();
  }

  updateUser(id: any, data: any) {
    return this.afs.collection('users').doc(id).update({
      name: data.nameControl,
      email: data.mailControl,
    });
  }
}
