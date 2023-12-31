import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ChatService } from 'src/app/home/shared/chat.service';
import { User } from 'src/app/models/models';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent implements AfterViewInit {
  @ViewChild('customTextArea', { static: false }) customTextArea!: ElementRef;
  @Input() drawerThread: any;
  @Input() chats!: any;
  @Input() currentUser!: User;

  constructor(public chatService: ChatService) {}

  ngAfterViewInit() {
    this.chatService.setTextareaRef(this.customTextArea);
  }
}
