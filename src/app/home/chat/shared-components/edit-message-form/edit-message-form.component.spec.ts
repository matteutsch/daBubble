import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMessageFormComponent } from './edit-message-form.component';

describe('EditMessageFormComponent', () => {
  let component: EditMessageFormComponent;
  let fixture: ComponentFixture<EditMessageFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMessageFormComponent]
    });
    fixture = TestBed.createComponent(EditMessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
