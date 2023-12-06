import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from 'src/app/home/shared/drawer.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  isSideMenuOpen: boolean = true;

  @ViewChild('drawerSidebar') drawerSidebar: MatDrawer | undefined;
  @ViewChild('drawerThread') drawerThread: MatDrawer | undefined;

  constructor(
    public drawerService: DrawerService,
    public firebaseService: FirebaseService
  ) {}

  toggleBtnText() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }
}
