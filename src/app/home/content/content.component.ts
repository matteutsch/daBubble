import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  @ViewChild('drawerSidebar') drawerSidebar: MatDrawer | undefined;
  @ViewChild('drawerThread') drawerThread: MatDrawer | undefined;
  innerWidth: number = this.drawerService.innerWidth;
  constructor(
    public drawerService: DrawerService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  shouldShowMainChat() {
    return (
      this.innerWidth < 800 &&
      (this.drawerSidebar?.opened || this.drawerThread?.opened)
    );
  }

  toggleSidebarAndThread() {
    if (this.innerWidth < 1300) {
      if (this.drawerThread!.opened) {
        this.drawerService.closeDrawer(this.drawerThread!);
      }
      this.drawerService.toggleDrawer(this.drawerSidebar!);
    } else {
      this.drawerService.toggleDrawer(this.drawerSidebar!);
    }
  }

  toggleBtnText() {
    this.drawerService.isSideMenuOpen = !this.drawerService.isSideMenuOpen;
  }
}
