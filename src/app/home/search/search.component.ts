import { Component, Input } from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from '../shared/chat.service';

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
  constructor(
    private userService: UserService,
    private chatService: ChatService
  ) {
    this.results$ = this.input$.pipe(
      filter((term) => term.length >= 3),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => (this.isLoading = true)),
      switchMap((term) => this.searchUsers(term)),
      tap(() => (this.isLoading = false))
    );
  }

  searchUsers(searchTerm: string): Observable<User[]> {
    return this.userService.usersSubject.pipe(
      map((users) =>
        users
          .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .filter((user) => user.name !== this.currentUser.name)
      )
    );
  }

  selectUserFromDropdown(user: User) {
    this.searchInputValue = '';
    this.chatService.createPrivateChat(user, this.currentUser);
  }
}
