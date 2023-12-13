import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { DialogEditProfileComponent } from '../dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() user!: User;

  editForm!: FormGroup;
  isOpen: boolean = false;

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    private userService: UserService
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
      user: this.user,
    };

    const dialogRef = this.dialog.open(
      DialogEditProfileComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.userService.updateUser(this.user.uid, data);
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
