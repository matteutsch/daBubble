import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription, firstValueFrom, take } from 'rxjs';
import {
  Chat,
  EmojiPicker,
  Message,
  MessageData,
  User,
} from 'src/app/models/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService implements OnDestroy {
  public threadMessage: Message = new MessageData();
  public threadMessageAuthor!: User;
  public threadMessageIndex: number = 0;
  public threadName: string = '';
  public ulChatMessages!: HTMLElement;
  public ulThreadMessages!: HTMLElement;
  public currentMessages!: Message[];

  messageSubscription!: Subscription;

  constructor(
    private afs: AngularFirestore,
    private firestoreService: FirestoreService
  ) {}

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  /**
   * Retrieves chat messages from the specified chat.
   * @method
   * @param {Chat} chat - The chat from which to retrieve messages.
   * @returns {Promise<void>}
   */
  public async getChatMessages(chat: Chat): Promise<void> {
    if (chat.chatID.length > 0) {
      try {
        const messageRef = this.afs
          .collection(`${chat.type}Chats`)
          .doc(chat.chatID)
          .collection('messages', (ref) => ref.orderBy('timestampData'))
          .valueChanges();
        const messagesCountRef = messageRef.pipe(take(1));
        const messages = await firstValueFrom(messagesCountRef);
        this.currentMessages = messages as Message[];
        this.messageSubscription = messageRef.subscribe((res) => {
          const newMessages = res as Message[];
          this.handleAddedMessages(newMessages);
          this.handleRemovedMessages(newMessages);
        });
      } catch (error) {
        console.error(`Error retrieving messages: ${error}`);
      }
    }
  }

  /**
   * Handles added messages by updating the currentMessages array.
   * @private
   * @param {Message[]} messages - The array of added messages.
   * @returns {void}
   */
  private handleAddedMessages(messages: Message[]): void {
    const newMessages = messages.filter(
      (newMsg: Message) =>
        !this.currentMessages.some(
          (existingMsg: Message) => existingMsg.msgId == newMsg.msgId
        )
    );
    this.currentMessages.push(...newMessages);
  }

  /**
   * Handles removed messages by updating the currentMessages array.
   * @private
   * @param {Message[]} messages - The array of removed messages.
   * @returns {void}
   */
  private handleRemovedMessages(messages: Message[]): void {
    const removedMessages = this.currentMessages.filter(
      (existingMsg: Message) =>
        !messages.some((newMsg: Message) => newMsg.msgId === existingMsg.msgId)
    );
    removedMessages.forEach((removedMsg: Message) => {
      const index = this.currentMessages.findIndex(
        (existingMsg: Message) => existingMsg.msgId === removedMsg.msgId
      );
      if (index !== -1) {
        this.currentMessages.splice(index, 1);
      }
    });
  }

  /**
   * Asynchronously sends a message to the specified chat.
   *
   * @param {string} authorID - The ID of the message author.
   * @param {string} contentText - The text content of the message.
   * @param {Chat} chat - The chat to which the message will be sent.
   * @returns {Promise<void>}
   */
  public async sendMessage(
    authorID: string,
    contentText: string,
    chat: Chat
  ): Promise<void> {
    const message = new MessageData(
      authorID,
      contentText,
      new Date().getTime()
    ).toFirestoreObject();
    const messageDocRef = this.firestoreService.getMsgDocRef(chat, message);
    messageDocRef.set(message);
  }

  /**
   * Updates the content of a message in the specified chat.
   * @method
   * @param {Chat} chat - The chat containing the message.
   * @param {Message} message - The message to be updated.
   * @param {string} newMsgContent - The new content for the message.
   * @returns {Promise<void>}
   */
  public async updateMessage(
    chat: Chat,
    message: Message,
    newMsgContent: string
  ): Promise<void> {
    const messageDocRef = this.firestoreService.getMsgDocRef(chat, message);
    messageDocRef.update({
      content: newMsgContent,
    });
  }

  /**
   * Asynchronously deletes a message from the specified chat.
   *
   * @param {Chat} chat - The chat from which the message will be deleted.
   * @param {Message} message - The message to be deleted.
   * @returns {Promise<void>} - A promise indicating the success or failure of the deletion.
   */
  public async deleteMessage(chat: Chat, message: Message): Promise<void> {
    const messageDocRef = this.firestoreService.getMsgDocRef(chat, message);
    messageDocRef.delete();
  }

  /**
   * Asynchronously sends an answer to a message in the specified chat.
   *
   * @param {string} authorID - The ID of the answer author.
   * @param {string} contentText - The text content of the answer.
   * @param {Chat} chat - The chat to which the answer will be sent.
   * @returns {Promise<void>}
   */
  public async sendAnswer(
    authorID: string,
    contentText: string,
    chat: Chat
  ): Promise<void> {
    const message = new MessageData(
      authorID,
      contentText,
      new Date().getTime()
    ).toFirestoreObject();
    message.fromMsgId = this.threadMessage.msgId;
    const threadMessage = { ...this.threadMessage };
    const messageDocRef = this.firestoreService.getMsgDocRef(
      chat,
      threadMessage
    );
    threadMessage.answers.push(message);
    messageDocRef.update({
      answers: threadMessage.answers,
    });
  }

  /**
   * Updates the content of an answer in the specified chat.
   *
   * @param {Chat} chat - The chat containing the answer.
   * @param {string} newMsgContent - The new content for the answer.
   * @param {number} index - The index of the answer to be updated.
   * @returns {Promise<void>}
   */
  public async updateAnswer(
    chat: Chat,
    newMsgContent: string,
    index: number
  ): Promise<void> {
    const updatedAnswers = [...this.threadMessage.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      content: newMsgContent,
    };
    const messageDocRef = this.firestoreService.getMsgDocRef(
      chat,
      this.threadMessage
    );
    messageDocRef.update({
      answers: updatedAnswers,
    });
  }

  /**
   * Asynchronously deletes an answer from a message in the specified chat.
   *
   * @param {number} answerIndex - The index of the answer to be deleted.
   * @param {Chat} chat - The chat from which the answer will be deleted.
   * @returns {Promise<void>}
   */
  public async deleteAnswer(answerIndex: number, chat: Chat): Promise<void> {
    const threadMessage = { ...this.threadMessage };
    const messageDocRef = this.firestoreService.getMsgDocRef(
      chat,
      threadMessage
    );
    threadMessage.answers.splice(answerIndex, 1);
    messageDocRef.update({
      answers: threadMessage.answers,
    });
  }

  /**
   * Adds an emoji to a message in the specified chat.
   *
   * @param {Chat} chat - The chat containing the message.
   * @param {Message} message - The message to which the emoji will be added.
   * @param {EmojiPicker} newEmoji - The new emoji to be added.
   * @returns {Promise<void>}
   */
  public async addMsgEmoji(
    chat: Chat,
    message: Message,
    newEmoji: EmojiPicker
  ): Promise<void> {
    const updatedEmoji = [...message.emoji];
    this.updateEmojiQuantityByAdd(updatedEmoji, newEmoji);
    const messageDocRef = this.firestoreService.getMsgDocRef(chat, message);
    messageDocRef.update({
      emoji: updatedEmoji,
    });
  }

  /**
   * Adds an emoji to an answer in the specified chat.
   *
   * @param {Chat} chat - The chat containing the thread message.
   * @param {EmojiPicker} newEmoji - The new emoji to be added.
   * @param {number} msgIndex - The index of the answer to receive the emoji.
   * @returns {Promise<void>}
   */
  public async addAnswerEmoji(
    chat: Chat,
    newEmoji: EmojiPicker,
    msgIndex: number
  ): Promise<void> {
    const updatedEmoji = [...this.threadMessage.answers[msgIndex].emoji];
    const updatedAnswers = [...this.threadMessage.answers];
    this.updateEmojiQuantityByAdd(updatedEmoji, newEmoji);
    updatedAnswers[msgIndex] = {
      ...updatedAnswers[msgIndex],
      emoji: updatedEmoji,
    };
    const messageDocRef = this.firestoreService.getMsgDocRef(
      chat,
      this.threadMessage
    );
    messageDocRef.update({
      answers: updatedAnswers,
    });
  }

  /**
   * Deletes an emoji from a message in the specified chat.
   *
   * @param {Chat} chat - The chat containing the message.
   * @param {Message} message - The message from which the emoji will be deleted.
   * @param {number} emojiIndex - The index of the emoji to be deleted.
   * @param {User} user - The user initiating the deletion.
   * @returns {Promise<void>}
   */
  public async deleteMsgEmoji(
    chat: Chat,
    message: Message,
    emojiIndex: number,
    user: User
  ): Promise<void> {
    const updatedEmoji = [...message.emoji];
    this.updateEmojiQuantityByDelete(updatedEmoji, emojiIndex, user.uid);
    const messageDocRef = this.firestoreService.getMsgDocRef(chat, message);
    messageDocRef.update({
      emoji: updatedEmoji,
    });
  }

  /**
   * Deletes an emoji from an answer in the specified chat.
   *
   * @param {Chat} chat - The chat containing the thread message.
   * @param {number} msgIndex - The index of the answer containing the emoji.
   * @param {number} emojiIndex - The index of the emoji to be deleted.
   * @param {User} user - The user initiating the deletion.
   * @returns {Promise<void>}
   */
  public async deleteAnsweremoji(
    chat: Chat,
    msgIndex: number,
    emojiIndex: number,
    user: User
  ): Promise<void> {
    const updatedEmoji = [...this.threadMessage.answers[msgIndex].emoji];
    const updatedAnswers = [...this.threadMessage.answers];
    this.updateEmojiQuantityByDelete(updatedEmoji, emojiIndex, user.uid);
    updatedAnswers[msgIndex] = {
      ...updatedAnswers[msgIndex],
      emoji: updatedEmoji,
    };
    const messageDocRef = this.firestoreService.getMsgDocRef(
      chat,
      this.threadMessage
    );
    messageDocRef.update({
      answers: updatedAnswers,
    });
  }

  /**
   * Updates the quantity of an emoji after it is deleted.
   *
   * @private
   * @param {EmojiPicker[]} updatedEmoji - The array of updated emojis.
   * @param {number} emojiIndex - The index of the emoji to be deleted.
   * @param {string} userUid - The UID of the user initiating the deletion.
   * @returns {EmojiPicker[]} - The updated array of emojis.
   */
  private updateEmojiQuantityByDelete(
    updatedEmoji: EmojiPicker[],
    emojiIndex: number,
    userUid: string
  ): EmojiPicker[] {
    if (updatedEmoji[emojiIndex].quantity > 1) {
      updatedEmoji[emojiIndex].quantity--;
      const userIndex = updatedEmoji[emojiIndex].authorsId.indexOf(userUid);
      if (userIndex !== -1) {
        updatedEmoji[emojiIndex].authorsId.splice(userIndex, 1);
      }
    } else {
      updatedEmoji.splice(emojiIndex, 1);
    }
    return updatedEmoji;
  }

  /**
   * Updates the quantity of an emoji after it is added.
   *
   * @private
   * @param {EmojiPicker[]} updatedEmoji - The array of updated emojis.
   * @param {EmojiPicker} newEmoji - The new emoji to be added.
   * @returns {void}
   */
  private updateEmojiQuantityByAdd(
    updatedEmoji: EmojiPicker[],
    newEmoji: EmojiPicker
  ): void {
    const emojiIndex: number = updatedEmoji.findIndex(
      (emoji) => emoji.unified === newEmoji.unified
    );
    if (emojiIndex !== -1) {
      updatedEmoji[emojiIndex].quantity++;
      updatedEmoji[emojiIndex].authorsId.push(newEmoji.authorsId[0]);
    } else {
      updatedEmoji.push({
        ...newEmoji,
        quantity: 1,
        authorsId: [newEmoji.authorsId[0]],
      });
    }
  }
}
