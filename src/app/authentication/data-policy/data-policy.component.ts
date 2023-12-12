import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-data-policy',
  templateUrl: './data-policy.component.html',
  styleUrls: ['./data-policy.component.scss'],
})
export class DataPolicyComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
