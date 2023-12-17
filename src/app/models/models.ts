export interface User {
  uid: string;
  email: string;
  emailVerified?: boolean;
  name: string;
  photoURL: string;
  chats: {
    channel?: Chat[];
    private?: string[];
  };
  status: StatusType;
}

export enum StatusType {
  Online = 'online',
  Offline = 'offline',
  /*Busy = 'busy',
  AFK = 'afk', */
}

export interface Chats {
  channel: Chat[];
  private: string[];
}

export interface Chat {
  id: string;
  name: string;
  members?: string[];
  messages?: Message[];
}

export interface Message {
  author: string;
  content: string;
  emoji: string[];
  timestampData: Date;
  answers?: Message[];
}

export class MessageData {
  public author: string = '';
  public content: string = '';
  public emoji: string[] = [];
  public timestampData: number;
  public answers: Message[] = [];

  constructor(userName: string, contentText: string, timestamp: number) {
    this.author = userName;
    this.content = contentText;
    this.emoji = [];
    this.timestampData = timestamp;
    this.answers = [];
  }

  toFirestoreObject(): any {
    return {
      author: this.author,
      content: this.content,
      emoji: this.emoji,
      timestampData: this.timestampData,
      answers: []
    };
  }
}

export interface PrivatChatMember {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  chatId: string;
  status: StatusType;
}

export class PrivateChatMemberData {
  public uid: string = '';
  public email: string = '';
  public name: string = '';
  public photoURL: string = '';
  public chatId: string = '';
  public status: StatusType;

  constructor(user: User, id: string) {
    this.uid = user.uid;
    this.email = user.email;
    this.name = user.name;
    this.photoURL = user.photoURL;
    this.chatId = id;
    this.status = user.status;
  }
}
