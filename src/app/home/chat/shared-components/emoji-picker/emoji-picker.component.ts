import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/home/shared/chat.service';
import { MessageService } from 'src/app/home/shared/message.service';
import { EmojiData, EmojiPicker, Message } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
})
export class EmojiPickerComponent {
  @Input() emojiInput$: any;
  @Input() message!: Message;
  @Input() messageIndex!: number;
  @Input() answerIndex!: number;
  @Input() type!: string;

  isOpened: boolean = false;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    public messageService: MessageService
  ) {}

  /**
   * Adds the selected emoji to the textarea.
   *
   * @param {any} event - The event containing the selected emoji.
   * @returns {void}
   *
   */
  addTextareaEmoji(event: any): void {
    this.appendInputValue(event.emoji.native);
    this.toggledTextareaEmoji();
  }

  /**
   * Appends the selected emoji to the input field value.
   *
   * @param {any} newContent - The new content (emoji) to be added.
   * @returns {void}
   */
  appendInputValue(newContent: any): void {
    if (this.emojiInput$) {
      const currentValue = this.emojiInput$.value;
      const updatedValue = currentValue + newContent;
      this.emojiInput$.value = updatedValue;
    }
  }

  /**
   * Toggles the state of the textarea emoji selection between open and closed.
   */
  toggledTextareaEmoji() {
    this.isOpened = !this.isOpened;
  }

  /**
   * Adds the selected emoji to the message and updates the chat.
   *
   * @param {any} event - The event containing the selected emoji.
   * @returns {Promise<void>}
   */
  public async addMessageEmoji(event: any): Promise<void> {
    const newEmoji: EmojiPicker = this.createNewEmoji(event);
    if (this.type === 'chat') {
      this.messageService.addMsgEmoji(
        this.chatService.currentChat,
        this.message,
        newEmoji
      );
    } else if (this.type === 'thread') {
      this.messageService.addAnswerEmoji(
        this.chatService.currentChat,
        newEmoji,
        this.answerIndex
      );
    }
    this.isOpened = !this.isOpened;
  }

  /**
   * Creates a new emoji object from the selected emoji event.
   *
   * @param {any} event - The event containing the selected emoji.
   * @returns {EmojiPicker} - The created emoji object.
   */
  createNewEmoji(event: any): EmojiPicker {
    const newEmoji: EmojiPicker = new EmojiData(
      event.emoji
    ).toFirestoreObject();
    newEmoji.quantity++;
    newEmoji.authorsId.push(this.userService.user.uid);
    return newEmoji;
  }

  /**
   * Toggles the state of message emoji selection between open and closed.
   *
   */
  toggledMessageEmoji() {
    this.isOpened = !this.isOpened;
  }
}
