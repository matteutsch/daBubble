import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { ChatService } from '../../shared/chat.service';
import { ChatMessageComponent } from '../shared-components/chat-message/chat-message.component';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements AfterViewInit {
  @Input() drawerThread: any;
  @ViewChild('ulThreadMessages') ulThreadMessagesRef!: ElementRef;
  @ViewChild('customThreadTextarea') customThreadTextareaRef!: ElementRef;
  @ViewChildren(ChatMessageComponent)
  threadMessages!: QueryList<ChatMessageComponent>;

  constructor(
    public drawerService: DrawerService,
    public chatService: ChatService,
    public userService: UserService,
    public messageService: MessageService
  ) {}

  ngAfterViewInit() {
    if (this.ulThreadMessagesRef) {
      this.messageService.ulThreadMessages =
        this.ulThreadMessagesRef.nativeElement;
    }
    this.subscribeToThreadMessages(this.threadMessages);
    this.chatService.setThreadTextareaRef(this.customThreadTextareaRef);
  }

  /**
   * Subscribe to changes in the thread messages and scroll to the bottom when all messages are loaded.
   * @param {QueryList<ChatMessageComponent>} messages - The list of chat message components.
   */
  subscribeToThreadMessages(messages: QueryList<ChatMessageComponent>) {
    messages.changes.subscribe((messages: QueryList<ChatMessageComponent>) => {
      if (
        messages.length - 1 ===
        this.messageService.threadMessage.answers.length
      ) {
        setTimeout(() => {
          this.chatService.scrollChatToBottom(
            this.ulThreadMessagesRef.nativeElement
          );
        }, 100);
      }
    });
  }

  /**
   * Closes the thread, and focuses the chat textarea.
   * @returns {void}
   */
  closeThread(): void {
    this.drawerService.closeDrawer(this.drawerThread);
    this.chatService.focusChatTextarea();
  }
}
