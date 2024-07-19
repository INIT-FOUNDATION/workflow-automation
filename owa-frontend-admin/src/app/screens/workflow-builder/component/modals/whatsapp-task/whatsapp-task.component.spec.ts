import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappTaskComponent } from './whatsapp-task.component';

describe('WhatsappTaskComponent', () => {
  let component: WhatsappTaskComponent;
  let fixture: ComponentFixture<WhatsappTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsappTaskComponent]
    });
    fixture = TestBed.createComponent(WhatsappTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
