import { Component } from '@angular/core';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent {

  showEmojiPopup: boolean = false;
  emojiMartVisible = false;
  textareaValue: string = '';


  constructor(public emojiService:EmojiService) { }



  toggleEmojiPopup(): void {
    this.emojiService.toggleEmojiPopup(this.emojiMartVisible)
  }

  // addEmoji(_emoji: string) {
  //   this.textareaValue += _emoji;
  //   // this.showEmojiPopup = false;
  // }
  
  // closePopups(): void {
  //   this.showEmojiPopup = false;
    
  // }
}
