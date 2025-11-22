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

  colSpan = input<string>();
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

  passwordRequirements = {
    lowerCase: false,
    upperCase: false,
    hasNumbers: false,
    hasSpecialCharacters: false,
    isLengthy: false,
  };

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
    if (this.passwordStrength <= 1) return 'bg-red-600';
    if (this.passwordStrength === 2) return 'bg-yellow-400';
    if (this.passwordStrength === 3) return 'bg-orange-300';
    if (this.passwordStrength === 4) return 'bg-orange-500';
    return 'bg-green-400';
  }

  get unmetRequirements(): string[] {
    const unmet: string[] = [];

    if (!this.passwordRequirements.lowerCase) unmet.push('•  یک حرف کوچک');

    if (!this.passwordRequirements.upperCase) unmet.push('•  یک حرف بزرگ');

    if (!this.passwordRequirements.hasNumbers) unmet.push('•  یک عدد');

    if (!this.passwordRequirements.hasSpecialCharacters)
      unmet.push('•  یکی از این کاراکتر ها (@ # $ % ! ?)');

    if (!this.passwordRequirements.isLengthy) unmet.push('• 8 کاراکتر ');

    return unmet;
  }

  // ----- EVENTS -----

  calculatePasswordStrength(value: string) {
    // Update requirement flags
    this.passwordRequirements.lowerCase = /[a-z]/.test(value);
    this.passwordRequirements.upperCase = /[A-Z]/.test(value);
    this.passwordRequirements.hasNumbers = /[0-9]/.test(value);
    this.passwordRequirements.hasSpecialCharacters = /[@#$%^&*!?]/.test(value);
    this.passwordRequirements.isLengthy = value.length >= 8;

    // Count how many are true
    let score = 0;
    if (this.passwordRequirements.isLengthy) score++;
    if (this.passwordRequirements.upperCase) score++;
    if (this.passwordRequirements.lowerCase) score++;
    if (this.passwordRequirements.hasNumbers) score++;
    if (this.passwordRequirements.hasSpecialCharacters) score++;

    this.passwordStrength = score;
  }

  onInputChange(e: Event) {
    const val = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.value.set(val);
    this.valueChange.emit(val);

    if (this.type() === 'password') {
      this.calculatePasswordStrength(val);
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
