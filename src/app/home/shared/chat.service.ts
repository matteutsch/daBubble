import { ElementRef, Injectable } from '@angular/core';
import { User } from 'src/app/models/models';
import { SelectService } from './select.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private customTextAreaRef: any;
  isMainChatChannel: boolean = false;
  isNotChat: boolean = true;
  isMyPrivatChat: boolean = false;

  constructor(public select: SelectService) {}

  setTextareaRef(ref: ElementRef) {
    this.customTextAreaRef = ref;
  }
  getTextareaRef(): any {
    return this.customTextAreaRef;
  }

  selectUser(selectedUser: User, currentUser: User) {
    this.select.setSelectedUser(selectedUser);
    if (selectedUser === currentUser) {
      this.openMyPrivatChat();
    } else {
      this.openDirectChat();
    }
  }

  openChannelChat() {
    this.isMainChatChannel = true;
  }

  openNewChat() {
    this.isMainChatChannel = false;
    this.isNotChat = true;
    this.isMyPrivatChat = false;
  }

  openDirectChat() {
    this.isMainChatChannel = false;
    this.isNotChat = false;
    this.isMyPrivatChat = false;
  }

  openMyPrivatChat() {
    this.isMainChatChannel = false;
    this.isNotChat = false;
    this.isMyPrivatChat = true;
  }
}
