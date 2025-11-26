import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextField } from '../text-field/text-field';
// import { SelectField } from '../select-field/select-field';
// import { Option } from '../select-field/select-field';
// import { SelectValue } from '../select-field/select-field';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, TextField],
  templateUrl: './form.html',
})
export class FormComponent {}
