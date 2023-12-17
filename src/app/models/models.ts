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
  authorID?: string;
  content: string;
  emoji: string[];
  timestampData: Date;
  answers?: Message[];
  photoURL?: string;
}

export class MessageData {
  public author: string = '';
  public authorID: string = '';
  public content: string = '';
  public emoji: string[] = [];
  public timestampData: number;
  public answers: Message[] = [];
  public photoURL: string = ''

  constructor(user: User, contentText: string, timestamp: number) {
    this.author = user.name;
    this.authorID = user.uid;
    this.content = contentText;
    this.emoji = [];
    this.timestampData = timestamp;
    this.answers = [];
    this.photoURL = user.photoURL;
  }

  toFirestoreObject(): any {
    return {
      author: this.author,
      authorID: this.authorID,
      content: this.content,
      emoji: this.emoji,
      timestampData: this.timestampData,
      answers: [],
      photoURL: this.photoURL
    };
  }
}
