import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.html',
  imports: [CommonModule, FormsModule],
})
export class TextFieldComponent {
  @Input() label?: string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() containerClassName?: string;
  @Input() className?: string;

  @Input() minrows?: number;
  @Input() maxrows?: number;
  @Input() width?: string; // e.g., 'w-full', 'w-1/2', 'w-64', 'flex-1'
  @Input() multiline = false;

  @Input() defaultValue?: string;
  @Input() placeholder?: string;

  @Input() id?: string;
  @Input() name?: string;

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  isFocused = false;

  get actualValue(): string {
    return this.value !== undefined && this.value !== null ? this.value : this.defaultValue || '';
  }

  get hasValue(): boolean {
    return !!this.actualValue && this.actualValue.length > 0;
  }

  get float(): boolean {
    return this.hasValue || this.isFocused;
  }

  // Match React placeholder truncation
  get truncatedPlaceholder(): string {
    if (!this.placeholder) return '';
    return this.placeholder.length > 30
      ? this.placeholder.substring(0, 30) + '...'
      : this.placeholder;
  }

  onInputChange(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.value = value;
    this.valueChange.emit(value);
  }

  onFocus() {
    this.isFocused = true;
    this.focused.emit();
  }

  onBlur() {
    this.isFocused = false;
    this.blurred.emit();
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement) {
    if (!this.multiline) return;

    textarea.style.height = 'auto';

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minH = (this.minrows ?? 3) * lineHeight;
    const maxH = (this.maxrows ?? 10) * lineHeight;

    const newHeight = Math.min(Math.max(textarea.scrollHeight, minH), maxH);

    textarea.style.height = `${newHeight}px`;
  }
}
