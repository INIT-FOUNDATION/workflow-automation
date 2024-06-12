import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCardsComponent } from './workflow-cards.component';

describe('WorkflowCardsComponent', () => {
  let component: WorkflowCardsComponent;
  let fixture: ComponentFixture<WorkflowCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowCardsComponent]
    });
    fixture = TestBed.createComponent(WorkflowCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
