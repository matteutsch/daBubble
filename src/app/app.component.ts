import { Component, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  firestore: Firestore = inject(Firestore);
  unsubUsers;

  unsubUser;

  constructor() {
    this.unsubUsers = onSnapshot(this.getUsersRef(), (list) => {
      // console.log("Current data: ", list);
      list.forEach((doc) => {
        console.log('user:', doc.data());

      })
    });

    this.unsubUser = onSnapshot(doc(this.getUsersRef(), 'qVSyArSQmvBo3gwvmriI'), (doc)=> {
      console.log('currentUser:', doc.data());
      
    });
  }

  onNgDestroy() {
    this.unsubUsers;
    this.unsubUser;
  }

  getUsersRef() {
    return collection(this.firestore, "users");
  }

}
