import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import localeDe from '@angular/common/locales/de';
import { ChatService } from 'src/app/home/shared/chat.service';
import { Message } from 'src/app/models/models';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() drawerThread: any;
  @Input() message: any;
  @ViewChild('') chatTextArea!: ElementRef;

  date: Date | undefined;

  constructor(
    public drawerService: DrawerService,
    private datePipe: DatePipe,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    registerLocaleData(localeDe);
  }

  getUpdateFormattedTime(message: Message) {
    if (message) {
      const date = new Date(message.timestampData);
      const formattedTime = this.datePipe.transform(date, 'HH:mm') + ' Uhr';
      return formattedTime;
    }
    return null;
  }

  getUpdateFormattedDate(message: Message) {
    if (message) {
      const date = new Date(message.timestampData);
      const formattedDate = this.datePipe.transform(date, 'EEEE, dd MMMM', 'de') ?? '';
      return formattedDate;
    }
    return null;
  }

  async setThreadMessage() {
    this.chatService.threadMessage = this.message;
  }

  openThread() {
    this.setThreadMessage();
    this.drawerService.openDrawer(this.drawerThread);
  }
}
