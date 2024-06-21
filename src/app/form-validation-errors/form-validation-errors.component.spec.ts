import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidationErrorsComponent } from './form-validation-errors.component';

describe('FormValidationErrorsComponent', () => {
  let component: FormValidationErrorsComponent;
  let fixture: ComponentFixture<FormValidationErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormValidationErrorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormValidationErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
