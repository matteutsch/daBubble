import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPrivateChatComponent } from './header-private-chat.component';

describe('HeaderPrivateChatComponent', () => {
  let component: HeaderPrivateChatComponent;
  let fixture: ComponentFixture<HeaderPrivateChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderPrivateChatComponent]
    });
    fixture = TestBed.createComponent(HeaderPrivateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
