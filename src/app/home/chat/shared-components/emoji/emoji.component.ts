import { Component } from '@angular/core';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent {

  showEmojiPopup: boolean = false;
  // emojiMartVisible = false;
  textareaValue: string = '';


  constructor(public emojiService:EmojiService) { }


  // closePopups(): void {
  //   this.showEmojiPopup = false;
    
  // }
}
