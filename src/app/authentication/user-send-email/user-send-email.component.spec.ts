import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSendEmailComponent } from './user-send-email.component';

describe('UserSendEmailComponent', () => {
  let component: UserSendEmailComponent;
  let fixture: ComponentFixture<UserSendEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSendEmailComponent]
    });
    fixture = TestBed.createComponent(UserSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
