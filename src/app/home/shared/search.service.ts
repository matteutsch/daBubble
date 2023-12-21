import { Injectable } from '@angular/core';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs';
import { User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  currentUser!: User;
  constructor(private userService: UserService, private auth: AuthService) {
    auth.user.subscribe((user) => {
      if (user) {
        this.userService.getUser(user.uid).subscribe((currentUser) => {
          this.currentUser = currentUser;
        });
      }
    });
  }

  getResults(input: Observable<any>) {
    return input.pipe(
      filter((term) => term.length >= 3),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) => this.searchUsers(term))
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
}
