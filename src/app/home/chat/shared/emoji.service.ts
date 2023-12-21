import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  emojiSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  emoji$: Observable<any> = this.emojiSubject.asObservable();

  selectedEmoji: string | null = null;

  constructor() {}
}
