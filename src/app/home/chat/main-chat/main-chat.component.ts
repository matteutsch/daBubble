import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ChatService } from 'src/app/home/shared/chat.service';
import { ChatMember, ChatMemberData } from 'src/app/models/models';
import { MatDialog } from '@angular/material/dialog';
import { DialogMemberProfileComponent } from '../../dialogs/dialog-member-profile/dialog-member-profile.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { ChatMessageComponent } from '../shared-components/chat-message/chat-message.component';
import { SelectService } from '../../shared/select.service';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren(ChatMessageComponent)
  chatMessages!: QueryList<ChatMessageComponent>;
  @ViewChild('ulChatMessages', { static: false }) ulChatMessageRef!: ElementRef;
  @ViewChild('customTextArea', { static: false }) customTextArea!: ElementRef;
  @Input() drawerThread: any;
  @Input() drawerSidebar: any;

  public selectedUser: ChatMember = new ChatMemberData();
  private memberSubscription!: Subscription;

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    public authService: AuthService,
    public selectService: SelectService,
    public messageService: MessageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupMemberSubscription();
  }

  ngOnDestroy(): void {
    this.memberSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.chatService.setTextareaRef(this.customTextArea);
    if (this.ulChatMessageRef) {
      this.messageService.ulChatMessages = this.ulChatMessageRef.nativeElement;
    }
    this.subscribeToChatMessages(this.chatMessages);
  }

  /**
   * Subscribe to changes in the chat messages and scroll to the bottom when all messages are loaded.
   * @param {QueryList<ChatMessageComponent>} messages - The list of chat message components.
   */
  subscribeToChatMessages(messages: QueryList<ChatMessageComponent>) {
    messages.changes.subscribe((messages: QueryList<ChatMessageComponent>) => {
      if (messages.length === this.messageService.currentMessages.length) {
        setTimeout(() => {
          this.chatService.scrollChatToBottom(
            this.ulChatMessageRef.nativeElement
          );
        }, 100);
      }
    });
  }

  /**
   * Sets up a subscription to update the selected user based on user updates.
   *
   * @returns {void}
   */
  private setupMemberSubscription(): void {
    this.memberSubscription = this.selectService.selectedUser.subscribe(
      (updatedMember: ChatMember) => (this.selectedUser = updatedMember)
    );
  }

  /**
   * Opens a dialog displaying the profile of a chat member.
   *
   * @param {ChatMember} member - The chat member for whom the profile will be displayed.
   * @returns {void}
   */
  openUserProfile(member: ChatMember): void {
    const dialogRef = this.dialog.open(DialogMemberProfileComponent, {
      panelClass: 'dialog-member-profile',
      data: member,
    });
  }
}
