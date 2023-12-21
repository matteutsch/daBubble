import { Component, ElementRef, ViewChild } from '@angular/core';
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

  name = 'Angular';
  message = '';
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger',
  ];

  // showEmojiPopup: boolean = false;
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

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    console.log(this.message);
    const { message } = this;
    console.log(message);
    console.log(`${event.emoji.native}`);
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    // this.showEmojiPicker = false;
  }

  onFocus() {
    console.log('focus');
    this.showEmojiPicker = false;
  }
  onBlur() {
    console.log('onblur');
  }

  /* onInput(event: any) {
    this.textareaValue = (event.target as HTMLTextAreaElement).value;
    console.log('Textarea Value:', this.textareaValue);
  } */
  send() {
    const textareaValue: string = this.textArea.nativeElement.value;
    this.userService
      .getUser(this.authService.userID)
      .subscribe((currentUser) => {
        this.chatService.sendMessage(currentUser.name, textareaValue);
      });
  }

  toggleEmojiPopup(): void {
    this.emojiMartVisible = !this.emojiMartVisible;
  }
}
