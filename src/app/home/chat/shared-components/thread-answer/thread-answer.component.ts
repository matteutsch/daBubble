import { registerLocaleData } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/home/shared/chat.service';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { MessageService } from 'src/app/home/shared/message.service';
import { EmojiPicker, Message, MessageData, User } from 'src/app/models/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';
import localeDe from '@angular/common/locales/de';

@Component({
  selector: 'app-thread-answer',
  templateUrl: './thread-answer.component.html',
  styleUrls: ['./thread-answer.component.scss'],
})
export class ThreadAnswerComponent {
  @Input() drawerThread: any;
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

  constructor(
    public drawerService: DrawerService,
    private chatService: ChatService,
    public userService: UserService,
    private firestoreService: FirestoreService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    registerLocaleData(localeDe);
    this.getAuthor(this.message);
  }

  ngOnChanges() {
    this.getEmojiAuthors(this.message);
  }

  /**
   * Deletes an emoji at the specified index or adds a new emoji if the user has not reacted before.
   *
   * @param {number} emojiIndex - The index of the emoji to be deleted or added.
   * @param {EmojiPicker} emoji - The emoji to be added if the user has not reacted before.
   * @returns {Promise<void>} - A promise that resolves once the emoji is deleted or added.
   */
  async deleteOrAddEmoji(
    emojiIndex: number,
    emoji: EmojiPicker
  ): Promise<void> {
    const userIndex = emoji.authorsId.indexOf(this.userService.user.uid);
    if (userIndex !== -1) {
      this.messageService.deleteAnswerEmoji(
        this.chatService.currentChat,
        this.answerIndex,
        emojiIndex,
        this.userService.user
      );
    } else {
      this.messageService.addAnswerEmoji(
        this.chatService.currentChat,
        emoji,
        this.answerIndex,
        this.userService.user.uid
      );
    }
  }

  /**
   * Retrieves authors associated with emojis in a message.
   *
   * @param {Message} message - The message containing emojis.
   * @returns {void}
   */
  getEmojiAuthors(message: Message): void {
    message.emoji.forEach((emoji: EmojiPicker) => {
      const emojiAuthors: User[] = [];
      emoji.authorsId.forEach(async (authorId: string) => {
        const author: User =
          await this.firestoreService.getDocumentFromCollection(
            'users',
            authorId
          );
        emojiAuthors.push(author);
      });
      this.allEmojiAuthors.push(emojiAuthors);
    });
  }

  /**
   * Retrieves the author information for the given message.
   *
   * @async
   * @param {Message} msg - The message for which to retrieve the author information.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async getAuthor(msg: Message): Promise<void> {
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

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  /**
   * Deletes an answer from the current chat thread.
   * Calls the `deleteAnswer` method in the message service to delete the specified answer.
   *
   * @returns {void}
   */
  public deleteMsg(): void {
    this.messageService.deleteAnswer(
      this.answerIndex,
      this.chatService.currentChat
    );
  }
}
