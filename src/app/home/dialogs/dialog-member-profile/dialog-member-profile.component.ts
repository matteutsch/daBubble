import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/models';
import { MatDialogRef } from '@angular/material/dialog';
import { SelectService } from '../../shared/select.service';
import { ChatService } from '../../shared/chat.service';

@Component({
  selector: 'app-dialog-member-profile',
  templateUrl: './dialog-member-profile.component.html',
  styleUrls: ['./dialog-member-profile.component.scss'],
})
export class DialogMemberProfileComponent implements OnInit {
  user!: User;

  constructor(
    public dialogRef: MatDialogRef<DialogMemberProfileComponent>,
    private select: SelectService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.select.selectedUser$.subscribe((user) => {
      this.user = user;
    });
  }

  close() {
    this.dialogRef.close();
    const customTextAreaRef = this.chatService.getTextareaRef().textArea;
    customTextAreaRef.nativeElement.focus();
  }
}
