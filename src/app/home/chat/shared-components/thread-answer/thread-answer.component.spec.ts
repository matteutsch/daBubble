import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadAnswerComponent } from './thread-answer.component';

describe('ThreadAnswerComponent', () => {
  let component: ThreadAnswerComponent;
  let fixture: ComponentFixture<ThreadAnswerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreadAnswerComponent]
    });
    fixture = TestBed.createComponent(ThreadAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
