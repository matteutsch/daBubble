import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/home/shared/chat.service';
import { User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
})
export class CustomTextareaComponent implements OnInit {
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;
  @Input() type!: string;

  messageForm!: FormGroup;

  constructor(
    public chatService: ChatService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.messageForm = new FormGroup({
      messageControl: new FormControl('', [Validators.required]),
    });
  }

  async submit() {
    const textareaValue = this.messageForm.value.messageControl as string;
    if (textareaValue) {
      this.userService
        .getUser(this.authService.userID)
        .subscribe(async (currentUser) => {
          await this.send(currentUser, textareaValue);
        });
      this.messageForm.reset();
    }
  }

  async send(currentUser: User, textareaValue: string) {
    if (this.type === 'chat') {
      await this.chatService.sendMessage(currentUser, textareaValue);
      this.scrollToBottom(this.chatService.ulChatMessageRef);
    } else if (this.type === 'thread') {
      await this.chatService.sendAnswer(currentUser, textareaValue);
      this.scrollToBottom(this.chatService.ulThreadMessageRef);
    }
  }

  scrollToBottom(ref: ElementRef): void {
    if (ref) {
      const element = ref.nativeElement;
      element.scrollTop = element.scrollHeight;
    } else {
      console.error('Element reference not available.');
    }
  }
}
