import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedConditionsComponent } from './predefined-conditions.component';

describe('PredefinedConditionsComponent', () => {
  let component: PredefinedConditionsComponent;
  let fixture: ComponentFixture<PredefinedConditionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredefinedConditionsComponent]
    });
    fixture = TestBed.createComponent(PredefinedConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
