import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTaskComponent } from './sms-task.component';

describe('SmsTaskComponent', () => {
  let component: SmsTaskComponent;
  let fixture: ComponentFixture<SmsTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmsTaskComponent]
    });
    fixture = TestBed.createComponent(SmsTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
