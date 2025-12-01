// normalize-digits.directive.ts
import { Directive, ElementRef, HostListener, Input, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DigitNormalizationService } from '../services/digitnormalization-service/digit-normalization-service';

@Directive({
  selector: '[appNormalizeDigits]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NormalizeDigitsDirective),
      multi: true,
    },
  ],
})
export class NormalizeDigitsDirective implements ControlValueAccessor {
  @Input() appNormalizeDigits: boolean = true;

  private digitService = inject(DigitNormalizationService);
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!this.appNormalizeDigits) return;

    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.normalizeAndUpdate(input);
  }

  @HostListener('blur')
  onBlur(): void {
    if (!this.appNormalizeDigits) return;
    this.onTouched();

    // نرمالایز روی blur هم
    const input = this.el.nativeElement;
    this.normalizeAndUpdate(input);
  }

  private normalizeAndUpdate(input: HTMLInputElement | HTMLTextAreaElement): void {
    const originalValue = input.value;
    const normalized = this.digitService.normalizeArabicPersianNumbers(originalValue);

    if (originalValue !== normalized) {
      input.value = normalized;
      this.onChange(normalized);
      // برای کامپوننت‌های پدر
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      const normalized = this.digitService.normalizeArabicPersianNumbers(String(value));
      this.el.nativeElement.value = normalized;
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.el.nativeElement.disabled = isDisabled;
  }
}
