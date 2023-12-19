import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/home/shared/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
})
export class CustomTextareaComponent implements OnInit {
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;

  messageForm!: FormGroup;

  constructor(
    public chatService: ChatService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.messageForm = new FormGroup({
      messageControl: new FormControl('', [Validators.required])
    });
  }

  async send() {
    const textareaValue = this.messageForm.value.messageControl as string;
    if (textareaValue) {
      this.userService
        .getUser(this.authService.userID)
        .subscribe(async (currentUser) => {
          await this.chatService.sendMessage(currentUser, textareaValue);
          this.scrollChatToBottom();
        });
        this.messageForm.reset();
    }
  }

  scrollChatToBottom(): void {
    if (this.chatService.ulChatMessageRef) {
      const chatMessagesElement =
        this.chatService.ulChatMessageRef.nativeElement;
      chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
    } else {
      console.error('Element reference not available.');
    }
  }
}
