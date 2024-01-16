import { Component } from '@angular/core';
import { ChatService } from '../../shared/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogMemberProfileComponent } from '../../dialogs/dialog-member-profile/dialog-member-profile.component';
import { ChatMember, ChatMemberData } from 'src/app/models/models';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { SelectService } from '../../shared/select.service';

@Component({
  selector: 'app-header-private-chat',
  templateUrl: './header-private-chat.component.html',
  styleUrls: ['./header-private-chat.component.scss'],
})
export class HeaderPrivateChatComponent {
  public selectedUser: ChatMember = new ChatMemberData();
  private memberSubscription!: Subscription;

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    public selectService: SelectService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupUserSubscription();
  }

  ngOnDestroy(): void {
    this.memberSubscription.unsubscribe();
  }

  /**
   * Sets up a subscription to update the selected user based on user updates.
   *
   * @returns {void}
   */
  private setupUserSubscription(): void {
    this.memberSubscription = this.selectService.selectedUser.subscribe(
      (updatedMember: ChatMember) => (this.selectedUser = updatedMember)
    );
  }

  /**
   * Opens a dialog displaying the profile of a chat member.
   *
   * @param {ChatMember} member - The chat member for whom the profile will be displayed.
   * @returns {void}
   */
  openUserProfile(member: ChatMember): void {
    const dialogRef = this.dialog.open(DialogMemberProfileComponent, {
      panelClass: 'dialog-member-profile',
      data: member,
    });
  }
}
