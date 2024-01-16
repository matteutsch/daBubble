import { v4 as uuidv4 } from 'uuid';
export interface User {
  uid: string;
  email: string;
  emailVerified?: boolean;
  name: string;
  photoURL: string;
  chats: {
    channel: ChannelChat[];
    private: PrivateChat[];
  };
}
export class UserData {
  public uid: string = '';
  public email: string = '';
  public emailVerified: boolean = false;
  public name: string = '';
  public photoURL: string = '';
  public chats: { channel: ChannelChat[]; private: PrivateChat[] } = {
    channel: [],
    private: [],
  };

  constructor(user: any = '', userName: string = '', url: string = '') {
    this.uid = user.uid || '';
    this.email = user.email || '';
    this.emailVerified = user.emailVerified || false;
    this.name = userName;
    this.photoURL = url;
    this.chats = {
      channel: [],
      private: [],
    };
  }

  toFirestoreObject(): User {
    return {
      uid: this.uid,
      email: this.email,
      emailVerified: this.emailVerified,
      name: this.name,
      photoURL: this.photoURL,
      chats: this.chats
    };
  }
}

export interface Chat {
  chatID: string;
  name: string;
  members: string[];
  messages?: Message[];
  description?: string;
  createdBy: string;
  type: string;
}

export class ChatData {
  public chatID: string = '';
  public name: string = '';
  public members: string[] = [];
  public description: string = '';
  public createdBy: string = '';
  public type: string = 'default';

  constructor(
    newChatID: string = '',
    user: User = new UserData(),
    chatName: string = '',
    chatDescription: string = ''
  ) {
    this.chatID = newChatID;
    this.name = chatName;
    this.members = [user.uid];
    this.description = chatDescription;
    this.createdBy = user.uid;
  }

  toFirestoreObject(): Chat {
    return {
      chatID: this.chatID,
      name: this.name,
      members: this.members,
      description: this.description,
      createdBy: this.createdBy,
      type: this.type,
    };
  }

  setType(type: string): void {
    this.type = type;
  }
}

export interface PrivateChat {
  chatID: string;
  chatPartnerID: string;
}

export class PrivateChatData {
  public chatID: string = '';
  public chatPartnerID: string = '';

  constructor(newChatID: string, newPartnerID: string) {
    this.chatID = newChatID;
    this.chatPartnerID = newPartnerID;
  }

  toFirestoreObject(): PrivateChat {
    return {
      chatID: this.chatID,
      chatPartnerID: this.chatPartnerID,
    };
  }
}

export interface ChannelChat {
  chatID: string;
}

export class ChannelChatData {
  public chatID: string = '';

  constructor(newChatID: string) {
    this.chatID = newChatID;
  }

  toFirestoreObject(): ChannelChat {
    return {
      chatID: this.chatID,
    };
  }
}

export interface Message {
  msgId: string;
  authorID: string;
  content: string;
  emoji: EmojiPicker[];
  timestampData: number;
  answers: Message[];
  photoURL?: string;
  fromMsgId?: string;
}

export class MessageData {
  public msgId: string = uuidv4();
  public authorID: string = '';
  public content: string = '';
  public emoji: EmojiPicker[] = [];
  public timestampData: number;
  public answers: Message[] = [];

  constructor(authorID: string = '', contentText: string = '', timestamp: number = 1641000000) {
    this.authorID = authorID;
    this.content = contentText;
    this.emoji = [];
    this.timestampData = timestamp;
    this.answers = [];
  }

  toFirestoreObject(): Message {
    return {
      msgId: this.msgId,
      authorID: this.authorID,
      content: this.content,
      emoji: this.emoji,
      timestampData: this.timestampData,
      answers: []
    };
  }
}

export interface ChatMember {
  uid: string;
  email: string;
  name: string;
  photoURL: string;
  chatID: string;
}

export class ChatMemberData {
  public uid: string = '';
  public email: string = '';
  public name: string = '';
  public photoURL: string = '';
  public chatID: string = '';

  constructor(user: User = new UserData(), newChatID: string = '') {
    this.uid = user.uid;
    this.email = user.email;
    this.name = user.name;
    this.photoURL = user.photoURL;
    this.chatID = newChatID;
  }

  toFirestoreObject(): ChatMember {
    return {
      uid: this.uid,
      email: this.email,
      name: this.name,
      photoURL: this.photoURL,
      chatID: this.chatID,
    };
  }
}

export interface EmojiPicker {
  authorsId: string[];
  id: string;
  name: string;
  native: any;
  unified: string;
  quantity: number;
}

export class EmojiData {
  public authorsId: string[] = [];
  public id: string = '';
  public name: string = '';
  public native: any;
  public unified: string = '';
  public quantity: number = 0;

  constructor(emoji: any) {
    this.id = emoji.id;
    this.name = emoji.name;
    this.native = emoji.native;
    this.unified = emoji.unified;
  }

  toFirestoreObject(): EmojiPicker {
    return {
      authorsId: this.authorsId,
      id: this.id,
      name: this.name,
      native: this.native,
      unified: this.unified,
      quantity: this.quantity
    }
  }
}