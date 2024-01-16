import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DialogEditProfileComponent } from '../dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isOpen: boolean = false;

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    public userService: UserService
  ) {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      top: '100px',
      right: '16px',
    };
    dialogConfig.panelClass = 'custom-rounded';

    dialogConfig.data = {
      user: this.userService.user,
    };

    const dialogRef = this.dialog.open(
      DialogEditProfileComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.userService.updateUser(this.userService.user.uid, data);
      }
    });
  }

  toggleLogout() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.auth.SignOut();
  }
}
