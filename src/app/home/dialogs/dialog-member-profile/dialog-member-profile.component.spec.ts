import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemberProfileComponent } from './dialog-member-profile.component';

describe('DialogMemberProfileComponent', () => {
  let component: DialogMemberProfileComponent;
  let fixture: ComponentFixture<DialogMemberProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogMemberProfileComponent]
    });
    fixture = TestBed.createComponent(DialogMemberProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
