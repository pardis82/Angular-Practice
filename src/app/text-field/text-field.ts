import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.html',
  imports: [CommonModule, FormsModule],
})
export class TextField {
  // ----- SIGNAL INPUTS -----
  label = input<string>();
  type = input<string>('text');
  helperText = input<string>();
  errorMessage = input<string>();
  containerClassName = input<string>();
  className = input<string>();

  minrows = input<number>(3);
  maxrows = input<number>(10);
  width = input<string>();
  multiline = input<boolean>(false);

  defaultValue = input<string>();
  placeholder = input<string>();

  id = input<string>();
  name = input<string>();

  // value with two-way binding
  value = model<string>('');
  valueChange = output<string>();

  // ----- SIGNAL OUTPUTS -----
  focused = output<void>();
  blurred = output<void>();

  // ----- INTERNAL STATE -----
  isFocused = false;
  isPasswordVisible = false;
  actualType = this.type();
  passwordStrength = 0;

  constructor() {
    this.actualType = this.type() || 'text';
  }

  ngOnChanges() {
    this.actualType = this.type() || 'text';

    if (this.type() !== 'password') {
      this.isPasswordVisible = false;
    }
  }

  // ----- GETTERS -----
  get actualValue(): string {
    const v = this.value();
    return v !== undefined && v !== null ? v : this.defaultValue() || '';
  }

  get hasValue(): boolean {
    return !!this.actualValue && this.actualValue.length > 0;
  }

  get float(): boolean {
    return this.hasValue || this.isFocused;
  }

  get truncatedPlaceholder(): string {
    const p = this.placeholder() || '';
    return p.length > 30 ? p.substring(0, 30) + '...' : p;
  }

  get strengthPrecentage(): number {
    return (this.passwordStrength / 5) * 100;
  }

  get stengthColor(): string {
    if (this.passwordStrength <= 1) return 'bg-red-400';
    if (this.passwordStrength <= 3) return 'bg-yellow-400';
    return 'bg-green-400';
  }

  // ----- EVENTS -----

  calculatePasswordStrength(value: string) {
    let passwordScore = 0;
    if (value.length >= 8) passwordScore++;
    if (/[A-Z]/.test(value)) passwordScore++;
    if (/[a-z]/.test(value)) passwordScore++;
    if (/[0-9]/.test(value)) passwordScore++;
    if (/[^A-Za-z0-9]/.test(value)) passwordScore++;

    this.passwordStrength = passwordScore;
  }

  onInputChange(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.value.set(value);
    this.valueChange.emit(value);

    if (this.type() === 'password') {
      this.calculatePasswordStrength(value);
    }
  }

  onFocus() {
    this.isFocused = true;
    this.focused.emit();
  }

  onBlur() {
    this.isFocused = false;
    this.blurred.emit();
  }

  togglePasswordVisibility(): void {
    if (this.type() === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
      this.actualType = this.isPasswordVisible ? 'text' : 'password';
    }
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement) {
    if (!this.multiline()) return;

    textarea.style.height = 'auto';

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minH = this.minrows() * lineHeight;
    const maxH = this.maxrows() * lineHeight;

    const newHeight = Math.min(Math.max(textarea.scrollHeight, minH), maxH);

    textarea.style.height = `${newHeight}px`;
  }
}
