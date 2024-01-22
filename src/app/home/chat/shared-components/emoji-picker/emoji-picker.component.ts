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

  emojiFilter = (e: any) =>
    ![
      '1F972',
      '1F978',
      '1FAC0',
      '1FAC1',
      '1F90C',
      '1F9AC',
      '1F9A3',
      '1F9AB',
      '1F9A4',
      '1FAB6',
      '1F9AD',
      '1FAB2',
      '1FAB1',
      '1FAB0',
      '1FAB3',
      '1FAB4',
      '1FAD0',
      '1FAD2',
      '1FAD1',
      '1FAD3',
      '1FAD5',
      '1FAD4',
      '1FAD6',
      '1F9CB',
      '1FA84',
      '1FA86',
      '1FA85',
      '1FAA2',
      '1FAA1',
      '1F6D6',
      '1FAB5',
      '1FAA8',
      '1F6FC',
      '1F6FB',
      '1FA96',
      '1FA98',
      '1FA97',
      '1FA9D',
      '1FA9B',
      '1FA9A',
      '1FA83',
      '1FA9C',
      '1F6D7',
      '1FA9E',
      '1FA9F',
      '1FAA4',
      '1FAA5',
      '1FAA3',
      '1FAA0',
      '1FAA7',
      '1FAA6',
      
    ].includes(e);

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
    if (!this.emojiInput$) {
      return;
    }
    const currentValue = this.emojiInput$.value.messageControl || '';
    const updatedValue = currentValue + newContent;
    this.emojiInput$.get('messageControl').setValue(updatedValue);
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
