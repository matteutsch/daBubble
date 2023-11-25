import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isOpen: boolean = false;
  isEditing: boolean = false;

  toggleLogout() {
    this.isOpen = !this.isOpen;
    if (this.isEditing) {
      this.toggleEditProfile();
    }
  }
  toggleEditProfile() {
    this.isEditing = !this.isEditing;
  }
}
