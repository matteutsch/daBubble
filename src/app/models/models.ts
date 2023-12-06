export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  chats?: Chat[];
  status: StatusType;
}

export interface Chat {
  id: string;
  type: ChatType;
  participants: string[]; // IDs der Chat-Teilnehmer
  messages: Message[];
}

export enum ChatType {
  Channel = 'channel',
  Private = 'private',
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export enum StatusType {
  Online = 'online',
  Offline = 'offline',
  /*Busy = 'busy',
  AFK = 'afk', */
}
