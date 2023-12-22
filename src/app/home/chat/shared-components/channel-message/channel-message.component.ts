import { Component, Input } from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-channel-message',
  templateUrl: './channel-message.component.html',
  styleUrls: ['./channel-message.component.scss']
})
export class ChannelMessageComponent {

  emojiMartVisible = false;

  //TODO: The component name of 'channel-message' should be renamed to 'chat-message' (because this is a component used in both chats, not just in a specific one.).
  @Input() drawerThread: any;

  constructor(public drawerService: DrawerService, public emojiService: EmojiService) {}

  toggleEmojiPicker(): void {

    this.emojiMartVisible = !this.emojiMartVisible;
    // this.emojiService.toggleEmojiPopup(this.emojiMartVisible);
  }
}
