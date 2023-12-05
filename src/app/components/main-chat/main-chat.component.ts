import { Component, Input } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent {

  @Input() drawerThread: any;

  constructor(public chatService: ChatService) {

  }

}
