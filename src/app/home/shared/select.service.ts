import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/models';

@Injectable({
  providedIn: 'root',
})
export class SelectService {

  constructor() {}

  private selectedUserSubject = new BehaviorSubject<any>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();

  setSelectedUser(user: User) {
    this.selectedUserSubject.next(user);
  }
}
