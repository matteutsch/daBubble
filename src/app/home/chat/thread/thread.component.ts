import { Component, Input, OnInit } from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { ChatService } from '../../shared/chat.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent {
  @Input() drawerThread: any;

  constructor(
    public drawerService: DrawerService,
    public chatService: ChatService
    ) {}

    closeThread() {
      this.drawerService.closeDrawer(this.drawerThread)
    }
}
