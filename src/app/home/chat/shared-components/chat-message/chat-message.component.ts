import { registerLocaleData } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import localeDe from '@angular/common/locales/de';
import { ChatService } from 'src/app/home/shared/chat.service';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { EmojiPicker, Message, MessageData, User } from 'src/app/models/models';
import { MessageService } from 'src/app/home/shared/message.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, OnChanges, OnDestroy {
  @Input() drawerThread: any;
  @Input() drawerSidebar: any;
  @Input() message: Message = new MessageData();
  @Input() messageAuthor!: User;
  @Input() messageIndex!: number;
  @Input() answerIndex!: number;
  @Input() msgType!: string;
  @Input() chatType!: string;
  @Input() chatId!: string;

  date: Date | undefined;
  targetElementColor: string = '';
  targetElementDisplay: string = '';
  isEditing: boolean = false;
  allEmojiAuthors: User[][] = [];
  messageSubscription!: Subscription;

  constructor(
    public drawerService: DrawerService,
    private chatService: ChatService,
    public userService: UserService,
    private firestoreService: FirestoreService,
    private messageService: MessageService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    registerLocaleData(localeDe);
    this.getAuthor(this.message);
    this.setMsgSubscribe();
  }

  ngOnChanges() {
    this.getEmojiAuthors(this.message);
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  /**
   * @private
   * Sets up a subscription to listen for updates on a specific chat message.
   * Retrieves the message using the provided chat ID, chat type, and message ID,
   * and subscribes to changes in the message content.
   * When the message is updated, various handlers are called to manage thread messages,
   * edited answers, added answers, and removed answers.
   * Additionally, it retrieves and updates the authors of emoji reactions in the message.
   * @returns {void}
   */
  private setMsgSubscribe(): void {
    if (this.chatId && this.chatType) {
      if (this.chatId.length > 0) {
        try {
          const messageRef = this.afs
            .collection(`${this.chatType}Chats`)
            .doc(this.chatId)
            .collection('messages')
            .doc(this.message.msgId)
            .valueChanges();
          this.messageSubscription = messageRef.subscribe((res) => {
            const updatedMsg = res as Message;
            this.message = updatedMsg;
            let threadMsg = this.messageService.threadMessage;
            if (this.message.msgId === threadMsg.msgId) {
              threadMsg = this.message;
              this.handleEditedAnswers();
              this.handleAddedAnswers(updatedMsg.answers);
              this.handleRemovedAnswers(updatedMsg.answers);
            }
            this.getEmojiAuthors(this.message);
          });
        } catch (error) {
          console.error(`Error retrieving messages: ${error}`);
        }
      }
    }
  }

  /**
   * @private
   * Handles edited answers in the context of a threaded message.
   * Compares each answer in the thread message with the corresponding answer in the current message.
   * If an answer is edited (content is different), updates the answer in the thread message.
   * @returns {void}
   */
  private handleEditedAnswers(): void {
    this.messageService.threadMessage.answers.forEach(
      (answer: Message, answerIndex: number) => {
        if (
          JSON.stringify(answer) !==
          JSON.stringify(this.message.answers[answerIndex])
        ) {
          this.messageService.threadMessage.answers[answerIndex] =
            this.message.answers[answerIndex];
        }
      }
    );
  }

  /**
   * @private
   * Handles added answers in the context of a threaded message.
   * Filters out newly added answers that do not already exist in the thread message's answers.
   * Appends the filtered new answers to the thread message's answers array.
   * @param {Message[]} messages - An array of messages representing added answers.
   * @returns {void}
   */
  private handleAddedAnswers(messages: Message[]): void {
    const newMessages = messages.filter(
      (newMsg: Message) =>
        !this.messageService.threadMessage.answers.some(
          (existingMsg: Message) => existingMsg.msgId == newMsg.msgId
        )
    );
    this.messageService.threadMessage.answers.push(...newMessages);
  }

  /**
   * @private
   * Handles removed answers in the context of a threaded message.
   * Filters out answers that exist in the thread message's answers but are not present in the provided messages.
   * Removes the filtered answers from the thread message's answers array.
   * @param {Message[]} messages - An array of messages representing the remaining answers.
   * @returns {void}
   */
  private handleRemovedAnswers(messages: Message[]): void {
    const removedMessages = this.messageService.threadMessage.answers.filter(
      (existingMsg: Message) =>
        !messages.some((newMsg: Message) => newMsg.msgId === existingMsg.msgId)
    );
    removedMessages.forEach((removedMsg: Message) => {
      const index = this.messageService.threadMessage.answers.findIndex(
        (existingMsg: Message) => existingMsg.msgId === removedMsg.msgId
      );
      if (index !== -1) {
        this.messageService.threadMessage.answers.splice(index, 1);
      }
    });
  }

  /**
   * Deletes an emoji at the specified index.
   *
   * @param {number} emojiIndex - The index of the emoji to be deleted.
   * @returns {Promise<void>} - A promise that resolves once the emoji is deleted.
   */
  public async deleteEmoji(emojiIndex: number): Promise<void> {
    if (this.msgType === 'chat') {
      this.messageService.deleteMsgEmoji(
        this.chatService.currentChat,
        this.message,
        emojiIndex,
        this.userService.user
      );
    } else if (this.msgType === 'thread') {
      this.messageService.deleteAnsweremoji(
        this.chatService.currentChat,
        this.answerIndex,
        emojiIndex,
        this.userService.user
      );
    }
  }

  /**
   * Retrieves authors associated with emojis in a message.
   *
   * @param {Message} message - The message containing emojis.
   * @returns {void}
   */
  public getEmojiAuthors(message: Message): void {
    message.emoji.forEach((emoji: EmojiPicker) => {
      const emogiAuthors: User[] = [];
      emoji.authorsId.forEach(async (authorId: string) => {
        const author: User =
          await this.firestoreService.getDocumentFromCollection(
            'users',
            authorId
          );
        emogiAuthors.push(author);
      });
      this.allEmojiAuthors.push(emogiAuthors);
    });
  }

  /**
   * Retrieves the author information for the given message.
   *
   * @async
   * @param {Message} msg - The message for which to retrieve the author information.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  public async getAuthor(msg: Message): Promise<void> {
    if (msg) {
      this.messageAuthor =
        await this.firestoreService.getDocumentFromCollection(
          'users',
          this.message.authorID
        );
    }
  }

  onIsEditingChanged(newValue: boolean) {
    this.isEditing = newValue;
  }

  changeStyle(isMouseOver: boolean) {
    this.targetElementColor = isMouseOver ? '#eceefe' : '';
    this.targetElementDisplay = isMouseOver ? 'inline-flex' : '';
  }

  /**
   * Sets the thread message, thread message index, and thread name based on the current message.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async setThreadMessage(): Promise<void> {
    this.messageService.threadMessage = this.message;
    this.messageService.threadMessageAuthor = this.messageAuthor;
    this.messageService.threadMessageIndex = this.messageIndex;
    const currentChat = this.chatService.currentChat;
    this.messageService.threadName =
      currentChat.type === 'channel'
        ? `# ${currentChat.name}`
        : currentChat.name;
  }

  /**
   * Opens the thread, sets the thread message, opens the thread, and focuses the thread textarea.
   * @async
   * @function
   * @returns {Promise<void>} A Promise that resolves when the thread is opened and the textarea is focused.
   */
  public async openThread(): Promise<void> {
    await this.setThreadMessage();
    await this.drawerService.openDrawer(this.drawerThread);
    this.chatService.focusThreadTextarea();
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  /**
   * Deletes a message from the current chat.
   * Calls the `deleteMessage` method in the message service to delete the specified message.
   * If the deleted message is the current thread message, it closes the thread drawer.
   *
   * @param {Message} message - The message to be deleted.
   * @returns {Promise<void>} - A promise indicating the success or failure of the deletion.
   */
  public async deleteMsg(message: Message): Promise<void> {
    await this.messageService.deleteMessage(
      this.chatService.currentChat,
      message
    );
    if (
      message.timestampData === this.messageService.threadMessage.timestampData
    ) {
      this.drawerService.closeDrawer(this.drawerThread);
    }
  }

  toggleSidebarAndThread() {
    if (this.drawerService.innerWidth < 1300) {
      if (this.drawerSidebar!.opened) {
        this.drawerService.isSideMenuOpen = false;
        this.drawerService.closeDrawer(this.drawerSidebar!);
      }
      this.openThread();
    } else {
      this.openThread();
    }
  }
}
