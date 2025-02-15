import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesModalComponent } from './properties-modal.component';

describe('PropertiesModalComponent', () => {
  let component: PropertiesModalComponent;
  let fixture: ComponentFixture<PropertiesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesModalComponent]
    });
    fixture = TestBed.createComponent(PropertiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
