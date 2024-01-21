import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatMember, ChatMemberData } from 'src/app/models/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DialogMemberProfileComponent } from '../dialog-member-profile/dialog-member-profile.component';
import { ChatService } from '../../shared/chat.service';

@Component({
  selector: 'app-dialog-members',
  templateUrl: './dialog-members.component.html',
  styleUrls: ['./dialog-members.component.scss'],
})
export class DialogMembersComponent implements OnInit {
  channelMembers: ChatMember[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[],
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.pushMembers();
  }

  /**
   * Fetches user data for each member from Firestore and populates the `channelMembers` array with ChatMember instances.
   *
   * @returns {Promise<void>} A Promise that resolves once all user data is fetched and the array is populated with ChatMember instances.
   */
  async pushMembers(): Promise<void> {
    this.channelMembers = [];
    this.data.forEach(async (memberID: string) => {
      const user = await this.firestoreService.getDocumentFromCollection(
        'users',
        memberID
      );
      const member = new ChatMemberData(
        user,
        this.chatService.currentChat.chatID
      );
      this.channelMembers.push(member);
    });
  }

  /**
   * Opens a dialog displaying the profile of a chat member.
   *
   * @param {ChatMember} member - The chat member for whom the profile will be displayed.
   * @returns {void}
   */
  openUserProfile(member: ChatMember): void {
    const dialogConfig = new MatDialogConfig();
    if (window.innerWidth <= 450) {
      dialogConfig.minWidth = '95vw';
    }
    dialogConfig.panelClass = 'dialog-member-profile';
    dialogConfig.data = member;
    const dialogRef = this.dialog.open(
      DialogMemberProfileComponent,
      dialogConfig
    );
  }

  openAddMemberDialog() {
    this.dialogRef.close('add');
  }

  close(): void {
    this.dialogRef.close();
  }
}
