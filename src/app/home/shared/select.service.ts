import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMember, ChatMemberData } from 'src/app/models/models';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  public selectedUser: BehaviorSubject<ChatMember> =
    new BehaviorSubject<ChatMember>(new ChatMemberData());

  constructor() {}
}
