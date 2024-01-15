import { Component, Input } from '@angular/core';
import { DrawerService } from 'src/app/home/shared/drawer.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent {

  @Input() drawerThread: any;
  message = '';

  constructor(public drawerService: DrawerService) { }
}
