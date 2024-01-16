import { Component, Input, OnInit } from '@angular/core';
import { PresenceService } from '../presence.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
})
export class UserStatusComponent implements OnInit {
  @Input() uid!: string;

  public presence$: any;
  public status!: string;

  constructor(private presenceService: PresenceService) {}

  ngOnInit() {
    this.presence$ = this.presenceService.getPresence(this.uid);
    if (this.presence$) {
      this.presence$.subscribe((presence: any) => {
        this.status = presence.status;
      });
    }
  }
}
