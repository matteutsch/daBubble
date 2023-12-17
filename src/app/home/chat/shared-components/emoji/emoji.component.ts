import { Component, ElementRef, HostListener } from '@angular/core';
import { EmojiService } from '../../shared/emoji.service';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent {

  showEmojiPopup: boolean = true;
  emojiMartVisible = false;
  textareaValue: string = '';
  selectedEmoji: string | null = null;
  emojiCount: number = 0;

  // public showEmojis = false;
  public text = "";
  public textEdit: string = "";
  showEmojis: boolean | undefined;
  showEmojisEdit: boolean | undefined;
  showEmojisComment: boolean | undefined;
  emojiMessageIndex = 0;


  constructor(public emojiService:EmojiService, private emojiPickerElement: ElementRef) { }


  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    // Überprüfen Sie, ob der Klick außerhalb des Emoji-Pickers erfolgt
    const clickedInsideEmojiPicker = this.emojiPickerElement.nativeElement.contains(event.target);

    if (!clickedInsideEmojiPicker) {
      // Schließen Sie den Emoji-Picker, wenn außerhalb geklickt wird
      this.emojiMartVisible = false;
    }
  }
  toggleEmojiPopup(): void {
    this.emojiMartVisible = !this.emojiMartVisible;
  }



  saveEmoji(emoji: any): void {
    if (this.selectedEmoji === emoji) {
      // Wenn auf dasselbe Emoji erneut geklickt wird, erhöhe den Zähler
      this.emojiCount++;
    } else {
      // Wenn ein neues Emoji ausgewählt wird, setze den Zähler zurück
      this.emojiCount = 1;
    }
console.log(emoji)
    // Aktualisiere das ausgewählte Emoji
    this.selectedEmoji = emoji;

    // Hier können Sie weitere Aktionen mit dem ausgewählten Emoji durchführen, wenn nötig
    console.log(`Ausgewähltes Emoji: ${this.selectedEmoji}, Anzahl: ${this.emojiCount}`);

        // Fügen Sie das Emoji dem Text hinzu oder verarbeiten Sie es anderweitig
        this.textareaValue += emoji;

        // Schließen Sie den Emoji-Picker nach der Auswahl
        this.emojiMartVisible = false;
  }


// saveEmoji(e: { emoji: { unified: string; }; }) {
//   let unicodeCode: string = e.emoji.unified;
//   let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
//   if (this.showEmojis) {
//     this.text += emoji;
//     this.showEmojis = !this.showEmojis;
//   }
//   if (this.showEmojisEdit) {
//     this.textEdit += emoji;
//     this.showEmojisEdit = !this.showEmojisEdit;
//   }
// }


//   closePopups(): void {
//     this.showEmojiPopup = false;
    
//   }
}
