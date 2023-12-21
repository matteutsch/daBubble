import { Component, Input } from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { User } from 'src/app/models/models';
import { ChatService } from '../shared/chat.service';
import { SearchService } from '../shared/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() currentUser!: User;
  searchInputValue: string = '';
  input$ = new Subject<string>();
  isLoading = false;
  results$!: Observable<User[]>;

  //TODO: add searchChannel() / searchThread etc..
  constructor(private chatService: ChatService, private search: SearchService) {
    this.results$ = this.search.getResults(this.input$);
  }

  selectUserFromDropdown(user: User) {
    this.searchInputValue = '';
    this.chatService.createPrivateChat(user, this.currentUser);
  }
}
