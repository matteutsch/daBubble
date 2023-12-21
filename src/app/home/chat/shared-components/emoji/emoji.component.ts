import { Component } from '@angular/core';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
})
export class EmojiComponent {
  set = 'native';
  showEmojiPopup: boolean = true;
  emojiMartVisible = false;
  textareaValue: string = '';
  selectedEmoji: string | null = null;
  emojiCount: number = 0;

  constructor(public emojiService: EmojiService) {}

  saveEmoji(emoji: any) {
    this.emojiService.emojiSubject.next(emoji.emoji);
  }

  toggleEmojiPopup(): void {
    this.emojiMartVisible = !this.emojiMartVisible;
  }
}
