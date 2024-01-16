import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { serverTimestamp } from 'firebase/database';
import { User } from 'src/app/models/models';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }

  /**
   * Retrieves the presence status of a user.
   * @param {string} uid - The unique identifier of the user.
   * @returns {Observable<any>} An Observable that emits the presence status of the user if available, or null if not found.
   */
  getPresence(uid: string): Observable<any> {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  /**
   * Asynchronously retrieves the user information.
   * @returns {Promise<User | null>} A Promise that resolves to the user object if the user is authenticated, or null if not.
   */
  async getUser(): Promise<User | null> {
    const user: any = await firstValueFrom(this.afAuth.authState);
    return user;
  }

  /**
   * Asynchronously sets the user presence status.
   * @param {string} status - The presence status to set.
   * @returns {Promise<void>} A Promise that resolves when the presence status is successfully updated.
   */
  async setPresence(status: string): Promise<void> {
    const user: User | null = await this.getUser();
    if (user) {
      return this.db
        .object(`status/${user.uid}`)
        .update({ status, timestamp: this.timestamp });
    }
  }

  /**
   * Gets the server timestamp.
   * @returns {object} The server timestamp.
   */
  get timestamp(): object {
    const timestamp: object = serverTimestamp();
    return timestamp;
  }

  /**
   * Updates the user's presence status based on their authentication state.
   * @returns {Observable<string>} An Observable that emits the user's presence status.
   */
  updateOnUser(): Observable<string> {
    const connection = this.db
      .object('.info/connected')
      .valueChanges()
      .pipe(map((connected) => (connected ? 'online' : 'offline')));

    return this.afAuth.authState.pipe(
      switchMap((user) => (user ? connection : of('offline'))),
      tap((status) => this.setPresence(status))
    );
  }

  /**
   * Updates the user's presence status on disconnection.
   * @returns {Observable<any>} An Observable that emits when the user disconnects.
   */
  updateOnDisconnect(): Observable<any> {
    return this.afAuth.authState.pipe(
      tap((user) => {
        if (user) {
          this.db.object(`status/${user.uid}`).query.ref.onDisconnect().update({
            status: 'offline',
            timestamp: this.timestamp,
          });
        }
      })
    );
  }

  /**
   * Signs the user out and sets their presence status to 'offline'.
   * @returns {Promise<void>} A Promise that resolves when the user is signed out and the presence status is updated.
   */
  async signOut(): Promise<void> {
    await this.setPresence('offline');
    await this.afAuth.signOut();
  }

  /**
   * Updates the user's presence status based on the document's visibility state.
   * @returns {void}
   */
  updateOnAway(): void {
    document.onvisibilitychange = (e) => {
      if (document.visibilityState === 'hidden') {
        this.setPresence('away');
      } else {
        this.setPresence('online');
      }
    };
  }
}
