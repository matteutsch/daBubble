import {
  Component,
  OnChanges,
  Input,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/home/shared/chat.service';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { Message, MessageData, User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-message-form',
  templateUrl: './edit-message-form.component.html',
  styleUrls: ['./edit-message-form.component.scss'],
})
export class EditMessageFormComponent implements OnChanges, AfterViewInit {
  @Input() isEditing: any;
  @Output() isEditingChanged = new EventEmitter<boolean>();
  @Input() message: any;
  @Input() messageIndex!: number;
  @Input() user!: User;
  @Input() type!: string;
  @ViewChild('messageTextArea', { static: false }) messageTextArea!: ElementRef;
  editMessageForm!: FormGroup;

  constructor(
    public drawerService: DrawerService,
    private chatService: ChatService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnChanges() {
    this.editMessageForm = new FormGroup({
      messageControl: new FormControl(this.message?.content, [
        Validators.required,
      ]),
    });
  }

  ngAfterViewInit() {
    this.adjustTextareaHeight();
  }

  async saveEditedMessage() {
    const textareaValue = this.editMessageForm.value.messageControl as string;
    const newMessage = this.createMessage(textareaValue);
    if (this.type === 'chat') {
      this.updateMessagesArray(newMessage);
    } else if (this.type === 'thread') {
      this.updateAnswersArray(newMessage);
    }
    await this.updateChatMessages();
    this.toggleEditing();
  }

  private createMessage(textareaValue: string): Message {
    return new MessageData(
      this.user,
      textareaValue,
      new Date().getTime()
    ).toFirestoreObject();
  }

  private updateMessagesArray(newMessage: Message): void {
    const messagesArr = this.chatService.currentChat.messages;
    messagesArr?.forEach(() => {
      messagesArr[this.messageIndex] = newMessage;
    });
  }

  private updateAnswersArray(newMessage: any): void {
    const messagesArr = this.chatService.currentChat.messages;
    messagesArr?.forEach(() => {
      messagesArr[this.chatService.threadMessageIndex].answers![
        this.messageIndex
      ] = newMessage;
    });
  }

  private async updateChatMessages(): Promise<void> {
    const ref = this.chatService.getPrivateChatRef(
      this.chatService.currentChat.id
    );
    const messagesArr = this.chatService.currentChat.messages;
    await ref.update({ messages: messagesArr });
  }

  adjustTextareaHeight() {
    this.messageTextArea.nativeElement.style.overflow = 'hidden';
    this.messageTextArea.nativeElement.style.height = 'auto';
    this.messageTextArea.nativeElement.style.height = `${this.messageTextArea.nativeElement.scrollHeight}px`;
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.isEditingChanged.emit(this.isEditing);
  }
}
