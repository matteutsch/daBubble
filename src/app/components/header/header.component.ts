import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isOpen: boolean = false;
  isCheckingProfile: boolean = false;
  isEditing: boolean = false;

  toggleLogout() {
    this.isOpen = !this.isOpen;
    if (this.isCheckingProfile) {
      this.toggleCheckProfile();
    } else if (this.isEditing) {
      this.toggleEditProfile();
    }
  }
  toggleCheckProfile() {
    this.isCheckingProfile = !this.isCheckingProfile;
  }

  toggleEditProfile() {
    this.isEditing = !this.isEditing;
  }
}
