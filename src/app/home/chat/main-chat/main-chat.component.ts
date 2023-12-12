import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/home/shared/chat.service';
import { Chats } from 'src/app/models/models';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss'],
})
export class MainChatComponent {
  @Input() drawerThread: any;
  @Input() chats!: Chats;

  constructor(public chatService: ChatService) { }
}
