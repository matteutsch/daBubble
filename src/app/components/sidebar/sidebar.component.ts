import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  showChannels: boolean = true;
  showDirectMessages: boolean = true;
  isSideMenuOpen: boolean = false;

  toggleBtnText() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }
}
