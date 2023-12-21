import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
// selectedEmoji: any;
selectedEmoji: string | null = null;
textareaValue: string = '';

  constructor() {}

}
