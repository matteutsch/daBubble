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

  isSideMenuOpen: boolean = true;

  constructor(
    public drawerService: DrawerService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  toggleBtnText() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }
}
