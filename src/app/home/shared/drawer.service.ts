import { HostListener, Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  isSideMenuOpen: boolean = true;
  innerWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
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
