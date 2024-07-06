import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaFieldComponent } from './text-area-field.component';

describe('TextAreaFieldComponent', () => {
  let component: TextAreaFieldComponent;
  let fixture: ComponentFixture<TextAreaFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextAreaFieldComponent]
    });
    fixture = TestBed.createComponent(TextAreaFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
