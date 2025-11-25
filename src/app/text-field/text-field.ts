import { Component, input, output, model, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../services/validation/validation';
import { PassValidation } from '../../services/pass-validation/pass-validation';
import { UserNameValidation } from '../../services/user-name-validation/user-name-validation';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.html',
  imports: [CommonModule, FormsModule],
})
export class TextField {
  // ----- SIGNAL INPUTS -----
  label = input<string>();
  type = input<string>('text'); // text, password, email, phone, nationalcode , username
  helperText = input<string>();
  errorMessage = model<string>();
  containerClassName = input<string>();
  className = input<string>();
  backgroundColor = input<string>(' #ffe2e2');
  minrows = input<number>(3);
  maxrows = input<number>(10);
  colSpan = input<string>();
  multiline = input<boolean>(false);
  defaultValue = input<string>();
  placeholder = input<string>();
  id = input<string>();
  name = input<string>();

  //---validation patterns---
  validationMode = input<'auto' | 'none'>('auto');
  showValidationUI = input<boolean>(true);

  // ----- SIGNAL OUTPUTS -----
  value = model<string>('');
  valueChange = output<string>();
  focused = output<void>();
  blurred = output<void>();

  // ----- signals -----
  isFocused = signal(false);
  isPasswordVisible = signal(false);
  actualType = this.type();

  //-----Computed signals------

  float = computed(() => this.hasValue() || this.isFocused());
  actualValue = computed(() => {
    const v = this.value();
    return v !== undefined && v !== null ? v : this.defaultValue() || '';
  });
  hasValue = computed(() => !!this.actualValue() && this.actualValue().length > 0);
  isPasswordValid = computed(() => {
    return (
      this.validationMode() === 'auto' &&
      this.type() === 'password' &&
      this.unmetPasswordRules().length === 0 &&
      this.hasValue()
    );
  });
  isUsernameValid = computed(() => {
    return (
      this.validationMode() === 'auto' &&
      this.type() === 'username' &&
      this.unmetUserNameRules().length === 0 &&
      this.hasValue()
    );
  });

  // Password & Username UI state
  passwordScore = 0;
  unmetPasswordRules = signal<string[]>([]);
  unmetUserNameRules = signal<string[]>([]);
  passwordColor = '';
  passwordPercentage = 0;

  constructor(
    private validation: ValidationService,
    private passwordValidation: PassValidation,
    private userNameValidation: UserNameValidation
  ) {
    this.actualType = this.type() || 'text';
  }

  ngOnChanges() {
    this.actualType = this.type() || 'text';
    if (this.type() !== 'password') {
      this.isPasswordVisible.set(false);
    }
  }

  // ----- GETTERS -----

  get borderClasses() {
    if (this.errorMessage()) return 'border-red-400';
    if (this.isPasswordValid() || this.isUsernameValid()) return 'border-green-400';
    if (
      !this.errorMessage() &&
      (this.isFocused() || (this.hasValue() && (this.isPasswordValid() || this.isUsernameValid())))
    ) {
      return 'border-purple-500';
    }
    if (!this.isFocused() && !this.errorMessage()) return 'border-gray-300';
    return 'border-gray-300';
  }

  getLabelTextClasses() {
    const classes = [];
    const shouldFloat = this.float(); // Call once and reuse

    // Float positioning
    if (shouldFloat) {
      classes.push('text-xs -top-[0.7rem]');
    } else {
      classes.push('top-1/2 -translate-y-1/2 text-[11.5px]');
    }

    // Error state (highest priority)
    if (this.errorMessage()) {
      classes.push('text-red-500');
      return classes;
    }

    // Success state for password when all rules are met
    if (
      !this.errorMessage() &&
      this.validationMode() === 'auto' &&
      ((this.type() === 'password' && this.unmetPasswordRules().length === 0) ||
        (this.type() === 'username' && this.unmetUserNameRules().length === 0)) &&
      shouldFloat &&
      this.hasValue()
    ) {
      classes.push('text-green-600');
      return classes;
    }

    // Default purple state - only apply if we haven't already returned
    if (!this.errorMessage() && shouldFloat) {
      classes.push('text-purple-600');
    }

    return classes;
  }

  get truncatedPlaceholder(): string {
    const p = this.placeholder() || '';
    return p.length > 30 ? p.substring(0, 30) + '...' : p;
  }

  get passwordStrengthPercent(): number {
    return this.passwordValidation.getPassPrecentage(this.passwordScore);
  }

  get passwordStrengthColor(): string {
    return this.passwordValidation.getStrengthColor(this.passwordScore);
  }

  private handlePassValidation(val: string) {
    if (!val) {
      this.isPasswordVisible.set(false);
      this.actualType = 'password';
    }
    if (this.validationMode() === 'auto') {
      const result = this.passwordValidation.validatePassword(val);
      this.passwordScore = result.extra.score;
      this.passwordColor = result.extra.color;
      this.passwordPercentage = result.extra.percentage;
      this.unmetPasswordRules.set(result.helper);
      this.errorMessage.set('');
    } else {
      this.errorMessage.set('');
      this.passwordScore = 0;
      this.passwordColor = '';
      this.passwordPercentage = 0;
      this.unmetPasswordRules.set([]);
    }
  }

  private handleUsernameValidation(val: string) {
    if (this.validationMode() === 'auto') {
      const result = this.userNameValidation.validateUsername(val);
      this.unmetUserNameRules.set(result.unmet);
      if (result.valid) {
        this.errorMessage.set('');
      } else {
        this.errorMessage.set(result.unmet[0]);
      }
    } else {
      this.unmetUserNameRules.set([]);
      this.errorMessage.set('');
    }
  }

  private handleGeneralValidation(val: string) {
    if (this.validationMode() === 'auto') {
      const v = this.validation.validateField(this.type(), val);
      this.errorMessage.set(v.error);
    } else {
      this.errorMessage.set('');
    }

    // Clear password-specific properties for non-password fields
    this.passwordScore = 0;
    this.passwordColor = '';
    this.passwordPercentage = 0;
    this.unmetPasswordRules.set([]);
    this.unmetUserNameRules.set([]);
  }

  private Validators: Record<string, (val: string) => void> = {
    password: (val: string) => this.handlePassValidation(val),
    username: (val: string) => this.handleUsernameValidation(val),
    othertypes: (val: string) => this.handleGeneralValidation(val),
  };
  // ----- MAIN INPUT HANDLER -----
  onInputChange(e: Event) {
    const inputEl = e.target as HTMLInputElement | HTMLTextAreaElement;
    let val = inputEl.value;

    // Send value upward
    this.value.set(val);
    this.valueChange.emit(val);

    // ALWAYS use ValidationService to validate
    (this.Validators[this.type()] || this.Validators['default'])(val);
  }

  onFocus() {
    this.isFocused.set(true);
    this.focused.emit();
  }

  onBlur() {
    this.isFocused.set(false);
    this.blurred.emit();
  }
  togglePasswordVisibility(): void {
    if (!this.value()) return;

    if (this.type() === 'password') {
      this.isPasswordVisible.set(!this.isPasswordVisible);
      this.actualType = this.isPasswordVisible() ? 'text' : 'password';
    }
  }

  getDisplayMessage(): {
    type: 'error' | 'password-strong' | 'password-helper' | 'general-helper' | 'none';
    content: any;
  } {
    if (this.errorMessage()) {
      return { type: 'error', content: this.errorMessage() };
    }

    if (this.showValidationUI() && this.type() === 'password' && this.hasValue()) {
      if (this.unmetPasswordRules().length === 0) {
        return { type: 'password-strong', content: null };
      } else {
        return {
          type: 'password-helper',
          content: {
            helperText: this.helperText(),
            rules: this.unmetPasswordRules(),
          },
        };
      }
    }

    if (this.helperText() && this.hasValue() && this.type() !== 'password') {
      return { type: 'general-helper', content: this.helperText() };
    }

    return { type: 'none', content: null };
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
