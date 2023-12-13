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
import { Chat, User } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { SelectService } from '../shared/select.service';
import { AuthService } from 'src/app/services/auth.service';

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
  //TODO: hide dropdown in case there's no input value
  constructor(
    private userService: UserService,
    private select: SelectService,
    private auth: AuthService
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
        users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  selectUserFromDropdown(user: User) {
    this.searchInputValue = '';
    const privateChat: Chat = {
      id: user.uid,
      name: user.name,
    };
    this.userService.updatePrivateChat(this.currentUser.uid, privateChat);
  }
}
