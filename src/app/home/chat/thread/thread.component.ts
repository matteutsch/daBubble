import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { ChatService } from '../../shared/chat.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements AfterViewInit {
  @Input() drawerThread: any;
  @ViewChild('ulThreadMessages') ulThreadMessagesRef!: ElementRef;

  constructor(
    public drawerService: DrawerService,
    public chatService: ChatService,
    public authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.chatService.ulThreadMessageRef = this.ulThreadMessagesRef;
  }

  closeThread() {
    this.drawerService.closeDrawer(this.drawerThread);
  }
}
