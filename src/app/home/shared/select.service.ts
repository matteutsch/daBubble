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
  private selectedChannelSubject = new BehaviorSubject<any>(null);
  selectedChannel$ = this.selectedChannelSubject.asObservable();

  setSelectedMember(user: User) {
    this.selectedUserSubject.next(user);
  }
  setSelectedChannel(channel: User) {
    this.selectedChannelSubject.next(channel);
  }
}
