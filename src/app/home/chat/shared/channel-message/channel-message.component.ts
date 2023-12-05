import { Component, Input } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-channel-message',
  templateUrl: './channel-message.component.html',
  styleUrls: ['./channel-message.component.scss']
})
export class ChannelMessageComponent {

  @Input() drawerThread: any;

  constructor(public drawerService: DrawerService) {}
}
