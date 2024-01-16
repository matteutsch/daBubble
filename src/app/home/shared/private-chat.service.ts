import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import {
  Chat,
  ChatData,
  ChatMember,
  ChatMemberData,
  PrivateChat,
  PrivateChatData,
  User,
} from 'src/app/models/models';

@Injectable({
  providedIn: 'root',
})
export class PrivateChatService {
  public privateChatMembers: ChatMember[] = [];

  constructor(private afs: AngularFirestore) {}

  /**
   * Asynchronously adds a member to a private chat and updates the list of private chat members.
   *
   * @param {string} memberId - The ID of the member to add.
   * @param {string} chatID - The ID of the private chat.
   * @returns {Promise<void>}
   */
  public async pushMemberInPrivateChat(
    memberId: string,
    chatID: string
  ): Promise<void> {
    if (memberId && chatID) {
      this.afs
        .collection('users')
        .doc(memberId)
        .valueChanges()
        .subscribe((userRef: any) => {
          const user = userRef;
          const isMember = this.isPrivateChatMember(user);
          const chatMember = new ChatMemberData(
            user,
            chatID
          ).toFirestoreObject();
          if (!isMember) {
            this.privateChatMembers.push(chatMember);
          } else {
            this.updatePrivateChatMember(chatMember);
          }
        });
    }
  }

  /**
   * Updates the list of private chat members with the provided member data.
   *
   * @param {ChatMember} user - The updated member data.
   * @returns {void}
   * @private
   */
  private updatePrivateChatMember(user: ChatMember): void {
    this.privateChatMembers.forEach((member: ChatMember, index) => {
      if (user.uid === member.uid) {
        this.privateChatMembers[index] = user;
      }
    });
  }

  /**
   * Checks if a user is already a member of the private chat.
   *
   * @param {User} user - The user to check for membership.
   * @returns {boolean} - A boolean indicating whether the user is already a member.
   * @private
   */
  private isPrivateChatMember(user: User): boolean {
    return this.privateChatMembers.some(
      (existingMember) => existingMember.uid === user.uid
    );
  }
  
  /**
   * Asynchronously sets a Firestore document for a new private chat and updates users' private chat lists.
   *
   * @param {User} user - The user initiating the private chat.
   * @param {User} currentUser - The current user.
   * @param {AngularFirestoreCollection} collection - The Firestore collection to set the document in.
   * @param {Chat} newChatData - The data for the new private chat.
   * @returns {Promise<void>} A Promise that resolves when the operation is complete.
   */
  public async setPrivateDoc(
    user: User,
    currentUser: User,
    collection: AngularFirestoreCollection,
    newChatData: Chat
  ): Promise<void> {
    collection
      .doc(newChatData.chatID)
      .set(newChatData)
      .then(() => {
        this.updateUserPrivateChat(
          user.uid,
          newChatData.chatID,
          currentUser.uid
        );
        this.updateUserPrivateChat(
          currentUser.uid,
          newChatData.chatID,
          user.uid
        );
      })
      .catch((error: any) => {
        throw Error('Error creating document: ', error);
      });
  }

  /**
   * Creates a new private chat for the Firestore collection with the specified user and current user.
   *
   * @param {User} user - The user initiating the private chat.
   * @param {User} currentUser - The current user.
   * @returns {Chat} - The newly created private chat.
   */
  public createPrivateChatForCollection(user: User, currentUser: User): Chat {
    const newChatId = this.afs.createId();
    const newChatData = new ChatData(newChatId, currentUser);
    newChatData.setType('private');
    newChatData.members.push(user.uid);
    return newChatData.toFirestoreObject();
  }

  /**
   * Asynchronously updates the user's private chat list with the new private chat data.
   *
   * @param {string} userID - The ID of the user to update.
   * @param {string} newChatDataID - The ID of the new private chat data.
   * @param {string} partnerID - The ID of the chat partner.
   * @returns {Promise<void>}
   * @private
   */
  private async updateUserPrivateChat(
    userID: string,
    newChatDataID: string,
    partnerID: string
  ): Promise<void> {
    const newPrivateChat = new PrivateChatData(newChatDataID, partnerID);
    let privateChats: PrivateChat[] = [];
    await this.afs
      .collection('users')
      .doc(userID)
      .get()
      .forEach((user: any) => {
        privateChats = user.data().chats.private;
      });
    privateChats.push(newPrivateChat.toFirestoreObject());
    this.afs
      .collection('users')
      .doc(userID)
      .update({
        'chats.private': privateChats,
      } as Partial<User>);
  }

  /**
   * Checks if a private chat with the specified chat partner already exists in the user's private chat list.
   *
   * @param {string} newMemberID - The ID of the chat partner to check for existence.
   * @param {User} user - The user to check for existing private chats.
   * @returns {boolean} - A boolean indicating whether the private chat already exists for the user.
   */
  public isPrivateChatAlreadyExists(newMemberID: string, user: User): boolean {
    let existingPrivateChats: PrivateChat[] = user.chats.private;
    const isNewChatAlreadyInArray = existingPrivateChats.some(
      (chat: PrivateChat) => chat.chatPartnerID === newMemberID
    );
    return isNewChatAlreadyInArray;
  }
}
