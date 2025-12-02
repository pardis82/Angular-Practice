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
  @Input('appNormalizeDigits') appNormalizedDigits = true;

  private digitService = inject(DigitNormalizationService);
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private isDisabled = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  // Triggered on typing, pasting, autofill, etc.
  @HostListener('input', ['$event'])
  handleInput(event: Event): void {
    if (!this.appNormalizedDigits) return;

    const input = event.target as HTMLInputElement | null;
    if (!input) return;

    this.normalizeAndUpdate(input.value);
  }

  // Triggered when user leaves the field
  @HostListener('blur')
  handleBlur(): void {
    this.onTouched();
    if (!this.appNormalizedDigits) return;

    const input = this.el.nativeElement;
    const value = input.value;

    // Normalize if needed
    this.normalizeAndUpdate(value);
  }

  // Normalize + update Angular form control
  private normalizeAndUpdate(value: string): void {
    const normalized = this.digitService.convertNonEnglishDigits(value);

    if (value !== normalized) {
      this.el.nativeElement.value = normalized;
      this.onChange(normalized);
    } else {
      this.onChange(value);
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value === undefined || value === null) {
      this.el.nativeElement.value = '';
      return;
    }

    const normalized = this.digitService.convertNonEnglishDigits(String(value));
    this.el.nativeElement.value = normalized;
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
