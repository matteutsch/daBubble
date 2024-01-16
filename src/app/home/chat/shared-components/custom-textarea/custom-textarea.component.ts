import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/home/shared/chat.service';
import { MessageService } from 'src/app/home/shared/message.service';
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
    public userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.messageForm = new FormGroup({
      messageControl: new FormControl('', [
        Validators.required,
        this.customValidation.bind(this),
      ]),
    });
    this.chatService.chatType.subscribe(() => {
      this.updateControlValidity();
    });
  }

  /**
   * Handles the submission of the message form.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async submit(): Promise<void> {
    const textareaValue = this.messageForm.value.messageControl as string;
    if (textareaValue) {
      await this.send(this.userService.user.uid, textareaValue);
      this.messageForm.reset();
    }
  }

  /**
   * Sends a message to the chat or an answer to a thread.
   *
   * @async
   * @param {string} authorID - The ID of the message author.
   * @param {string} textareaValue - The content of the message.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async send(authorID: string, textareaValue: string): Promise<void> {
    if (this.type === 'chat') {
      await this.messageService.sendMessage(authorID, textareaValue, this.chatService.currentChat);
      this.chatService.scrollChatToBottom(this.messageService.ulChatMessages);
      this.chatService.focusChatTextarea();
    } else if (this.type === 'thread') {
      await this.messageService.sendAnswer(authorID, textareaValue, this.chatService.currentChat);
      this.chatService.scrollChatToBottom(this.messageService.ulThreadMessages);
      this.chatService.focusThreadTextarea();
    }
  }

  /**
   * Validates the FormControl based on the current chat type.
   * @param {FormControl} control - The FormControl to be validated.
   * @returns {ValidationErrors | null} - Validation errors or null if valid.
   */
  customValidation(control: FormControl): { [key: string]: any } | null {
    const currentChatType = this.chatService.currentChat.type;
    if (currentChatType === 'default') {
      return { invalidType: true };
    }
    if (currentChatType === 'channel' || currentChatType === 'private') {
      return null;
    }
    return { invalidType: true };
  }

  /**
   * Updates the validity of the 'messageControl' FormControl in the messageForm.
   */
  updateControlValidity(): void {
    const control = this.messageForm.get('messageControl');
    if (control) {
      control.updateValueAndValidity();
    }
  }
}
