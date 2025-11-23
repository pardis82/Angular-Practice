import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../services/validation/validation';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.html',
  imports: [CommonModule, FormsModule],
})
export class TextField {
  // ----- SIGNAL INPUTS -----
  label = input<string>();

  type = input<string>('text'); // text, password, email, phone, nationalcode
  helperText = input<string>();
  errorMessage = model<string>();
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

  // ----- SIGNAL OUTPUTS -----
  value = model<string>('');
  valueChange = output<string>();
  focused = output<void>();
  blurred = output<void>();

  // ----- INTERNAL STATE -----
  isFocused = false;
  isPasswordVisible = false;
  actualType = this.type();

  // Password UI state
  passwordScore = 0;
  unmetPasswordRules: string[] = [];
  passwordColor = '';
  passwordPercentage = 0;

  constructor(private validation: ValidationService) {
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

  get passwordStrengthPercent(): number {
    return this.validation.getPasswordStrengthPercentage(this.passwordScore);
  }

  get passwordStrengthColor(): string {
    return this.validation.getPasswordStrengthColor(this.passwordScore);
  }

  // ----- MAIN INPUT HANDLER -----
  onInputChange(e: Event) {
    const inputEl = e.target as HTMLInputElement | HTMLTextAreaElement;
    let val = inputEl.value;

    // Send value upward
    this.value.set(val);
    this.valueChange.emit(val);

    // ALWAYS use ValidationService to validate
    const v = this.validation.validateField(this.type(), val);

    // Assign values returned from ValidationService
    this.errorMessage.set(v.error);

    // ----- PASSWORD SPECIAL HANDLING -----
    if (this.type() === 'password') {
      this.passwordScore = v.extra?.score || 0;
      this.passwordColor = v.extra?.color || '';
      this.passwordPercentage = v.extra?.percentage || 0;

      // The unmet rules array (strings)
      this.unmetPasswordRules = v.helper || [];
    }

    if (this.type() === 'phone') {
    }
  }

  onFocus() {
    this.isFocused = true;
    this.focused.emit();
  }

  onBlur() {
    this.isFocused = false;
    this.blurred.emit();

    // Auto-format phone number ONLY after user finishes typing
    if (this.type() === 'phone') {
      const formatted = this.validation.formatPhoneNumber(this.value(), '+98');
      this.value.set(formatted);
      this.valueChange.emit(formatted);
    }
  }

  togglePasswordVisibility(): void {
    if (this.type() === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
      this.actualType = this.isPasswordVisible ? 'text' : 'password';
    }
  }

  // ----- TEXTAREA AUTO RESIZE -----
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
