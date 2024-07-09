import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTaskComponent } from './decision-task.component';

describe('DecisionTaskComponent', () => {
  let component: DecisionTaskComponent;
  let fixture: ComponentFixture<DecisionTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionTaskComponent]
    });
    fixture = TestBed.createComponent(DecisionTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
