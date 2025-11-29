import {
  Component,
  input,
  output,
  model,
  signal,
  computed,
  effect,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.html',
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextField),
      multi: true,
    },
  ],
})
export class TextField implements ControlValueAccessor {
  constructor() {
    effect(() => {
      if (this.type() === 'password' && !this.hasValue()) {
        this.isPasswordVisible.set(false);
      }
    });
  }

  // ----- SIGNAL INPUTS -----
  label = input<string>();
  type = input<string>('text');
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
  unmetNationalCodeRules = input<string[]>([]);
  passwordColor = input<string>('');
  passwordPercentage = input<number>(0);

  // ----- SIGNAL OUTPUTS -----
  value = model<string>('');
  valueChange = output<string>();
  focused = output<void>();
  blurred = output<void>();
  valueDirty = output<string>();
  valuePristine = output<string>();

  // ----- states -----
  isFocused = signal(false);
  isPasswordVisible = signal(false);

  // ----- ControlValueAccessor Properties -----
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

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

  truncatedPlaceholder = computed(() => {
    const p = this.placeholder() || '';
    return p.length > 30 ? p.substring(0, 30) + '...' : p;
  });

  // UI states
  borderClasses = computed(() => {
    if (this.errorMessage()) return 'border-red-400';

    if (
      this.showValidationUI() &&
      ((this.type() === 'password' && this.unmetPasswordRules().length === 0 && this.hasValue()) ||
        (this.type() === 'username' && this.unmetUserNameRules().length === 0 && this.hasValue()) ||
        (this.type() === 'nationalcode' &&
          this.unmetNationalCodeRules().length === 0 &&
          this.hasValue()))
    ) {
      return 'border-green-400';
    }

    if (this.isFocused() || this.hasValue()) {
      return 'border-purple-500';
    }

    return 'border-gray-300';
  });

  labelTextClasses = computed(() => {
    const classes = [];
    const shouldFloat = this.float();

    classes.push(shouldFloat ? 'text-xs -top-[0.7rem]' : 'top-1/2 -translate-y-1/2 text-[11.5px]');

    if (this.errorMessage()) {
      classes.push('text-red-500');
    } else if (
      this.showValidationUI() &&
      ((this.type() === 'password' && this.unmetPasswordRules().length === 0 && this.hasValue()) ||
        (this.type() === 'username' && this.unmetUserNameRules().length === 0 && this.hasValue()) || (this.type()==='nationalcode' && this.unmetNationalCodeRules().length===0 && this.hasValue()) )
    ) {
      classes.push('text-green-600');
    } else if (shouldFloat) {
      classes.push('text-purple-600');
    }

    return classes;
  });

  // ----- CONTROL VALUE ACCESSOR METHODS -----
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // ----- MAIN INPUT HANDLER (updated) -----
  onInputChange(e: Event) {
    const inputEl = e.target as HTMLInputElement | HTMLTextAreaElement;
    let val = inputEl.value;

    // Update local state
    this.value.set(val);
    this.valueChange.emit(val);
    this.valueDirty.emit(val);

    // Notify form control
    this.onChange(val);
  }

  onFocus() {
    this.isFocused.set(true);
    this.focused.emit();
  }

  onBlur() {
    this.isFocused.set(false);
    this.onTouched(); // Mark as touched for form control
    this.blurred.emit();
  }

  togglePasswordVisibility(): void {
    if (this.type() === 'password') {
      this.isPasswordVisible.set(!this.isPasswordVisible());
    }
  }

  getDisplayMessage(): {
    type:
      | 'error'
      | 'password-strong'
      | 'password-helper'
      | 'username-helper'
      | 'general-helper'
      | 'none';
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

    if (this.showValidationUI() && this.type() === 'username' && this.hasValue()) {
      if (this.unmetUserNameRules().length > 0) {
        return {
          type: 'username-helper',
          content: this.unmetUserNameRules()[0],
        };
      }
    }

    if (this.helperText() && this.hasValue()) {
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
