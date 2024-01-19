import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DialogEditProfileComponent } from '../dialogs/dialog-edit-profile/dialog-edit-profile.component';
import { UserService } from 'src/app/services/user.service';
import { DrawerService } from '../shared/drawer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() drawerSidebar: any;
  @Input() drawerThread: any;
  isOpen: boolean = false;
  innerWidth: number = window.innerWidth;

  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    public userService: UserService,
    public drawerService: DrawerService
  ) {
    this.drawerService.getResizeObservable().subscribe((width) => {
      this.innerWidth = width;
    });
  }

  showLogo() {
    return (
      this.innerWidth > 600 ||
      (this.innerWidth < 600 && this.drawerSidebar.opened)
    );
  }
  showChannelLogo() {
    return this.innerWidth < 600 && !this.drawerSidebar.opened;
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    if (this.innerWidth > 600) {
      dialogConfig.position = {
        top: '100px',
        right: '16px',
      };
    }

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
