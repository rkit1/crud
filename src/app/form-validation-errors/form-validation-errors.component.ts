import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-validation-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-validation-errors.component.html',
  styleUrl: './form-validation-errors.component.scss'
})
export class FormValidationErrorsComponent {
  errors = input<ValidationErrors | null>(null);
}
