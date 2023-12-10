import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {

  }
  
  uploadFile(file: File, form: any): void {
    const storageRef = this.storage.ref(`images/${file.name}`);
    const uploadTask = storageRef.put(file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          this.saveFileData(file.name, downloadURL);
          console.log('File available at', downloadURL);
          this.chooseUserAvatar(downloadURL, form);
        });
      })
    ).subscribe();
  }

  private saveFileData(fileName: string, downloadURL: string): void {
    this.firestore.collection('files').add({
      fileName: fileName,
      downloadURL: downloadURL
    })
      .then(docRef => {
        console.log('File data stored with ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error storing file data: ', error);
      });
  }

  chooseUserAvatar(pickedImg: string, form: any) {
    form.get('fileControl')?.setValue(pickedImg ? pickedImg : '');
  }

  getUser(userID: any): Observable<any> {
    return this.firestore
      .collection('users')
      .doc(userID)
      .valueChanges();
  }
}