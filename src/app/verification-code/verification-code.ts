import {
  Component,
  input,
  output,
  computed,
  signal,
  effect,
  ViewChildren,
  ElementRef,
  QueryList,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormControl,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { FakeCode } from '../fakeverificationcode';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-verification-code',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule],
  templateUrl: './verification-code.html',
})
export class VerificationCode  {
  constructor(private fb: FormBuilder) {
    effect(() => {
      const count = this.boxNumber();
      const newControls = Array(count)
        .fill(null)
        .map(() => new FormControl(''));
      this.verificationValues.set(newControls);
    });
  }

 
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  boxNumber = input<number>(6); //how many inputs do we have based on where we want to use it
  boxedFilled = output<string>(); //when all boxes are filled we notify the parent
  boxPerChange = output<string>(); // when each box is filled
  maxLength = input<number>(1);
  boxMaxLength = input<number[]>([]);
  verificationValues = signal<FormControl[]>([]);
  containerClassName = input<string>();
  className = input<string>();
  backgroundColor = input<string>(' #ffffffff');

  getMaxLengthPerBox(index: number): number {
    const perBox = this.boxMaxLength();
    if (Array.isArray(perBox) && perBox.length === this.boxNumber()) {
      return perBox[index];
    }
    return this.maxLength();
  }

  onInput(event: any, index: any) {
    const target = event.target;
    const value = target.value;
    const maxChars = this.getMaxLengthPerBox(index);

    if (value && value.length > 0) this.boxPerChange.emit(value);
    if (value.length === maxChars && index < this.boxNumber() - 1) {
      setTimeout(() => {
        const inputs = this.codeInputs.toArray();
        if (inputs[index + 1]) {
          inputs[index + 1].nativeElement.focus();
        }
      });
    }
  }
  onKeyDown(event: KeyboardEvent, index: number) {
    const target = event.target as HTMLInputElement;
    const currentValue = target.value;
    const cursorPosition = target.selectionStart || 0;
    if (event.key == 'Backspace') {
      if (currentValue === '' && index >= 0) {
        event.preventDefault();
        setTimeout(() => {
          const inputs = this.codeInputs.toArray();
          if (inputs[index - 1]) {
            inputs[index - 1].nativeElement.focus();
            const prevValue = this.verificationValues()[index - 1].value || '';
            inputs[index - 1].nativeElement.setSelectionRange(prevValue.length, prevValue.length);
          }
        });
      }
    }
    if (event.key == 'ArrowLeft') {
      if (index >= 0) {
        event.preventDefault();
        setTimeout(() => {
          const inputs = this.codeInputs.toArray();
          if (inputs[index - 1]) {
            inputs[index - 1].nativeElement.focus();
          }
        });
      }
    }

    if (event.key === 'ArrowRight') {
      if (index < this.boxNumber() - 1) {
        event.preventDefault();
        setTimeout(() => {
          const inputs = this.codeInputs.toArray();
          if (inputs[index + 1]) {
            inputs[index + 1].nativeElement.focus();
          }
        });
      }
    }
  }

  onPaste(event: ClipboardEvent, index: number) {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    const maxLen = this.getMaxLengthPerBox(index);
    const totalBoxes = this.boxNumber();
    const controls = this.verificationValues();

    let currentIndex = index;
    let charIndex = 0;

    // از ایندکس فعلی شروع کن و باکس‌ها رو پر کن
    while (currentIndex < totalBoxes && charIndex < pastedText.length) {
      const maxLen = this.getMaxLengthPerBox(currentIndex);
      const currentControl = controls[currentIndex];
      const currentValue = currentControl.value || '';

      // چقدر جا خالی داریم در این باکس؟
      const remainingSpace = maxLen - currentValue.length;

      if (remainingSpace > 0) {
        // بخشی از متن paste شده رو بگیر که در این باکس جا بشه
        const charsToAdd = pastedText.slice(charIndex, charIndex + remainingSpace);
        currentControl.setValue(currentValue + charsToAdd);
        charIndex += charsToAdd.length;
      }

      // اگر این باکس هنوز جا داره، همینجا بمون
      // اگر پر شد، برو باکس بعدی
      if (currentControl.value.length === maxLen) {
        currentIndex++;
      }
    }
    // فوکس و cursor رو تنظیم کن
    setTimeout(() => {
      const inputs = this.codeInputs.toArray();
      const focusIndex = Math.min(currentIndex, totalBoxes - 1);
      if (inputs[focusIndex]) {
        inputs[focusIndex].nativeElement.focus();

        const controlValue = controls[focusIndex].value || '';
        // اگر در همین باکس موندیم، cursor رو به آخر مقدار جدید ببر
        // اگر به باکس بعدی رفتیم، cursor رو به اولش ببر
        const cursorPos = currentIndex === focusIndex ? controlValue.length : 0;

        inputs[focusIndex].nativeElement.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }

  
}
