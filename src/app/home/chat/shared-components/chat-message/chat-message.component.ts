import { registerLocaleData } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import localeDe from '@angular/common/locales/de';
import { ChatService } from 'src/app/home/shared/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() drawerThread: any;
  @Input() message: any;
  @Input() messageIndex!: number;
  @Input() type!: string;
  @ViewChild('') chatTextArea!: ElementRef;

  date: Date | undefined;

  targetElementColor: string = '';
  targetElementDisplay: string = '';
  isEditing: boolean = false;
  user: any = {};

  constructor(
    public drawerService: DrawerService,
    private chatService: ChatService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit() {
    registerLocaleData(localeDe);
    this.authService.user.subscribe((user) => {
      if (user) {
        this.userService.getUser(user.uid).subscribe((currentUser) => {
          this.user = currentUser;
        });
      }
    });
  }

  onIsEditingChanged(newValue: boolean) {
    this.isEditing = newValue;
  }

  changeStyle(isMouseOver: boolean) {
    this.targetElementColor = isMouseOver ? '#eceefe' : '';
    this.targetElementDisplay = isMouseOver ? 'inline-flex' : '';
  }

  async setThreadMessage() {
    this.chatService.threadMessage = this.message;
    this.chatService.threadMessageIndex = this.messageIndex;
  }

  openThread() {
    this.setThreadMessage();
    this.drawerService.openDrawer(this.drawerThread);
    console.log('this.chatService.threadMessage', this.chatService.threadMessage);
    
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }
}
