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
  isSideMenuOpen: boolean = true;
  userID: any;
  user: any = {};

  @ViewChild('drawerSidebar') drawerSidebar: MatDrawer | undefined;
  @ViewChild('drawerThread') drawerThread: MatDrawer | undefined;

  constructor(
    public drawerService: DrawerService,
    public authService: AuthService,
    public userService: UserService
  ) {
    authService.user.subscribe((user) => {
      if (user) {
        this.userService.getUser(user.uid).subscribe((currentUser) => {
          this.user = currentUser;
        });
      }
    });
  }

  toggleBtnText() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }
}
