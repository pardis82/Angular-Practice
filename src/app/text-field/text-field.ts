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
  errorMessage = input<string>();
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

  //---UI validation helpers---

  showValidationUI = input<boolean>(true);
  passwordScore = input<number>(0);
  unmetPasswordRules = input<string[]>([]);
  unmetUserNameRules = input<string[]>([]);
  passwordColor = input<string>('');
  passwordPercentage = input<number>(0);

  // ----- SIGNAL OUTPUTS -----
  value = model<string>('');
  valueChange = output<string>();
  focused = output<void>();
  blurred = output<void>();

  // ----- states -----
  isFocused = signal(false);
  isPasswordVisible = signal(false);

  //-----Computed signals------

  float = computed(() => this.hasValue() || this.isFocused());
  hasValue = computed(() => {
    const v = this.value() ?? this.defaultValue() ?? '';
    return v.length > 0;
  });
  actualType = computed(() => {
    if (this.type() === 'password' && this.isPasswordVisible()) return 'text';
    else {
      return this.type() || 'text';
    }
  });

  // UI states

  borderClasses = computed(() => {
    if (this.errorMessage()) return 'border-red-400';

    if (!this.errorMessage() && (this.isFocused() || this.hasValue())) {
      return 'border-purple-500';
    }
    return 'border-gray-300';
  });

  labelTextClasses = computed(() => {
    {
      const classes = [];
      const shouldFloat = this.float(); // Call once and reuse

      // Float positioning
      classes.push(
        shouldFloat ? 'text-xs -top-[0.7rem]' : 'top-1/2 -translate-y-1/2 text-[11.5px]'
      );

      // Error state (highest priority)
      classes.push(this.errorMessage() ? 'text-red-500' : shouldFloat ? 'text-purple-600' : '');

      // Default purple state - only apply if we haven't already returned
      if (!this.errorMessage() && shouldFloat) {
        classes.push('text-purple-600');
      }

      return classes;
    }
  });

  get truncatedPlaceholder(): string {
    const p = this.placeholder() || '';
    return p.length > 30 ? p.substring(0, 30) + '...' : p;
  }

  // ----- MAIN INPUT HANDLER -----
  onInputChange(e: Event) {
    const inputEl = e.target as HTMLInputElement | HTMLTextAreaElement;
    let val = inputEl.value;

    // Send value upward
    this.value.set(val);
    this.valueChange.emit(val);
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
      this.isPasswordVisible.set(!this.isPasswordVisible());
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
