import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chat, User } from 'src/app/models/models';
import { SearchService } from '../../shared/search.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-add-members',
  templateUrl: './dialog-add-members.component.html',
  styleUrls: ['./dialog-add-members.component.scss'],
})
export class DialogAddMembersComponent implements OnInit {
  channelChat!: Chat;
  addMemberGroup!: FormGroup;
  searchInputValue: string = '';
  input$ = new Subject<string>();
  isLoading = false;
  results$!: Observable<User[]>;
  isSelected: boolean = false;
  memberId!: User;

  constructor(
    private search: SearchService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chat
  ) {
    this.addMemberGroup = this.fb.group({
      memberName: new FormControl(''),
    });
    this.results$ = this.search.getResults(this.input$);
  }

  selectMemberFromDropdown(user: User) {
    this.memberId = user;
    this.addMemberGroup.get('memberName')?.patchValue(user.name);
    this.isSelected = true;
    setTimeout(() => {
      this.isSelected = false;
    }, 500);
  }

  submit() {
    this.dialogRef.close(this.memberId.uid);
  }

  ngOnInit(): void {
    this.channelChat = this.data;
  }

  close(): void {
    this.dialogRef.close();
  }
}
