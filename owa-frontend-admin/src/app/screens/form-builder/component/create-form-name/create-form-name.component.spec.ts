import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormNameComponent } from './create-form-name.component';

describe('CreateFormNameComponent', () => {
  let component: CreateFormNameComponent;
  let fixture: ComponentFixture<CreateFormNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFormNameComponent]
    });
    fixture = TestBed.createComponent(CreateFormNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
