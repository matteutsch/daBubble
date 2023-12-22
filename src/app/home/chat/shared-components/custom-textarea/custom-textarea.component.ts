import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ChatService } from 'src/app/home/shared/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
})

export class CustomTextareaComponent {
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;


  message = '';
  showEmojiPicker = false;
  emojiMartVisible = false;
  textareaValue: string = '';
  selectedEmoji: string | null = null;

  constructor(
    public emojiService: EmojiService,
    public chatService: ChatService,
    public authService: AuthService,
    public userService: UserService
  ) {
    this.emojiService.emoji$.subscribe((emoji) => {
      //this.textareaValue = this.textArea.nativeElement.value;
      console.log('myemoji', this.textareaValue);
      this.textareaValue = emoji;
    });
  }


  /**
 * Called when a click event occurs on the document. Checks if the click is outside
 * the emoji picker and emoji symbol, and closes the picker accordingly.
 * @param event - The click event.
 */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    const isEmojiPickerClick = clickedElement.matches('.emoji-picker, .emoji-picker *');
    const isEmojiSymbolClick = clickedElement.matches('.icon-sentiment, .icon-sentiment *');

    if (!isEmojiPickerClick && !isEmojiSymbolClick) {
      this.showEmojiPicker = false;
    }
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  /**
* Adds an emoji to the message and updates the message text accordingly.
* @param event - The emoji selection event containing the selected emoji information.
*/
  addEmoji(event: any) {
    console.log(this.message);
    const { message } = this;
    console.log(message);
    console.log(`${event.emoji.native}`);
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    // this.showEmojiPicker = false;
  }

  send() {
    const textareaValue: string = this.textArea.nativeElement.value;
    this.userService
      .getUser(this.authService.userID)
      .subscribe((currentUser) => {
        this.chatService.sendMessage(currentUser.name, textareaValue);
      });
  }


}
