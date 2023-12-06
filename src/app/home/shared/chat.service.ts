import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ChatService {

    isMainChatChannel: boolean = false;
    isNotChat: boolean = true;
    isMyPrivatChat: boolean = false;

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
