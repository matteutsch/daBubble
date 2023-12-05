import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreatingComponent } from './account-creating.component';

describe('AccountCreatingComponent', () => {
  let component: AccountCreatingComponent;
  let fixture: ComponentFixture<AccountCreatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountCreatingComponent]
    });
    fixture = TestBed.createComponent(AccountCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
