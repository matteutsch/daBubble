export interface User {
  uid: string;
  email: string;
  emailVerified?: boolean;
  name: string;
  photoURL: string;
  chats: {
    channel?: string[];
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

export interface Chat {
  id: string;
  name: string;
  members?: string[];
  messages?: Message[];
  description?: string;
  createdBy?: string;
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
      answers: [],
    };
  }
}
