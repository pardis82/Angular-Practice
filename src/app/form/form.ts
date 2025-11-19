import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from '../text-field/text-field';
import { SelectField } from '../select-field/select-field';
import { Option } from '../select-field/select-field';
import { SelectValue } from '../select-field/select-field';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, TextFieldComponent, SelectField],
  templateUrl: './form.html',
})
export class FormComponent {
  firstName = '';
  description = '';
  lastName = '';
  password = '';
  email = '';
  nationalCode = '';
  selectedCountries: SelectValue = [];
  countries: Option[] = [
    { value: 'ir', label: 'Iran' },
    { value: 'tr', label: 'Turkey' },
    { value: 'us', label: 'United States' },
  ];
  onValueChange(v: SelectValue) {
    console.log('Selected countries:', v);
    console.log('Type of v:', typeof v);
    console.log('Is array:', Array.isArray(v));
    if (Array.isArray(v)) {
      console.log('Array length:', v.length);
      console.log('Array contents:', v);
    }
    this.selectedCountries = v as Option[];
  }
  onFieldFocus(): void {
    console.log('Field focused');
  }

  onFieldBlur(): void {
    console.log('Field blurred');
  }
}
