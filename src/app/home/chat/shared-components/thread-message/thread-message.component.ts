import { Component } from '@angular/core';

@Component({
  selector: 'app-thread-message',
  templateUrl: './thread-message.component.html',
  styleUrls: ['./thread-message.component.scss']
})
export class ThreadMessageComponent {
  emojiMartVisible = false;
  selectedEmoji: string | null = null;
  emojiCount: number = 0;
  
  toggleEmojiPopup(): void {

    this.emojiMartVisible = !this.emojiMartVisible;
    // this.emojiService.toggleEmojiPopup(this.emojiMartVisible);
  }

  addEmoji(emoji: string): void {
    if (this.selectedEmoji === emoji) {
      // Wenn auf dasselbe Emoji erneut geklickt wird, erhöhe den Zähler
      this.emojiCount++;
    } else {
      // Wenn ein neues Emoji ausgewählt wird, setze den Zähler zurück
      this.emojiCount = 1;
    }

    // Aktualisiere das ausgewählte Emoji
    this.selectedEmoji = emoji;

    // Hier können Sie weitere Aktionen mit dem ausgewählten Emoji durchführen, wenn nötig
    console.log(`Ausgewähltes Emoji: ${this.selectedEmoji}, Anzahl: ${this.emojiCount}`);
  }

}
