import { Data } from '@angular/router';

export interface User {
  uid: string;
  email: string;
  emailVerified?: boolean;
  name: string;
  photoURL: string;
  chats: {
    channel?: Chat[];
    private?: Chat[];
  };
  status: StatusType;
}

export interface Chats {
  channel: Chat[];
  private: Chat[];
}
export interface Chat {
  id: string;
  name: string;
  members?: string[];
  messages: Message[];
}

export interface Message {
  author: string;
  content: string;
  emoji: string[];
  timestampData: Date;
  answers?: Message[];
}

export enum StatusType {
  Online = 'online',
  Offline = 'offline',
  /*Busy = 'busy',
  AFK = 'afk', */
}
