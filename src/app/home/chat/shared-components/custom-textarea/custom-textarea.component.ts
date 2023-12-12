import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.scss'],
})
export class CustomTextareaComponent {
  @ViewChild('textArea', { static: false }) textArea!: ElementRef;

  constructor() {}
}
