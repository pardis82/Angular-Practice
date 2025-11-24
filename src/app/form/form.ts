import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextField } from '../text-field/text-field';
import { SelectField } from '../select-field/select-field';
import { Option } from '../select-field/select-field';
import { SelectValue } from '../select-field/select-field';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, TextField, SelectField],
  templateUrl: './form.html',
})
export class FormComponent {
  firstName = '';
  firstName2 = '';
  description = '';
  description2 = '';
  lastName = '';
  password = '';
  lastName2 = '';
  password2 = '';
  email = '';
  username=''
  nationalCode = '';
  selectedCountries: SelectValue = [];
  countries: Option[] = [
    { value: 'ir', label: 'ایران' },
    { value: 'tr', label: 'ترکیه' },
    { value: 'us', label: 'آمریکا' },
    { value: 'br', label: 'انگلیس' },
    { value: 'fr', label: 'فرانسه' },
  ];

  selectedInsurance: SelectValue = [];
  Insurance: Option[] = [
    { value: 'public', label: 'تامین اجتماعی' },
    { value: 'complete', label: 'تکمیلی' },
  ];

  selectedLevel: SelectValue = [];
  Level: Option[] = [
    { value: 'beginner', label: 'A1' },
    { value: 'intermediate', label: 'B1' },
    { value: 'advanced', label: 'C1' },
  ];
  selectedLevel2: SelectValue = [];
  Level2: Option[] = [
    { value: 'beginner', label: 'A1' },
    { value: 'intermediate', label: 'B1' },
    { value: 'advanced', label: 'C1' },
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
  // onFieldFocus(): void {
  //   console.log('Field focused');
  // }

  // onFieldBlur(): void {
  //   console.log('Field blurred');
  // }
}
