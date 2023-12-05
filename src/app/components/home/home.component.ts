import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  isSideMenuOpen: boolean = true;

  @ViewChild('drawerSidebar') drawerSidebar: MatDrawer | undefined;
  @ViewChild('drawerThread') drawerThread: MatDrawer | undefined;

  constructor(public drawerService: DrawerService) {}

  toggleBtnText() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }
}
