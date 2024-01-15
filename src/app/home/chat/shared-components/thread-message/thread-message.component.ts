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
  emojiCountCheckMark: number = 0;
  emojiCountRocket: number = 0;
  emojis: any;
  imageUrl: any;

  // emojis = [
  //   { type: 'check-mark', imageUrl: '../../../assets/emoji/emoji _check mark_.png', count: 0, name: 'Sofia Müller', text: 'hat reagiert' },
  //   { type: 'rocket', imageUrl: '../../../assets/emoji/emoji _rocket_.png', count: 0, name: 'Noah Braun', text: 'hat reagiert' },
  //   // Füge hier weitere Emoji-Typen hinzu, wenn nötig
  // ];

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
    // // const emoji = this.emojis.find(e => e.type === emojiType);
    // // if (emoji) {
    // //   emoji.count++;
    // // }

    // let emoji = this.emojis.find((e: { type: string; }) => e.type === emojiType);

    // if (emoji) {
    //   emoji.count++;
    // }

    if (emojiType === 'check-mark') {
      this.emojiCountCheckMark++;
    } else if (emojiType === 'rocket') {
      this.emojiCountRocket++;
    }

  }
}