import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isSideMenuOpen: boolean = true;

  toggleBtnText() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }
}
