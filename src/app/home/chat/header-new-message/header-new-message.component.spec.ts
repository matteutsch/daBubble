import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNewMessageComponent } from './header-new-message.component';

describe('HeaderNewMessageComponent', () => {
  let component: HeaderNewMessageComponent;
  let fixture: ComponentFixture<HeaderNewMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderNewMessageComponent]
    });
    fixture = TestBed.createComponent(HeaderNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
