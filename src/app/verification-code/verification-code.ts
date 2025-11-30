import {
  Component,
  input,
  output,
  computed,
  OnInit,
  signal,
  effect,
  ViewChildren,
  ElementRef,
  QueryList,
  viewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  ɵInternalFormsSharedModule,
} from '@angular/forms';

@Component({
  selector: 'app-verification-code',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './verification-code.html',
})
export class VerificationCode {
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
  verificationValues = signal<FormControl[]>([]);

  onInput(event: any, index: any) {
    const value = event.target.value;
    if (value && value.length > 0) this.boxPerChange.emit(value);
    if (index < this.boxNumber() - 1) {
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
    if (event.key == 'Backspace' && !target.value && index > 0) {
      setTimeout(() => {
        const inputs = this.codeInputs.toArray();
        if (inputs[index - 1]) {
          inputs[index - 1].nativeElement.focus();
        }
      });
    }
  }
}
