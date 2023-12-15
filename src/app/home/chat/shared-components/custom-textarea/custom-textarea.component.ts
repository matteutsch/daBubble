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

  // [x: string]: any;

  //   toggleEmojiPicker(index: number) {
  //     this.showEmojiPicker[index] = !this.showEmojiPicker[index];
  //   }

  //   @ViewChild('textArea', { static: false }) textArea!: ElementRef;
  // showEmojiPicker: any;

  constructor(public emojiService: EmojiService) {}

  toggleEmojiPopup(): void {

    this.emojiMartVisible = !this.emojiMartVisible;
    // this.emojiService.toggleEmojiPopup(this.emojiMartVisible);
  }
  // toggleEmojiPopup(): void {
  //   this.emojiMartVisible = !this.emojiMartVisible;
  // }

  // addEmoji(_emoji: string) {
  //   this.textareaValue += _emoji;
  //   // this.showEmojiPopup = false;
  // }

  // // closePopups(): void {
  // //   this.showEmojiPopup = false;

  // // }
}
