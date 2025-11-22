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
  passwordStrength = 0;
  passwordRequirements = {
    lowerCase: false,
    upperCase: false,
    hasNumbers: false,
    hasSpecialCharacters: false,
    isLengthy: false,
  };

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

  get strengthPrecentage(): number {
    return this.validation.getPasswordStrengthPercentage(this.passwordStrength);
  }

  get stengthColor(): string {
    return this.validation.getPasswordStrengthColor(this.passwordStrength);
  }

  get unmetRequirements(): string[] {
    const unmet: string[] = [];
    if (!this.passwordRequirements.lowerCase) unmet.push('•  یک حرف کوچک');
    if (!this.passwordRequirements.upperCase) unmet.push('•  یک حرف بزرگ');
    if (!this.passwordRequirements.hasNumbers) unmet.push('•  یک عدد');
    if (!this.passwordRequirements.hasSpecialCharacters)
      unmet.push('•  یکی از این کاراکتر ها (@ # $ % ! ?)');
    if (!this.passwordRequirements.isLengthy) unmet.push('• حداقل 8 کاراکتر');
    return unmet;
  }

  // ----- EVENTS -----
  onInputChange(e: Event) {
    const val = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.value.set(val);
    this.valueChange.emit(val);

    switch (this.type()) {
      case 'password':
        const pw = this.validation.getPasswordRequirements(val);
        this.passwordRequirements = pw.requirements;
        this.passwordStrength = pw.score;
        this.errorMessage.set('');
        break;

      case 'nationalcode':
        this.errorMessage.set(
          this.validation.validateNationalCode(val) ? '' : 'کد ملی باید ۱۰ رقم باشد'
        );
        break;

      case 'phone':
        this.errorMessage.set(
          this.validation.validatePhoneNumber(val) ? '' : 'شماره موبایل معتبر نیست'
        );
        // optional: auto-format with prefix
        this.value.set(this.validation.formatPhoneNumber(val));
        break;

      case 'email':
        this.errorMessage.set(this.validation.validateEmail(val) ? '' : 'ایمیل معتبر نیست');
        break;

      default:
        this.errorMessage.set('');
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
