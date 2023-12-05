import { Component, Input } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent {

  @Input() drawerThread: any;

  constructor(public drawerService: DrawerService) { }
}
