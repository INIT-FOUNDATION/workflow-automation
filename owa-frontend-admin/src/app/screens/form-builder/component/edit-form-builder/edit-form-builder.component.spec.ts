import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormBuilderComponent } from './edit-form-builder.component';

describe('EditFormBuilderComponent', () => {
  let component: EditFormBuilderComponent;
  let fixture: ComponentFixture<EditFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
