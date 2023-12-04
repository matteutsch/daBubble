import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {

  toggleDrawer(drawerInstance: MatDrawer): void {
    if (drawerInstance) {
      drawerInstance.toggle();   
    }
  }

  closeDrawer(drawerInstance: MatDrawer): void {
    if (drawerInstance) {
      drawerInstance.close();
    }
  }

  openDrawer(drawerInstance: MatDrawer): void {
    if (drawerInstance) {
      drawerInstance.open();
    }
  }
}
