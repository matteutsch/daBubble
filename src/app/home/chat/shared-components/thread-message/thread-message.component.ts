import { Component, HostListener } from '@angular/core';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-thread-message',
  templateUrl: './thread-message.component.html',
  styleUrls: ['./thread-message.component.scss']
})

export class ThreadMessageComponent {
  emojiMartVisible = false;
  selectedEmoji: string | null = null;
  emojiCount: number = 0;
  showEmojiPicker = false;
  textareaValue: string = '';
  emojiCountCheckMark:  number = 0;
  emojiCountRocket: number = 0;


  constructor(
    public emojiService: EmojiService,
  ) {
    this.emojiService.emoji$.subscribe((emoji) => {
      console.log('myemoji', this.textareaValue);
      this.textareaValue = emoji;
    });
  }

/**
 * Called when a click event occurs on the document. Checks if the click is outside
 * the emoji picker and emoji symbol, and closes the picker accordingly.
 * @param event - The click event.
 */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    const isEmojiPickerClick = clickedElement.matches('.emoji-picker, .emoji-picker *');
    const isEmojiSymbolClick = clickedElement.matches('.icon-sentiment, .icon-sentiment *');
  
    if (!isEmojiPickerClick && !isEmojiSymbolClick) {
      this.showEmojiPicker = false;
    }
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  /**
 * Adds an emoji reaction and increments the corresponding counter.
 * @param emojiType - The type of the selected emoji ('check-mark' or 'rocket').
 */
  addEmoji(emojiType: string) {
    
    if (emojiType === 'check-mark') {
      this.emojiCountCheckMark++; 
    } else if (emojiType === 'rocket') {
      this.emojiCountRocket++; 
    }

}
}