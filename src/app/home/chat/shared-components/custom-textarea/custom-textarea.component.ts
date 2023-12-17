import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/home/shared/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
})
export class CustomTextareaComponent {
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;

  constructor(
    public chatService: ChatService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  send() {
    const textareaValue: string = this.textArea.nativeElement.value;
    this.userService
      .getUser(this.authService.userID)
      .subscribe((currentUser) => {
        this.chatService.sendMessage(currentUser, textareaValue);
      });
  }
}
