import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import localeDe from '@angular/common/locales/de';
import { ChatService } from 'src/app/home/shared/chat.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit {
  @Input() drawerThread: any;
  @Input() message: any;
  @ViewChild('') chatTextArea!: ElementRef;

  timestamp!: number;
  date: Date | undefined;
  public formattedTime!: string;
  public formattedDate!: string;

  constructor(
    public drawerService: DrawerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    console.log('message:', this.message);
    
    registerLocaleData(localeDe);
    if (this.message) {
      this.timestamp = this.message.timestampData;
      this.date = new Date(this.timestamp);
      this.formattedTime = this.datePipe.transform(this.date, 'HH:mm') + ' Uhr';
      this.formattedDate = this.datePipe.transform(this.date, 'EEEE, dd MMMM', 'de') ?? '';
    }
  }
}
