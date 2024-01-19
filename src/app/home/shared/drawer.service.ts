import {
  HostListener,
  Injectable,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, debounceTime, fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  isSideMenuOpen: boolean = true;
  innerWidth: number = window.innerWidth;
  private resizeObservable: Observable<number>;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }

  constructor() {
    this.resizeObservable = fromEvent(window, 'resize').pipe(
      debounceTime(200),
      map(() => window.innerWidth)
    );
  }

  getResizeObservable(): Observable<number> {
    return this.resizeObservable;
  }
  /**
   * Toggles the visibility of the provided Material drawer instance.
   * @param {MatDrawer} drawerInstance - The Material drawer instance to toggle.
   * @returns {void}
   */
  toggleDrawer(drawerInstance: MatDrawer): void {
    if (drawerInstance) {
      drawerInstance.toggle();
    }
  }

  /**
   * Closes the provided Material drawer instance asynchronously.
   * @async
   * @param {MatDrawer} drawerInstance - The Material drawer instance to close.
   * @returns {Promise<void>} A Promise that resolves when the drawer is closed.
   */
  async closeDrawer(drawerInstance: MatDrawer): Promise<void> {
    if (drawerInstance) {
      await drawerInstance.close();
    }
  }

  /**
   * Opens the provided Material drawer instance asynchronously.
   * @async
   * @param {MatDrawer} drawerInstance - The Material drawer instance to open.
   * @returns {Promise<void>} A Promise that resolves when the drawer is opened.
   */
  async openDrawer(drawerInstance: MatDrawer): Promise<void> {
    if (drawerInstance) {
      await drawerInstance.open();
    }
  }
}
