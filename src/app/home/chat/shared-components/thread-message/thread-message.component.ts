import { Component } from '@angular/core';

@Component({
  selector: 'app-thread-message',
  templateUrl: './thread-message.component.html',
  styleUrls: ['./thread-message.component.scss']
})
export class ThreadMessageComponent {
  emojiMartVisible = false;
  
  toggleEmojiPopup(): void {

    this.emojiMartVisible = !this.emojiMartVisible;
    // this.emojiService.toggleEmojiPopup(this.emojiMartVisible);
  }
}
