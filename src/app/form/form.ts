import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextField } from '../text-field/text-field';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, TextField],
  templateUrl: './form.html',
})
export class FormComponent {}
