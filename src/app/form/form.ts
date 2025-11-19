import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from '../text-field/text-field';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, TextFieldComponent],
  templateUrl: './form.html',
})
export class FormComponent {
  firstName = '';
  description = '';
  lastName = '';
  password = '';
  email = '';
  nationalCode = '';

  onFieldFocus(): void {
    console.log('Field focused');
  }

  onFieldBlur(): void {
    console.log('Field blurred');
  }
}
