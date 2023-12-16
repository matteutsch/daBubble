import { Component, ElementRef, ViewChild } from '@angular/core';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
})
export class CustomTextareaComponent {
  // showEmojiPopup: boolean = false;
  emojiMartVisible = false;
  // textareaValue: string = '';


  constructor(public emojiService: EmojiService) {}

  toggleEmojiPopup(): void {

    this.emojiMartVisible = !this.emojiMartVisible;
    
  }

}
