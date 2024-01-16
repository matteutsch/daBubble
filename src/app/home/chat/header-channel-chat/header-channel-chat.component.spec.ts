import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderChannelChatComponent } from './header-channel-chat.component';

describe('HeaderChannelChatComponent', () => {
  let component: HeaderChannelChatComponent;
  let fixture: ComponentFixture<HeaderChannelChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderChannelChatComponent]
    });
    fixture = TestBed.createComponent(HeaderChannelChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
