import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  emojiMartVisible = false;


  constructor() { }
 

  toggleEmojiPopup(emojiMartVisible: boolean) {
    this.emojiMartVisible = !this.emojiMartVisible;
  }
}
