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
import { MessageService } from 'src/app/home/shared/message.service';
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
  @Input() answerIndex!: number;
  @Input() type!: string;
  @ViewChild('messageTextArea', { static: false }) messageTextArea!: ElementRef;

  editMessageForm!: FormGroup;

  constructor(
    public drawerService: DrawerService,
    private chatService: ChatService,
    public authService: AuthService,
    public userService: UserService,
    private messageService: MessageService
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
    this.messageTextArea.nativeElement.focus();
  }

  /**
   * Saves the edited message and updates chat or thread messages accordingly.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  public async saveEditedMessage(): Promise<void> {
    const textareaValue = this.editMessageForm.value.messageControl as string;
    if (this.type === 'chat') {
      this.messageService.updateMessage(
        this.chatService.currentChat,
        this.message,
        textareaValue
      );
    } else if (this.type === 'thread') {
      this.messageService.updateAnswer(
        this.chatService.currentChat,
        textareaValue,
        this.answerIndex
      );
    }
    this.toggleEditing();
  }

  /**
   * Adjusts the height of the textarea based on its content.
   */
  adjustTextareaHeight() {
    this.messageTextArea.nativeElement.style.overflow = 'hidden';
    this.messageTextArea.nativeElement.style.height = 'auto';
    this.messageTextArea.nativeElement.style.height = `${this.messageTextArea.nativeElement.scrollHeight}px`;
  }

  /**
   * Toggles the editing state and emits the change.
   */
  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.isEditingChanged.emit(this.isEditing);
  }
}
