import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDirectMessagesComponent } from './chat-direct-messages.component';

describe('ChatDirectMessagesComponent', () => {
  let component: ChatDirectMessagesComponent;
  let fixture: ComponentFixture<ChatDirectMessagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatDirectMessagesComponent]
    });
    fixture = TestBed.createComponent(ChatDirectMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
