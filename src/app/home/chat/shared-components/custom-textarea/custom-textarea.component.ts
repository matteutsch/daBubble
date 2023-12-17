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
  @ViewChild('textArea', {static:false}) textArea!: ElementRef;
  // showEmojiPopup: boolean = false;
  emojiMartVisible = false;
  // textareaValue: string = '';


  constructor(public emojiService: EmojiService,
    public chatService: ChatService,
    public authService: AuthService,
    public userService: UserService
  ) {}

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
